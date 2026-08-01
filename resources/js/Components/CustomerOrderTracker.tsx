import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, X, Clock, Flame, CheckCircle2, RefreshCw, ChevronUp, ChevronDown, UtensilsCrossed } from 'lucide-react';

interface OrderItem {
    id: number;
    quantity: number;
    subtotal: number;
    product?: {
        name: string;
    };
}

interface Order {
    id: number;
    order_number: string;
    order_type: string;
    table_number?: string;
    status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled' | string;
    total_amount: number;
    payment_method: string;
    customer_name?: string;
    customer_phone?: string;
    delivery_address?: string;
    created_at: string;
    order_items?: OrderItem[];
}

export default function CustomerOrderTracker() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [lastTrackedOrder, setLastTrackedOrder] = useState<string>('');

    // Load saved order numbers from localStorage or perform search
    const fetchOrders = async (queryText?: string) => {
        const term = queryText !== undefined ? queryText : searchQuery;
        if (!term.trim()) {
            setOrders([]);
            setSearched(false);
            return;
        }

        setLoading(true);
        setSearched(true);
        try {
            const res = await fetch(`/api/v1/orders/track?query=${encodeURIComponent(term.trim())}`);
            if (res.ok) {
                const json = await res.json();
                setOrders(json.data || []);
            }
        } catch (err) {
            console.error('Order tracking fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Auto-search if customer placed an order stored in localStorage
    useEffect(() => {
        try {
            const savedOrderNum = localStorage.getItem('saddle_ranch_last_order');
            if (savedOrderNum) {
                setLastTrackedOrder(savedOrderNum);
                setSearchQuery(savedOrderNum);
                fetchOrders(savedOrderNum);
            }
        } catch (e) {
            // ignore localstorage errors
        }
    }, []);

    // Polling while tracking drawer is open
    useEffect(() => {
        if (!isOpen || !searchQuery.trim()) return;

        const interval = setInterval(() => {
            fetchOrders(searchQuery);
        }, 5000);

        return () => clearInterval(interval);
    }, [isOpen, searchQuery]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchOrders();
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return {
                    label: 'ORDER RECEIVED (PENDING)',
                    className: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
                    icon: <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                };
            case 'preparing':
                return {
                    label: 'SIZZLING ON GRILL',
                    className: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
                    icon: <Flame className="w-3.5 h-3.5 text-orange-400 animate-bounce" />
                };
            case 'ready':
                return {
                    label: 'READY FOR PICK-UP',
                    className: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
                    icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                };
            case 'completed':
                return {
                    label: 'COMPLETED / SERVED',
                    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
                    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                };
            case 'cancelled':
                return {
                    label: 'CANCELLED / VOIDED',
                    className: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
                    icon: <X className="w-3.5 h-3.5 text-rose-400" />
                };
            default:
                return {
                    label: status.toUpperCase(),
                    className: 'bg-stone-800 text-stone-300 border-stone-700',
                    icon: <Clock className="w-3.5 h-3.5" />
                };
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
            {/* FLOATING EXPANDED TRACKING PANEL */}
            {isOpen && (
                <div className="mb-3 w-80 sm:w-96 rounded-2xl bg-[#1c150e]/95 border-2 border-[#f59e0b]/50 shadow-2xl backdrop-blur-md text-[#f0e0d1] overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-[#261e15] to-[#19120a] border-b border-[#534434] flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#f59e0b] text-[#472a00] flex items-center justify-center font-bold shadow-md">
                                <UtensilsCrossed className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-domine font-bold text-sm text-[#ffc174] leading-tight">Live Order Tracker</h3>
                                <p className="text-[11px] text-[#d8c3ad]">Track your sizzling meal in real time</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-lg text-[#d8c3ad] hover:text-white hover:bg-[#31281f] transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Search Form */}
                    <div className="p-4 space-y-3 bg-[#121213]/80">
                        <form onSubmit={handleSearchSubmit} className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Enter Order # (e.g. SR-8492) or Phone #"
                                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1c150e] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                />
                                <Search className="w-4 h-4 text-[#8c7a6b] absolute left-3 top-2.5" />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-3.5 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#472a00] font-bold text-xs transition-colors flex items-center gap-1 shadow-md cursor-pointer disabled:opacity-50"
                            >
                                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Find'}
                            </button>
                        </form>

                        {/* Order List */}
                        <div className="max-h-72 overflow-y-auto space-y-3 pt-1">
                            {loading ? (
                                <div className="p-6 text-center text-xs text-[#d8c3ad] flex items-center justify-center gap-2">
                                    <RefreshCw className="w-4 h-4 animate-spin text-[#f59e0b]" />
                                    <span>Fetching live kitchen status...</span>
                                </div>
                            ) : orders.length > 0 ? (
                                orders.map((order) => {
                                    const badge = getStatusBadge(order.status);
                                    return (
                                        <div key={order.id} className="p-3.5 rounded-xl bg-[#1c150e] border border-[#534434] space-y-2.5 shadow-md">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-black text-sm text-white">#{order.order_number}</span>
                                                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#31281f] text-[#ffc174] border border-[#534434]">
                                                        {order.order_type.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <span className="font-mono text-xs font-bold text-[#f59e0b]">₱{Number(order.total_amount).toFixed(2)}</span>
                                            </div>

                                            {/* Status Badge */}
                                            <div className={`p-2 rounded-lg border text-xs font-bold font-mono flex items-center justify-between ${badge.className}`}>
                                                <div className="flex items-center gap-1.5">
                                                    {badge.icon}
                                                    <span>{badge.label}</span>
                                                </div>
                                                <span className="text-[10px] opacity-80">
                                                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            {/* Items Preview */}
                                            {order.order_items && order.order_items.length > 0 && (
                                                <div className="text-[11px] text-[#d8c3ad] pt-1 border-t border-[#31281f] space-y-1">
                                                    {order.order_items.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between">
                                                            <span>{item.quantity}x {item.product?.name || 'Dish'}</span>
                                                            <span className="font-mono opacity-80">₱{Number(item.subtotal).toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : searched ? (
                                <div className="p-6 text-center text-xs text-[#8c7a6b] bg-[#1c150e] rounded-xl border border-dashed border-[#534434]">
                                    No active orders found for "{searchQuery}". Please check your order number.
                                </div>
                            ) : (
                                <div className="p-5 text-center text-xs text-[#d8c3ad] bg-[#1c150e] rounded-xl border border-[#534434]">
                                    Enter your Order # or Phone # above to view live kitchen preparation progress.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* FLOATING ACTION BUTTON (BOTTOM-RIGHT) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-[#472a00] font-black text-xs uppercase tracking-wider shadow-2xl shadow-[#f59e0b]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-[#ffc174]/60"
            >
                <div className="relative">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                </div>
                <span>See My Orders</span>
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
        </div>
    );
}
