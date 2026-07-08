import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion } from 'motion/react';
import { FormEvent } from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { PasswordInput } from '@/components/PasswordInput';
import { PageProps } from '@/types';

export default function Login() {
    const { flash } = usePage<PageProps>().props;
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <StoreLayout>
            <Head title="Login" />
            <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-16 lg:py-24 flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md bg-white p-8 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-gray-100"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black tracking-tighter uppercase italic mb-2">Login</h1>
                        <p className="text-gray-500 text-sm font-medium">Welcome back. Please enter your details.</p>
                    </div>

                    {flash.error && (
                        <div role="alert" className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-sm px-4 py-3">
                            {flash.error}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2" htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                                placeholder="you@example.com"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-bold text-gray-900" htmlFor="password">Password</label>
                                <Link href="/forgot-password" className="text-xs font-bold text-gray-500 hover:text-black transition-colors">Forgot password?</Link>
                            </div>
                            <PasswordInput
                                id="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
                        </div>

                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                            Remember me
                        </label>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-black text-white py-3.5 px-4 rounded-sm font-bold tracking-widest text-sm hover:bg-gray-900 transition-colors disabled:opacity-60"
                            >
                                {processing ? 'SIGNING IN…' : 'SIGN IN'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm font-medium text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-black font-bold hover:underline">Sign up here</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </StoreLayout>
    );
}
