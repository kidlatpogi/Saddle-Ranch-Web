import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, X, Send, MapPin, Clock, Utensils, Tag, RefreshCw, MessageSquare, Flame } from 'lucide-react';

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: string;
}

const DEFAULT_WORKER_URL = 'http://localhost:8787/api/chat';

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome-1',
            sender: 'bot',
            text: '🤠 Howdy! Welcome to Saddle Ranch Sizzling House AI Assistant. How can I help you today? Ask me about our locations, prices, opening hours, or special promos!',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setHasUnread(false);
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (textToSend?: string) => {
        const text = (textToSend || inputValue).trim();
        if (!text || isLoading) return;

        const userMsg: Message = {
            id: `user-${Date.now()}`,
            sender: 'user',
            text: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, userMsg]);
        if (!textToSend) setInputValue('');
        setIsLoading(true);

        try {
            // Attempt to call Cloudflare Worker API
            const response = await fetch(DEFAULT_WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
            });

            if (response.ok) {
                const data = await response.json();
                const botReplyText = data.reply || data.message;
                addBotResponse(botReplyText);
            } else {
                // Fallback to local intelligent assistant logic if worker dev server is offline
                const fallbackReply = generateLocalKnowledgeReply(text);
                addBotResponse(fallbackReply);
            }
        } catch (err) {
            // Graceful fallback to client-side knowledge engine
            const fallbackReply = generateLocalKnowledgeReply(text);
            addBotResponse(fallbackReply);
        } finally {
            setIsLoading(false);
        }
    };

    const addBotResponse = (text: string) => {
        const botMsg: Message = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
    };

    const generateLocalKnowledgeReply = (msg: string): string => {
        const q = msg.toLowerCase();
        if (q.includes('location') || q.includes('where') || q.includes('address') || q.includes('branch')) {
            return '🤠 Saddle Ranch has two locations in Cavite:\n\n📍 **Bulihan Branch**: 123 Roadhouse Lane, Barangay Bulihan, Cavite\n📍 **Dasmariñas Branch**: Governors Drive, Barangay Sampaloc 1, Dasmariñas City, Cavite';
        }
        if (q.includes('open') || q.includes('hour') || q.includes('time') || q.includes('status')) {
            return '⏰ Yeehaw! We are OPEN daily:\n\n• **Bulihan Branch**: Mon - Sun (11:00 AM - 11:00 PM)\n• **Dasmariñas Branch**: Mon - Sun (10:00 AM - 10:00 PM)';
        }
        if (q.includes('price') || q.includes('menu') || q.includes('cost') || q.includes('sisig') || q.includes('steak')) {
            return '🥩 Featured Sizzling Specialties & Prices:\n\n• **Sizzling Pork Sisig**: ₱180.00\n• **Sizzling Pork T-Bone Steak**: ₱250.00\n• **Sizzling Porterhouse Steak**: ₱320.00\n• **Sizzling Chicken Steak**: ₱190.00\n• **Sizzling Gambas**: ₱220.00';
        }
        if (q.includes('discount') || q.includes('promo') || q.includes('voucher') || q.includes('free') || q.includes('offer')) {
            return '🏷️ Saddle Ranch Specials:\n\n🚚 **FREE Delivery** around Bulihan area\n🎓 **10% Student Discount** (With valid student ID)\n👵 **20% Senior & PWD Discount**\n🎟️ Use promo code `WELCOME10` for 10% off online orders!';
        }
        if (q.includes('order') || q.includes('delivery') || q.includes('pickup') || q.includes('takeout') || q.includes('dine')) {
            return '🛒 Order Options available on our website:\n\n1. **Pick-Up / Takeout** (Ready in 15 mins)\n2. **Home Delivery** (Free in Bulihan)\n3. **Dine-In Table QR Scan** (Instant table ordering)';
        }
        return '🤠 Howdy! I am Saddle Ranch AI. Feel free to ask me about our location, prices, opening hours, discounts, or ordering options!';
    };

    const handleClearChat = () => {
        setMessages([
            {
                id: 'welcome-1',
                sender: 'bot',
                text: '🤠 Chat cleared! How can Saddle Ranch AI help you today?',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
        ]);
    };

    const formatText = (content: string) => {
        // Simple helper to parse basic markdown bolding like **text**
        const parts = content.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-[#ffc174]">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="fixed bottom-6 left-6 z-50 font-sans">
            {/* Chatbot Toggle Trigger Button - Fixed Bottom Left */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative group flex items-center gap-3 px-4 py-3 bg-[#1F1914] text-[#ffc174] rounded-full border border-[#f59e0b]/50 shadow-2xl hover:bg-[#2A221C] hover:border-[#f59e0b] hover:scale-105 transition-all duration-300 btn-bevel"
                    aria-label="Open Saddle Ranch AI Assistant"
                >
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#f59e0b] text-[#472a00] font-bold shadow-inner">
                        <Bot className="w-6 h-6 animate-pulse" />
                        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffc174] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#1F1914]"></span>
                        </span>
                    </div>
                    <div className="text-left pr-1 hidden sm:block">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#ffc174] flex items-center gap-1">
                            <span>Saddle Ranch AI</span>
                            <Sparkles className="w-3 h-3 text-[#f59e0b]" />
                        </div>
                        <div className="text-[10px] text-[#d8c3ad] font-mono">Ask Location, Prices & Hours</div>
                    </div>
                </button>
            )}

            {/* Chat Modal / Popup Window */}
            {isOpen && (
                <div className="w-[340px] sm:w-[380px] h-[520px] bg-[#16120E] border border-[#534434] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 backdrop-blur-md">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#261E16] via-[#1F1914] to-[#261E16] p-4 border-b border-[#534434] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#f59e0b] text-[#472a00] shadow">
                                <Flame className="w-5 h-5" />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#16120E]"></span>
                            </div>
                            <div>
                                <h3 className="font-domine text-sm font-bold text-[#ffc174] flex items-center gap-1.5">
                                    Saddle Ranch AI
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30">
                                        Wrangler Worker
                                    </span>
                                </h3>
                                <p className="text-[10px] text-[#d8c3ad] font-mono flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    Cloudflare AI Connected
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleClearChat}
                                className="p-1.5 text-[#d8c3ad] hover:text-[#ffc174] hover:bg-[#31281f] rounded-lg transition-colors"
                                title="Clear conversation"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 text-[#d8c3ad] hover:text-white hover:bg-[#31281f] rounded-lg transition-colors"
                                title="Close chat"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div className="bg-[#1C1712] px-3 py-2 border-b border-[#3B2F24] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                        <button
                            onClick={() => handleSendMessage('Where are your locations and branch addresses?')}
                            className="flex items-center gap-1 text-[11px] font-medium bg-[#2A221C] text-[#f0e0d1] hover:bg-[#f59e0b]/20 hover:text-[#ffc174] hover:border-[#f59e0b]/50 px-2.5 py-1 rounded-full border border-[#534434] transition-all whitespace-nowrap"
                        >
                            <MapPin className="w-3 h-3 text-[#f59e0b]" /> Locations
                        </button>
                        <button
                            onClick={() => handleSendMessage('Are you open right now and what are your operating hours?')}
                            className="flex items-center gap-1 text-[11px] font-medium bg-[#2A221C] text-[#f0e0d1] hover:bg-[#f59e0b]/20 hover:text-[#ffc174] hover:border-[#f59e0b]/50 px-2.5 py-1 rounded-full border border-[#534434] transition-all whitespace-nowrap"
                        >
                            <Clock className="w-3 h-3 text-[#f59e0b]" /> Hours
                        </button>
                        <button
                            onClick={() => handleSendMessage('What are your menu dishes and prices?')}
                            className="flex items-center gap-1 text-[11px] font-medium bg-[#2A221C] text-[#f0e0d1] hover:bg-[#f59e0b]/20 hover:text-[#ffc174] hover:border-[#f59e0b]/50 px-2.5 py-1 rounded-full border border-[#534434] transition-all whitespace-nowrap"
                        >
                            <Utensils className="w-3 h-3 text-[#f59e0b]" /> Prices
                        </button>
                        <button
                            onClick={() => handleSendMessage('Do you have discounts, free delivery, or promos?')}
                            className="flex items-center gap-1 text-[11px] font-medium bg-[#2A221C] text-[#f0e0d1] hover:bg-[#f59e0b]/20 hover:text-[#ffc174] hover:border-[#f59e0b]/50 px-2.5 py-1 rounded-full border border-[#534434] transition-all whitespace-nowrap"
                        >
                            <Tag className="w-3 h-3 text-[#f59e0b]" /> Promos
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#120F0C]">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow ${
                                        msg.sender === 'user'
                                            ? 'bg-[#f59e0b] text-[#472a00] font-medium rounded-br-none'
                                            : 'bg-[#211B15] text-[#f0e0d1] border border-[#3D3126] rounded-bl-none'
                                    }`}
                                >
                                    <div className="whitespace-pre-wrap">{formatText(msg.text)}</div>
                                </div>
                                <span className="text-[9px] text-[#8C7A6B] font-mono mt-1 px-1">
                                    {msg.timestamp}
                                </span>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex items-center gap-2 bg-[#211B15] text-[#ffc174] border border-[#3D3126] px-3.5 py-2.5 rounded-2xl rounded-bl-none w-max text-xs">
                                <Bot className="w-3.5 h-3.5 animate-spin text-[#f59e0b]" />
                                <span>Saddle Ranch AI is thinking...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer Input Form */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }}
                        className="p-3 bg-[#1A1510] border-t border-[#3B2F24] flex items-center gap-2"
                    >
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about location, prices, hours..."
                            className="flex-1 bg-[#261F18] border border-[#534434] rounded-xl px-3 py-2 text-xs text-[#f0e0d1] placeholder-[#8C7A6B] focus:outline-none focus:border-[#f59e0b] transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isLoading}
                            className="p-2.5 rounded-xl bg-[#f59e0b] text-[#472a00] font-bold hover:bg-[#ffc174] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
