import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, MouseEvent } from 'react';
import { ProductDetailData, ProductVariantData } from '@/types';
import { useCart } from '@/lib/cart';
import { useUi } from '@/lib/ui';
import { SizeChart } from '@/components/SizeChart';

interface QuickViewModalProps {
    slug: string | null;
    onClose: () => void;
}

export function QuickViewModal({ slug, onClose }: QuickViewModalProps) {
    const [product, setProduct] = useState<ProductDetailData | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
    const [activeImage, setActiveImage] = useState(0);
    const [zoom, setZoom] = useState<{ active: boolean; x: number; y: number }>({ active: false, x: 50, y: 50 });
    const { addItem } = useCart();
    const { showToast, openCart } = useUi();

    // Zoom the image toward wherever the cursor is hovering.
    const handleZoomMove = (e: MouseEvent<HTMLDivElement>) => {
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
                    <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row pointer-events-auto relative max-h-[90vh]"
                        >
                            <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors">
                                <X className="w-5 h-5" />
                            </button>

                            {loading || !product ? (
                                <div className="w-full h-96 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                                </div>
                            ) : (
                                <>
                                    {/* Images */}
                                    <div className="w-full md:w-1/2 bg-gray-50 flex flex-col items-center justify-center p-8 overflow-hidden group">
                                        <div
                                            className="w-full flex items-center justify-center overflow-hidden cursor-zoom-in"
                                            onMouseEnter={handleZoomMove}
                                            onMouseMove={handleZoomMove}
                                            onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
                                        >
                                            <img
                                                src={product.images[activeImage]?.url ?? product.image ?? ''}
                                                alt={product.name}
                                                className="w-full h-full object-contain mix-blend-multiply max-h-[40vh] md:max-h-[60vh] transition-transform duration-200 ease-out"
                                                style={{
                                                    transform: zoom.active ? 'scale(2)' : 'scale(1)',
                                                    transformOrigin: `${zoom.x}% ${zoom.y}%`,
                                                }}
                                            />
                                        </div>
                                        {product.images.length > 1 && (
                                            <div className="flex gap-2 mt-4 flex-wrap justify-center">
                                                {product.images.map((img, i) => (
                                                    <button
                                                        key={img.id}
                                                        onClick={() => { setActiveImage(i); setZoom((z) => ({ ...z, active: false })); }}
                                                        className={`w-12 h-12 rounded border-2 overflow-hidden ${i === activeImage ? 'border-black' : 'border-transparent'}`}
                                                    >
                                                        <img src={img.url} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
                                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-2">{product.name}</h2>
                                        <p className="text-xl font-medium text-gray-700 mb-6">
                                            {selectedVariant?.price_formatted ?? product.price_formatted}
                                        </p>

                                        {product.description && (
                                            <div className="prose prose-sm text-gray-600 mb-8">
                                                <p>{product.description}</p>
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
                </>
            )}
        </AnimatePresence>
    );
}
