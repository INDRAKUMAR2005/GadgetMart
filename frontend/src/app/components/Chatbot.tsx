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
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // ✅ Calls our own Next.js server-side route — Gemini key stays secure on the server
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Show the real error from our server so we can debug
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
        <div className="fixed bottom-12 right-12 z-[100]">
            {/* Help Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition-all duration-700 border-2 border-indigo-600 group relative overflow-hidden"
            >
                {/* Pulse Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-200 to-indigo-50 rounded-[2rem] blur opacity-20 group-hover:opacity-40 animate-pulse transition-opacity" />

                {isOpen ? (
                    <span className="text-indigo-600 text-3xl font-black relative z-10 transition-transform duration-500 hover:rotate-90">✕</span>
                ) : (
                    <div className="relative z-10 flex flex-col items-center gap-1.5 translate-y-0.5">
                        <div className="text-3xl transition-all group-hover:scale-110 text-indigo-600">💬</div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 leading-none">Help</span>
                        <div className="w-1 h-1 rounded-full bg-indigo-600 animate-ping" />
                    </div>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-28 right-0 w-[440px] h-[640px] bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in-bespoke z-50">
                    {/* Support Header */}
                    <div className="p-10 bg-slate-50 border-b border-slate-100 flex items-center justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 blur-3xl -z-10" />
                        <div>
                            <h3 className="font-black text-2xl tracking-tighter text-slate-900 uppercase italic">Help Center</h3>
                            <div className="flex items-center gap-2.5 mt-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">AI-Powered · Always Online</p>
                            </div>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-white border-2 border-indigo-600 flex items-center justify-center text-2xl shadow-sm text-indigo-600">GM</div>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-white custom-scrollbar relative">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(79,70,229,0.02)_0%,_transparent_70%)] pointer-events-none" />
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-6 rounded-[2.5rem] text-[13px] leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white font-black rounded-tr-none'
                                    : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none font-medium'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 rounded-tl-none flex gap-2 self-start">
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Bar */}
                    <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4 items-center">
                        <div className="flex-1 relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about any product..."
                                className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-5 text-sm text-slate-900 focus:outline-none focus:border-indigo-400 transition-all placeholder:text-slate-300 font-medium shadow-sm"
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="w-16 h-16 premium-btn rounded-2xl flex items-center justify-center active:scale-95 shadow-xl group/btn disabled:opacity-40"
                        >
                            <svg className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
