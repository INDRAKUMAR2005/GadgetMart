"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
    productName: string;
    quantity: number;
    price: number;
}

interface Order {
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    orderItems: OrderItem[];
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('gm_user');
        if (!storedUser) {
            router.push('/login');
            return;
        }
        const userObj = JSON.parse(storedUser);
        setUser(userObj);

        const token = localStorage.getItem('gm_token');
        fetch(`/api/orders?email=${encodeURIComponent(userObj.email)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setOrders(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch order history:", err);
                setLoading(false);
            });
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-2 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin mb-8" />
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">Synchronizing Chronicles</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-[#f8fafc] pt-48 pb-32 px-10 relative overflow-hidden">
            {/* Elite Background Effects */}
            <div className='fixed inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.1)_0%,_transparent_50%),_radial-gradient(circle_at_bottom_left,_rgba(212,175,55,0.05)_0%,_transparent_40%)] -z-10' />
            <div className="fixed top-0 left-0 w-full h-full opacity-10 pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#ffffff05 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            <div className="max-w-5xl mx-auto animate-in-bespoke">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37] mb-6">Chronological Records</h4>
                        <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-none">Acquisitions.</h1>
                        <p className="text-zinc-500 font-bold text-xl mt-6 uppercase tracking-tight">Tracking your premium deployment history.</p>
                    </div>
                    <Link href="/" className="bg-[#0f172a] gold-border px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-[#d4af37] hover:bg-[#d4af37]/5 transition-all w-fit">
                        ← Return to Interface
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="glass-card p-32 rounded-[4rem] text-center border border-white/5 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/5 blur-[80px] -z-10 opacity-30" />
                        <span className="text-7xl block mb-12 opacity-20 filter grayscale">📁</span>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-6">Zero Records.</h2>
                        <p className="text-zinc-500 font-bold mb-16 uppercase tracking-widest text-sm max-w-md mx-auto">No hardware acquisitions have been logged in the secure database for this identity.</p>
                        <Link href="/" className="premium-btn px-16 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em]">
                            Initialize Deployment
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {orders.map((order, idx) => (
                            <div key={order.orderNumber} className="glass-card rounded-[4rem] p-12 border border-white/5 hover:border-[#d4af37]/20 transition-all duration-700 group relative animate-in-bespoke" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12 border-b border-white/5 pb-10">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Sequence Identifier</p>
                                        <p className="font-mono text-zinc-300 font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-xs">{order.orderNumber}</p>
                                    </div>
                                    <div className="grid grid-cols-2 md:flex gap-12">
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Timestamp</p>
                                            <p className="font-black text-white uppercase italic text-sm">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Operational Status</p>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${order.status === 'PAID' ? 'bg-[#d4af37]' : 'bg-zinc-600'}`} />
                                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:text-right space-y-4">
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Net Valuation</p>
                                        <div className="flex lg:justify-end items-baseline gap-2">
                                            <span className="text-xl font-black text-[#d4af37]">₹</span>
                                            <p className="text-4xl font-black text-white italic tracking-tighter leading-none">{order.totalAmount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    {order.orderItems.map((item, iIdx) => (
                                        <div key={iIdx} className="flex justify-between items-center group/item">
                                            <div className="flex items-center gap-8">
                                                <div className="w-16 h-16 bg-[#020617] gold-border rounded-2xl flex items-center justify-center text-2xl group-hover/item:scale-110 transition-transform duration-500">
                                                    <span className="opacity-60 grayscale group-hover/item:opacity-100 group-hover/item:grayscale-0 transition-all">📦</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="font-black text-2xl text-white uppercase tracking-tighter">{item.productName}</p>
                                                    <div className="flex items-center gap-4">
                                                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Allocation Rank: {iIdx + 1}</p>
                                                        <p className="text-[10px] text-[#d4af37] font-black uppercase tracking-[0.2em]">Quantity: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xs font-bold text-zinc-700">₹</span>
                                                <p className="font-black text-2xl text-zinc-400 italic">{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-24 text-center">
                    <p className="text-zinc-800 text-[10px] font-black uppercase tracking-[0.4em]">
                        Authenticated Chronology Matrix v2.1.0 • Private Gateway Encryption
                    </p>
                </div>
            </div>
        </div>
    );
}
