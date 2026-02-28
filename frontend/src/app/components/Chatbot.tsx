"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm GadgetMart's AI assistant. Ask me anything about our tech products! 🚀" }
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
        console.log("Chatbot: Attempting to send message...", input);
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            console.log("Chatbot: Fetching /api/chat...");
            // Backup timeout to clear loading if it gets stuck
            const timeout = setTimeout(() => setIsLoading(false), 10000);

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            clearTimeout(timeout);
            // ... (rest of logic)

            const data = await response.json();

            if (!response.ok) {
                const errMsg = data?.error || "Something went wrong. Please try again.";
                setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${errMsg}` }]);
                return;
            }

            const aiResponse = data?.reply || "I'm having a little trouble. Could you rephrase that?";
            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        } catch (error: any) {
            console.error("Chatbot Error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "⚠️ Unable to connect. Please check your internet connection and try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // ── Chatbot wrapper — responsive position ─────────────────────────────
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[100]">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-xl flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition-all duration-700 border-2 border-amber-400 group relative overflow-hidden"
                aria-label="Toggle chat"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-200 to-amber-50 rounded-[2rem] blur opacity-20 group-hover:opacity-40 animate-pulse transition-opacity" />

                {isOpen ? (
                    <span className="text-amber-500 text-2xl sm:text-3xl font-black relative z-10">✕</span>
                ) : (
                    <div className="relative z-10 flex flex-col items-center gap-1">
                        <div className="text-2xl sm:text-3xl transition-all group-hover:scale-110 text-amber-500">💬</div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-500 leading-none hidden sm:block">Help</span>
                        <div className="w-1 h-1 rounded-full bg-amber-400 animate-ping" />
                    </div>
                )}
            </button>

            {/* Chat Window — full-width on mobile, fixed width on desktop */}
            {isOpen && (
                <div className="
                    absolute bottom-20 right-0
                    w-[calc(100vw-2rem)] sm:w-[400px] md:w-[440px]
                    max-h-[70vh] sm:max-h-[600px] h-[500px] sm:h-[620px]
                    bg-white rounded-[2rem] sm:rounded-[3.5rem]
                    shadow-2xl border border-slate-100
                    overflow-hidden flex flex-col
                    animate-in-bespoke z-50
                ">
                    {/* Header */}
                    <div className="p-5 sm:p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 blur-3xl -z-10" />
                        <div>
                            <h3 className="font-black text-lg sm:text-2xl tracking-tighter text-slate-900 uppercase italic">Help Center</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">AI · Always Online</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white border-2 border-amber-400 flex items-center justify-center text-sm sm:text-base font-black shadow-sm text-amber-500">GM</div>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-6 bg-white">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] text-[13px] leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-amber-400 text-slate-900 font-black rounded-tr-none'
                                    : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none font-medium'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-50 p-4 sm:p-6 rounded-[2rem] border border-slate-100 rounded-tl-none flex gap-2">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex gap-3 items-center shrink-0">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about any product..."
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-amber-400 transition-all placeholder:text-slate-300 font-medium shadow-sm"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="w-12 h-12 sm:w-14 sm:h-14 premium-btn rounded-xl flex items-center justify-center active:scale-95 shadow-lg shrink-0 disabled:opacity-40"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
