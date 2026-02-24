"use client";

import React, { useState } from 'react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (data: any) => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
    const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/auth/send-otp?email=${encodeURIComponent(email)}`, { method: 'POST' });
            if (!res.ok) throw new Error('Failed to send OTP');
            setStep('OTP');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, { method: 'POST' });
            const data = await res.json();
            if (data.status === 'FAILED') throw new Error(data.message);

            // Success! Store JWT
            localStorage.setItem('gm_token', data.token);
            localStorage.setItem('gm_user', JSON.stringify({ email: data.email, name: data.name }));
            onSuccess(data);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-100">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-black text-zinc-900 leading-tight">
                            {step === 'EMAIL' ? 'Welcome Back' : 'Verify Email'}
                        </h2>
                        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {step === 'EMAIL' ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-zinc-500 mb-2 uppercase tracking-widest">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 text-zinc-900 focus:outline-none focus:border-blue-500 transition-all"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-zinc-950 text-white font-bold py-4 rounded-2xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-950/10"
                            >
                                {loading ? 'SENDING...' : 'CONTINUE'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-zinc-500 mb-2 uppercase tracking-widest">Verification Code</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 text-center text-3xl font-black tracking-[1em] text-zinc-900 focus:outline-none focus:border-blue-500 transition-all"
                                    placeholder="000000"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <p className="mt-4 text-sm text-zinc-400 text-center">
                                    Code sent to <span className="text-zinc-900 font-medium">{email}</span>
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-zinc-950 text-white font-bold py-4 rounded-2xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-950/10"
                            >
                                {loading ? 'VERIFYING...' : 'SIGN IN'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep('EMAIL')}
                                className="w-full text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors"
                            >
                                USE DIFFERENT EMAIL
                            </button>
                        </form>
                    )}
                </div>
                <div className="bg-zinc-50 p-6 border-t border-zinc-100 text-center">
                    <p className="text-sm text-zinc-400">
                        GadgetMart uses deep-linking and real-time aggregation to bring you the best deals.
                    </p>
                </div>
            </div>
        </div>
    );
}
