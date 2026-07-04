import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Full-screen intro splash shown once per browser session (until closed).
 * Animated INSKYLXSTR wordmark + logo reveal, then wipes away to the app.
 */
export function SplashScreen() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Only show once per tab session so navigating around doesn't replay it.
        if (typeof window === 'undefined') return;
        // Skip the splash inside the admin panel — it's for the storefront.
        if (window.location.pathname.startsWith('/admin')) return;
        const seen = sessionStorage.getItem('inskylxstr_splash_seen');
        if (seen) return;

        setShow(true);
        sessionStorage.setItem('inskylxstr_splash_seen', '1');
        document.body.style.overflow = 'hidden';

        const timer = setTimeout(() => {
            setShow(false);
            document.body.style.overflow = '';
        }, 2600);

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = '';
        };
    }, []);

    // The animated wordmark, letter by letter.
    const word = 'INSKYLXSTR';

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="splash"
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                    {/* Subtle moving grid backdrop for a streetwear/tech feel */}
                    <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                            backgroundImage:
                                'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                            backgroundSize: '48px 48px',
                        }}
                    />

                    {/* Radial glow behind the logo */}
                    <motion.div
                        className="absolute w-[420px] h-[420px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)' }}
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        transition={{ duration: 1.4, ease: 'easeOut' }}
                    />

                    <div className="relative flex flex-col items-center">
                        {/* Logo mark */}
                        <motion.img
                            src="/images/logo-brand.png"
                            alt="INSKYLXSTR"
                            className="h-20 sm:h-24 w-auto object-contain invert mb-6"
                            initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            transition={{ type: 'spring', damping: 12, stiffness: 120, delay: 0.1 }}
                        />

                        {/* Animated wordmark */}
                        <div className="flex overflow-hidden">
                            {word.split('').map((char, i) => (
                                <motion.span
                                    key={i}
                                    className="text-white text-2xl sm:text-4xl font-black uppercase italic tracking-tighter"
                                    initial={{ y: '110%', opacity: 0 }}
                                    animate={{ y: '0%', opacity: 1 }}
                                    transition={{ delay: 0.4 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </div>

                        {/* Underline sweep */}
                        <motion.div
                            className="h-[2px] bg-white mt-4"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ delay: 1, duration: 0.7, ease: 'easeInOut' }}
                        />

                        {/* Tagline */}
                        <motion.p
                            className="text-white/50 text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.3, duration: 0.6 }}
                        >
                            Streetwear · Pontianak
                        </motion.p>
                    </div>

                    {/* Bottom loading bar */}
                    <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-white"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2.4, ease: 'easeInOut' }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
