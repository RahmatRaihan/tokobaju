import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { CartItem } from '@/types';

const STORAGE_KEY = 'inskylxstr_cart';

interface CartContextValue {
    items: CartItem[];
    count: number;
    subtotal: number;
    addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    updateQuantity: (variantId: number, quantity: number) => void;
    removeItem: (variantId: number) => void;
    clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Hydrate from localStorage on mount (avoids SSR/first-render mismatch).
    useEffect(() => {
        setItems(readStorage());
    }, []);

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            /* ignore quota errors */
        }
    }, [items]);

    const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.variant_id === item.variant_id);
            if (existing) {
                const nextQty = Math.min(existing.quantity + quantity, item.max_stock);
                return prev.map((i) =>
                    i.variant_id === item.variant_id ? { ...i, quantity: nextQty, max_stock: item.max_stock } : i,
                );
            }
            return [...prev, { ...item, quantity: Math.min(quantity, item.max_stock) }];
        });
    }, []);

    const updateQuantity = useCallback((variantId: number, quantity: number) => {
        setItems((prev) =>
            prev.map((i) =>
                i.variant_id === variantId
                    ? { ...i, quantity: Math.max(1, Math.min(quantity, i.max_stock)) }
                    : i,
            ),
        );
    }, []);

    const removeItem = useCallback((variantId: number) => {
        setItems((prev) => prev.filter((i) => i.variant_id !== variantId));
    }, []);

    const clear = useCallback(() => setItems([]), []);

    const count = items.reduce((acc, i) => acc + i.quantity, 0);
    const subtotal = items.reduce((acc, i) => acc + i.unit_price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, count, subtotal, addItem, updateQuantity, removeItem, clear }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within a CartProvider');
    return ctx;
}
