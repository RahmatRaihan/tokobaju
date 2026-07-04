import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Pagination } from '@/components/Pagination';
import { useConfirm } from '@/components/ConfirmDialog';
import { Paginated } from '@/types';

interface AdminProduct {
    id: number;
    name: string;
    price_formatted: string;
    category: string | null;
    image: string | null;
    is_featured: boolean;
    is_active: boolean;
    is_sold_out: boolean;
    total_stock: number;
}

interface Props {
    products: Paginated<AdminProduct>;
    filters: { search: string };
}

export default function Index({ products, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const confirm = useConfirm();

    const submitSearch = (value: string) => {
        setSearch(value);
        router.get('/admin/products', value ? { search: value } : {}, { preserveState: true, replace: true });
    };

    const destroy = async (id: number, name: string) => {
        if (await confirm({ message: `Delete "${name}"? This cannot be undone.`, danger: true })) {
            router.delete(`/admin/products/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="Products">
            <Head title="Admin — Products" />
            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-2xl font-bold">Products</h2>
                    <Link href="/admin/products/create" className="bg-black text-white px-4 py-2 text-sm font-bold rounded-sm flex items-center space-x-2 hover:bg-gray-800">
                        <Plus className="w-4 h-4" />
                        <span>Add Product</span>
                    </Link>
                </div>

                <div className="relative max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => submitSearch(e.target.value)}
                        placeholder="Search products…"
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
                    />
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[640px]">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.data.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No products found.</td></tr>
                            ) : (
                                products.data.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            {p.image ? (
                                                <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-sm bg-gray-100" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-sm bg-gray-100" />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-bold">
                                            {p.name}
                                            {p.is_featured && <span className="ml-2 text-[10px] bg-black text-white px-1.5 py-0.5 rounded uppercase">Featured</span>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{p.category ?? '—'}</td>
                                        <td className="px-6 py-4">{p.price_formatted}</td>
                                        <td className="px-6 py-4">{p.total_stock}</td>
                                        <td className="px-6 py-4">
                                            {!p.is_active ? (
                                                <span className="px-2 py-1 text-xs font-bold rounded-sm bg-gray-100 text-gray-500">Hidden</span>
                                            ) : p.is_sold_out ? (
                                                <span className="px-2 py-1 text-xs font-bold rounded-sm bg-red-100 text-red-700">Sold Out</span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-bold rounded-sm bg-green-100 text-green-700">Active</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <Link href={`/admin/products/${p.id}/edit`} className="text-gray-500 hover:text-black p-2 inline-block" title="Edit">
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => destroy(p.id, p.name)} className="text-red-500 hover:text-red-700 p-2" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={products.links} />
            </div>
        </AdminLayout>
    );
}
