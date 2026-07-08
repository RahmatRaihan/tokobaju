import { X, Loader2, ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef, MouseEvent } from 'react';
import { ProductDetailData, ProductVariantData } from '@/types';
import { useCart } from '@/lib/cart';
import { useUi } from '@/lib/ui';
import { SizeChart } from '@/components/SizeChart';

interface QuickViewModalProps {
    slug: string | null;
    onClose: () => void;
}

/**
 * Full-screen image viewer. Swiping is native scroll-snap — no gesture library,
 * and it keeps the browser's own momentum/rubber-banding on touch.
 */
function Lightbox({ images, startIndex, alt, onClose }: { images: string[]; startIndex: number; alt: string; onClose: () => void }) {
    const track = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(startIndex);

    // Jump to the tapped image without animating from image 0.
    useEffect(() => {
        const el = track.current;
        if (el) el.scrollLeft = startIndex * el.clientWidth;
    }, [startIndex]);

    // Stop the page behind from scrolling while the viewer is open.
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') go(1);
            if (e.key === 'ArrowLeft') go(-1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, images.length, onClose]);

    const go = (delta: number) => {
        const el = track.current;
        if (!el) return;
        const next = Math.min(Math.max(index + delta, 0), images.length - 1);
        el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
    };

    const onScroll = () => {
        const el = track.current;
        if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${alt} — image viewer`}
            className="fixed inset-0 z-[70] bg-black"
        >
            <button onClick={onClose} aria-label="Close image viewer" className="absolute top-4 right-4 z-10 p-3 text-white/80 hover:text-white bg-white/10 rounded-full backdrop-blur-sm">
                <X className="w-6 h-6" />
            </button>

            {images.length > 1 && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 text-white/70 text-sm font-medium tabular-nums">
                    {index + 1} / {images.length}
                </div>
            )}

            <div
                ref={track}
                onScroll={onScroll}
                className="h-full w-full flex overflow-x-auto snap-x snap-mandatory overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {images.map((url, i) => (
                    <div key={url} className="min-w-full h-full snap-center flex items-center justify-center p-2">
                        <img src={url} alt={`${alt} ${i + 1}`} className="max-w-full max-h-full object-contain" />
                    </div>
                ))}
            </div>

            {images.length > 1 && (
                <>
                    {/* Touch swipes; these are for mouse and keyboard users. */}
                    <button onClick={() => go(-1)} disabled={index === 0} aria-label="Previous image" className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-white/10 rounded-full backdrop-blur-sm disabled:opacity-25">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button onClick={() => go(1)} disabled={index === images.length - 1} aria-label="Next image" className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-white/10 rounded-full backdrop-blur-sm disabled:opacity-25">
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((url, i) => (
                            <span key={url} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
                        ))}
                    </div>
                </>
            )}
        </motion.div>
    );
}

export function QuickViewModal({ slug, onClose }: QuickViewModalProps) {
    const [product, setProduct] = useState<ProductDetailData | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
    const [activeImage, setActiveImage] = useState(0);
    const [zoom, setZoom] = useState<{ active: boolean; x: number; y: number }>({ active: false, x: 50, y: 50 });
    const [lightbox, setLightbox] = useState(false);
    const { addItem } = useCart();
    const { showToast, openCart } = useUi();

    // Zoom the image toward wherever the cursor is hovering.
    const handleZoomMove = (e: MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoom({ active: true, x, y });
    };

    useEffect(() => {
        if (!slug) {
            setProduct(null);
            return;
        }
        setLoading(true);
        setProduct(null);
        setActiveImage(0);
        setLightbox(false);
        fetch(`/products/${slug}/quick-view`, { headers: { Accept: 'application/json' } })
            .then((r) => r.json())
            .then((data: ProductDetailData) => {
                setProduct(data);
                const firstAvailable = data.variants.find((v) => !v.is_sold_out);
                setSelectedVariantId((firstAvailable ?? data.variants[0])?.id ?? null);
            })
            .catch(() => showToast('Failed to load product'))
            .finally(() => setLoading(false));
    }, [slug, showToast]);

    const selectedVariant: ProductVariantData | undefined = product?.variants.find((v) => v.id === selectedVariantId);

    // Products with no uploaded gallery still have a single cover image.
    const gallery: string[] = product
        ? (product.images.length > 0 ? product.images.map((i) => i.url) : [product.image].filter(Boolean) as string[])
        : [];

    const sizes = product ? Array.from(new Set(product.variants.map((v) => v.size).filter(Boolean))) as string[] : [];
    const colors = product ? Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean))) as string[] : [];

    const handleAdd = () => {
        if (!product || !selectedVariant || selectedVariant.is_sold_out) return;
        addItem({
            variant_id: selectedVariant.id,
            product_id: product.id,
            product_slug: product.slug,
            name: product.name,
            variant_label: selectedVariant.label,
            unit_price: selectedVariant.price,
            image: product.image,
            max_stock: selectedVariant.stock,
        });
        showToast(`Added ${product.name} to cart`);
        onClose();
        openCart();
    };

    // Pick a variant when the user chooses a size or color.
    const chooseSize = (size: string) => {
        const match = product?.variants.find(
            (v) => v.size === size && (!selectedVariant?.color || v.color === selectedVariant.color),
        ) ?? product?.variants.find((v) => v.size === size);
        if (match) setSelectedVariantId(match.id);
    };
    const chooseColor = (color: string) => {
        const match = product?.variants.find(
            (v) => v.color === color && (!selectedVariant?.size || v.size === selectedVariant.size),
        ) ?? product?.variants.find((v) => v.color === color);
        if (match) setSelectedVariantId(match.id);
    };

    return (
        <AnimatePresence>
            {slug && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
                    />
                    {/* Bottom sheet on mobile, centered card on desktop. */}
                    <div className="fixed inset-0 flex items-end md:items-center justify-center z-[60] md:p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 40 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                            className="bg-white w-full max-w-4xl rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col md:flex-row pointer-events-auto relative max-h-[92vh] md:max-h-[90vh] overflow-y-auto md:overflow-hidden"
                        >
                            <button onClick={onClose} aria-label="Close quick view" className="absolute top-3 right-3 md:top-4 md:right-4 z-10 p-2.5 bg-white/90 backdrop-blur rounded-full shadow hover:bg-gray-100 transition-colors">
                                <X className="w-5 h-5" />
                            </button>

                            {loading || !product ? (
                                <div className="w-full h-96 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                                </div>
                            ) : (
                                <>
                                    {/* Images */}
                                    <div className="w-full md:w-1/2 bg-white md:bg-gray-50 flex flex-col items-center justify-center px-3 pt-3 pb-4 md:p-8 md:overflow-hidden group shrink-0">
                                        {/* Grab handle — reads as a draggable sheet on mobile. */}
                                        <div className="md:hidden w-10 h-1 bg-gray-300 rounded-full mb-3" />

                                        <button
                                            type="button"
                                            onClick={() => setLightbox(true)}
                                            aria-label="View image full screen"
                                            className="relative w-full flex items-center justify-center overflow-hidden cursor-zoom-in rounded-xl bg-gray-50"
                                            onMouseEnter={handleZoomMove}
                                            onMouseMove={handleZoomMove}
                                            onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
                                        >
                                            <img
                                                src={gallery[activeImage] ?? ''}
                                                alt={product.name}
                                                className="w-full h-full object-contain max-h-[52vh] md:max-h-[60vh] transition-transform duration-200 ease-out"
                                                style={{
                                                    transform: zoom.active ? 'scale(2)' : 'scale(1)',
                                                    transformOrigin: `${zoom.x}% ${zoom.y}%`,
                                                }}
                                            />
                                            <span className="md:hidden absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                                                <Expand className="w-3 h-3" />
                                                Tap to zoom
                                            </span>
                                        </button>

                                        {gallery.length > 1 && (
                                            <div className="flex gap-2 mt-3 md:mt-4 flex-wrap justify-center">
                                                {gallery.map((url, i) => (
                                                    <button
                                                        key={url}
                                                        onClick={() => { setActiveImage(i); setZoom((z) => ({ ...z, active: false })); }}
                                                        aria-label={`Show image ${i + 1}`}
                                                        className={`w-14 h-14 rounded-lg border-2 overflow-hidden transition-colors ${i === activeImage ? 'border-black' : 'border-gray-200'}`}
                                                    >
                                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="w-full md:w-1/2 p-5 pb-8 md:p-12 flex flex-col md:overflow-y-auto">
                                        <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter mb-1 pr-10">{product.name}</h2>
                                        <p className="text-lg md:text-xl font-medium text-gray-700 mb-5 md:mb-6">
                                            {selectedVariant?.price_formatted ?? product.price_formatted}
                                        </p>

                                        {product.description && (
                                            <div className="prose prose-sm text-gray-600 mb-6 md:mb-8">
                                                <p className="line-clamp-3 md:line-clamp-none">{product.description}</p>
                                            </div>
                                        )}

                                        {/* Size Guide standalone for products without size variants. */}
                                        {product.size_chart_url && sizes.length === 0 && (
                                            <div className="mb-6">
                                                <SizeChart src={product.size_chart_url} />
                                            </div>
                                        )}

                                        {sizes.length > 0 && (
                                            <div className="mb-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm font-bold uppercase tracking-wide">Size</span>
                                                    <SizeChart src={product.size_chart_url} />
                                                </div>
                                                <div className="flex flex-wrap gap-3">
                                                    {sizes.map((size) => (
                                                        <button
                                                            key={size}
                                                            onClick={() => chooseSize(size)}
                                                            className={`min-w-12 h-12 px-3 text-sm font-bold border flex items-center justify-center transition-all rounded-md ${
                                                                selectedVariant?.size === size ? 'border-black bg-black text-white' : 'border-gray-200 text-black hover:border-black'
                                                            }`}
                                                        >
                                                            {size}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {colors.length > 0 && (
                                            <div className="mb-6">
                                                <span className="text-sm font-bold uppercase tracking-wide block mb-3">Color</span>
                                                <div className="flex flex-wrap gap-3">
                                                    {colors.map((color) => (
                                                        <button
                                                            key={color}
                                                            onClick={() => chooseColor(color)}
                                                            className={`px-4 h-12 text-sm font-bold border flex items-center justify-center transition-all rounded-md ${
                                                                selectedVariant?.color === color ? 'border-black bg-black text-white' : 'border-gray-200 text-black hover:border-black'
                                                            }`}
                                                        >
                                                            {color}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-auto pt-4">
                                            {!selectedVariant || selectedVariant.is_sold_out ? (
                                                <button disabled className="w-full bg-[#2c2f33] text-white font-bold py-4 rounded-xl uppercase tracking-wide opacity-80 cursor-not-allowed">
                                                    Sold Out
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleAdd}
                                                    className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-colors uppercase tracking-wide shadow-lg hover:shadow-xl"
                                                >
                                                    Add to Cart
                                                </button>
                                            )}
                                            {selectedVariant && !selectedVariant.is_sold_out && selectedVariant.stock <= 5 && (
                                                <p className="text-xs text-orange-500 mt-2 text-center">Only {selectedVariant.stock} left in stock</p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>

                    <AnimatePresence>
                        {lightbox && gallery.length > 0 && (
                            <Lightbox images={gallery} startIndex={activeImage} alt={product?.name ?? ''} onClose={() => setLightbox(false)} />
                        )}
                    </AnimatePresence>
                </>
            )}
        </AnimatePresence>
    );
}
