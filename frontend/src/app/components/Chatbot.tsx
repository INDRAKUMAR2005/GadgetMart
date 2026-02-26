"use client";

import React, { useState, useEffect, useRef } from 'react';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm your GadgetMart AI Assistant. Ask me anything about our gadgets, prices, or recommendations! 🚀" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are a helpful and tech-savvy shopping assistant for GadgetMart, an elite e-commerce platform for gadgets like iPhones, MacBooks, and high-end tech. Be concise, friendly, and professional. 
            User says: ${userMessage}`
                        }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Gemini API Error:", errorData);
                throw new Error(errorData.error?.message || "Failed to connect to AI");
            }

            const data = await response.json();

            // Check for candidates or safety blocks
            let aiResponse = "";
            if (data.candidates && data.candidates.length > 0) {
                const candidate = data.candidates[0];
                if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                    aiResponse = candidate.content.parts[0].text;
                } else if (candidate.finishReason === "SAFETY") {
                    aiResponse = "I'm sorry, but I can't discuss that topic as it violates safety guidelines.";
                }
            }

            if (!aiResponse) {
                aiResponse = "I'm having trouble processing that right now. Could you please rephrase or ask something else?";
            }

            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        } catch (error: any) {
            console.error("Chatbot Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-12 right-12 z-[100]">
            {/* Elite Launcher Button with Hyper-Glow */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-24 h-24 bg-[#020617] rounded-[2rem] shadow-[0_20px_50px_rgba(59,130,246,0.2)] flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition-all duration-700 gold-border group relative overflow-hidden"
            >
                {/* Dynamic Pulse Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/20 via-transparent to-[#d4af37]/10 opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37]/40 to-[#3b82f6]/40 rounded-[2rem] blur opacity-20 group-hover:opacity-40 animate-pulse transition-opacity" />

                {isOpen ? (
                    <span className="text-[#d4af37] text-3xl font-black relative z-10 transition-transform duration-500 hover:rotate-90">✕</span>
                ) : (
                    <div className="relative z-10 flex flex-col items-center gap-1.5 translate-y-0.5">
                        <div className="text-3xl filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] transition-all group-hover:scale-110">🏛️</div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4af37] leading-none">Concierge</span>
                        <div className="w-1 h-1 rounded-full bg-[#3b82f6] animate-ping" />
                    </div>
                )}
            </button>

            {/* Premium Chat Window */}
            {isOpen && (
                <div className="absolute bottom-28 right-0 w-[440px] h-[640px] bg-[#020617] rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden flex flex-col animate-in-bespoke z-50">
                    {/* Header: Sapphire Terminal Aesthetic */}
                    <div className="p-10 bg-[#0f172a]/50 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#3b82f6]/5 blur-3xl -z-10" />
                        <div>
                            <h3 className="font-black text-2xl tracking-tighter gradient-text uppercase italic">Intelligence Hub</h3>
                            <div className="flex items-center gap-2.5 mt-2">
                                <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
                                <p className="text-[10px] font-black text-[#d4af37]/60 uppercase tracking-[0.3em]">Encrypted Session Active</p>
                            </div>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-[#020617] gold-border flex items-center justify-center text-2xl shadow-xl">🔱</div>
                    </div>

                    {/* Messages with Custom Scrollbar */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#020617]/50 custom-scrollbar relative">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.03)_0%,_transparent_70%)] pointer-events-none" />
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-6 rounded-[2.5rem] text-[13px] leading-relaxed shadow-lg ${msg.role === 'user'
                                    ? 'bg-[#d4af37] text-[#020617] font-black rounded-tr-none'
                                    : 'bg-[#0f172a] text-[#f8fafc] border border-white/5 rounded-tl-none font-medium'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-[#0f172a] p-6 rounded-[2.5rem] border border-white/5 rounded-tl-none flex gap-2 self-start">
                                    <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Bar: Sleek Interface */}
                    <div className="p-8 bg-[#0f172a]/30 backdrop-blur-3xl border-t border-white/5 flex gap-4 items-center">
                        <div className="flex-1 relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Consult with AI Core..."
                                className="w-full bg-[#020617] border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-[#d4af37]/50 transition-all placeholder:text-zinc-700 font-medium"
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            className="w-16 h-16 premium-btn rounded-2xl flex items-center justify-center active:scale-95 shadow-xl group/btn"
                        >
                            <svg className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
