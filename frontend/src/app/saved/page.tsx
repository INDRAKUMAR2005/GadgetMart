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
        <div className='min-h-screen bg-white text-zinc-950 p-12'>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter">Saved <span className="text-blue-600">Gadgets</span></h1>
                        <p className="text-zinc-500 font-medium">Your personal collection of premium tech.</p>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-zinc-100 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
                    >
                        ← Back to Store
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="font-bold text-zinc-400 uppercase tracking-widest text-xs">Loading collection...</p>
                    </div>
                ) : savedProducts.length === 0 ? (
                    <div className="text-center py-32 bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-200">
                        <span className="text-6xl block mb-6">🏜️</span>
                        <h3 className="text-2xl font-black mb-2">Collection Empty</h3>
                        <p className="text-zinc-500 mb-8">You haven't saved any gadgets yet.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20"
                        >
                            Start Exploring
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {savedProducts.map((product, i) => (
                            <div key={i} className="glass-card p-6 rounded-[2.5rem] border border-zinc-100 hover:border-blue-200 transition-all group">
                                <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-6 border border-zinc-50">
                                    <img src={product.imageUrl} alt={product.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <button
                                        onClick={() => removeSaved(product.productName)}
                                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{product.brand}</span>
                                    </div>
                                    <h3 className="text-xl font-black mb-4 truncate">{product.productName}</h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-2xl font-black text-zinc-950">₹{product.price?.toLocaleString()}</p>
                                        <button
                                            onClick={() => router.push(`/?q=${encodeURIComponent(product.productName)}`)}
                                            className="bg-zinc-950 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                                        >
                                            View Deals
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
