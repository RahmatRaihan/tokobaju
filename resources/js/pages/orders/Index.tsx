import { Head, Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import StoreLayout from '@/layouts/StoreLayout';
import { Pagination } from '@/components/Pagination';
import { Paginated } from '@/types';
import { statusLabel, STATUS_COLORS } from '@/lib/orderStatus';

interface OrderRow {
    id: number;
    order_number: string;
    status: string;
    total_formatted: string;
    items_count: number;
    created_at: string;
}

interface Props {
    orders: Paginated<OrderRow>;
}

export default function Index({ orders }: Props) {
    return (
        <StoreLayout>
            <Head title="Pesanan Saya" />
            <div className="max-w-3xl w-full mx-auto px-4 lg:px-8 py-10 lg:py-16">
                <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">Pesanan Saya</h1>

                {orders.data.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-9 h-9 text-gray-300" />
                        </div>
                        <p className="text-lg font-bold uppercase tracking-wide text-gray-700 mb-2">Belum ada pesanan</p>
                        <p className="text-sm mb-6">Yuk mulai belanja dan checkout produk favoritmu.</p>
                        <Link href="/catalog" className="inline-block bg-black text-white text-sm font-bold px-8 py-3 rounded-sm uppercase tracking-widest hover:bg-gray-900 transition-colors">
                            Belanja Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.data.map((order, i) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link
                                    href={`/my-orders/${order.id}`}
                                    className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-black hover:shadow-sm transition-all"
                                >
                                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Package className="w-6 h-6 text-gray-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-bold text-sm">{order.order_number}</span>
                                            <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                                {statusLabel(order.status)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {order.created_at} · {order.items_count} item · {order.total_formatted}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                </Link>
                            </motion.div>
                        ))}
                        <Pagination links={orders.links} />
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
