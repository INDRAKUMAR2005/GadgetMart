"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import RazorpayButton from "../components/RazorpayButton";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const productName = searchParams.get("product") || "Gadget";
    const amount = parseFloat(searchParams.get("amount") || "0");
    const email = searchParams.get("email") || "";

    const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSuccess = (data: any) => {
        setPaymentStatus("success");
        // In a real app, you'd show a success screen or redirect to /orders
        setTimeout(() => {
            router.push("/");
        }, 3000);
    };

    const handleFailure = (err: any) => {
        setPaymentStatus("error");
        setErrorMsg(err.message || "Payment failed");
    };

    if (paymentStatus === "success") {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-5xl mb-6">✅</div>
                <h1 className="text-4xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-zinc-400">Your order for {productName} has been placed.</p>
                <p className="text-zinc-500 mt-4">Redirecting you to home...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <h1 className="text-4xl font-bold mb-8">Secure Checkout</h1>

            <div className="glass rounded-3xl p-8 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-zinc-400">Product</span>
                    <span className="font-bold">{productName}</span>
                </div>
                <div className="flex justify-between items-center mb-6 border-t border-zinc-800 pt-6">
                    <span className="text-zinc-400">Platform</span>
                    <span className="text-blue-400 font-medium">GadgetMart Official</span>
                </div>
                <div className="flex justify-between items-center text-2xl font-bold border-t border-zinc-800 pt-6">
                    <span>Total Amount</span>
                    <span className="text-green-400">₹{amount.toLocaleString()}</span>
                </div>
            </div>

            {paymentStatus === "error" && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
                    ⚠️ {errorMsg}
                </div>
            )}

            {/* The Razorpay Trigger */}
            <RazorpayButton
                amount={amount}
                productName={productName}
                userEmail={email}
                onSuccess={handleSuccess}
                onFailure={handleFailure}
            />

            <p className="text-center text-zinc-500 text-sm mt-6">
                🔒 Secured by Razorpay. All transactions are encrypted.
            </p>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-20">
            <Suspense fallback={<div className="text-center pt-20">Loading order details...</div>}>
                <CheckoutContent />
            </Suspense>
        </div>
    );
}
