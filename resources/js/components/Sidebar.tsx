import { Search, ChevronUp, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Category } from '@/types';

interface FilterSectionProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-100 py-6">
            <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between font-bold text-sm">
                {title}
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {isOpen && <div className="mt-4">{children}</div>}
        </div>
    );
}

function Radio({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
    return (
        <label className="flex items-center space-x-3 cursor-pointer group">
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${checked ? 'border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                {checked && <div className="w-2 h-2 bg-black rounded-full" />}
            </div>
            <input type="radio" className="hidden" checked={checked} onChange={onChange} />
            <span className="text-sm font-medium">{label}</span>
        </label>
    );
}

export interface Filters {
    search: string;
    category: string;
    availability: string;
    price: string;
    sort: string;
}

interface SidebarProps {
    filters: Filters;
    categories: Category[];
    onChange: (patch: Partial<Filters>) => void;
    /** Controls the mobile filter drawer (managed by the Catalog page). */
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

/** The actual filter controls (category / availability / price), reused on
 *  the desktop sidebar and inside the mobile drawer. */
function FilterControls({ filters, categories, onChange }: Omit<SidebarProps, 'mobileOpen' | 'onMobileClose'>) {
    return (
        <>
            <FilterSection title="Category">
                <div className="space-y-3">
                    <Radio checked={filters.category === ''} onChange={() => onChange({ category: '' })} label="All Products" />
                    {categories.map((c) => (
                        <Radio key={c.id} checked={filters.category === c.slug} onChange={() => onChange({ category: c.slug })} label={c.name} />
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="Availability">
                <div className="space-y-3">
                    <Radio checked={filters.availability === 'all'} onChange={() => onChange({ availability: 'all' })} label="All" />
                    <Radio checked={filters.availability === 'instock'} onChange={() => onChange({ availability: 'instock' })} label="In Stock" />
                    <Radio checked={filters.availability === 'soldout'} onChange={() => onChange({ availability: 'soldout' })} label="Sold Out" />
                </div>
            </FilterSection>

            <FilterSection title="Price">
                <div className="space-y-3">
                    <Radio checked={filters.price === 'all'} onChange={() => onChange({ price: 'all' })} label="All Prices" />
                    <Radio checked={filters.price === 'under'} onChange={() => onChange({ price: 'under' })} label="Under Rp 620.000" />
                    <Radio checked={filters.price === 'mid'} onChange={() => onChange({ price: 'mid' })} label="Rp 620.000 - Rp 1.200.000" />
                    <Radio checked={filters.price === 'high'} onChange={() => onChange({ price: 'high' })} label="Rp 1.200.000 - Rp 1.800.000" />
                    <Radio checked={filters.price === 'veryhigh'} onChange={() => onChange({ price: 'veryhigh' })} label="Rp 1.800.000 +" />
                </div>
            </FilterSection>
        </>
    );
}

export function Sidebar({ filters, categories, onChange, mobileOpen = false, onMobileClose }: SidebarProps) {
    return (
        <>
            {/* Desktop sidebar (search lives here on large screens) */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="relative mb-8">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search"
                        value={filters.search}
                        onChange={(e) => onChange({ search: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                </div>
                <FilterControls filters={filters} categories={categories} onChange={onChange} />
            </aside>

            {/* Mobile slide-in filter drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onMobileClose}
                            className="lg:hidden fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                            className="lg:hidden fixed top-0 left-0 h-full w-[85%] max-w-xs bg-white z-50 shadow-2xl flex flex-col"
                        >
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <h2 className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
                                    <SlidersHorizontal className="w-5 h-5" /> Filters
                                </h2>
                                <button onClick={onMobileClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto px-5">
                                <FilterControls filters={filters} categories={categories} onChange={onChange} />
                            </div>
                            <div className="p-5 border-t border-gray-100">
                                <button
                                    onClick={onMobileClose}
                                    className="w-full bg-black text-white font-bold py-3.5 rounded-xl uppercase tracking-wide text-sm hover:bg-gray-900 transition-colors"
                                >
                                    Show Results
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
