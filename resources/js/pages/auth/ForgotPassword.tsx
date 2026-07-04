import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'motion/react';
import { FormEvent, useState } from 'react';
import { Mail, ShieldCheck, KeyRound } from 'lucide-react';
import StoreLayout from '@/layouts/StoreLayout';
import { PasswordInput } from '@/components/PasswordInput';

type Step = 'email' | 'otp' | 'password';

export default function ForgotPassword() {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [notice, setNotice] = useState<string | null>(null);

    const post = (url: string, data: Record<string, string>, onOk: () => void) => {
        setProcessing(true);
        setErrors({});
        router.post(url, data, {
            preserveScroll: true,
            onSuccess: (page) => {
                const flash = (page.props.flash as { success?: string }) ?? {};
                setNotice(flash.success ?? null);
                onOk();
            },
            onError: (errs) => setErrors(errs as Record<string, string>),
            onFinish: () => setProcessing(false),
        });
    };

    const submitEmail = (e: FormEvent) => {
        e.preventDefault();
        post('/forgot-password', { email }, () => setStep('otp'));
    };

    const submitOtp = (e: FormEvent) => {
        e.preventDefault();
        post('/forgot-password/verify', { email, code }, () => setStep('password'));
    };

    const submitPassword = (e: FormEvent) => {
        e.preventDefault();
        post('/forgot-password/reset', {
            email,
            code,
            password,
            password_confirmation: passwordConfirmation,
        }, () => {
            // On success the controller redirects to /login, so nothing else to do.
        });
    };

    const resendCode = () => {
        post('/forgot-password', { email }, () => setNotice('A new code has been sent.'));
    };

    const steps = [
        { key: 'email', label: 'Email', icon: Mail },
        { key: 'otp', label: 'Verify', icon: ShieldCheck },
        { key: 'password', label: 'Reset', icon: KeyRound },
    ] as const;
    const stepIndex = steps.findIndex((s) => s.key === step);

    return (
        <StoreLayout>
            <Head title="Forgot Password" />
            <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-16 lg:py-24 flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md bg-white p-8 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-gray-100"
                >
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-black tracking-tighter uppercase italic mb-2">Reset Password</h1>
                        <p className="text-gray-500 text-sm font-medium">
                            {step === 'email' && "Enter your email and we'll send you a verification code."}
                            {step === 'otp' && `Enter the 6-digit code sent to ${email}.`}
                            {step === 'password' && 'Create a new password for your account.'}
                        </p>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {steps.map((s, i) => {
                            const Icon = s.icon;
                            const active = i <= stepIndex;
                            return (
                                <div key={s.key} className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${active ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < stepIndex ? 'bg-black' : 'bg-gray-200'}`} />}
                                </div>
                            );
                        })}
                    </div>

                    {notice && (
                        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">{notice}</div>
                    )}

                    {/* Step 1: Email */}
                    {step === 'email' && (
                        <form onSubmit={submitEmail} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                    placeholder="you@example.com"
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                            </div>
                            <button type="submit" disabled={processing} className="w-full bg-black text-white py-3.5 px-4 rounded-sm font-bold tracking-widest text-sm hover:bg-gray-900 transition-colors disabled:opacity-60">
                                {processing ? 'SENDING…' : 'SEND CODE'}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP */}
                    {step === 'otp' && (
                        <form onSubmit={submitOtp} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Verification Code</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-center text-2xl tracking-[0.5em] font-bold"
                                    placeholder="______"
                                    autoFocus
                                    required
                                />
                                {errors.code && <p className="text-red-500 text-xs mt-1 font-medium">{errors.code}</p>}
                            </div>
                            <button type="submit" disabled={processing || code.length !== 6} className="w-full bg-black text-white py-3.5 px-4 rounded-sm font-bold tracking-widest text-sm hover:bg-gray-900 transition-colors disabled:opacity-60">
                                {processing ? 'VERIFYING…' : 'VERIFY CODE'}
                            </button>
                            <div className="text-center text-sm text-gray-500">
                                Didn't get it?{' '}
                                <button type="button" onClick={resendCode} disabled={processing} className="text-black font-bold hover:underline disabled:opacity-50">Resend</button>
                                {' · '}
                                <button type="button" onClick={() => { setStep('email'); setCode(''); }} className="text-black font-bold hover:underline">Change email</button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: New password */}
                    {step === 'password' && (
                        <form onSubmit={submitPassword} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">New Password</label>
                                <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                                {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Confirm New Password</label>
                                <PasswordInput value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="••••••••" required />
                            </div>
                            {errors.code && <p className="text-red-500 text-xs font-medium">{errors.code}</p>}
                            <button type="submit" disabled={processing} className="w-full bg-black text-white py-3.5 px-4 rounded-sm font-bold tracking-widest text-sm hover:bg-gray-900 transition-colors disabled:opacity-60">
                                {processing ? 'RESETTING…' : 'RESET PASSWORD'}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center">
                        <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-black">← Back to login</Link>
                    </div>
                </motion.div>
            </div>
        </StoreLayout>
    );
}
