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
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/login');
            return;
        }
        const userObj = JSON.parse(storedUser);
        setUser(userObj);

        fetch(`/api/orders?email=${encodeURIComponent(userObj.email)}`)
            .then(res => res.json())
            .then(data => {
                setOrders(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch orders:", err);
                setLoading(false);
            });
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-zinc-950 mesh-bg pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter mb-2">My Orders</h1>
                        <p className="text-zinc-500 font-medium">Tracking your premium gadget acquisitions.</p>
                    </div>
                    <Link href="/" className="text-sm font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">
                        Back to Shop
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="glass-card p-20 rounded-[3rem] text-center border border-white/50">
                        <div className="text-6xl mb-6">📦</div>
                        <h2 className="text-2xl font-black mb-4">No orders found.</h2>
                        <p className="text-zinc-500 mb-8 max-w-sm mx-auto">Your collection is empty. Start exploring the latest tech and build your dream setup today.</p>
                        <Link href="/" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order) => (
                            <div key={order.orderNumber} className="glass-card rounded-[2.5rem] p-8 border border-white/50 premium-shadow holographic group">
                                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 border-b border-zinc-100 pb-8">
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Order Number</p>
                                        <p className="font-mono text-xs text-zinc-600">{order.orderNumber}</p>
                                    </div>
                                    <div className="flex gap-12">
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Date</p>
                                            <p className="font-bold text-sm">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Status</p>
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${order.status === 'PAID' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    order.status === 'PLACED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        'bg-zinc-50 text-zinc-600 border-zinc-100'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total Amount</p>
                                        <p className="text-2xl font-black italic">₹{order.totalAmount.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {order.orderItems.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center group/item">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center text-xl group-hover/item:scale-110 transition-transform">📱</div>
                                                <div>
                                                    <p className="font-bold text-lg">{item.productName}</p>
                                                    <p className="text-xs text-zinc-400 font-medium">Quantity: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-black text-zinc-600">₹{item.price.toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
