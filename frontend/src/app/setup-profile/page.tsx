"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupProfilePage() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [locationName, setLocationName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem('gm_user');
        if (!user) {
            router.push('/login');
            return;
        }
        const userObj = JSON.parse(user);
        setName(userObj.name || '');
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('gm_token');
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, phone, locationName })
            });

            if (res.ok) {
                const data = await res.json();
                // Update local storage
                const user = JSON.parse(localStorage.getItem('gm_user') || '{}');
                localStorage.setItem('gm_user', JSON.stringify({ ...user, name: data.name, phone: data.phone, locationName: data.locationName }));

                router.push('/');
            } else {
                setError('Profile calibration failed. Protocol error.');
            }
        } catch (err) {
            setError('Neural link error. Check terminal connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-[#f8fafc] flex flex-col justify-center items-center px-6 relative overflow-hidden">
            {/* Elite Background Effects */}
            <div className='fixed inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15)_0%,_transparent_50%),_radial-gradient(circle_at_bottom_left,_rgba(212,175,55,0.05)_0%,_transparent_40%)] -z-10' />
            <div className="fixed top-0 left-0 w-full h-full opacity-20 pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#ffffff05 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="w-full max-w-lg animate-in-bespoke">
                <div className="flex flex-col items-center mb-16">
                    <div className="w-20 h-20 bg-[#020617] gold-border rounded-[2rem] flex items-center justify-center text-[#d4af37] text-4xl font-black shadow-2xl mb-8">
                        GM
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37] mb-4 text-center">Protocol Level 2</h4>
                    <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic leading-none text-center">Identity Calibration</h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-6 text-center">Establishing verified infrastructure credentials.</p>
                </div>

                <div className="glass-card p-12 rounded-[4rem] border border-white/5 relative group overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/5 blur-[80px] -z-10 group-hover:bg-[#d4af37]/10 transition-all opacity-30" />

                    {error && (
                        <div className="mb-10 p-5 bg-[#d4af37]/5 border border-[#d4af37]/20 text-[#d4af37] text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 animate-pulse">
                            <span className="w-2 h-2 bg-[#d4af37] rounded-full" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Operator Name</label>
                            <input
                                type="text"
                                required
                                placeholder="Full Name"
                                className="w-full bg-[#020617]/50 border border-white/10 rounded-2xl px-6 py-5 text-white font-bold placeholder:text-zinc-700 focus:outline-none focus:border-[#d4af37]/40 transition-all shadow-2xl"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Communication Link</label>
                            <input
                                type="tel"
                                required
                                placeholder="+91 XXXX XXXX"
                                className="w-full bg-[#020617]/50 border border-white/10 rounded-2xl px-6 py-5 text-white font-bold placeholder:text-zinc-700 focus:outline-none focus:border-[#d4af37]/40 transition-all shadow-2xl"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Deployment Sector</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Home Base / Regional Hub"
                                className="w-full bg-[#020617]/50 border border-white/10 rounded-2xl px-6 py-5 text-white font-bold placeholder:text-zinc-700 focus:outline-none focus:border-[#d4af37]/40 transition-all shadow-2xl"
                                value={locationName}
                                onChange={(e) => setLocationName(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="premium-btn w-full py-7 rounded-2xl text-[10px] uppercase tracking-[0.4em] group"
                        >
                            {loading ? (
                                <div className="animate-spin w-5 h-5 border-2 border-[#d4af37]/20 border-t-[#d4af37] rounded-full mx-auto" />
                            ) : (
                                <span className="flex items-center justify-center gap-4">
                                    Initialize Interface
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-zinc-700 text-[9px] font-black uppercase tracking-[0.5em]">
                        Private Key Encryption Active • Level 4 Clearance
                    </p>
                </div>
            </div>
        </div>
    );
}
