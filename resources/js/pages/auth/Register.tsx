import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'motion/react';
import { FormEvent } from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { PasswordInput } from '@/components/PasswordInput';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <StoreLayout>
            <Head title="Create Account" />
            <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-16 lg:py-24 flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md bg-white p-8 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-gray-100"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black tracking-tighter uppercase italic mb-2">Create Account</h1>
                        <p className="text-gray-500 text-sm font-medium">Join us and start your journey.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2" htmlFor="name">Full Name</label>
                            <input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black" placeholder="John Doe" required />
                            {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2" htmlFor="email">Email Address</label>
                            <input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black" placeholder="you@example.com" required />
                            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2" htmlFor="phone">WhatsApp Number (optional)</label>
                            <input id="phone" type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black" placeholder="08xxxxxxxxxx" />
                            {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2" htmlFor="password">Password</label>
                            <PasswordInput id="password" value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder="••••••••" required />
                            {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2" htmlFor="password_confirmation">Confirm Password</label>
                            <PasswordInput id="password_confirmation" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} placeholder="••••••••" required />
                        </div>

                        <div className="pt-2">
                            <button type="submit" disabled={processing} className="w-full bg-black text-white py-3.5 px-4 rounded-sm font-bold tracking-widest text-sm hover:bg-gray-900 transition-colors disabled:opacity-60">
                                {processing ? 'CREATING…' : 'CREATE ACCOUNT'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm font-medium text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="text-black font-bold hover:underline">Sign in here</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </StoreLayout>
    );
}
