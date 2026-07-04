import { Head, Link, router } from '@inertiajs/react';
import { Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Pagination } from '@/components/Pagination';
import { Paginated } from '@/types';

interface AdminOrder {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    total_formatted: string;
    status: string;
    items_count: number;
    created_at: string;
}

interface Props {
    orders: Paginated<AdminOrder>;
    statuses: string[];
    filters: { status: string; search: string };
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function Index({ orders, statuses, filters }: Props) {
    const [search, setSearch] = useState(filters.search);

    const reload = (patch: Record<string, string>) => {
        const query = { status: filters.status, search, ...patch };
        const clean = Object.fromEntries(Object.entries(query).filter(([, v]) => v));
        router.get('/admin/orders', clean, { preserveState: true, replace: true });
    };

    const destroy = (id: number, num: string) => {
        if (confirm(`Delete order ${num}?`)) router.delete(`/admin/orders/${id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Orders">
            <Head title="Admin — Orders" />
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Orders</h2>

                <div className="flex flex-wrap gap-3">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && reload({ search })}
                        placeholder="Search order # or customer…"
                        className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black w-64"
                    />
                    <select
                        value={filters.status}
                        onChange={(e) => reload({ status: e.target.value })}
                        className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black capitalize"
                    >
                        <option value="">All statuses</option>
                        {statuses.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[720px]">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Order</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.data.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No orders found.</td></tr>
                            ) : (
                                orders.data.map((o) => (
                                    <tr key={o.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-bold">
                                            <Link href={`/admin/orders/${o.id}`} className="hover:underline">{o.order_number}</Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>{o.customer_name}</div>
                                            <div className="text-xs text-gray-400">{o.customer_phone}</div>
                                        </td>
                                        <td className="px-6 py-4">{o.items_count}</td>
                                        <td className="px-6 py-4 font-medium">{o.total_formatted}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-sm capitalize ${statusColors[o.status] ?? 'bg-gray-100'}`}>{o.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{o.created_at}</td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <Link href={`/admin/orders/${o.id}`} className="text-gray-500 hover:text-black p-2 inline-block"><Eye className="w-4 h-4" /></Link>
                                            <button onClick={() => destroy(o.id, o.order_number)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={orders.links} />
            </div>
        </AdminLayout>
    );
}
