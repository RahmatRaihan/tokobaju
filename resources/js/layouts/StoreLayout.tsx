import { ReactNode, useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePage } from '@inertiajs/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { CartProvider } from '@/lib/cart';
import { UiProvider, useUi } from '@/lib/ui';
import { PageProps } from '@/types';

function Chrome({ children }: { children: ReactNode }) {
    const { toast } = useUi();
    const { site } = usePage<PageProps>().props;
    const { component } = usePage();
    const isLanding = component === 'Home';
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 300);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const waHref = site.whatsapp_number
        ? `https://wa.me/${site.whatsapp_number.replace(/\D/g, '')}`
        : '#';

    return (
        <div className="min-h-screen bg-white font-sans text-black flex flex-col relative overflow-x-hidden">
            <Header />
            {/* The navbar is fixed; the landing hero sits under it full-bleed,
                other pages need top padding equal to the navbar height (h-24). */}
            <div className={`flex-1 w-full flex flex-col ${isLanding ? '' : 'pt-24 md:pt-32'}`}>{children}</div>

            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={scrollToTop}
                        className="fixed bottom-24 right-6 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-black shadow-lg hover:bg-gray-50 transition-colors z-40"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowUp className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Floating WhatsApp button */}
            <motion.a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                aria-label="Chat via WhatsApp"
                className="group fixed bottom-6 right-6 z-40 flex items-center gap-0 hover:gap-2 bg-[#25D366] rounded-full text-white shadow-xl hover:bg-[#1da851] transition-all duration-300 pl-4 pr-4 h-14 overflow-hidden"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
            >
                {/* Pulsing ring */}
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
                <svg viewBox="0 0 24 24" fill="currentColor" className="relative w-7 h-7 flex-shrink-0">
                    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.2-3.58.94.96-3.49-.23-.36a9.45 9.45 0 0 1-1.45-5.03c0-5.22 4.25-9.47 9.48-9.47 2.53 0 4.9.99 6.69 2.78a9.4 9.4 0 0 1 2.77 6.7c0 5.22-4.25 9.47-9.48 9.47zm8.06-17.53A11.36 11.36 0 0 0 12.04.5C5.78.5.68 5.6.68 11.86c0 2.09.55 4.13 1.59 5.93L.58 23.5l5.85-1.54a11.3 11.3 0 0 0 5.6 1.43h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.03-1.18-5.89-3.32-8.04z" />
                </svg>
                <span className="relative max-w-0 group-hover:max-w-[120px] transition-all duration-300 whitespace-nowrap overflow-hidden font-bold text-sm">
                    Chat Kami
                </span>
            </motion.a>

            <AnimatePresence>
                {toast && (
                    <motion.div
                        key="toast"
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-lg z-50 text-sm font-medium flex items-center space-x-2"
                    >
                        <span>{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <CartDrawer />
            <Footer />
        </div>
    );
}

export default function StoreLayout({ children }: { children: ReactNode }) {
    return (
        <UiProvider>
            <CartProvider>
                <Chrome>{children}</Chrome>
            </CartProvider>
        </UiProvider>
    );
}
