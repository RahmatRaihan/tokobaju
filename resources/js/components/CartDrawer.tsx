import { X, Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, FormEvent } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useCart } from '@/lib/cart';
import { useUi } from '@/lib/ui';
import { formatRupiah } from '@/lib/format';

export function CartDrawer() {
    const { isCartOpen, closeCart } = useUi();
    const { items, subtotal, updateQuantity, removeItem, clear } = useCart();
    const { auth } = usePage<PageProps>().props;

    const [checkingOut, setCheckingOut] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [form, setForm] = useState({
        customer_name: auth.user?.name ?? '',
        customer_phone: auth.user?.phone ?? '',
        shipping_address: '',
        notes: '',
    });
    const [error, setError] = useState<string | null>(null);

    const submitCheckout = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setProcessing(true);

        router.post(
            '/checkout',
            {
                ...form,
                items: items.map((i) => ({ variant_id: i.variant_id, quantity: i.quantity })),
            },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const checkout = (page.props as unknown as PageProps).flash?.checkout;
                    if (checkout?.whatsapp_url) {
                        clear();
                        setCheckingOut(false);
                        closeCart();
                        window.open(checkout.whatsapp_url, '_blank');
                    }
                },
                onError: (errors) => {
                    setError(Object.values(errors)[0] as string);
                },
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold uppercase tracking-wide flex items-center gap-2">
                                {checkingOut && (
                                    <button onClick={() => setCheckingOut(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                )}
                                {checkingOut ? 'Checkout' : `Your Cart (${items.length})`}
                            </h2>
                            <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {items.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4 p-6">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold uppercase tracking-wide text-gray-900">Your cart is empty</h3>
                                <p className="text-sm font-medium text-gray-500 text-center px-8 pb-4">
                                    Looks like you haven't added anything to your cart yet.
                                </p>
                                <button onClick={closeCart} className="px-8 py-3 bg-black text-white text-sm font-bold rounded-sm hover:bg-gray-900 transition-colors uppercase tracking-widest w-full max-w-[280px]">
                                    Continue Shopping
                                </button>
                            </div>
                        ) : checkingOut ? (
                            /* Checkout form */
                            <form onSubmit={submitCheckout} className="flex-1 flex flex-col overflow-y-auto">
                                <div className="flex-1 p-6 space-y-4">
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-1">Full Name</label>
                                        <input
                                            required
                                            value={form.customer_name}
                                            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-1">WhatsApp Number</label>
                                        <input
                                            required
                                            value={form.customer_phone}
                                            onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                                            placeholder="08xxxxxxxxxx"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-1">Shipping Address</label>
                                        <textarea
                                            value={form.shipping_address}
                                            onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black h-20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-1">Notes (optional)</label>
                                        <textarea
                                            value={form.notes}
                                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black h-16"
                                        />
                                    </div>
                                </div>
                                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-bold uppercase text-gray-600">Total</span>
                                        <span className="text-lg font-bold">{formatRupiah(subtotal)}</span>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#1da851] transition-colors tracking-wide uppercase text-sm disabled:opacity-60"
                                    >
                                        {processing ? 'Processing…' : 'Order via WhatsApp'}
                                    </button>
                                    <p className="text-xs text-gray-500 mt-3 text-center">
                                        You'll be redirected to WhatsApp to confirm your order with our admin.
                                    </p>
                                </div>
                            </form>
                        ) : (
                            /* Cart items */
                            <>
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {items.map((item) => (
                                        <div key={item.variant_id} className="flex gap-4">
                                            <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                                {item.image && (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                                )}
                                            </div>
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-sm font-bold tracking-tight uppercase line-clamp-2 pr-4">{item.name}</h3>
                                                        {item.variant_label && item.variant_label !== 'Default' && (
                                                            <p className="text-xs text-gray-500 mt-0.5">{item.variant_label}</p>
                                                        )}
                                                    </div>
                                                    <button onClick={() => removeItem(item.variant_id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-medium mt-1">{formatRupiah(item.unit_price)}</p>
                                                <div className="mt-auto flex items-center border border-gray-200 rounded w-fit">
                                                    <button onClick={() => updateQuantity(item.variant_id, item.quantity - 1)} className="px-2 py-1 hover:bg-gray-100 transition-colors">
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-xs font-bold w-8 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.variant_id, item.quantity + 1)} className="px-2 py-1 hover:bg-gray-100 transition-colors disabled:opacity-40" disabled={item.quantity >= item.max_stock}>
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-bold uppercase text-gray-600">Subtotal</span>
                                        <span className="text-lg font-bold">{formatRupiah(subtotal)}</span>
                                    </div>
                                    {auth.user ? (
                                        <button
                                            onClick={() => setCheckingOut(true)}
                                            className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-colors tracking-wide uppercase text-sm"
                                        >
                                            Checkout
                                        </button>
                                    ) : (
                                        <Link
                                            href="/login"
                                            onClick={closeCart}
                                            className="block text-center w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-colors tracking-wide uppercase text-sm"
                                        >
                                            Login to Checkout
                                        </Link>
                                    )}
                                </div>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
