import { Head, router } from '@inertiajs/react';
import { Search, Download, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Pagination } from '@/components/Pagination';
import { useConfirm } from '@/components/ConfirmDialog';
import { Paginated } from '@/types';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    orders_count: number;
    joined: string;
    is_new: boolean;
}

interface Props {
    customers: Paginated<Customer>;
    filters: { search: string };
}

export default function Index({ customers, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const confirm = useConfirm();

    const submitSearch = (value: string) => {
        setSearch(value);
        router.get('/admin/customers', value ? { search: value } : {}, { preserveState: true, replace: true });
    };

    const destroy = async (c: Customer) => {
        const warning = c.orders_count > 0
            ? `${c.name} has ${c.orders_count} order(s). The orders stay, but they will no longer be linked to an account.`
            : `Delete ${c.name}? This cannot be undone.`;

        if (await confirm({ message: warning, danger: true, confirmText: 'Delete' })) {
            router.delete(`/admin/customers/${c.id}`, { preserveScroll: true });
        }
    };

    // The export mirrors whatever search filter is active.
    const exportUrl = `/admin/customers/export${search ? `?search=${encodeURIComponent(search)}` : ''}`;

    return (
        <AdminLayout title="Customers">
            <Head title="Admin — Customers" />
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Customers</h2>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="relative max-w-xs flex-1 min-w-[220px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input value={search} onChange={(e) => submitSearch(e.target.value)} placeholder="Search customers…" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
                    </div>
                    <a href={exportUrl} className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 text-sm font-bold rounded-lg hover:bg-gray-800">
                        <Download className="w-4 h-4" />
                        Export Excel
                    </a>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[640px]">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Orders</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {customers.data.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No customers yet.</td></tr>
                            ) : (
                                customers.data.map((c) => (
                                    <tr key={c.id} className={`hover:bg-gray-50 ${c.is_new ? 'bg-green-50/60' : ''}`}>
                                        <td className="px-6 py-4 font-bold">
                                            {c.name}
                                            {c.is_new && <span className="ml-2 text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded uppercase align-middle">New</span>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{c.email}</td>
                                        <td className="px-6 py-4 text-gray-600">{c.phone ?? '—'}</td>
                                        <td className="px-6 py-4">{c.orders_count}</td>
                                        <td className="px-6 py-4 text-gray-500">{c.joined}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => destroy(c)} className="text-red-500 hover:text-red-700 p-2 rounded-sm hover:bg-red-50" title="Delete" aria-label={`Delete ${c.name}`}>
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={customers.links} />
            </div>
        </AdminLayout>
    );
}
