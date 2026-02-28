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
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-8" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Loading Orders</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 pt-48 pb-32 px-10 relative overflow-hidden">
            {/* Background Effects */}
            <div className='fixed inset-0 bg-[radial-gradient(circle at top right,rgba(79,70,229,0.05) 0%,transparent 50%),radial-gradient(circle at bottom left,rgba(212,175,55,0.05) 0%,transparent 40%)] -z-10' />
            <div className="fixed top-0 left-0 w-full h-full opacity-5 pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            <div className="max-w-5xl mx-auto animate-in-bespoke">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-600 mb-6">History</h4>
                        <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-none text-slate-900">Your Orders</h1>
                        <p className="text-slate-400 font-bold text-xl mt-6 uppercase tracking-tight">See your previous gadget finds here.</p>
                    </div>
                    <Link href="/" className="bg-white border-2 border-indigo-600 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 hover:bg-slate-50 transition-all w-fit shadow-sm">
                        ← Back to Shopping
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="glass-card p-32 rounded-[4rem] text-center border border-slate-100 relative group overflow-hidden bg-white shadow-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 blur-[80px] -z-10 opacity-30" />
                        <span className="text-7xl block mb-12 opacity-20">🛒</span>
                        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-6">No Orders yet.</h2>
                        <p className="text-slate-400 font-bold mb-16 uppercase tracking-widest text-sm max-w-md mx-auto">You haven't ordered anything yet. Start shopping to find the best tech!</p>
                        <Link href="/" className="premium-btn px-16 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em]">
                            Find Gadgets
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {orders.map((order, idx) => (
                            <div key={order.orderNumber} className="glass-card rounded-[4rem] p-12 border border-slate-100 hover:border-indigo-400 transition-all duration-700 group relative animate-in-bespoke bg-white shadow-sm" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12 border-b border-slate-50 pb-10">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Order number</p>
                                        <p className="font-mono text-slate-500 font-bold bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-xs">{order.orderNumber}</p>
                                    </div>
                                    <div className="grid grid-cols-2 md:flex gap-12">
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Date</p>
                                            <p className="font-black text-slate-900 uppercase italic text-sm">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Status</p>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${order.status === 'PAID' ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:text-right space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Total</p>
                                        <div className="flex lg:justify-end items-baseline gap-2">
                                            <span className="text-xl font-black text-indigo-600">₹</span>
                                            <p className="text-4xl font-black text-slate-900 italic tracking-tighter leading-none">{order.totalAmount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    {order.orderItems.map((item, iIdx) => (
                                        <div key={iIdx} className="flex justify-between items-center group/item">
                                            <div className="flex items-center gap-8">
                                                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-2xl group-hover/item:scale-110 transition-transform duration-500">
                                                    <span className="opacity-60 grayscale group-hover/item:opacity-100 group-hover/item:grayscale-0 transition-all">📦</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="font-black text-2xl text-slate-900 uppercase tracking-tighter">{item.productName}</p>
                                                    <div className="flex items-center gap-4">
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Item #{iIdx + 1}</p>
                                                        <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em]">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xs font-bold text-slate-300">₹</span>
                                                <p className="font-black text-2xl text-slate-400 italic">{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-24 text-center">
                    <p className="text-slate-200 text-[10px] font-black uppercase tracking-[0.4em]">
                        © 2026 GadgetMart. Simple and Secure.
                    </p>
                </div>
            </div>
        </div>
    );
}
