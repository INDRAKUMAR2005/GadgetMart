import { NextRequest, NextResponse } from "next/server";

// ─── GadgetMart AI Chat API Route ───────────────────────────────────────────
// This is a SERVER-SIDE route, so the Gemini key is never exposed to the
// browser. The key is read from the server's environment (process.env).
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!API_KEY) {
        return NextResponse.json(
            { error: "AI service is not configured. Please add your GEMINI_API_KEY to the server environment." },
            { status: 503 }
        );
    }

    try {
        const { message } = await req.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are GadgetMart's friendly AI shopping assistant. GadgetMart is a premium tech e-commerce platform selling the latest gadgets — iPhones, MacBooks, Samsung devices, headphones, and more. Help users find products, compare prices, and make informed purchase decisions. Keep responses concise, helpful, and friendly.

User: ${message}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                    }
                }),
            }
        );

        if (!geminiRes.ok) {
            const errBody = await geminiRes.json().catch(() => ({}));
            const msg = errBody?.error?.message || `Gemini API error (${geminiRes.status})`;
            console.error("[Chat API] Gemini error:", msg);
            return NextResponse.json({ error: msg }, { status: 502 });
        }

        const data = await geminiRes.json();
        const candidate = data?.candidates?.[0];
        const text =
            candidate?.content?.parts?.[0]?.text ||
            "I'm having a little trouble right now. Please try again in a moment!";

        return NextResponse.json({ reply: text });
    } catch (err: any) {
        console.error("[Chat API] Unexpected error:", err.message);
        return NextResponse.json(
            { error: "An unexpected error occurred. Please try again." },
            { status: 500 }
        );
    }
}
