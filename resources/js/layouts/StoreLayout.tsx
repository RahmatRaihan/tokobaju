import { ReactNode, useEffect, useState } from 'react';
import { MessageCircle, ArrowUp } from 'lucide-react';
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
            <div className="flex-1 w-full flex flex-col">{children}</div>

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
                className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-xl hover:bg-[#1da851] transition-colors z-40"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <MessageCircle className="w-6 h-6" />
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
