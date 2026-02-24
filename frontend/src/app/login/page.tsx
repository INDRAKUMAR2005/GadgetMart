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
                setError(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
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
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError('Verification failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center px-6 selection:bg-blue-100">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-transparent to-transparent -z-10" />

            <div className="w-full max-w-md">
                {/* Brand */}
                <div className="flex flex-col items-center mb-12">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-blue-600/20 mb-6" onClick={() => router.push('/')}>
                        GM
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-zinc-900">Welcome Back</h1>
                    <p className="text-zinc-500 font-medium">Your premium tech gateway awaits.</p>
                </div>

                {/* Auth Card */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-zinc-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)]">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-zinc-950 text-white py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-950/20 flex justify-center items-center min-h-[60px]"
                            >
                                {loading ? <div className="animate-spin w-5 h-5 border-3 border-white/20 border-t-white rounded-full" /> : 'Send Magic Link'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div>
                                <div className="flex justify-between items-end mb-2 ml-1">
                                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest">Verification Code</label>
                                    <span className="text-[10px] font-bold text-blue-600">Sent to {email.split('@')[0]}...</span>
                                </div>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-center text-3xl font-black tracking-[0.5em] text-zinc-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-zinc-200"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex justify-center items-center min-h-[60px]"
                            >
                                {loading ? <div className="animate-spin w-5 h-5 border-3 border-white/20 border-t-white rounded-full" /> : 'Verify & Access'}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    disabled={timer > 0 || loading}
                                    className={`text-xs font-black uppercase tracking-widest transition-all ${timer > 0 ? 'text-zinc-300' : 'text-zinc-500 hover:text-blue-600'}`}
                                    onClick={handleSendOtp}
                                >
                                    {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                                </button>
                            </div>

                            <button
                                type="button"
                                className="w-full text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-all"
                                onClick={() => setStep(1)}
                            >
                                ← Use a different email
                            </button>
                        </form>
                    )}
                </div>

                <p className="mt-8 text-center text-zinc-400 text-xs font-medium">
                    By signing in, you agree to GadgetMart’s <br />
                    <span className="text-zinc-900 font-bold border-b border-zinc-200">Terms of Service</span> and <span className="text-zinc-900 font-bold border-b border-zinc-200">Privacy Policy</span>
                </p>
            </div>
        </div>
    );
}
