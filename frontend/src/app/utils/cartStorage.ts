export interface CartItem {
    id: string;
    name: string;
    platform: string;
    price: number;
    image?: string;
    quantity: number;
}

const CART_KEY = 'gm_cart';

export const getCart = (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    const cart = getCart();
    const existingIndex = cart.findIndex((i) => i.id === item.id && i.platform === item.platform);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
};

export const removeFromCart = (id: string, platform: string) => {
    const cart = getCart().filter((i) => !(i.id === id && i.platform === platform));
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
};

export const updateQuantity = (id: string, platform: string, quantity: number) => {
    const cart = getCart();
    const item = cart.find((i) => i.id === id && i.platform === platform);
    if (item) {
        item.quantity = Math.max(1, quantity);
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        window.dispatchEvent(new Event('cart-updated'));
    }
};

export const clearCart = () => {
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new Event('cart-updated'));
};
