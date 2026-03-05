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
        if (cart.length > 0) {
            router.push(`/checkout?product=Multiple Items&amount=${total}`);
        }
    };

    return (
        <div className='min-h-screen bg-white text-slate-900 selection:bg-amber-100 mesh-bg font-main pb-48 relative overflow-hidden'>
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.06)_0%,transparent_55%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.05)_0%,transparent_45%)] -z-10" />

            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-[50] glass-card px-4 sm:px-6 lg:px-10 py-4 border-none rounded-none border-b border-slate-100">
                <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group" onClick={() => router.push('/')}>
                        <div className="w-9 h-9 sm:w-11 sm:h-11 bg-white border-2 border-amber-400 rounded-xl flex items-center justify-center text-amber-500 text-sm sm:text-lg font-black shadow-md transition-all group-hover:scale-110">GM</div>
                        <span className="text-lg sm:text-2xl font-black tracking-tighter uppercase gradient-text">GadgetMart<span className="text-slate-300 hidden sm:inline">.Cart</span></span>
                    </div>
                    <button onClick={() => router.push('/')} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-amber-500 transition-all">Back to Store</button>
                </div>
            </nav>

            <main className='pt-36 sm:pt-48 max-w-7xl mx-auto px-4 sm:px-10'>
                <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-12 mb-16 sm:mb-24 animate-in-bespoke'>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-2 sm:mb-4">Your Selection</h4>
                        <h1 className='text-5xl sm:text-7xl font-black tracking-tighter text-slate-900 uppercase italic leading-none'>Shopping Cart.</h1>
                        <p className='text-slate-500 font-bold text-base sm:text-xl mt-4 uppercase tracking-tight'>Review your items before checkout.</p>
                    </div>
                    {cart.length > 0 && (
                        <button onClick={clearCart} className='text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-red-500 transition-all border-b border-slate-200 pb-1 w-fit'>Clear Cart</button>
                    )}
                </div>

                {cart.length === 0 ? (
                    <div className='text-center py-32 sm:py-48 glass-card bg-white rounded-[3rem] sm:rounded-[4rem] border border-slate-100 shadow-xl animate-in-bespoke relative overflow-hidden'>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 blur-[80px] -z-10 opacity-60" />
                        <span className='text-7xl block mb-10 filter grayscale opacity-40'>🛒</span>
                        <h2 className='text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4'>Cart is Empty.</h2>
                        <p className='text-slate-500 font-bold mb-12 sm:mb-16 uppercase tracking-widest text-[10px] sm:text-xs'>Explore the best tech deals and add them here.</p>
                        <button onClick={() => router.push('/')} className='premium-btn px-10 sm:px-16 py-5 sm:py-6 rounded-2xl text-[10px] uppercase tracking-[0.4em]'>Browse Gadgets</button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-16'>
                        <div className='lg:col-span-2 space-y-6 sm:space-y-8'>
                            {cart.map((item, idx) => (
                                <div key={item.id + item.platform} className='glass-card bg-white p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center gap-6 sm:gap-10 group hover:border-amber-200 hover:shadow-xl transition-all duration-700 animate-in-bespoke' style={{ animationDelay: `${idx * 100}ms` }}>
                                    <div className='w-24 h-24 sm:w-32 sm:h-32 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 p-2 shrink-0 group-hover:scale-105 transition-all duration-700'>
                                        <img src={item.image} alt={item.name} className='w-full h-full object-cover rounded-[1rem] sm:rounded-[1.5rem] opacity-90 group-hover:opacity-100' />
                                    </div>
                                    <div className='flex-grow'>
                                        <div className='flex justify-between items-start'>
                                            <div>
                                                <h3 className='text-xl sm:text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2'>{item.name}</h3>
                                                <div className="inline-flex items-center gap-2 bg-amber-50 px-3 py-1 sm:py-1.5 rounded-full border border-amber-200">
                                                    <span className='w-1.5 h-1.5 rounded-full bg-amber-500'></span>
                                                    <p className='text-[9px] sm:text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none'>{item.platform}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id, item.platform)} className='w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0'>
                                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                        <div className='flex justify-between items-center mt-6 sm:mt-10'>
                                            <div className='flex items-center bg-slate-50 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border border-slate-100'>
                                                <button onClick={() => updateQuantity(item.id, item.platform, item.quantity - 1)} className='w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-black text-slate-500 hover:text-slate-900 bg-white shadow-sm rounded-lg'>-</button>
                                                <span className='w-10 sm:w-12 text-center font-black text-xs sm:text-sm text-amber-500'>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.platform, item.quantity + 1)} className='w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-black text-slate-500 hover:text-slate-900 bg-white shadow-sm rounded-lg'>+</button>
                                            </div>
                                            <div className="flex items-baseline gap-1 sm:gap-2">
                                                <span className="text-xs sm:text-sm font-bold text-amber-500">₹</span>
                                                <p className='text-3xl sm:text-4xl font-black text-slate-900 italic tracking-tighter text-right'>{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='lg:col-span-1'>
                            <div className='glass-card bg-white p-8 sm:p-12 rounded-[3.5rem] sm:rounded-[4rem] lg:sticky lg:top-32 border border-slate-100 shadow-[0_20px_50px_-20px_rgba(245,158,11,0.25)] overflow-hidden group z-10'>
                                <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-amber-50 blur-[80px] -z-10 group-hover:bg-amber-100 transition-all opacity-60" />

                                <h2 className='text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-8 sm:mb-12'>Order Summary</h2>

                                <div className='space-y-6 sm:space-y-8 mb-12 sm:mb-16'>
                                    <div className='flex justify-between items-center text-slate-600 font-bold'>
                                        <span className="text-[10px] uppercase tracking-widest">Subtotal</span>
                                        <span className="text-slate-900 font-black">₹{total.toLocaleString()}</span>
                                    </div>
                                    <div className='flex justify-between items-center text-slate-600 font-bold'>
                                        <span className="text-[10px] uppercase tracking-widest">Shipping</span>
                                        <span className="text-amber-500 font-black">Free</span>
                                    </div>
                                    <div className='pt-8 sm:pt-10 border-t border-slate-100 flex flex-col gap-3 sm:gap-4'>
                                        <span className='text-[10px] font-black uppercase tracking-[0.4em] text-slate-400'>Total Amount</span>
                                        <div className="flex items-baseline gap-2 sm:gap-3">
                                            <span className="text-xl sm:text-2xl font-black text-amber-500">₹</span>
                                            <span className='text-5xl sm:text-6xl font-black text-slate-900 italic tracking-tighter leading-none'>{total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className='premium-btn w-full py-6 sm:py-7 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 group/btn shadow-md'
                                >
                                    Secure Checkout 🔒
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                                </button>

                                <div className="mt-8 flex flex-col items-center gap-2">
                                    <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                                        100% Encrypted Payment
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
