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
            className="fixed bottom-12 left-12 z-50 premium-btn px-10 py-6 rounded-[2.5rem] flex items-center gap-6 group hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(212,175,55,0.3)] animate-float"
        >
            <div className="relative">
                <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">🛒</span>
                <span className="absolute -top-3 -right-3 bg-black text-[#d4af37] text-[10px] w-6 h-6 flex items-center justify-center rounded-full border border-[#d4af37] font-black">{count}</span>
            </div>
            <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] text-black font-black uppercase tracking-[0.2em] opacity-80 mb-0.5">Secure Repository</span>
                <span className="text-sm text-black font-black uppercase tracking-[0.1em]">Open Vault</span>
            </div>
        </button>
    );
};

export default FloatingCart;
