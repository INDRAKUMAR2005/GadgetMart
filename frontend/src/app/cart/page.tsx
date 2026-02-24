"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCart, removeFromCart, updateQuantity, clearCart, CartItem } from '../utils/cartStorage';

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const router = useRouter();

    useEffect(() => {
        const loadCart = () => setCart(getCart());
        loadCart();
        window.addEventListener('cart-updated', loadCart);
        return () => window.removeEventListener('cart-updated', loadCart);
    }, []);

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        // For now, redirect to the first item's checkout or a combined checkout
        if (cart.length > 0) {
            const first = cart[0];
            router.push(`/checkout?product=Multiple Items&amount=${total}`);
        }
    };

    return (
        <div className='min-h-screen bg-white text-zinc-950 selection:bg-blue-100 pb-32'>
            <div className='fixed inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent -z-10' />

            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-xl border-b border-zinc-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-2xl font-black tracking-tighter cursor-pointer flex items-center gap-2" onClick={() => router.push('/')}>
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg font-black">GM</div>
                        <span>Gadget<span className="text-blue-600">Mart</span></span>
                    </div>
                    <button onClick={() => router.push('/')} className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-blue-600 transition-colors">Back to Store</button>
                </div>
            </nav>

            <main className='pt-40 max-w-5xl mx-auto px-6'>
                <div className='flex items-end justify-between mb-16'>
                    <div>
                        <h1 className='text-6xl font-black tracking-tighter text-zinc-900'>Your Cart.</h1>
                        <p className='text-zinc-500 font-medium text-xl mt-2'>Review your selected tech deals.</p>
                    </div>
                    {cart.length > 0 && (
                        <button onClick={clearCart} className='text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-600'>Clear All</button>
                    )}
                </div>

                {cart.length === 0 ? (
                    <div className='text-center py-32 bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-200'>
                        <span className='text-6xl block mb-6'>🛒</span>
                        <h2 className='text-3xl font-black text-zinc-900 mb-4'>Cart is empty.</h2>
                        <p className='text-zinc-500 font-medium mb-12'>You haven't added any deals yet.</p>
                        <button onClick={() => router.push('/')} className='bg-zinc-950 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all'>Start Shopping</button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
                        <div className='lg:col-span-2 space-y-6'>
                            {cart.map((item) => (
                                <div key={item.id + item.platform} className='bg-white p-6 rounded-[2rem] border-2 border-zinc-100 flex items-center gap-6 group hover:border-blue-200 transition-all'>
                                    <div className='w-24 h-24 rounded-2xl overflow-hidden border border-zinc-100 shrink-0 bg-zinc-50'>
                                        <img src={item.image} alt={item.name} className='w-full h-full object-cover' />
                                    </div>
                                    <div className='flex-grow'>
                                        <div className='flex justify-between items-start'>
                                            <div>
                                                <h3 className='text-xl font-black text-zinc-900 leading-tight'>{item.name}</h3>
                                                <p className='text-xs font-bold text-blue-600 uppercase tracking-widest mt-1'>{item.platform}</p>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id, item.platform)} className='text-zinc-300 hover:text-red-500 transition-colors'>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                        <div className='flex justify-between items-center mt-6'>
                                            <div className='flex items-center bg-zinc-100 rounded-xl px-2 py-1'>
                                                <button onClick={() => updateQuantity(item.id, item.platform, item.quantity - 1)} className='w-8 h-8 flex items-center justify-center font-black'>-</button>
                                                <span className='w-12 text-center font-black text-sm'>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.platform, item.quantity + 1)} className='w-8 h-8 flex items-center justify-center font-black'>+</button>
                                            </div>
                                            <p className='text-xl font-black text-zinc-900'>₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='lg:col-span-1'>
                            <div className='bg-zinc-950 text-white p-10 rounded-[3rem] sticky top-40 shadow-2xl shadow-zinc-950/20'>
                                <h2 className='text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-8'>Order Summary</h2>
                                <div className='space-y-4 mb-12'>
                                    <div className='flex justify-between items-center text-zinc-400 font-bold'>
                                        <span>Subtotal</span>
                                        <span>₹{total.toLocaleString()}</span>
                                    </div>
                                    <div className='flex justify-between items-center text-zinc-400 font-bold'>
                                        <span>Tax (GST)</span>
                                        <span>₹0</span>
                                    </div>
                                    <div className='pt-4 border-t border-zinc-800 flex justify-between items-center'>
                                        <span className='text-sm font-black uppercase tracking-widest'>Total</span>
                                        <span className='text-4xl font-black'>₹{total.toLocaleString()}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className='w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-[1.5rem] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95'
                                >
                                    Confirm & Pay
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
