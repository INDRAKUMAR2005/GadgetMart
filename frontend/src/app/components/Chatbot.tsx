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
        <div className="fixed bottom-8 right-8 z-[100]">
            {/* Launcher Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group"
            >
                {isOpen ? (
                    <span className="text-white text-2xl">✕</span>
                ) : (
                    <div className="relative">
                        <span className="text-white text-3xl">🤖</span>
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
                    </div>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-96 h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-zinc-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                        <h3 className="font-bold text-lg">GadgetBot AI</h3>
                        <p className="text-xs text-blue-100 italic">Powered by Gemini</p>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-3xl text-sm ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white text-zinc-800 shadow-sm border border-zinc-100 rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-4 rounded-3xl shadow-sm border border-zinc-100 rounded-tl-none flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-zinc-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask anything..."
                            className="flex-1 bg-zinc-100 border-none rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSend}
                            className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
