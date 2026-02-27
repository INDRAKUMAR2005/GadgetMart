"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(0);
    const router = useRouter();

    useEffect(() => {
        // Redirect if already logged in
        const token = localStorage.getItem('gm_token');
        if (token) {
            router.push('/');
        }
    }, [router]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/auth/send-otp?email=${encodeURIComponent(email)}`, { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                setStep(2);
                setTimer(60);
            } else {
                setError(data.message || 'Failed to send verification code');
            }
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${otp}`, { method: 'POST' });
            const data = await res.json();
            if (res.ok && data.token) {
                localStorage.setItem('gm_token', data.token);
                localStorage.setItem('gm_user', JSON.stringify({ email: data.email, name: data.name, role: data.role }));

                if (!data.name) {
                    router.push('/setup-profile');
                } else {
                    router.push('/');
                }
            } else {
                setError(data.message || 'Invalid OTP. Please try again.');
            }
        } catch (err) {
            setError('Verification failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-[#f8fafc] flex flex-col justify-center items-center px-6 selection:bg-[#d4af37]/30 relative overflow-hidden">
            {/* Elite Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15)_0%,_transparent_50%),_radial-gradient(circle_at_bottom_left,_rgba(212,175,55,0.05)_0%,_transparent_40%)] -z-10" />
            <div className="fixed top-0 left-0 w-full h-full opacity-20 pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#ffffff05 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="w-full max-w-md animate-in-bespoke">
                {/* Brand Identity */}
                <div className="flex flex-col items-center mb-16">
                    <button
                        onClick={() => router.push('/')}
                        className="w-20 h-20 bg-[#0f172a] gold-border rounded-[2rem] flex items-center justify-center text-[#d4af37] text-4xl font-black shadow-2xl hover:scale-110 transition-all duration-700 mb-8 relative group"
                    >
                        <div className="absolute inset-0 bg-[#d4af37]/5 blur-[20px] rounded-[2rem] opacity-0 group-hover:opacity-100 transition-all" />
                        GM
                    </button>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-4">Login</h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Welcome back</p>
                </div>

                {/* Glassmorphism Auth Container */}
                <div className="glass-card p-12 rounded-[3.5rem] border border-white/5 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#3b82f6]/5 blur-[60px] opacity-20 -z-10" />

                    {error && (
                        <div className="mb-8 p-5 bg-[#d4af37]/5 border border-[#d4af37]/20 text-[#d4af37] text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 animate-pulse">
                            <span className="w-2 h-2 bg-[#d4af37] rounded-full" />
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-8">
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Email Address</label>
                                <div className="relative group/field">
                                    <input
                                        type="email"
                                        required
                                        placeholder="user@example.com"
                                        className="w-full bg-[#020617]/50 border border-white/10 rounded-2xl px-6 py-5 text-white font-bold placeholder:text-zinc-700 focus:outline-none focus:border-[#d4af37]/40 transition-all shadow-2xl"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="premium-btn w-full py-6 rounded-2xl text-[10px] uppercase tracking-[0.4em] flex justify-center items-center gap-4 group"
                            >
                                {loading ? (
                                    <div className="animate-spin w-5 h-5 border-2 border-[#d4af37]/20 border-t-[#d4af37] rounded-full" />
                                ) : (
                                    <>
                                        Send OTP
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-end ml-2">
                                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">OTP Code</label>
                                    <span className="text-[9px] font-black text-[#d4af37] uppercase tracking-widest">Sent to your email</span>
                                </div>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    placeholder="••••••"
                                    className="w-full bg-[#020617]/50 border border-white/10 rounded-2xl px-6 py-5 text-center text-4xl font-black tracking-[0.4em] text-white focus:outline-none focus:border-[#d4af37]/40 transition-all placeholder:text-white/5 shadow-2xl"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="premium-btn w-full py-6 rounded-2xl text-[10px] uppercase tracking-[0.4em] flex justify-center items-center gap-4 group"
                            >
                                {loading ? (
                                    <div className="animate-spin w-5 h-5 border-2 border-[#d4af37]/20 border-t-[#d4af37] rounded-full" />
                                ) : (
                                    <>
                                        Verify OTP
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                                    </>
                                )}
                            </button>

                            <div className="flex flex-col gap-6 pt-4">
                                <button
                                    type="button"
                                    disabled={timer > 0 || loading}
                                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all py-2 border-b border-white/5 self-center ${timer > 0 ? 'text-zinc-800' : 'text-[#d4af37]/60 hover:text-[#d4af37]'}`}
                                    onClick={handleSendOtp}
                                >
                                    {timer > 0 ? `Retry in ${timer}s` : 'Resend OTP'}
                                </button>

                                <button
                                    type="button"
                                    className="text-[9px] font-black text-zinc-600 hover:text-white uppercase tracking-[0.2em] transition-all"
                                    onClick={() => setStep(1)}
                                >
                                    ← Change Email
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="mt-12 text-center space-y-4">
                    <p className="text-zinc-800 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">
                        By logging in, you agree to our <br />
                        <span className="text-zinc-500 border-b border-zinc-800">Terms of Service</span> and <span className="text-zinc-500 border-b border-zinc-800">Privacy Policy</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
