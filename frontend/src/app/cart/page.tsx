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
            router.push(`/checkout?product=Multiple Archive Units&amount=${total}`);
        }
    };

    return (
        <div className='min-h-screen bg-[#020617] text-[#f8fafc] selection:bg-[#d4af37]/30 pb-48 relative overflow-hidden'>
            {/* Elite Background Effects */}
            <div className='fixed inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.1)_0%,_transparent_50%),_radial-gradient(circle_at_bottom_left,_rgba(212,175,55,0.05)_0%,_transparent_40%)] -z-10' />
            <div className="fixed top-0 left-0 w-full h-full opacity-10 pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#ffffff05 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            {/* Premium Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/40 backdrop-blur-2xl border-b border-white/5 px-10 py-6">
                <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                    <div className="text-3xl font-black tracking-tighter cursor-pointer flex items-center gap-4 group" onClick={() => router.push('/')}>
                        <div className="w-12 h-12 bg-[#020617] gold-border rounded-xl flex items-center justify-center text-[#d4af37] text-xl font-black group-hover:scale-110 transition-all duration-700">GM</div>
                        <span className="uppercase italic gradient-text">GadgetMart<span className="opacity-20 italic">.Archive</span></span>
                    </div>
                    <button onClick={() => router.push('/')} className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-[#d4af37] transition-all">Back to Protocols</button>
                </div>
            </nav>

            <main className='pt-48 max-w-7xl mx-auto px-10'>
                <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24 animate-in-bespoke'>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37] mb-4">Storage Hub</h4>
                        <h1 className='text-7xl font-black tracking-tighter text-white uppercase italic leading-none'>Repository.</h1>
                        <p className='text-zinc-500 font-bold text-xl mt-4 uppercase tracking-tight'>Review your pending hardware allocations.</p>
                    </div>
                    {cart.length > 0 && (
                        <button onClick={clearCart} className='text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37]/60 hover:text-red-500 transition-all border-b border-[#d4af37]/20 pb-2 w-fit'>Purge Archive Data</button>
                    )}
                </div>

                {cart.length === 0 ? (
                    <div className='text-center py-48 glass-card rounded-[4rem] border border-white/5 animate-in-bespoke relative overflow-hidden'>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/5 blur-[80px] -z-10 opacity-30" />
                        <span className='text-7xl block mb-10 opacity-20 filter grayscale'>🧊</span>
                        <h2 className='text-4xl font-black text-white uppercase tracking-tighter mb-4'>Archive Offline.</h2>
                        <p className='text-zinc-500 font-bold mb-16 uppercase tracking-widest text-sm'>No hardware units have been designated for acquisition.</p>
                        <button onClick={() => router.push('/')} className='premium-btn px-16 py-6 rounded-2xl text-[10px] uppercase tracking-[0.4em]'>Initialize Scanner</button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-16'>
                        <div className='lg:col-span-2 space-y-8'>
                            {cart.map((item, idx) => (
                                <div key={item.id + item.platform} className='glass-card p-8 rounded-[3rem] border border-white/5 flex flex-col md:flex-row md:items-center gap-10 group hover:border-[#d4af37]/20 transition-all duration-700 animate-in-bespoke' style={{ animationDelay: `${idx * 100}ms` }}>
                                    <div className='w-32 h-32 rounded-[2rem] overflow-hidden bg-[#020617] gold-border p-2 shrink-0 group-hover:rotate-3 transition-all duration-700'>
                                        <img src={item.image} alt={item.name} className='w-full h-full object-cover rounded-[1.5rem] opacity-70 group-hover:opacity-100' />
                                    </div>
                                    <div className='flex-grow'>
                                        <div className='flex justify-between items-start'>
                                            <div>
                                                <h3 className='text-2xl font-black text-white tracking-tighter uppercase mb-2'>{item.name}</h3>
                                                <div className="inline-flex items-center gap-2 bg-[#d4af37]/5 px-4 py-1.5 rounded-full border border-[#d4af37]/10">
                                                    <span className='w-1.5 h-1.5 rounded-full bg-[#d4af37]'></span>
                                                    <p className='text-[10px] font-black text-[#d4af37] uppercase tracking-widest leading-none'>{item.platform}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id, item.platform)} className='w-10 h-10 rounded-full flex items-center justify-center text-zinc-600 hover:text-red-500 hover:bg-red-500/5 transition-all'>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                        <div className='flex justify-between items-center mt-10'>
                                            <div className='flex items-center bg-[#0f172a]/50 rounded-2xl p-2 border border-white/5'>
                                                <button onClick={() => updateQuantity(item.id, item.platform, item.quantity - 1)} className='w-10 h-10 flex items-center justify-center font-black text-zinc-500 hover:text-white'>-</button>
                                                <span className='w-12 text-center font-black text-sm text-[#d4af37]'>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.platform, item.quantity + 1)} className='w-10 h-10 flex items-center justify-center font-black text-zinc-500 hover:text-white'>+</button>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xs font-bold text-[#d4af37]">₹</span>
                                                <p className='text-3xl font-black text-white italic tracking-tighter text-right'>{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='lg:col-span-1'>
                            <div className='glass-card p-12 rounded-[4rem] sticky top-40 border border-[#d4af37]/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden group'>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/5 blur-[80px] -z-10 group-hover:bg-[#d4af37]/10 transition-all" />

                                <h2 className='text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37] mb-12'>Financial Index</h2>

                                <div className='space-y-8 mb-16'>
                                    <div className='flex justify-between items-center text-zinc-500 font-bold'>
                                        <span className="text-[10px] uppercase tracking-widest">Base Valuation</span>
                                        <span className="text-white">₹{total.toLocaleString()}</span>
                                    </div>
                                    <div className='flex justify-between items-center text-zinc-500 font-bold'>
                                        <span className="text-[10px] uppercase tracking-widest">Protocol Fee</span>
                                        <span className="text-[#d4af37]">Waived</span>
                                    </div>
                                    <div className='pt-10 border-t border-white/5 flex flex-col gap-4'>
                                        <span className='text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600'>Net Allocated Amount</span>
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-2xl font-black text-[#d4af37]">₹</span>
                                            <span className='text-6xl font-black text-white italic tracking-tighter leading-none'>{total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className='premium-btn w-full py-7 rounded-2xl text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 group/btn'
                                >
                                    Confirm Transmission
                                    <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                                </button>

                                <p className="text-center text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] mt-10">
                                    Secure Reserve Protocol v4.0.1
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
