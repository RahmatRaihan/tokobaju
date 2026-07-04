import { X, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

/**
 * A "Size Guide" trigger + modal for a single product's size chart.
 * Renders nothing when the product has no size chart image.
 */
export function SizeChart({ src, className = '' }: { src: string | null; className?: string }) {
    const [open, setOpen] = useState(false);

    if (!src) return null;

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={`inline-flex items-center gap-1 text-xs text-gray-500 underline hover:text-black transition-colors ${className}`}
            >
                <Ruler className="w-3.5 h-3.5" />
                Size Guide
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-sm"
                        />
                        <div className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl pointer-events-auto relative max-h-[90vh] flex flex-col"
                            >
                                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                    <h3 className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
                                        <Ruler className="w-5 h-5" /> Size Chart
                                    </h3>
                                    <button onClick={() => setOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-4 overflow-y-auto bg-gray-50 flex items-center justify-center">
                                    <img src={src} alt="Size chart" className="max-w-full h-auto rounded-lg" />
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
