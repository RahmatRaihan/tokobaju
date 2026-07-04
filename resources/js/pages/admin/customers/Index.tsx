import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Pagination } from '@/components/Pagination';
import { Paginated } from '@/types';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    orders_count: number;
    joined: string;
}

interface Props {
    customers: Paginated<Customer>;
    filters: { search: string };
}

export default function Index({ customers, filters }: Props) {
    const [search, setSearch] = useState(filters.search);

    const submitSearch = (value: string) => {
        setSearch(value);
        router.get('/admin/customers', value ? { search: value } : {}, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title="Customers">
            <Head title="Admin — Customers" />
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Customers</h2>

                <div className="relative max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={search} onChange={(e) => submitSearch(e.target.value)} placeholder="Search customers…" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[560px]">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Orders</th>
                                <th className="px-6 py-4">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {customers.data.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No customers yet.</td></tr>
                            ) : (
                                customers.data.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-bold">{c.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{c.email}</td>
                                        <td className="px-6 py-4 text-gray-600">{c.phone ?? '—'}</td>
                                        <td className="px-6 py-4">{c.orders_count}</td>
                                        <td className="px-6 py-4 text-gray-500">{c.joined}</td>
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
