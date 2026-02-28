"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SavedPage() {
    const [savedProducts, setSavedProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('gm_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            fetchSavedProducts();
        } else {
            router.push('/login');
        }
    }, []);

    const fetchSavedProducts = async () => {
        try {
            const res = await fetch('/api/auth/saved', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('gm_token')}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setSavedProducts(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const removeSaved = async (productName: string) => {
        try {
            const res = await fetch(`/api/auth/saved/${encodeURIComponent(productName)}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('gm_token')}`
                }
            });
            if (res.ok) {
                setSavedProducts(prev => prev.filter(p => p.productName !== productName));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className='min-h-screen bg-white text-slate-900 selection:bg-indigo-100 p-12 lg:p-24 relative overflow-hidden'>
            {/* Background Effects */}
            <div className='fixed inset-0 bg-[radial-gradient(circle at bottom left,rgba(79,70,229,0.05) 0%,transparent 50%),radial-gradient(circle at top right,rgba(212,175,55,0.05) 0%,transparent 40%)] -z-10' />
            <div className="fixed top-0 left-0 w-full h-full opacity-5 pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            <div className="max-w-[1400px] mx-auto animate-in-bespoke">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-600 mb-6">Saved Items</h4>
                        <h1 className="text-8xl font-black tracking-tighter uppercase italic leading-none text-slate-900">Your Saves.</h1>
                        <p className="text-slate-400 font-bold text-xl mt-6 uppercase tracking-tight">Gadgets you've bookmarked to check later.</p>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-white border-2 border-indigo-600 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 hover:bg-slate-50 transition-all w-fit shadow-sm"
                    >
                        ← Back to Shopping
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-48 text-center">
                        <div className="w-16 h-16 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-10"></div>
                        <p className="font-black text-slate-400 uppercase tracking-[0.5em] text-[10px]">Loading Saves</p>
                    </div>
                ) : savedProducts.length === 0 ? (
                    <div className="text-center py-48 glass-card rounded-[4rem] border border-slate-100 relative overflow-hidden group bg-white shadow-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 blur-[80px] -z-10 opacity-30" />
                        <span className="text-7xl block mb-12 opacity-20">🔖</span>
                        <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-6">Your library is empty.</h3>
                        <p className="text-slate-400 font-bold mb-16 uppercase tracking-widest text-sm">You haven't saved any gadgets yet. Explore and bookmark your favorites!</p>
                        <button
                            onClick={() => router.push('/')}
                            className="premium-btn px-16 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em]"
                        >
                            Explore Tech
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {savedProducts.map((product, i) => (
                            <div key={i} className="glass-card p-10 rounded-[3.5rem] border border-slate-100 hover:border-indigo-400 transition-all duration-700 group relative bg-white shadow-sm">
                                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-10 bg-white border border-slate-50 p-3">
                                    <img src={product.imageUrl} alt={product.productName} className="w-full h-full object-cover rounded-[2rem] opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-40" />
                                    <button
                                        onClick={() => removeSaved(product.productName)}
                                        className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-all z-20 shadow-sm"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-indigo-600" />
                                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">{product.brand}</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none group-hover:translate-x-1 transition-transform">{product.productName}</h3>

                                    <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-black text-indigo-600">₹</span>
                                            <p className="text-4xl font-black text-slate-900 italic tracking-tighter">{product.price?.toLocaleString()}</p>
                                        </div>
                                        <button
                                            onClick={() => router.push(`/?q=${encodeURIComponent(product.productName)}`)}
                                            className="premium-btn px-8 py-4 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 group/btn"
                                        >
                                            View Details
                                            <svg className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
