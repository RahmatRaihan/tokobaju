import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';

interface OrderItem {
    id: number;
    product_name: string;
    variant_label: string | null;
    unit_price_formatted: string;
    quantity: number;
    line_total_formatted: string;
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string | null;
    shipping_address: string | null;
    city: string | null;
    province: string | null;
    postal_code: string | null;
    notes: string | null;
    status: string;
    subtotal_formatted: string;
    total_formatted: string;
    created_at: string;
    items: OrderItem[];
}

interface Props {
    order: Order;
    statuses: string[];
}

export default function Show({ order, statuses }: Props) {
    const changeStatus = (status: string) => {
        router.patch(`/admin/orders/${order.id}/status`, { status }, { preserveScroll: true });
    };

    return (
        <AdminLayout title={`Order ${order.order_number}`}>
            <Head title={`Admin — ${order.order_number}`} />
            <div className="space-y-6 max-w-3xl">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <h2 className="text-2xl font-bold">{order.order_number}</h2>
                    <Link href="/admin/orders" className="text-sm font-bold text-gray-500 hover:text-black">← Back to orders</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-2">
                        <h3 className="font-bold mb-3">Customer</h3>
                        <p className="text-sm"><span className="text-gray-500">Name:</span> {order.customer_name}</p>
                        <p className="text-sm"><span className="text-gray-500">Phone:</span> {order.customer_phone}</p>
                        {order.customer_email && <p className="text-sm"><span className="text-gray-500">Email:</span> {order.customer_email}</p>}
                        <p className="text-sm"><span className="text-gray-500">Address:</span> {order.shipping_address ?? '—'}</p>
                        {(order.city || order.province) && (
                            <p className="text-sm"><span className="text-gray-500">City / Province:</span> {[order.city, order.province, order.postal_code].filter(Boolean).join(', ')}</p>
                        )}
                        <p className="text-sm"><span className="text-gray-500">Notes:</span> {order.notes ?? '—'}</p>
                        <p className="text-sm"><span className="text-gray-500">Placed:</span> {order.created_at}</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <h3 className="font-bold mb-3">Status</h3>
                        <select
                            value={order.status}
                            onChange={(e) => changeStatus(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm capitalize focus:outline-none focus:border-black"
                        >
                            {statuses.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                        </select>
                        <p className="text-xs text-gray-400 mt-2">
                            Moving to <strong>processing</strong> confirms the order and reduces variant stock.
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">Product</th>
                                <th className="px-6 py-3">Variant</th>
                                <th className="px-6 py-3">Unit Price</th>
                                <th className="px-6 py-3">Qty</th>
                                <th className="px-6 py-3 text-right">Line Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {order.items.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 font-medium">{item.product_name}</td>
                                    <td className="px-6 py-4 text-gray-500">{item.variant_label ?? '—'}</td>
                                    <td className="px-6 py-4">{item.unit_price_formatted}</td>
                                    <td className="px-6 py-4">{item.quantity}</td>
                                    <td className="px-6 py-4 text-right font-medium">{item.line_total_formatted}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t border-gray-200 bg-gray-50">
                            <tr>
                                <td colSpan={4} className="px-6 py-3 text-right font-bold">Total</td>
                                <td className="px-6 py-3 text-right font-black">{order.total_formatted}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
