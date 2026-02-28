"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCart } from '../utils/cartStorage';

const FloatingCart = () => {
    const [count, setCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const updateCount = () => setCount(getCart().reduce((acc, item) => acc + item.quantity, 0));
        updateCount();
        window.addEventListener('cart-updated', updateCount);
        return () => window.removeEventListener('cart-updated', updateCount);
    }, []);

    if (count === 0) return null;

    return (
        <button
            onClick={() => router.push('/cart')}
            className="fixed bottom-12 left-12 z-50 bg-indigo-600 text-white px-10 py-6 rounded-[2.5rem] flex items-center gap-6 group hover:scale-105 active:scale-95 transition-all shadow-xl animate-float"
        >
            <div className="relative">
                <span className="text-3xl">🛒</span>
                <span className="absolute -top-3 -right-3 bg-white text-indigo-600 text-[10px] w-6 h-6 flex items-center justify-center rounded-full border border-indigo-100 font-black shadow-sm">{count}</span>
            </div>
            <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] text-white font-black uppercase tracking-[0.2em] opacity-80 mb-0.5">Shopping Bag</span>
                <span className="text-sm text-white font-black uppercase tracking-[0.1em]">View Cart</span>
            </div>
        </button>
    );
};

export default FloatingCart;
