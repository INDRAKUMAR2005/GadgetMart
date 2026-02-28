"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import RazorpayButton from "../components/RazorpayButton";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const productName = searchParams.get("product") || "Premium Gadget";
    const amount = parseFloat(searchParams.get("amount") || "0");
    const email = searchParams.get("email") || "";

    const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSuccess = (data: any) => {
        setPaymentStatus("success");
        setTimeout(() => router.push("/"), 3000);
    };

    const handleFailure = (err: any) => {
        setPaymentStatus("error");
        setErrorMsg(err?.message || "Transaction failed. Please try again.");
    };

    if (paymentStatus === "success") {
        return (
            <div className="flex flex-col items-center justify-center py-20 sm:py-32 text-center animate-in-bespoke px-4">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#020617] gold-border rounded-[2.5rem] sm:rounded-[3rem] flex items-center justify-center text-5xl sm:text-6xl mb-8 sm:mb-12 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                    <span className="animate-pulse">✨</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase italic mb-4 sm:mb-6">Order Confirmed!</h1>
                <p className="text-amber-400 font-bold uppercase tracking-[0.3em] text-xs">{productName} — Order Placed</p>
                <div className="mt-8 sm:mt-12 inline-flex items-center gap-4 bg-[#0f172a]/40 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">Redirecting to Home</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-16 sm:py-24 px-4 sm:px-8 animate-in-bespoke">
            {/* Header */}
            <div className="mb-10 sm:mb-16 text-center lg:text-left">
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-400 mb-3 sm:mb-4">Secure Payment</h4>
                <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase italic leading-none">Checkout</h1>
            </div>

            {/* Order Summary Card */}
            <div className="glass-card rounded-[2.5rem] sm:rounded-[4rem] p-7 sm:p-12 mb-8 sm:mb-12 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/5 blur-[60px] -z-10 opacity-30" />

                <div className="space-y-7 sm:space-y-10">
                    {/* Product Name */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Product</span>
                        <span className="text-lg sm:text-2xl font-black text-white tracking-tight uppercase text-right">{productName}</span>
                    </div>

                    {/* Processing Hub */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 border-t border-white/5 pt-7 sm:pt-10">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Processing</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                            <span className="text-zinc-300 font-bold uppercase tracking-widest text-xs">GadgetMart Secure Node</span>
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 border-t border-white/5 pt-7 sm:pt-10">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total</span>
                        <div className="flex items-baseline gap-2 sm:gap-3">
                            <span className="text-xl sm:text-2xl font-black text-amber-400">₹</span>
                            <span className="text-5xl sm:text-7xl font-black text-white italic tracking-tighter">{amount.toLocaleString("en-IN")}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {paymentStatus === "error" && (
                <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                    <span className="text-xl">⚡</span>
                    <p>{errorMsg}</p>
                </div>
            )}

            {/* Pay Button */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/50 to-amber-200/30 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-all duration-1000" />
                <RazorpayButton
                    amount={amount}
                    productName={productName}
                    userEmail={email}
                    onSuccess={handleSuccess}
                    onFailure={handleFailure}
                />
            </div>

            {/* Footer info */}
            <div className="mt-10 sm:mt-16 flex flex-col items-center gap-4 sm:gap-6">
                <div className="pt-6 sm:pt-8 border-t border-white/5 w-full flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 opacity-30">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">🔒 Secure Encryption Active</p>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Verified by Razorpay</p>
                </div>
                <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] text-center max-w-md leading-relaxed">
                    By completing this purchase you agree to GadgetMart's service terms.
                </p>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-[#f8fafc] pt-24 sm:pt-32 pb-16 sm:pb-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(245,158,11,0.08)_0%,_transparent_50%),_radial-gradient(circle_at_top_right,_rgba(212,175,55,0.05)_0%,_transparent_40%)] -z-10" />
            <div className="fixed top-0 left-0 w-full h-full opacity-10 pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#ffffff05 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-32 sm:py-48 text-center animate-in-bespoke">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mb-6 sm:mb-8" />
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">Loading Order...</p>
                </div>
            }>
                <CheckoutContent />
            </Suspense>
        </div>
    );
}
