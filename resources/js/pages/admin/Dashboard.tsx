import { Head, Link } from '@inertiajs/react';
import { DollarSign, ShoppingCart, Users, Package, Download } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface MonthlySales {
    ym: string;
    label: string;
    total: number;
}

interface DashboardProps {
    stats: {
        total_sales: number;
        total_sales_formatted: string;
        orders_count: number;
        customers_count: number;
        products_count: number;
    };
    sales_by_month: MonthlySales[];
    orders_by_status: Record<string, number>;
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

const statusFill: Record<string, string> = {
    pending: '#eab308',
    processing: '#3b82f6',
    shipped: '#a855f7',
    completed: '#22c55e',
    cancelled: '#ef4444',
};

const rupiahShort = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}jt` : n >= 1_000 ? `${Math.round(n / 1_000)}rb` : String(n);

/* ponytail: CSS bars + one SVG circle — no chart library. */
function BarChart({ data }: { data: MonthlySales[] }) {
    const max = Math.max(...data.map((d) => d.total), 1);

    return (
        <div className="flex items-end gap-1 sm:gap-2 h-56" role="img" aria-label="Penjualan 12 bulan terakhir">
            {data.map((d) => (
                <div key={d.ym} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                    <div className="w-full flex-1 flex items-end">
                        <div
                            className="w-full bg-black rounded-t-sm transition-all hover:bg-gray-700"
                            style={{ height: `${Math.max((d.total / max) * 100, 1.5)}%` }}
                            title={`${d.label}: Rp ${d.total.toLocaleString('id-ID')}`}
                        />
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-gray-500 whitespace-nowrap">{d.label}</span>
                </div>
            ))}
        </div>
    );
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
    const total = data.reduce((s, d) => s + d.value, 0);
    if (total === 0) return <p className="text-sm text-gray-400 py-16 text-center">Belum ada pesanan.</p>;

    const R = 60;
    const C = 2 * Math.PI * R;
    let offset = 0;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-8">
            <svg viewBox="0 0 160 160" className="w-40 h-40 shrink-0 -rotate-90" role="img" aria-label={`Total ${total} pesanan berdasarkan status`}>
                {data
                    .filter((d) => d.value > 0)
                    .map((d) => {
                        const len = (d.value / total) * C;
                        const dash = <circle key={d.label} cx="80" cy="80" r={R} fill="none" stroke={d.color} strokeWidth="26" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} />;
                        offset += len;
                        return dash;
                    })}
            </svg>
            <ul className="space-y-2 w-full">
                {data.map((d) => (
                    <li key={d.label} className="flex items-center gap-3 text-sm">
                        <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: d.color }} />
                        <span className="capitalize flex-1">{d.label}</span>
                        <span className="font-bold">{d.value}</span>
                        <span className="text-gray-400 w-12 text-right">{Math.round((d.value / total) * 100)}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Dashboard({ stats, sales_by_month, orders_by_status, recent_orders }: DashboardProps) {
    const [month, setMonth] = useState(sales_by_month[sales_by_month.length - 1]?.ym ?? '');
    const donutData = Object.keys(statusFill).map((s) => ({ label: s, value: orders_by_status[s] ?? 0, color: statusFill[s] }));

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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                            <div>
                                <h3 className="font-bold">Penjualan per Bulan</h3>
                                <p className="text-xs text-gray-400">12 bulan terakhir · puncak {rupiahShort(Math.max(...sales_by_month.map((d) => d.total), 0))}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    aria-label="Pilih bulan untuk diekspor"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                                >
                                    {[...sales_by_month].reverse().map((d) => (
                                        <option key={d.ym} value={d.ym}>{d.label}</option>
                                    ))}
                                </select>
                                <a
                                    href={`/admin/export/orders?month=${month}`}
                                    className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 text-sm font-bold rounded-lg hover:bg-gray-800"
                                >
                                    <Download className="w-4 h-4" />
                                    Export Excel
                                </a>
                            </div>
                        </div>
                        <BarChart data={sales_by_month} />
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <h3 className="font-bold mb-6">Status Pesanan</h3>
                        <DonutChart data={donutData} />
                    </div>
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
