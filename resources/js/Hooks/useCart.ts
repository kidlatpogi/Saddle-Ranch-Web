import { useState, useEffect } from 'react';

export interface CartProduct {
    id: number;
    name: string;
    description: string;
    price: number | string;
    image_path?: string;
    stock_quantity: number;
}

export interface CartItem {
    product: CartProduct;
    quantity: number;
}

const CART_STORAGE_KEY = 'saddle_ranch_cart_v1';

export function useCart() {
    const [cart, setCart] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('saddle_ranch_cart_updated', { detail: { cart } }));
            }
        } catch (err) {
            console.error('Failed to save cart to localStorage', err);
        }
    }, [cart]);

    const addItem = (product: CartProduct, quantity: number = 1) => {
        if (product.stock_quantity <= 0) return;

        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
            if (existingIndex > -1) {
                const updated = [...prevCart];
                const newQty = updated[existingIndex].quantity + quantity;
                updated[existingIndex].quantity = Math.min(newQty, product.stock_quantity);
                return updated;
            } else {
                return [...prevCart, { product, quantity: Math.min(quantity, product.stock_quantity) }];
            }
        });
    };

    const removeItem = (productId: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        setCart((prevCart) => {
            if (quantity <= 0) {
                return prevCart.filter((item) => item.product.id !== productId);
            }
            return prevCart.map((item) => {
                if (item.product.id === productId) {
                    const maxAllowed = item.product.stock_quantity;
                    return { ...item, quantity: Math.min(quantity, maxAllowed) };
                }
                return item;
            });
        });
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem(CART_STORAGE_KEY);
    };

    const subtotal = cart.reduce((acc, item) => {
        const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
        return acc + price * item.quantity;
    }, 0);

    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return {
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
    };
}
