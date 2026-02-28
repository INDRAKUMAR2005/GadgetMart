"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface RazorpayButtonProps {
    amount: number;         // in INR (whole rupees — we convert to paise internally)
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

// ─────────────────────────────────────────────────────────
// GadgetMart Razorpay Checkout Button
// Only used for items sold DIRECTLY by GadgetMart.
// External platform links (Amazon, Flipkart etc.) redirect
// to those platforms — NO payment here.
// ─────────────────────────────────────────────────────────
export default function RazorpayButton({
    amount,
    productName,
    userEmail,
    userName = "Valued Customer",
    onSuccess,
    onFailure,
}: RazorpayButtonProps) {
    // Load Razorpay checkout.js script once
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        try {
            // Step 1: Ask our payment-service to create a Razorpay order
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

            // Step 2: Open Razorpay Checkout UI
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Must match your Dashboard key
                amount: amount * 100,                          // Razorpay takes paise
                currency: "INR",
                name: "GadgetMart",
                description: `Purchase: ${productName}`,
                image: "/logo.png",
                order_id: orderData.razorpayOrderId,

                // Handler function — called after successful payment
                handler: async function (response: any) {
                    // Step 3: Verify signature on our server
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

                prefill: {
                    name: userName,
                    email: userEmail,
                    contact: "",  // No phone needed per your design
                },

                notes: {
                    source: "GadgetMart",
                },

                theme: {
                    color: "#4f46e5",
                },
            };

            const rzp = new window.Razorpay(options);

            // Handle payment failure
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
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-200 shadow-lg flex items-center justify-center gap-3 group"
        >
            <span className="text-xl group-hover:scale-110 transition-transform">🛍️</span>
            <span className="uppercase tracking-widest text-[10px] font-black">Purchase Item</span>
            <span className="ml-auto font-black text-sm opacity-90">₹{amount.toLocaleString()}</span>
        </button>
    );
}
