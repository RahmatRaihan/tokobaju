import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';
import { SizeChart } from '@/components/SizeChart';
import { ProductDetailData, ProductCardData } from '@/types';
import { useCart } from '@/lib/cart';
import { useUi } from '@/lib/ui';

interface ProductShowProps {
    product: ProductDetailData;
    related: ProductCardData[];
}

function Detail({ product, related }: ProductShowProps) {
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
        (product.variants.find((v) => !v.is_sold_out) ?? product.variants[0])?.id ?? null,
    );
    const [activeImage, setActiveImage] = useState(0);
    const [quickView, setQuickView] = useState<string | null>(null);
    const { addItem } = useCart();
    const { showToast, openCart } = useUi();

    const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
    const sizes = Array.from(new Set(product.variants.map((v) => v.size).filter(Boolean))) as string[];
    const colors = Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean))) as string[];

    const chooseSize = (size: string) => {
        const match = product.variants.find((v) => v.size === size && (!selectedVariant?.color || v.color === selectedVariant.color))
            ?? product.variants.find((v) => v.size === size);
        if (match) setSelectedVariantId(match.id);
    };
    const chooseColor = (color: string) => {
        const match = product.variants.find((v) => v.color === color && (!selectedVariant?.size || v.size === selectedVariant.size))
            ?? product.variants.find((v) => v.color === color);
        if (match) setSelectedVariantId(match.id);
    };

    const handleAdd = () => {
        if (!selectedVariant || selectedVariant.is_sold_out) return;
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
        openCart();
    };

    return (
        <>
            <Head title={product.name} />

            <main className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-8 lg:py-12">
                <nav className="text-sm text-gray-500 mb-8">
                    <Link href="/catalog" className="hover:text-black">Catalog</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                    {/* Images */}
                    <div>
                        <div className="aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center p-8">
                            <img
                                src={product.images[activeImage]?.url ?? product.image ?? ''}
                                alt={product.name}
                                className="w-full h-full object-contain mix-blend-multiply"
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="flex gap-3 mt-4 flex-wrap">
                                {product.images.map((img, i) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setActiveImage(i)}
                                        className={`w-20 h-20 rounded-lg border-2 overflow-hidden bg-gray-50 ${i === activeImage ? 'border-black' : 'border-transparent'}`}
                                    >
                                        <img src={img.url} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col">
                        {product.category && <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">{product.category}</p>}
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-3">{product.name}</h1>
                        <p className="text-2xl font-medium text-gray-800 mb-6">
                            {selectedVariant?.price_formatted ?? product.price_formatted}
                        </p>

                        {product.description && <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>}

                        {/* Size Guide — always available when the product has a chart,
                            even for products without size variants. */}
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
                                            className={`min-w-12 h-12 px-3 text-sm font-bold border rounded-md transition-all ${selectedVariant?.size === size ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}
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
                                            className={`px-4 h-12 text-sm font-bold border rounded-md transition-all ${selectedVariant?.color === color ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}
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
                                <button onClick={handleAdd} className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-colors uppercase tracking-wide shadow-lg">
                                    Add to Cart
                                </button>
                            )}
                            {selectedVariant && !selectedVariant.is_sold_out && selectedVariant.stock <= 5 && (
                                <p className="text-xs text-orange-500 mt-2 text-center">Only {selectedVariant.stock} left in stock</p>
                            )}
                        </div>
                    </div>
                </div>

                {related.length > 0 && (
                    <section className="mt-20">
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">You may also like</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                            {related.map((p) => (
                                <ProductCard key={p.id} product={p} onQuickView={() => setQuickView(p.slug)} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <QuickViewModal slug={quickView} onClose={() => setQuickView(null)} />
        </>
    );
}

export default function ProductShow(props: ProductShowProps) {
    return (
        <StoreLayout>
            <Detail {...props} />
        </StoreLayout>
    );
}
