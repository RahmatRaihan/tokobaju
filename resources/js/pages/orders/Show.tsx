import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, PackageCheck, Truck, CheckCircle2, XCircle, MessageCircle } from 'lucide-react';
import StoreLayout from '@/layouts/StoreLayout';
import { PageProps } from '@/types';
import { PROGRESS_STEPS, statusLabel, STATUS_COLORS } from '@/lib/orderStatus';

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
    status: string;
    customer_name: string;
    customer_phone: string;
    shipping_address: string | null;
    notes: string | null;
    subtotal_formatted: string;
    total_formatted: string;
    created_at: string;
    items: OrderItem[];
}

const stepIcons = [Clock, PackageCheck, Truck, CheckCircle2];
const stepLabels = ['Dipesan', 'Diproses', 'Dikirim', 'Selesai'];

export default function Show({ order }: { order: Order }) {
    const { site } = usePage<PageProps>().props;
    const isCancelled = order.status === 'cancelled';
    const currentStep = PROGRESS_STEPS.indexOf(order.status as (typeof PROGRESS_STEPS)[number]);

    const waNumber = site.whatsapp_number?.replace(/\D/g, '');
    const waUrl = waNumber
        ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo, saya mau tanya soal pesanan ${order.order_number}`)}`
        : '#';

    return (
        <StoreLayout>
            <Head title={`Pesanan ${order.order_number}`} />
            <div className="max-w-3xl w-full mx-auto px-4 lg:px-8 py-10 lg:py-16">
                <Link href="/my-orders" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black mb-6">
                    <ArrowLeft className="w-4 h-4" /> Kembali ke pesanan
                </Link>

                <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter">{order.order_number}</h1>
                        <p className="text-sm text-gray-500 mt-1">Dipesan {order.created_at}</p>
                    </div>
                    <span className={`px-3 py-1.5 text-sm font-bold rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                        {statusLabel(order.status)}
                    </span>
                </div>

                {/* Progress tracker */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                    {isCancelled ? (
                        <div className="flex items-center gap-3 text-red-600">
                            <XCircle className="w-6 h-6" />
                            <div>
                                <p className="font-bold">Pesanan Dibatalkan</p>
                                <p className="text-sm text-gray-500">Hubungi kami via WhatsApp jika ada pertanyaan.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start justify-between relative">
                            {/* connecting line */}
                            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 mx-6" />
                            <motion.div
                                className="absolute top-5 left-0 h-0.5 bg-black mx-6"
                                initial={{ width: '0%' }}
                                animate={{ width: `${(currentStep / (PROGRESS_STEPS.length - 1)) * 100}%` }}
                                transition={{ duration: 0.6, ease: 'easeInOut' }}
                                style={{ maxWidth: 'calc(100% - 3rem)' }}
                            />

                            {PROGRESS_STEPS.map((_, i) => {
                                const Icon = stepIcons[i];
                                const done = i <= currentStep;
                                return (
                                    <div key={i} className="relative z-10 flex flex-col items-center flex-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${done ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className={`mt-2 text-[11px] sm:text-xs font-bold text-center ${done ? 'text-black' : 'text-gray-400'}`}>
                                            {stepLabels[i]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Items */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="font-bold">Item Pesanan</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between px-6 py-4">
                                <div>
                                    <p className="font-medium text-sm">{item.product_name}</p>
                                    {item.variant_label && item.variant_label !== 'Default' && (
                                        <p className="text-xs text-gray-500">{item.variant_label}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-0.5">{item.unit_price_formatted} × {item.quantity}</p>
                                </div>
                                <span className="font-bold text-sm">{item.line_total_formatted}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <span className="font-bold uppercase text-sm">Total</span>
                        <span className="font-black text-lg">{order.total_formatted}</span>
                    </div>
                </div>

                {/* Shipping info */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 space-y-2 text-sm">
                    <h2 className="font-bold mb-3">Info Pengiriman</h2>
                    <p><span className="text-gray-500">Nama:</span> {order.customer_name}</p>
                    <p><span className="text-gray-500">No. HP:</span> {order.customer_phone}</p>
                    <p><span className="text-gray-500">Alamat:</span> {order.shipping_address ?? '—'}</p>
                    {order.notes && <p><span className="text-gray-500">Catatan:</span> {order.notes}</p>}
                </div>

                {/* Contact admin */}
                <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold py-3.5 rounded-xl uppercase tracking-wide text-sm hover:bg-[#1da851] transition-colors"
                >
                    <MessageCircle className="w-5 h-5" /> Tanya via WhatsApp
                </a>
            </div>
        </StoreLayout>
    );
}
