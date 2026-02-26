"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import RazorpayButton from "../components/RazorpayButton";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const productName = searchParams.get("product") || "Elite Hardware";
    const amount = parseFloat(searchParams.get("amount") || "0");
    const email = searchParams.get("email") || "";

    const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSuccess = (data: any) => {
        setPaymentStatus("success");
        setTimeout(() => {
            router.push("/");
        }, 3000);
    };

    const handleFailure = (err: any) => {
        setPaymentStatus("error");
        setErrorMsg(err.message || "Protocol Interruption: Transaction Aborted");
    };

    if (paymentStatus === "success") {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center animate-in-bespoke">
                <div className="w-32 h-32 bg-[#020617] gold-border rounded-[3rem] flex items-center justify-center text-6xl mb-12 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                    <span className="animate-pulse">✨</span>
                </div>
                <h1 className="text-6xl font-black tracking-tighter uppercase italic mb-6">Allocation Confirmed</h1>
                <p className="text-[#d4af37] font-bold uppercase tracking-[0.3em] text-xs">Unit Reserved: {productName}</p>
                <div className="mt-12 inline-flex items-center gap-4 bg-[#0f172a]/40 px-8 py-4 rounded-2xl border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
                    <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">Redirecting to Command Center</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-24 px-8 animate-in-bespoke">
            <div className="mb-16 text-center lg:text-left">
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37] mb-4">Financial Protocol</h4>
                <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-none">Secured Checkout</h1>
            </div>

            <div className="glass-card rounded-[4rem] p-12 mb-12 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 blur-[80px] -z-10 opacity-30" />

                <div className="space-y-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Asset Identification</span>
                        <span className="text-2xl font-black text-white tracking-tight uppercase">{productName}</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-white/5 pt-10">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Infrastructure Node</span>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
                            <span className="text-zinc-300 font-bold uppercase tracking-widest text-xs">GadgetMart Private Relay</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-white/5 pt-10">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Valuation</span>
                        <div className="flex items-baseline gap-3">
                            <span className="text-2xl font-black text-[#d4af37]">₹</span>
                            <span className="text-7xl font-black text-white italic tracking-tighter">{amount.toLocaleString("en-IN")}</span>
                        </div>
                    </div>
                </div>
            </div>

            {paymentStatus === "error" && (
                <div className="mb-12 p-6 bg-[#d4af37]/5 border border-[#d4af37]/20 text-[#d4af37] text-[10px] font-black uppercase tracking-widest rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                    <span className="text-2xl">⚡</span>
                    <p>{errorMsg}</p>
                </div>
            )}

            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37]/50 to-[#d4af37]/20 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-all duration-1000" />
                <RazorpayButton
                    amount={amount}
                    productName={productName}
                    userEmail={email}
                    onSuccess={handleSuccess}
                    onFailure={handleFailure}
                />
            </div>

            <div className="mt-16 flex flex-col items-center gap-6">
                <div className="pt-8 border-t border-white/5 w-full flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">🔒 Encrypted Transfer Hub</p>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Powered by Razorpay Advanced Matrix</p>
                </div>
                <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] text-center max-w-md leading-relaxed">
                    By confirming this transmission, you authorize the secure allocation of digital assets via the private GadgetMart relay network.
                </p>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-[#f8fafc] pt-32 pb-24 relative overflow-hidden">
            {/* Background Grid Accent */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.1)_0%,_transparent_50%),_radial-gradient(circle_at_top_right,_rgba(212,175,55,0.05)_0%,_transparent_40%)] -z-10" />
            <div className="fixed top-0 left-0 w-full h-full opacity-10 pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#ffffff05 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-48 text-center animate-in-bespoke">
                    <div className="w-16 h-16 border-2 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin mb-8" />
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">Synchronizing Order Data</p>
                </div>
            }>
                <CheckoutContent />
            </Suspense>
        </div>
    );
}
