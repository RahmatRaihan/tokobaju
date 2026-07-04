import { Head, Link } from '@inertiajs/react';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface DashboardProps {
    stats: {
        total_sales: number;
        total_sales_formatted: string;
        orders_count: number;
        customers_count: number;
        products_count: number;
    };
    recent_orders: {
        id: number;
        order_number: string;
        customer_name: string;
        total_formatted: string;
        status: string;
        created_at: string;
    }[];
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function Dashboard({ stats, recent_orders }: DashboardProps) {
    const cards = [
        { label: 'Total Sales', value: stats.total_sales_formatted, icon: DollarSign },
        { label: 'Orders', value: stats.orders_count, icon: ShoppingCart },
        { label: 'Customers', value: stats.customers_count, icon: Users },
        { label: 'Products', value: stats.products_count, icon: Package },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin — Dashboard" />
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Dashboard</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((c) => {
                        const Icon = c.icon;
                        return (
                            <div key={c.label} className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm text-gray-500 font-medium">{c.label}</p>
                                    <Icon className="w-5 h-5 text-gray-400" />
                                </div>
                                <p className="text-2xl font-black">{c.value}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold">Recent Orders</h3>
                        <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-black">View all</Link>
                    </div>
                    {recent_orders.length === 0 ? (
                        <p className="p-6 text-gray-400 text-sm">No orders yet.</p>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Order</th>
                                    <th className="px-6 py-3">Customer</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Total</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recent_orders.map((o) => (
                                    <tr key={o.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-bold">
                                            <Link href={`/admin/orders/${o.id}`} className="hover:underline">{o.order_number}</Link>
                                        </td>
                                        <td className="px-6 py-4">{o.customer_name}</td>
                                        <td className="px-6 py-4 text-gray-500">{o.created_at}</td>
                                        <td className="px-6 py-4 font-medium">{o.total_formatted}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-sm capitalize ${statusColors[o.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                                {o.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
