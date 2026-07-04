import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion } from 'motion/react';
import { useState, useEffect, FormEvent } from 'react';
import { ShoppingBag } from 'lucide-react';
import StoreLayout from '@/layouts/StoreLayout';
import { useCart } from '@/lib/cart';
import { formatRupiah } from '@/lib/format';
import { PROVINCES, citiesOf } from '@/lib/regions';
import { PageProps } from '@/types';

interface CheckoutProps {
    prefill: { name: string; phone: string; email: string };
}

export default function Checkout({ prefill }: CheckoutProps) {
    const { items, subtotal, clear } = useCart();
    const { flash } = usePage<PageProps>().props;

    const [firstName, setFirstName] = useState(prefill.name.split(' ')[0] ?? '');
    const [lastName, setLastName] = useState(prefill.name.split(' ').slice(1).join(' ') ?? '');
    const [email, setEmail] = useState(prefill.email);
    const [newsletter, setNewsletter] = useState(true);
    const [address, setAddress] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [postal, setPostal] = useState('');
    const [phone, setPhone] = useState(prefill.phone);
    const [notes, setNotes] = useState('');

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);

    const cities = citiesOf(province);

    // Reset city when province changes.
    useEffect(() => {
        setCity('');
    }, [province]);

    // If a successful checkout flashed a WhatsApp URL, open it (redirect happens
    // server-side to the order page; this is a safety net if we stay here).
    useEffect(() => {
        if (flash?.checkout?.whatsapp_url) {
            window.open(flash.checkout.whatsapp_url, '_blank');
        }
    }, [flash]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});
        setGeneralError(null);
        setProcessing(true);

        router.post(
            '/checkout',
            {
                customer_name: `${firstName} ${lastName}`.trim(),
                customer_phone: phone,
                customer_email: email,
                shipping_address: address,
                province,
                city,
                postal_code: postal,
                notes,
                items: items.map((i) => ({ variant_id: i.variant_id, quantity: i.quantity })),
            },
            {
                onSuccess: (page) => {
                    const checkout = (page.props as unknown as PageProps).flash?.checkout;
                    if (checkout?.whatsapp_url) {
                        clear();
                        window.open(checkout.whatsapp_url, '_blank');
                    }
                },
                onError: (errs) => {
                    setErrors(errs as Record<string, string>);
                    if (errs.items) setGeneralError(errs.items as string);
                },
                onFinish: () => setProcessing(false),
            },
        );
    };

    const inputClass =
        'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors';

    // Empty cart guard.
    if (items.length === 0) {
        return (
            <StoreLayout>
                <Head title="Checkout" />
                <div className="max-w-md w-full mx-auto px-4 py-24 text-center text-gray-400">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-9 h-9 text-gray-300" />
                    </div>
                    <p className="text-lg font-bold uppercase tracking-wide text-gray-700 mb-2">Keranjang kosong</p>
                    <p className="text-sm mb-6">Tambahkan produk dulu sebelum checkout.</p>
                    <Link href="/catalog" className="inline-block bg-black text-white text-sm font-bold px-8 py-3 rounded-sm uppercase tracking-widest hover:bg-gray-900">
                        Belanja Sekarang
                    </Link>
                </div>
            </StoreLayout>
        );
    }

    return (
        <StoreLayout>
            <Head title="Checkout" />
            <div className="max-w-6xl w-full mx-auto px-4 lg:px-8 py-10 lg:py-14">
                {/* Breadcrumb */}
                <div className="text-sm mb-8">
                    <Link href="/catalog" className="text-gray-400 font-bold uppercase tracking-wide hover:text-black">Cart</Link>
                    <span className="mx-2 text-gray-300">&gt;</span>
                    <span className="text-gray-900 font-bold uppercase tracking-wide">Information &amp; Shipping</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-14">
                    {/* Form */}
                    <form onSubmit={submit} className="order-2 lg:order-1">
                        {generalError && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{generalError}</div>
                        )}

                        {/* Contact Information */}
                        <section className="mb-10">
                            <h2 className="text-lg font-black uppercase tracking-wide mb-5">Contact Information</h2>
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputClass}
                                />
                                {errors.customer_email && <p className="text-red-500 text-xs mt-1">{errors.customer_email}</p>}
                            </div>
                            <label className="flex items-center gap-2 mt-3 text-sm text-gray-700 cursor-pointer">
                                <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="w-4 h-4 accent-black" />
                                Email me with news and offers
                            </label>
                        </section>

                        {/* Shipping Address */}
                        <section>
                            <h2 className="text-lg font-black uppercase tracking-wide mb-5">Shipping Address</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} required />
                                        {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
                                    </div>
                                    <input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
                                </div>

                                <div>
                                    <input placeholder="Full Address (Street, Building, Apartment)" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} required />
                                    {errors.shipping_address && <p className="text-red-500 text-xs mt-1">{errors.shipping_address}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <select value={province} onChange={(e) => setProvince(e.target.value)} className={`${inputClass} ${!province ? 'text-gray-400' : ''}`} required>
                                            <option value="">Select Province</option>
                                            {PROVINCES.map((p) => (
                                                <option key={p} value={p} className="text-black">{p}</option>
                                            ))}
                                        </select>
                                        {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
                                    </div>
                                    <div>
                                        <select
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className={`${inputClass} ${!city ? 'text-gray-400' : ''}`}
                                            disabled={!province}
                                            required
                                        >
                                            <option value="">{province ? 'Select City' : 'Select Province First'}</option>
                                            {cities.map((c) => (
                                                <option key={c} value={c} className="text-black">{c}</option>
                                            ))}
                                        </select>
                                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <input placeholder="Postal Code" value={postal} onChange={(e) => setPostal(e.target.value.replace(/\D/g, ''))} maxLength={10} className={inputClass} />
                                        {errors.postal_code && <p className="text-red-500 text-xs mt-1">{errors.postal_code}</p>}
                                    </div>
                                </div>

                                <div>
                                    <input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} required />
                                    {errors.customer_phone && <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>}
                                </div>

                                <div>
                                    <textarea placeholder="Order notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} className={`${inputClass} h-20`} />
                                </div>
                            </div>
                        </section>

                        <div className="mt-8 hidden lg:block">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#1da851] transition-colors uppercase tracking-wide text-sm disabled:opacity-60"
                            >
                                {processing ? 'Processing…' : 'Order via WhatsApp'}
                            </button>
                            <p className="text-xs text-gray-500 mt-3 text-center">
                                Kamu akan diarahkan ke WhatsApp untuk konfirmasi pesanan dengan admin.
                            </p>
                        </div>
                    </form>

                    {/* Order summary */}
                    <aside className="order-1 lg:order-2">
                        <div className="bg-gray-50 rounded-2xl p-6 lg:sticky lg:top-28">
                            <h2 className="text-lg font-black uppercase tracking-wide mb-5">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.variant_id} className="flex gap-3">
                                        <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                            {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold uppercase line-clamp-1">{item.name}</p>
                                            {item.variant_label && item.variant_label !== 'Default' && (
                                                <p className="text-xs text-gray-500">{item.variant_label}</p>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium whitespace-nowrap">{formatRupiah(item.unit_price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatRupiah(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-gray-400">Dihitung via WhatsApp</span>
                                </div>
                                <div className="flex justify-between font-black text-lg pt-2 border-t border-gray-200 mt-2">
                                    <span>Total</span>
                                    <span>{formatRupiah(subtotal)}</span>
                                </div>
                            </div>

                            {/* Mobile submit (the form sits above via order-classes) */}
                            <button
                                type="button"
                                onClick={submit}
                                disabled={processing}
                                className="lg:hidden w-full mt-6 bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#1da851] transition-colors uppercase tracking-wide text-sm disabled:opacity-60"
                            >
                                {processing ? 'Processing…' : 'Order via WhatsApp'}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </StoreLayout>
    );
}
