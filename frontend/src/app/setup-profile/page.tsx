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
                setError('Profile update failed. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-center items-center px-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className='fixed inset-0 bg-[radial-gradient(circle at top right,rgba(79,70,229,0.05) 0%,transparent 50%),radial-gradient(circle at bottom left,rgba(212,175,55,0.05) 0%,transparent 40%)] -z-10' />
            <div className="fixed top-0 left-0 w-full h-full opacity-5 pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="w-full max-w-lg animate-in-bespoke">
                <div className="flex flex-col items-center mb-16">
                    <div className="w-20 h-20 bg-white border-2 border-indigo-600 rounded-[2rem] flex items-center justify-center text-indigo-600 text-4xl font-black shadow-lg mb-8">
                        GM
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-600 mb-4 text-center">Quick Setup</h4>
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase italic leading-none text-center">Tell us about yourself</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-6 text-center">Please provide your details to continue.</p>
                </div>

                <div className="glass-card p-12 rounded-[4rem] border border-slate-100 relative group overflow-hidden shadow-xl bg-white">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 blur-[80px] -z-10 group-hover:bg-indigo-100 transition-all opacity-30" />

                    {error && (
                        <div className="mb-10 p-5 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 animate-pulse">
                            <span className="w-2 h-2 bg-red-600 rounded-full" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Full Name</label>
                            <input
                                type="text"
                                required
                                placeholder="Full Name"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 transition-all shadow-sm"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Phone Number</label>
                            <input
                                type="tel"
                                required
                                placeholder="+91 XXXX XXXX"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 transition-all shadow-sm"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Location / Address</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Home / Office"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 transition-all shadow-sm"
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
                                <div className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full mx-auto" />
                            ) : (
                                <span className="flex items-center justify-center gap-4 text-white">
                                    Save Profile
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-300 text-[9px] font-black uppercase tracking-[0.5em]">
                        Your data is secure and encrypted.
                    </p>
                </div>
            </div>
        </div>
    );
}
