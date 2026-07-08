import { Head, router } from '@inertiajs/react';
import { motion } from 'motion/react';
import { useState, useRef, useCallback } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
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

export default function Catalog({ products, categories, filters }: CatalogProps) {
    const [quickView, setQuickView] = useState<string | null>(null);
    const [local, setLocal] = useState<Filters>(filters);
    const [filterOpen, setFilterOpen] = useState(false);
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // How many filters are active (for the mobile "Filter" button badge).
    const activeFilters =
        (local.category ? 1 : 0) +
        (local.availability && local.availability !== 'all' ? 1 : 0) +
        (local.price && local.price !== 'all' ? 1 : 0);

    const reload = useCallback((next: Filters) => {
        const query: Record<string, string> = {};
        if (next.search) query.search = next.search;
        if (next.category) query.category = next.category;
        if (next.availability && next.availability !== 'all') query.availability = next.availability;
        if (next.price && next.price !== 'all') query.price = next.price;

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

            <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-6 lg:py-12">
                <div className="flex flex-col lg:flex-row lg:space-x-12">
                    <Sidebar
                        filters={local}
                        categories={categories}
                        onChange={patch}
                        mobileOpen={filterOpen}
                        onMobileClose={() => setFilterOpen(false)}
                    />

                    <div className="flex-1">
                        {/* Mobile toolbar: search + filter button (compact) */}
                        <div className="lg:hidden mb-6 space-y-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products…"
                                    value={local.search}
                                    onChange={(e) => patch({ search: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={() => setFilterOpen(true)}
                                className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold hover:border-black transition-colors"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filter
                                {activeFilters > 0 && (
                                    <span className="bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{activeFilters}</span>
                                )}
                            </button>
                        </div>

                        {/* Desktop header: title */}
                        <div className="hidden lg:flex items-center mb-8">
                            <h1 className="text-2xl font-light text-gray-700">
                                All Products <span className="text-gray-400 text-lg">({products.total})</span>
                            </h1>
                        </div>

                        {/* Mobile result count */}
                        <p className="lg:hidden text-sm text-gray-500 mb-4">{products.total} product(s)</p>

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
