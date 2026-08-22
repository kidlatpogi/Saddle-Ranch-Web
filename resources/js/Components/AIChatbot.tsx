import React, { useState, useRef, useEffect } from 'react';
import LocationModal from '@/Components/LocationModal';
import CustomerAuthModal from '@/Components/CustomerAuthModal';
import { MessageSquare, X, MapPin, Clock, Utensils, Tag, Ticket, RefreshCw, Sparkles, Copy, Check } from 'lucide-react';

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: string;
}

const parseEnvText = (val?: string) => {
    if (!val) return '';
    return val.replace(/\\n/g, '\n');
};

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome-1',
            sender: 'bot',
            text: 'Welcome to Saddle Ranch! Select an option below for locations, hours, menu prices, or special promos.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [currentBranch, setCurrentBranch] = useState<'Bulihan' | 'Dasma'>(() => (localStorage.getItem('saddle_ranch_branch') as any) || 'Bulihan');
    const [products, setProducts] = useState<any[]>([]);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    // Typewriter Typing Effect State
    const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
    const [typedTextMap, setTypedTextMap] = useState<Record<string, string>>({});
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleLocUpdate = (e: any) => {
            if (e.detail) {
                setCurrentBranch(e.detail.branch);
            }
        };
        window.addEventListener('saddle_ranch_location_updated', handleLocUpdate);
        return () => window.removeEventListener('saddle_ranch_location_updated', handleLocUpdate);
    }, []);

    const fetchLiveProducts = async () => {
        try {
            const res = await fetch('/api/v1/products');
            if (res.ok) {
                const json = await res.json();
                if (json.data && Array.isArray(json.data)) {
                    setProducts(json.data);
                    return json.data;
                }
            }
        } catch (err) {
            console.error('Failed to fetch live chatbot menu prices:', err);
        }
        return [];
    };

    useEffect(() => {
        if (isOpen) {
            fetchLiveProducts();
            // Start typewriter for welcome message if not already typed
            if (!typedTextMap['welcome-1']) {
                typeOutBotMessage('welcome-1', messages[0].text);
            }
        }
    }, [isOpen]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, typedTextMap, isAiThinking, isOpen]);

    const typeOutBotMessage = (msgId: string, fullText: string) => {
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
        }

        let currentIndex = 0;
        setTypingMessageId(msgId);
        setTypedTextMap((prev) => ({ ...prev, [msgId]: '' }));

        typingIntervalRef.current = setInterval(() => {
            currentIndex += 3; // 3 chars per tick for smooth, lively typewriter speed
            if (currentIndex >= fullText.length) {
                currentIndex = fullText.length;
                if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
                setTypingMessageId(null);
            }
            const currentSub = fullText.slice(0, currentIndex);
            setTypedTextMap((prev) => ({ ...prev, [msgId]: currentSub }));
        }, 18);
    };

    const getLocationsResponse = () => {
        return (
            parseEnvText(import.meta.env.VITE_CHATBOT_LOCATIONS) ||
            'Saddle Ranch Roadhouse Locations in Cavite:\n\n📍 **Bulihan Branch**:\nblock 26 lot 17, Anahaw St, Silang, Cavite\n\n📍 **Dasmariñas Branch**:\n8X23+Q75, Governor\'s Dr, San Agustin I, Dasmariñas, 4114 Cavite'
        );
    };

    const getHoursResponse = () => {
        return (
            parseEnvText(import.meta.env.VITE_CHATBOT_HOURS) ||
            'We are open daily:\n\n• **Bulihan Branch**: Mon - Sun (11:00 AM - 11:00 PM)\n• **Dasmariñas Branch**: Mon - Sun (10:00 AM - 10:00 PM)'
        );
    };

    const getPromosResponse = () => {
        return (
            parseEnvText(import.meta.env.VITE_CHATBOT_PROMOS) ||
            'Discounts and promos:\n\n• **FREE Delivery** around Bulihan area\n• **10% Student Discount** (With valid student ID)\n• **20% Senior & PWD Discount**\n• Use promo code `WELCOME50` for ₱50.00 OFF online orders over ₱500!'
        );
    };

    const getVouchersResponse = async () => {
        try {
            const res = await fetch('/api/v1/customer/vouchers');
            if (res.ok) {
                const json = await res.json();
                if (!json.is_logged_in) {
                    return (
                        '🔐 **Customer Sign In Required**\n\n' +
                        'To view, claim, and redeem your personal account vouchers (including your **₱50.00 OFF** first-time customer voucher!), please sign in or register a free account!'
                    );
                }

                const list = json.data || [];
                if (list.length > 0) {
                    const welcomeVoucher = list.find((v: any) => v.code === 'WELCOME50' || v.code.includes('WELCOME'));
                    const otherVouchers = list.filter((v: any) => v !== welcomeVoucher);

                    let reply = '🎁 **Your Customer Account Vouchers**:\n\n';

                    if (welcomeVoucher) {
                        const statusStr = welcomeVoucher.is_used ? '❌ REDEEMED' : '✅ AVAILABLE TO USE';
                        reply += `1. **First-Time Customer Voucher**:\n• Code: \`${welcomeVoucher.code}\`\n• Discount: **₱${welcomeVoucher.value.toFixed(2)} OFF**\n• Min. Order: **₱${welcomeVoucher.min_spend.toFixed(2)}**\n• Usage: One-time per account\n• Status: **${statusStr}**\n\n`;
                    } else {
                        reply += `1. **First-Time Customer Voucher**:\n• Code: \`WELCOME50\`\n• Discount: **₱50.00 OFF** on orders over **₱500.00**\n• Usage: One-time per account\n• Status: **✅ AVAILABLE TO USE**\n\n`;
                    }

                    if (otherVouchers.length > 0) {
                        reply += '2. **Available Store & Promotional Vouchers**:\n';
                        otherVouchers.forEach((v: any) => {
                            const discountStr = v.discount_type === 'percentage' ? `${v.value}% OFF` : `₱${v.value.toFixed(2)} OFF`;
                            const statusStr = v.is_used ? '❌ REDEEMED' : '✅ AVAILABLE';
                            const branchStr = v.branch && v.branch !== 'all' ? ` (${v.branch.toUpperCase()} Branch)` : '';
                            reply += `• Code: \`${v.code}\` — **${discountStr}**${branchStr} (Min. spend ₱${v.min_spend.toFixed(2)}) [${statusStr}]\n`;
                        });
                    }

                    reply += '\n💡 *Tip: Click any code below to copy it instantly and paste it at checkout!*';
                    return reply;
                }
            }
        } catch (err) {
            console.error('Error fetching vouchers for chatbot:', err);
        }

        return (
            '🎁 **Your Customer Account Vouchers**:\n\n' +
            '1. **First-Time Customer Voucher**:\n• Code: `WELCOME50`\n• Discount: **₱50.00 OFF** on orders over **₱500.00**\n• Usage: One-time per account\n• Status: **✅ AVAILABLE TO USE**\n\n' +
            '2. **Available Store Vouchers**:\n• Code: `SADDLE10` — **10% OFF** (Min spend ₱200.00)\n• Code: `BULIHANFREE` — **15% OFF** (Bulihan Branch, Min spend ₱500.00)\n• Code: `DASMAFEAST` — **₱100.00 OFF** (Dasma Branch, Min spend ₱750.00)\n\n' +
            '💡 *Tip: Click any code below to copy it instantly and paste it at checkout!*'
        );
    };

    const getPricesResponse = async () => {
        const liveData = await fetchLiveProducts();
        const activeList = liveData.length > 0 ? liveData : products;

        if (activeList && activeList.length > 0) {
            const branchLabel = currentBranch === 'Bulihan' ? 'Bulihan Branch' : 'Dasmariñas Branch';
            const itemsText = activeList
                .filter((p: any) => p.is_active !== false)
                .map((p: any) => {
                    const rawPrice =
                        currentBranch === 'Bulihan'
                            ? (p.price_bulihan ?? p.price)
                            : (p.price_dasmarinas ?? p.price);
                    const formattedPrice = Number(rawPrice).toLocaleString('en-PH', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                    return `• **${p.name}**: ₱${formattedPrice}`;
                })
                .join('\n');

            const envPrefix = parseEnvText(import.meta.env.VITE_CHATBOT_PRICES) || 'Featured Menu Specialties & Prices';
            return `${envPrefix} (${branchLabel}):\n\n${itemsText}`;
        }

        return (
            parseEnvText(import.meta.env.VITE_CHATBOT_PRICES) ||
            'Featured Menu Specialties & Prices:\n\n• **Sizzling Pork Sisig**: ₱180.00\n• **Sizzling Pork T-Bone Steak**: ₱250.00\n• **Sizzling Porterhouse Steak**: ₱320.00\n• **Sizzling Chicken Steak**: ₱190.00\n• **Sizzling Gambas**: ₱220.00'
        );
    };

    const handleOptionClick = async (topic: 'locations' | 'hours' | 'prices' | 'promos' | 'vouchers') => {
        if (isLoading || isAiThinking || !!typingMessageId) return;
        setIsLoading(true);

        let userLabel = '';
        if (topic === 'locations') userLabel = 'Locations';
        else if (topic === 'hours') userLabel = 'Hours';
        else if (topic === 'prices') userLabel = 'Prices';
        else if (topic === 'promos') userLabel = 'Promos';
        else if (topic === 'vouchers') userLabel = 'Vouchers';

        // 1. Immediately post User message
        const userMsg: Message = {
            id: `user-${Date.now()}`,
            sender: 'user',
            text: userLabel,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, userMsg]);
        setIsAiThinking(true);

        // 2. Fetch response while AI thinking animation displays
        let botReply = '';
        if (topic === 'locations') {
            botReply = getLocationsResponse();
        } else if (topic === 'hours') {
            botReply = getHoursResponse();
        } else if (topic === 'prices') {
            botReply = await getPricesResponse();
        } else if (topic === 'promos') {
            botReply = getPromosResponse();
        } else if (topic === 'vouchers') {
            botReply = await getVouchersResponse();
        }

        // 3. Simulate live cloud AI model thinking reflection (~850ms)
        setTimeout(() => {
            setIsAiThinking(false);
            setIsLoading(false);

            const botMsgId = `bot-${Date.now()}`;
            const botMsg: Message = {
                id: botMsgId,
                sender: 'bot',
                text: botReply,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setMessages((prev) => [...prev, botMsg]);
            typeOutBotMessage(botMsgId, botReply);
        }, 850);
    };

    const handleClearChat = () => {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        const welcomeText = 'Welcome to Saddle Ranch! Select an option below for locations, hours, menu prices, or special promos.';
        const clearMsg: Message = {
            id: `welcome-${Date.now()}`,
            sender: 'bot',
            text: welcomeText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([clearMsg]);
        setIsAiThinking(false);
        typeOutBotMessage(clearMsg.id, welcomeText);
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2500);
    };

    const formatText = (content: string) => {
        const parts = content.split(/(\*\*.*?\*\*|`.*?`)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-[#ffc174]">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('`') && part.endsWith('`')) {
                const code = part.slice(1, -1);
                const isCopied = copiedCode === code;
                return (
                    <button
                        key={i}
                        onClick={() => copyToClipboard(code)}
                        title="Click to copy code"
                        className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-md bg-[#121213] text-[#f59e0b] border border-[#f59e0b]/40 hover:bg-[#f59e0b] hover:text-[#472a00] font-mono text-[11px] font-black tracking-wider transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                        <span>{code}</span>
                        {isCopied ? <Check className="w-3 h-3 text-green-400 shrink-0" /> : <Copy className="w-2.5 h-2.5 text-[#f59e0b] hover:text-[#472a00] shrink-0" />}
                    </button>
                );
            }
            return part;
        });
    };

    return (
        <>
            {/* Mobile Backdrop Overlay when Assistant is Open */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990] sm:hidden animate-in fade-in duration-200"
                />
            )}

            <div className="font-sans">
                {/* Toggle Trigger Button - Fixed Bottom Left */}
                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-40 group flex items-center gap-3 px-4 py-3 bg-[#1F1914] text-[#ffc174] rounded-full border border-[#f59e0b]/50 shadow-2xl hover:bg-[#2A221C] hover:border-[#f59e0b] hover:scale-105 active:scale-95 transition-all duration-300 btn-bevel"
                        aria-label="Open Help Assistant"
                    >
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#f59e0b] text-[#472a00] font-bold shadow-inner">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="text-left pr-1 hidden sm:block">
                            <div className="text-xs font-bold uppercase tracking-wider text-[#ffc174]">
                                Help Assistant
                            </div>
                            <div className="text-[10px] text-[#f59e0b] font-medium flex items-center gap-1">Ordering: {currentBranch === 'Bulihan' ? 'Bulihan Branch' : 'Dasmariñas Branch'}</div>
                        </div>
                    </button>
                )}

                {/* Chat Window - Taller Spacious Mobile & Desktop Layout */}
                {isOpen && (
                    <div className="fixed inset-x-3 bottom-3 sm:bottom-6 sm:left-6 sm:right-auto sm:w-[400px] w-[calc(100vw-24px)] h-[82vh] max-h-[640px] sm:h-[580px] bg-[#16120E] border-2 border-[#f59e0b]/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 backdrop-blur-md z-[100000]">
                        {/* Header */}
                        <div className="bg-[#1F1914] p-4 border-b border-[#534434] flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#f59e0b] text-[#472a00] font-bold shadow">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-domine text-sm font-bold text-[#ffc174]">
                                        Help Assistant
                                    </h3>
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

                        {/* Active Branch Bar */}
                        <div className="bg-[#241c14] px-4 py-2.5 border-b border-[#3B2F24] flex items-center justify-between text-xs shrink-0">
                            <div className="flex items-center gap-1.5 text-[#f0e0d1]">
                                <MapPin className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
                                <span>Ordering from: <strong className="text-[#ffc174] font-bold">{currentBranch === 'Bulihan' ? 'Bulihan Branch' : 'Dasmariñas Branch'}</strong></span>
                            </div>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setIsLocationModalOpen(true);
                                }}
                                className="text-[10px] font-black uppercase tracking-wider bg-[#f59e0b]/20 text-[#f59e0b] hover:bg-[#f59e0b] hover:text-[#472a00] px-2.5 py-0.5 rounded-full border border-[#f59e0b]/40 transition-colors cursor-pointer"
                            >
                                Change
                            </button>
                        </div>

                        {/* Messages Body */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#120F0C]">
                            {messages.map((msg) => {
                                const isBot = msg.sender === 'bot';
                                const isTyping = typingMessageId === msg.id;
                                const displayedText = isBot ? (typedTextMap[msg.id] !== undefined ? typedTextMap[msg.id] : msg.text) : msg.text;

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow ${msg.sender === 'user'
                                                ? 'bg-[#f59e0b] text-[#472a00] font-semibold rounded-br-none'
                                                : 'bg-[#211B15] text-[#f0e0d1] border border-[#3D3126] rounded-bl-none'
                                                }`}
                                        >
                                            <div className="whitespace-pre-wrap">
                                                {formatText(displayedText)}
                                                {isTyping && (
                                                    <span className="inline-block w-1.5 h-3 bg-[#f59e0b] ml-1 animate-pulse" />
                                                )}
                                            </div>
                                            {isBot && msg.text.includes('Customer Sign In Required') && (
                                                <button
                                                    onClick={() => setIsAuthModalOpen(true)}
                                                    className="mt-3 w-full py-2 px-3 rounded-xl bg-[#f59e0b] text-[#472a00] font-black text-xs uppercase tracking-wider hover:bg-[#ffc174] transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer btn-bevel"
                                                >
                                                    🔐 Sign In / Register Account
                                                </button>
                                            )}
                                        </div>
                                        <span className="text-[9px] text-[#8C7A6B] font-mono mt-1 px-1">
                                            {msg.timestamp}
                                        </span>
                                    </div>
                                );
                            })}

                            {/* Live AI Model Replying / Thinking Animation Bubble */}
                            {isAiThinking && (
                                <div className="flex flex-col items-start animate-in fade-in duration-200">
                                    <div className="bg-[#211B15] text-[#ffc174] border border-[#f59e0b]/40 rounded-2xl rounded-bl-none px-4 py-3 text-xs shadow flex items-center gap-2.5">
                                        <div className="relative flex items-center justify-center w-4 h-4 rounded-full bg-[#f59e0b]/20 text-[#f59e0b]">
                                            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-semibold text-xs text-[#ffc174]">Thinking</span>
                                            <span className="flex items-center gap-1 ml-0.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-bounce [animation-delay:-0.3s]" />
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-bounce [animation-delay:-0.15s]" />
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-bounce" />
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[9px] text-[#8C7A6B] font-mono mt-1 px-1">
                                        Processing response...
                                    </span>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Topic Action Buttons (Primary Action Grid) */}
                        <div className="p-3 bg-[#1A1510] border-t border-[#3B2F24] grid grid-cols-2 gap-2 shrink-0">
                            <button
                                onClick={() => handleOptionClick('locations')}
                                disabled={isLoading || isAiThinking || !!typingMessageId}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#261F18] border border-[#534434] text-[#f0e0d1] text-xs font-bold hover:bg-[#f59e0b] hover:text-[#472a00] hover:border-[#f59e0b] transition-all disabled:opacity-50 cursor-pointer shadow-sm active:scale-95"
                            >
                                <MapPin className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
                                <span>Locations</span>
                            </button>
                            <button
                                onClick={() => handleOptionClick('hours')}
                                disabled={isLoading || isAiThinking || !!typingMessageId}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#261F18] border border-[#534434] text-[#f0e0d1] text-xs font-bold hover:bg-[#f59e0b] hover:text-[#472a00] hover:border-[#f59e0b] transition-all disabled:opacity-50 cursor-pointer shadow-sm active:scale-95"
                            >
                                <Clock className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
                                <span>Hours</span>
                            </button>
                            <button
                                onClick={() => handleOptionClick('prices')}
                                disabled={isLoading || isAiThinking || !!typingMessageId}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#261F18] border border-[#534434] text-[#f0e0d1] text-xs font-bold hover:bg-[#f59e0b] hover:text-[#472a00] hover:border-[#f59e0b] transition-all disabled:opacity-50 cursor-pointer shadow-sm active:scale-95"
                            >
                                <Utensils className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
                                <span>Prices</span>
                            </button>
                            <button
                                onClick={() => handleOptionClick('promos')}
                                disabled={isLoading || isAiThinking || !!typingMessageId}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#261F18] border border-[#534434] text-[#f0e0d1] text-xs font-bold hover:bg-[#f59e0b] hover:text-[#472a00] hover:border-[#f59e0b] transition-all disabled:opacity-50 cursor-pointer shadow-sm active:scale-95"
                            >
                                <Tag className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
                                <span>Promos</span>
                            </button>
                            <button
                                onClick={() => handleOptionClick('vouchers')}
                                disabled={isLoading || isAiThinking || !!typingMessageId}
                                className="col-span-2 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-[#f59e0b]/30 to-amber-500/20 border border-[#f59e0b]/60 text-[#ffc174] text-xs font-black uppercase tracking-wider hover:bg-[#f59e0b] hover:text-[#472a00] transition-all disabled:opacity-50 cursor-pointer shadow-md active:scale-95 btn-bevel"
                            >
                                <Ticket className="w-4 h-4 text-[#f59e0b] shrink-0" />
                                <span>Vouchers & Account Discounts</span>
                            </button>
                        </div>
                    </div>
                )}
                <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
                <CustomerAuthModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                    onSuccess={() => {
                        setIsAuthModalOpen(false);
                        handleOptionClick('vouchers');
                    }}
                />
            </div>
        </>
    );
}
