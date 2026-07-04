import { Head, router } from '@inertiajs/react';
import { motion } from 'motion/react';
import { useState, useRef, useCallback } from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';
import { Sidebar, Filters } from '@/components/Sidebar';
import { Pagination } from '@/components/Pagination';
import { ProductCardData, Category, Paginated } from '@/types';

interface CatalogProps {
    products: Paginated<ProductCardData>;
    categories: Category[];
    filters: Filters;
}

const sortOptions: { value: string; label: string }[] = [
    { value: 'featured', label: 'Featured' },
    { value: 'price_asc', label: 'Price, low to high' },
    { value: 'price_desc', label: 'Price, high to low' },
    { value: 'az', label: 'Alphabetically, A-Z' },
    { value: 'za', label: 'Alphabetically, Z-A' },
];

export default function Catalog({ products, categories, filters }: CatalogProps) {
    const [quickView, setQuickView] = useState<string | null>(null);
    const [local, setLocal] = useState<Filters>(filters);
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const reload = useCallback((next: Filters) => {
        const query: Record<string, string> = {};
        if (next.search) query.search = next.search;
        if (next.category) query.category = next.category;
        if (next.availability && next.availability !== 'all') query.availability = next.availability;
        if (next.price && next.price !== 'all') query.price = next.price;
        if (next.sort && next.sort !== 'featured') query.sort = next.sort;

        router.get('/catalog', query, { preserveState: true, preserveScroll: true, replace: true });
    }, []);

    const patch = (p: Partial<Filters>) => {
        const next = { ...local, ...p };
        setLocal(next);

        // Debounce free-text search; apply the rest immediately.
        if ('search' in p) {
            if (searchTimer.current) clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(() => reload(next), 350);
        } else {
            reload(next);
        }
    };

    return (
        <StoreLayout>
            <Head title="Catalog" />

            <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row lg:space-x-12">
                    <Sidebar filters={local} categories={categories} onChange={patch} />

                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                            <h1 className="text-2xl font-light text-gray-700">
                                All Products <span className="text-gray-400 text-lg">({products.total})</span>
                            </h1>
                            <div className="flex items-center space-x-2 border border-gray-200 rounded px-3 py-1.5 text-sm font-bold">
                                <span className="text-gray-900">sort :</span>
                                <select
                                    className="bg-transparent focus:outline-none cursor-pointer"
                                    value={local.sort}
                                    onChange={(e) => patch({ sort: e.target.value })}
                                >
                                    {sortOptions.map((o) => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {products.data.length === 0 ? (
                            <div className="text-center py-24 text-gray-400">
                                <p className="text-xl font-bold uppercase tracking-wide mb-2">No products found</p>
                                <p className="text-sm">Try adjusting your filters.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                                {products.data.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                    >
                                        <ProductCard product={product} onQuickView={() => setQuickView(product.slug)} />
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        <Pagination links={products.links} />
                    </div>
                </div>
            </main>

            <QuickViewModal slug={quickView} onClose={() => setQuickView(null)} />
        </StoreLayout>
    );
}
