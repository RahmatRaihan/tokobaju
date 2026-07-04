import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useCart } from '@/lib/cart';
import { useUi } from '@/lib/ui';
import { formatRupiah } from '@/lib/format';

export function CartDrawer() {
    const { isCartOpen, closeCart } = useUi();
    const { items, subtotal, updateQuantity, removeItem } = useCart();
    const { auth } = usePage<PageProps>().props;

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
                            <h2 className="text-xl font-bold uppercase tracking-wide">Your Cart ({items.length})</h2>
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
                        ) : (
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
                                        <Link
                                            href="/checkout"
                                            onClick={closeCart}
                                            className="block text-center w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-colors tracking-wide uppercase text-sm"
                                        >
                                            Checkout
                                        </Link>
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
