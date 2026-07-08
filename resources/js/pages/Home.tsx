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
            <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
                {hero.image && (
                    <img src={hero.image} alt={hero.heading} className="w-full h-full object-cover object-center opacity-90" />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:pt-[50vh]">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl lg:text-[7vw] font-black uppercase tracking-tighter text-white leading-[0.85] drop-shadow-lg mb-4"
                    >
                        {hero.heading}
                    </motion.h1>
                    {hero.subheading && (
                        <p className="text-white/90 max-w-xl mb-8 font-medium uppercase tracking-wide drop-shadow">{hero.subheading}</p>
                    )}
                    <Link
                        href="/catalog"
                        className="group relative overflow-hidden border-2 border-white text-white px-12 py-4 font-bold text-sm sm:text-base uppercase tracking-[0.2em] shadow-lg"
                    >
                        <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                            Explore Collection
                        </span>
                        {/* White sweep from left on hover */}
                        <span className="absolute inset-0 bg-white -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0" />
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
