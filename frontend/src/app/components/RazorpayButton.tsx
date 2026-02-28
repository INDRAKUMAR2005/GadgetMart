"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface RazorpayButtonProps {
    amount: number;
    productName: string;
    userEmail: string;
    userName?: string;
    onSuccess: (paymentData: {
        razorpayOrderId: string;
        razorpayPaymentId: string;
        razorpaySignature: string;
    }) => void;
    onFailure?: (error: any) => void;
}

export default function RazorpayButton({
    amount,
    productName,
    userEmail,
    userName = "Valued Customer",
    onSuccess,
    onFailure,
}: RazorpayButtonProps) {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => { document.body.removeChild(script); };
    }, []);

    const handlePayment = async () => {
        try {
            const orderRes = await fetch("/api/payments/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderNumber: `GM-${Date.now()}`,
                    userEmail,
                    amount,
                }),
            });

            if (!orderRes.ok) throw new Error("Failed to create payment order");
            const orderData = await orderRes.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: amount * 100,
                currency: "INR",
                name: "GadgetMart",
                description: `Purchase: ${productName}`,
                image: "/logo.png",
                order_id: orderData.razorpayOrderId,
                handler: async function (response: any) {
                    const verifyRes = await fetch("/api/payments/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        }),
                    });
                    const verifyData = await verifyRes.json();
                    if (verifyData.status === "SUCCESS") {
                        onSuccess({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        });
                    } else {
                        onFailure?.({ message: "Payment verification failed" });
                    }
                },
                prefill: { name: userName, email: userEmail, contact: "" },
                notes: { source: "GadgetMart" },
                theme: { color: "#F59E0B" },   // ← Amber yellow
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function (response: any) {
                console.error("Razorpay payment failed:", response.error);
                onFailure?.(response.error);
            });
            rzp.open();
        } catch (error) {
            console.error("Payment initiation error:", error);
            onFailure?.(error);
        }
    };

    return (
        <button
            id="rzp-button1"
            onClick={handlePayment}
            className="w-full bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-900 font-black py-4 sm:py-5 px-6 sm:px-8 rounded-2xl transition-all duration-200 shadow-lg flex items-center justify-center gap-3 group"
        >
            <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform">🛍️</span>
            <span className="uppercase tracking-widest text-[10px] sm:text-[11px] font-black">Purchase Item</span>
            <span className="ml-auto font-black text-sm opacity-90">₹{amount.toLocaleString()}</span>
        </button>
    );
}
