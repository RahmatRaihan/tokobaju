import { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';

interface UiContextValue {
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toast: { id: number; message: string } | null;
    showToast: (message: string) => void;
}

const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const openCart = useCallback(() => setIsCartOpen(true), []);
    const closeCart = useCallback(() => setIsCartOpen(false), []);

    const showToast = useCallback((message: string) => {
        const id = Date.now();
        setToast({ id, message });
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            setToast((current) => (current?.id === id ? null : current));
        }, 3000);
    }, []);

    return (
        <UiContext.Provider value={{ isCartOpen, openCart, closeCart, toast, showToast }}>
            {children}
        </UiContext.Provider>
    );
}

export function useUi(): UiContextValue {
    const ctx = useContext(UiContext);
    if (!ctx) throw new Error('useUi must be used within a UiProvider');
    return ctx;
}
