import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { useState, ReactNode } from 'react';
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
}

export function Sidebar({ filters, categories, onChange }: SidebarProps) {
    return (
        <aside className="w-full lg:w-64 flex-shrink-0 mb-8 lg:mb-0">
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

            <div className="border border-gray-100 rounded-xl p-4 lg:p-0 lg:border-none">
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
            </div>
        </aside>
    );
}
