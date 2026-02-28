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
        <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-center items-center px-6 selection:bg-indigo-100 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(circle at top right,rgba(79,70,229,0.05) 0%,transparent 50%),radial-gradient(circle at bottom left,rgba(212,175,55,0.05) 0%,transparent 40%)] -z-10" />
            <div className="fixed top-0 left-0 w-full h-full opacity-5 pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="w-full max-w-md animate-in-bespoke">
                {/* Logo */}
                <div className="flex flex-col items-center mb-16">
                    <button
                        onClick={() => router.push('/')}
                        className="w-20 h-20 bg-white border-2 border-indigo-600 rounded-[2rem] flex items-center justify-center text-indigo-600 text-4xl font-black shadow-lg hover:scale-110 transition-all duration-700 mb-8 relative group"
                    >
                        <div className="absolute inset-0 bg-indigo-50 blur-[20px] rounded-[2rem] opacity-0 group-hover:opacity-100 transition-all" />
                        GM
                    </button>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-4 text-slate-900">Login</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Welcome back</p>
                </div>

                {/* Login Form */}
                <div className="glass-card p-12 rounded-[3.5rem] border border-slate-100 relative group overflow-hidden bg-white shadow-xl">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 blur-[60px] opacity-20 -z-10" />

                    {error && (
                        <div className="mb-8 p-5 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 animate-pulse">
                            <span className="w-2 h-2 bg-red-600 rounded-full" />
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-8">
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Email Address</label>
                                <div className="relative group/field">
                                    <input
                                        type="email"
                                        required
                                        placeholder="user@example.com"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 transition-all shadow-sm"
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
                                    <div className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
                                ) : (
                                    <>
                                        Get Code
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-end ml-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">OTP Code</label>
                                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Sent to your email</span>
                                </div>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    placeholder="••••••"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-center text-4xl font-black tracking-[0.4em] text-slate-900 focus:outline-none focus:border-indigo-400 transition-all placeholder:text-slate-200 shadow-sm"
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
                                    <div className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
                                ) : (
                                    <>
                                        Verify Code
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                                    </>
                                )}
                            </button>

                            <div className="flex flex-col gap-6 pt-4">
                                <button
                                    type="button"
                                    disabled={timer > 0 || loading}
                                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all py-2 border-b border-gray-100 self-center ${timer > 0 ? 'text-slate-300' : 'text-indigo-400 hover:text-indigo-600'}`}
                                    onClick={handleSendOtp}
                                >
                                    {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                                </button>

                                <button
                                    type="button"
                                    className="text-[9px] font-black text-slate-300 hover:text-slate-900 uppercase tracking-[0.2em] transition-all"
                                    onClick={() => setStep(1)}
                                >
                                    ← Back to Email
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="mt-12 text-center space-y-4">
                    <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">
                        By logging in, you agree to our <br />
                        <span className="text-slate-400 border-b border-slate-200">Terms</span> and <span className="text-slate-400 border-b border-slate-200">Privacy</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
