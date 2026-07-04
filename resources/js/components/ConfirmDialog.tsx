import { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    /** Use the red/danger style for destructive actions (delete). */
    danger?: boolean;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions>({ message: '' });
    const resolver = useRef<((value: boolean) => void) | null>(null);

    const confirm = useCallback<ConfirmFn>((opts) => {
        setOptions(opts);
        setOpen(true);
        return new Promise<boolean>((resolve) => {
            resolver.current = resolve;
        });
    }, []);

    const close = (result: boolean) => {
        setOpen(false);
        resolver.current?.(result);
        resolver.current = null;
    };

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => close(false)}
                            className="fixed inset-0 bg-black/50 z-[80] backdrop-blur-sm"
                        />
                        <div className="fixed inset-0 flex items-center justify-center z-[80] p-4 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                                transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                                role="alertdialog"
                                aria-modal="true"
                                className="bg-white w-full max-w-sm rounded-2xl shadow-2xl pointer-events-auto overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${options.danger ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
                                            <AlertTriangle className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 pt-0.5">
                                            <h3 className="text-base font-bold text-gray-900">
                                                {options.title ?? (options.danger ? 'Delete confirmation' : 'Please confirm')}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-600 leading-relaxed">{options.message}</p>
                                        </div>
                                        <button onClick={() => close(false)} className="text-gray-400 hover:text-black transition-colors -mt-1 -mr-1 p-1">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3 px-6 pb-6">
                                    <button
                                        onClick={() => close(false)}
                                        className="flex-1 py-2.5 px-4 rounded-lg border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        {options.cancelText ?? 'Cancel'}
                                    </button>
                                    <button
                                        autoFocus
                                        onClick={() => close(true)}
                                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold text-white transition-colors ${options.danger ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-gray-800'}`}
                                    >
                                        {options.confirmText ?? (options.danger ? 'Delete' : 'Confirm')}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </ConfirmContext.Provider>
    );
}

/**
 * Returns an async confirm() that resolves true/false — a drop-in, prettier
 * replacement for window.confirm().
 *
 *   const confirm = useConfirm();
 *   if (await confirm({ message: 'Delete this?', danger: true })) { ... }
 */
export function useConfirm(): ConfirmFn {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error('useConfirm must be used within a ConfirmProvider');
    return ctx;
}
