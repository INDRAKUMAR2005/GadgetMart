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
                setError('Failed to update profile. Please try again.');
            }
        } catch (err) {
            setError('Connection error. Please check your internet.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center px-6">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-12">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-2xl mb-6">
                        GM
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-zinc-900">Final Step</h1>
                    <p className="text-zinc-500 font-medium">Just a few more details to get started.</p>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-zinc-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)]">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-semibold focus:outline-none focus:border-blue-500 transition-all"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                            <input
                                type="tel"
                                required
                                placeholder="+91 XXXXX XXXXX"
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-semibold focus:outline-none focus:border-blue-500 transition-all"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">Location Name</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Home, Office, Bangalore"
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-semibold focus:outline-none focus:border-blue-500 transition-all"
                                value={locationName}
                                onChange={(e) => setLocationName(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex justify-center items-center"
                        >
                            {loading ? <div className="animate-spin w-5 h-5 border-3 border-white/20 border-t-white rounded-full" /> : 'Complete Setup'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
