import { Head, Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { useState } from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';
import { ProductCardData } from '@/types';

interface HomeProps {
    featured: ProductCardData[];
    hero: { image: string | null; heading: string; subheading: string | null };
}

export default function Home({ featured, hero }: HomeProps) {
    const [quickView, setQuickView] = useState<string | null>(null);

    return (
        <StoreLayout>
            <Head title="Home" />

            {/* Hero */}
            <div className="relative w-full h-[calc(100vh-96px)] bg-gray-900 overflow-hidden">
                {hero.image && (
                    <img src={hero.image} alt={hero.heading} className="w-full h-full object-cover object-top opacity-90" />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white text-4xl sm:text-6xl font-black uppercase italic tracking-tighter mb-4 drop-shadow-lg"
                    >
                        {hero.heading}
                    </motion.h1>
                    {hero.subheading && (
                        <p className="text-white/90 max-w-xl mb-6 font-medium drop-shadow">{hero.subheading}</p>
                    )}
                    <Link
                        href="/catalog"
                        className="border border-white text-white px-8 py-2.5 rounded-[20px] font-bold text-sm hover:bg-white hover:text-black transition-colors shadow-lg backdrop-blur-sm bg-black/20"
                    >
                        SHOP NOW
                    </Link>
                </div>
            </div>

            {/* Featured products */}
            {featured.length > 0 && (
                <section className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Featured</h2>
                        <p className="text-gray-500 mt-2">Handpicked pieces from the latest drop.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {featured.map((product) => (
                            <ProductCard key={product.id} product={product} onQuickView={() => setQuickView(product.slug)} />
                        ))}
                    </div>
                </section>
            )}

            <QuickViewModal slug={quickView} onClose={() => setQuickView(null)} />
        </StoreLayout>
    );
}
