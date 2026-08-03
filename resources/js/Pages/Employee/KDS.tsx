import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Flame,
    Clock,
    CheckCircle2,
    ArrowLeft,
    ChefHat,
    Volume2,
    VolumeX,
    Bell,
    Check,
    UtensilsCrossed,
    Sparkles,
    ShieldAlert,
    X,
    Lock
} from 'lucide-react';

interface OrderItemProduct {
    id: number;
    name: string;
    price: number;
}

interface OrderItem {
    id?: number;
    product_id?: number;
    quantity: number;
    unit_price?: number;
    subtotal?: number;
    product?: OrderItemProduct;
    name?: string;
    notes?: string;
}

interface KDSOrder {
    id: number | string;
    order_number: string;
    order_type: 'dine_in' | 'express_takeout' | 'pickup' | 'delivery' | string;
    table_number?: string;
    customer_name?: string;
    customer_phone?: string;
    status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
    created_at: string;
    order_items?: OrderItem[];
    // Computed / helper fields for legacy compatibility
    tableOrMode?: string;
    elapsedMins?: number;
    items?: { qty: number; name: string; notes?: string }[];
    timeAgo?: string;
    customer?: string;
}

interface CookSummaryItem {
    product_name: string;
    total_quantity: number;
}

interface KDSProps {
    userBranch?: string;
}

export default function KitchenDisplaySystem({ userBranch = 'Bulihan' }: KDSProps) {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
    const [orders, setOrders] = useState<KDSOrder[]>([]);
    const [cookSummary, setCookSummary] = useState<CookSummaryItem[]>([]);
    const previousPendingIdsRef = useRef<Set<string | number>>(new Set());

    // Security Void Modal State
    const [cancelModalOrder, setCancelModalOrder] = useState<KDSOrder | null>(null);
    const [cancelPassword, setCancelPassword] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    const [cancelError, setCancelError] = useState('');
    const [cancelLoading, setCancelLoading] = useState(false);

    // Audio Element Fallback Ref
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Web Audio API Chime Synthesizer
    const playKitchenChimeSound = () => {
        if (!soundEnabled) return;
        try {
            // Play HTML5 audio file if available
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => { });
            }

            // Web Audio dual chime fallback
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();

            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(880, ctx.currentTime);
            gain1.gain.setValueAtTime(0.3, ctx.currentTime);
            gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);

            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1760, ctx.currentTime + 0.1);
            gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.1);
            gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);

            osc1.start(ctx.currentTime);
            osc1.stop(ctx.currentTime + 0.5);
            osc2.start(ctx.currentTime + 0.1);
            osc2.stop(ctx.currentTime + 0.6);
        } catch (e) {
            console.warn('Web Audio Playback failed:', e);
        }
    };

    // Calculate elapsed minutes from created_at
    const getElapsedMins = (createdAtStr: string): number => {
        if (!createdAtStr) return 0;
        const created = new Date(createdAtStr).getTime();
        const now = new Date().getTime();
        if (isNaN(created)) return 0;
        return Math.max(0, Math.floor((now - created) / 60000));
    };

    // 3-Second Short Polling Engine
    const fetchKitchenOrders = async () => {
        try {
            const res = await fetch('/api/v1/kitchen/orders');
            if (res.ok) {
                const json = await res.json();
                const fetchedOrders: KDSOrder[] = json.data || [];
                const fetchedSummary: CookSummaryItem[] = json.summary || [];

                setOrders(fetchedOrders);
                setCookSummary(fetchedSummary);

                // Detect new pending orders to trigger chime
                const currentPendingIds = new Set(
                    fetchedOrders.filter(o => o.status === 'pending').map(o => o.id)
                );

                let hasNewPending = false;
                currentPendingIds.forEach(id => {
                    if (!previousPendingIdsRef.current.has(id)) {
                        hasNewPending = true;
                    }
                });

                if (hasNewPending) {
                    playKitchenChimeSound();
                }

                previousPendingIdsRef.current = currentPendingIds;
            }
        } catch (err) {
            console.error('KDS polling error:', err);
        }
    };

    const [activeWaiterCalls, setActiveWaiterCalls] = useState<any[]>([]);

    const fetchWaiterCalls = async () => {
        try {
            const res = await fetch('/api/v1/waiter-calls');
            if (res.ok) {
                const json = await res.json();
                setActiveWaiterCalls(json.data || []);
            }
        } catch (e) { }
    };

    const handleDismissWaiterCall = async (tableNumber: string) => {
        try {
            await fetch('/api/v1/waiter-calls/dismiss', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ table_number: tableNumber }),
            });
            setActiveWaiterCalls((prev) => prev.filter((c) => c.table_number !== tableNumber));
        } catch (e) { }
    };

    useEffect(() => {
        const clockInterval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        // Initial fetch + 3-second poll
        fetchKitchenOrders();
        fetchWaiterCalls();
        const pollInterval = setInterval(() => {
            fetchKitchenOrders();
            fetchWaiterCalls();
        }, 3000);

        return () => {
            clearInterval(clockInterval);
            clearInterval(pollInterval);
        };
    }, []);

    // Status Update (PATCH /orders/{id}/status)
    const handleUpdateStatus = async (orderId: string | number, newStatus: 'preparing' | 'ready' | 'completed') => {
        try {
            const res = await fetch(`/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                fetchKitchenOrders();
            } else {
                const errData = await res.json();
                alert(errData.message || 'Failed to update order status.');
            }
        } catch (e) {
            console.error('Status update error:', e);
        }
    };

    // Cancellation Handler (POST /orders/{id}/cancel)
    const handleCancelOrderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cancelModalOrder) return;
        if (!cancelPassword) {
            setCancelError('Authorization password is required.');
            return;
        }
        if (!cancelReason.trim()) {
            setCancelError('Cancellation reason is required.');
            return;
        }

        setCancelLoading(true);
        setCancelError('');

        try {
            const res = await fetch(`/orders/${cancelModalOrder.id}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    password: cancelPassword,
                    reason: cancelReason,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setCancelModalOrder(null);
                setCancelPassword('');
                setCancelReason('');
                fetchKitchenOrders();
            } else {
                setCancelError(data.message || 'Invalid authorization password');
            }
        } catch (err) {
            setCancelError('Network error verifying cancellation.');
        } finally {
            setCancelLoading(false);
        }
    };

    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const preparingCount = orders.filter(o => o.status === 'preparing').length;
    const readyCount = orders.filter(o => o.status === 'ready').length;

    const filteredOrders = orders.filter(o => {
        if (statusFilter === 'pending') return o.status === 'pending';
        if (statusFilter === 'preparing') return o.status === 'preparing';
        if (statusFilter === 'ready') return o.status === 'ready';
        return true;
    });

    // Order Type Badge helper
    const getOrderTypeBadge = (orderType: string, tableNum?: string) => {
        switch (orderType) {
            case 'dine_in':
                return { label: `[DINE-IN: TABLE ${tableNum || '01'}]`, className: 'bg-rose-950/80 text-rose-400 border border-rose-500/50' };
            case 'express_takeout':
                return { label: '[EXPRESS TAKEOUT]', className: 'bg-amber-950/80 text-amber-400 border border-amber-500/50' };
            case 'pickup':
                return { label: '[PICK-UP]', className: 'bg-blue-950/80 text-blue-400 border border-blue-500/50' };
            case 'delivery':
                return { label: '[DELIVERY: BULIHAN]', className: 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/50' };
            default:
                return { label: `[${orderType.toUpperCase()}]`, className: 'bg-[#18181b] text-[#fbbf24] border border-[#3f3f46]' };
        }
    };

    return (
        <>
            <Head title="Kitchen Display System (KDS) | Saddle Ranch" />

            {/* HTML5 Audio element fallback */}
            <audio ref={audioRef} src="/sounds/new-order.mp3" preload="auto" />

            <div className="min-h-screen bg-[#141416] text-[#f4f4f5] font-sans selection:bg-[#f59e0b] selection:text-[#3f2000] flex flex-col">

                {/* KDS Touch Header */}
                <header className="h-20 bg-[#1f1f23] border-b border-[#333338] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/20">
                            <Flame className="w-6 h-6 text-[#3f2000] animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-black font-domine text-white tracking-tight">Saddle Ranch KDS Terminal</h1>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${userBranch === 'Dasma' || userBranch === 'Dasmariñas'
                                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                    }`}>
                                    {userBranch === 'Dasma' ? 'Dasmariñas Branch' : `${userBranch} Branch`} KDS
                                </span>
                            </div>
                            <p className="text-xs text-[#a1a1aa]">Dedicated Grill & Cook Screen • <span className="font-mono text-[#fbbf24] font-bold">{currentTime}</span></p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Audio Chime Trigger & Sound Toggle */}
                        <button
                            onClick={playKitchenChimeSound}
                            className="px-3.5 py-2 rounded-xl bg-[#202024] border border-[#3f3f46] text-[#fbbf24] hover:bg-[#27272a] flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
                            title="Test Kitchen Bell Chime Sound"
                        >
                            <Bell className="w-4 h-4 text-[#f59e0b] animate-bounce" />
                            <span className="hidden sm:inline">Test Bell Chime</span>
                        </button>

                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${soundEnabled ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                }`}
                            title={soundEnabled ? 'Audio Chime Enabled' : 'Audio Chime Muted'}
                        >
                            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </button>

                        <Link
                            href="/employee/dashboard"
                            className="px-4 py-2.5 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-white flex items-center gap-1.5 text-xs font-bold transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Return to Portal</span>
                        </Link>
                    </div>
                </header>

                {/* KDS Main Area: Grid + Sticky Aggregator Side Panel */}
                <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 items-start">

                    {/* Main Section: Filters & Order Cards */}
                    <main className="flex-1 w-full space-y-6">

                        {/* PIPELINE FILTER CHIPS */}
                        <div className="p-3 rounded-2xl bg-[#202024] border border-[#333338] flex flex-wrap items-center justify-between gap-3 shadow-lg">
                            <div className="flex items-center gap-2 overflow-x-auto">
                                {[
                                    { id: 'All', label: 'All Active Tickets', count: orders.length, color: 'text-white' },
                                    { id: 'pending', label: '1. Pending Kitchen', count: pendingCount, color: 'text-amber-400' },
                                    { id: 'preparing', label: '2. Preparing (On Grill)', count: preparingCount, color: 'text-yellow-300' },
                                    { id: 'ready', label: '3. Ready to Serve', count: readyCount, color: 'text-blue-400' },
                                ].map((chip) => (
                                    <button
                                        key={chip.id}
                                        onClick={() => setStatusFilter(chip.id)}
                                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${statusFilter === chip.id
                                            ? 'bg-[#f59e0b] text-[#3f2000] font-black shadow-md'
                                            : 'bg-[#18181b] border border-[#3f3f46] text-[#a1a1aa] hover:text-white'
                                            }`}
                                    >
                                        <span>{chip.label}</span>
                                        <span className={`px-2 py-0.5 rounded-full bg-[#141416] text-[11px] font-mono font-black ${chip.color}`}>
                                            {chip.count}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
                                <ChefHat className="w-4 h-4 text-[#f59e0b]" />
                                <span>Active Cook Queue: <strong className="text-[#fbbf24] font-mono text-sm">{filteredOrders.length}</strong> tickets</span>
                            </div>
                        </div>

                        {/* Active Waiter Call Notification Banner */}
                        {activeWaiterCalls.length > 0 && (
                            <div className="mb-6 p-4 rounded-2xl bg-amber-500 text-[#3f2000] border-2 border-[#ffc174] shadow-2xl flex flex-wrap items-center justify-between gap-3 animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
                                        <Bell className="w-6 h-6 text-[#3f2000] animate-bounce" />
                                    </div>
                                    <div>
                                        <div className="font-black text-sm uppercase tracking-wider">WAITER ASSISTANCE REQUESTED!</div>
                                        <div className="text-xs font-bold">
                                            {activeWaiterCalls.map((c) => `Table #${c.table_number} (${c.branch || 'Bulihan'} Branch)`).join(' • ')}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {activeWaiterCalls.map((c) => (
                                        <button
                                            key={c.id || c.table_number}
                                            onClick={() => handleDismissWaiterCall(c.table_number)}
                                            className="px-3.5 py-1.5 rounded-xl bg-[#121213] text-[#ffc174] hover:bg-black font-black text-xs transition-all shadow cursor-pointer border border-[#f59e0b]"
                                        >
                                            Acknowledge Table #{c.table_number}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* HIGH-DISTINCTION UNCONFUSING KDS CARDS GRID */}
                        {filteredOrders.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredOrders.map((order) => {
                                    const elapsed = getElapsedMins(order.created_at);
                                    const typeBadge = getOrderTypeBadge(order.order_type, order.table_number);

                                    // Timer color coding: Green (<10m), Yellow (10-15m), Red Pulse (>15m)
                                    const isRedAlert = elapsed >= 15;
                                    const isYellowAlert = elapsed >= 10 && elapsed < 15;

                                    return (
                                        <div
                                            key={order.id}
                                            className={`rounded-3xl border-2 shadow-2xl flex flex-col justify-between overflow-hidden transition-all ${isRedAlert
                                                ? 'bg-[#261416] border-rose-500 shadow-rose-500/30 animate-pulse'
                                                : isYellowAlert
                                                    ? 'bg-[#221e16] border-amber-400/90 shadow-amber-500/20'
                                                    : order.status === 'pending'
                                                        ? 'bg-[#1e1710] border-[#f59e0b] shadow-[#f59e0b]/20'
                                                        : order.status === 'preparing'
                                                            ? 'bg-[#1f1e18] border-yellow-400/80 shadow-yellow-500/10'
                                                            : 'bg-[#131b29] border-blue-500/80 shadow-blue-500/20'
                                                }`}
                                        >
                                            {/* DISTINCT TOP BANNER BY STATUS */}
                                            <div className={`px-5 py-2.5 font-black text-xs uppercase tracking-wider flex items-center justify-between ${order.status === 'pending'
                                                ? 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-[#3f2000]'
                                                : order.status === 'preparing'
                                                    ? 'bg-yellow-500/20 text-yellow-300 border-b border-yellow-500/30'
                                                    : 'bg-blue-600/20 text-blue-300 border-b border-blue-500/30'
                                                }`}>
                                                <div className="flex items-center gap-2 font-domine">
                                                    {order.status === 'pending' && <Flame className="w-4 h-4 flex-shrink-0 animate-bounce" />}
                                                    {order.status === 'preparing' && <UtensilsCrossed className="w-4 h-4 flex-shrink-0" />}
                                                    {order.status === 'ready' && <Sparkles className="w-4 h-4 flex-shrink-0" />}
                                                    <span>
                                                        {order.status === 'pending' ? 'NEW ORDER - NEEDS GRILL' :
                                                            order.status === 'preparing' ? 'SIZZLING ON GRILL' :
                                                                'BUMPED & READY AT COUNTER'}
                                                    </span>
                                                </div>

                                                <span className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold ${isRedAlert ? 'bg-rose-500 text-white animate-pulse' :
                                                    isYellowAlert ? 'bg-amber-400 text-[#3f2000]' :
                                                        'bg-[#141416]/80 text-[#a1a1aa]'
                                                    }`}>
                                                    {elapsed} mins elapsed
                                                </span>
                                            </div>

                                            {/* CARD BODY CONTENT */}
                                            <div className="p-6 space-y-4 flex-1">
                                                {/* Ticket Sub-Header Bar */}
                                                <div className="flex items-center justify-between pb-3 border-b border-[#333338]">
                                                    <span className={`px-3.5 py-1 rounded-xl text-xs font-mono font-black ${typeBadge.className}`}>
                                                        {typeBadge.label}
                                                    </span>

                                                    <button
                                                        onClick={() => setCancelModalOrder(order)}
                                                        className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                                                        title="Cancel / Void Order"
                                                    >
                                                        <ShieldAlert className="w-3.5 h-3.5" />
                                                        <span>Void</span>
                                                    </button>
                                                </div>

                                                {/* Order ID & Customer */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="font-mono text-2xl font-black text-white tracking-wider">#{order.order_number}</span>
                                                        {order.customer_name && (
                                                            <div className="text-xs text-[#a1a1aa] font-bold">Guest: {order.customer_name}</div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Dish Items list with High-Visibility Badges */}
                                                <div className="space-y-3 pt-1">
                                                    {(order.order_items || order.items || []).map((item: any, idx: number) => {
                                                        const itemName = item.product?.name || item.name || 'Dish Item';
                                                        const itemNotes = item.notes || null;
                                                        const qty = item.quantity || item.qty || 1;

                                                        return (
                                                            <div key={idx} className="p-4 rounded-2xl bg-[#141416] border border-[#3f3f46] space-y-1.5 shadow-inner">
                                                                <div className="text-base sm:text-lg font-black text-white font-domine flex items-center gap-3">
                                                                    <span className="w-8 h-8 rounded-xl bg-[#f59e0b] text-[#3f2000] text-sm flex items-center justify-center font-mono font-black shadow-md flex-shrink-0">
                                                                        {qty}x
                                                                    </span>
                                                                    <span>{itemName}</span>
                                                                </div>
                                                                {itemNotes && (
                                                                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-sans italic">
                                                                        Note: {itemNotes}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* PRIMARY ACTION BUTTON FOOTER */}
                                            <div className="p-6 pt-0">
                                                {order.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, 'preparing')}
                                                        className="w-full px-4 py-4 sm:py-5 rounded-2xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] font-black text-sm sm:text-base uppercase tracking-wider transition-all shadow-xl shadow-[#f59e0b]/20 flex items-center justify-center gap-3 cursor-pointer active:scale-95"
                                                    >
                                                        <Flame className="w-6 h-6 flex-shrink-0 animate-bounce" />
                                                        <span className="text-center">START COOKING</span>
                                                    </button>
                                                )}

                                                {order.status === 'preparing' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, 'ready')}
                                                        className="w-full px-4 py-4 sm:py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm sm:text-base uppercase tracking-wider transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 cursor-pointer active:scale-95"
                                                    >
                                                        <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                                                        <span className="text-center">BUMP / READY</span>
                                                    </button>
                                                )}

                                                {order.status === 'ready' && (
                                                    <div className="w-full px-4 py-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2">
                                                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                                        <span>BUMPED & READY AT COUNTER</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-12 rounded-3xl bg-[#202024] border border-[#333338] text-center space-y-3">
                                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                                <h3 className="text-xl font-bold text-white font-domine">Kitchen Queue Clear!</h3>
                                <p className="text-xs text-[#a1a1aa]">No active cook tickets in status "{statusFilter}". Place an order from /order or /dine-in?table=05 to test live polling.</p>
                            </div>
                        )}

                    </main>

                    {/* SIDE PANEL: COOK SUMMARY ITEM AGGREGATOR */}
                    <aside className="w-full lg:w-80 rounded-3xl bg-[#202024] border border-[#333338] p-6 shadow-2xl space-y-4 sticky top-28">
                        <div className="flex items-center gap-2 pb-3 border-b border-[#333338]">
                            <ChefHat className="w-5 h-5 text-[#f59e0b]" />
                            <div>
                                <h3 className="font-domine font-black text-white text-sm uppercase tracking-wider">Cook Summary</h3>
                                <p className="text-[11px] text-[#a1a1aa]">Total Active Items to Grill</p>
                            </div>
                        </div>

                        <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
                            {cookSummary.length > 0 ? (
                                cookSummary.map((sumItem, idx) => (
                                    <div key={idx} className="p-3.5 rounded-2xl bg-[#141416] border border-[#3f3f46] flex items-center justify-between gap-3">
                                        <span className="text-xs font-bold text-white font-domine line-clamp-1">{sumItem.product_name}</span>
                                        <span className="px-2.5 py-1 rounded-xl bg-[#f59e0b] text-[#3f2000] font-mono font-black text-xs">
                                            {sumItem.total_quantity}x
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-xs text-[#71717a] border border-dashed border-[#3f3f46] rounded-2xl space-y-1">
                                    <div>No items currently on grill</div>
                                </div>
                            )}
                        </div>
                    </aside>

                </div>
            </div>

            {/* SECURITY MODAL FOR CANCELLED ORDERS */}
            {cancelModalOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <div className="w-full max-w-md rounded-3xl bg-[#18181b] border-2 border-rose-500/80 p-6 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-[#3f3f46]">
                            <div className="flex items-center gap-2 text-rose-400">
                                <ShieldAlert className="w-6 h-6" />
                                <h3 className="font-domine font-black text-white text-lg">Security Password Void</h3>
                            </div>
                            <button onClick={() => setCancelModalOrder(null)} className="text-[#a1a1aa] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="text-xs text-[#a1a1aa]">
                            Authorizing void cancellation for <strong className="text-white font-mono">#{cancelModalOrder.order_number}</strong>. Stock quantities will be restored and logged to audit trails.
                        </div>

                        {cancelError && (
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
                                <Lock className="w-4 h-4 flex-shrink-0" />
                                <span>{cancelError}</span>
                            </div>
                        )}

                        <form onSubmit={handleCancelOrderSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Reason for Cancellation</label>
                                <input
                                    type="text"
                                    required
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="e.g. Customer changed mind / Out of stock"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white focus:border-rose-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Manager/Employee Password</label>
                                <input
                                    type="password"
                                    required
                                    value={cancelPassword}
                                    onChange={(e) => setCancelPassword(e.target.value)}
                                    placeholder="Enter your account password"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white focus:border-rose-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setCancelModalOrder(null)}
                                    className="flex-1 py-3 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-white font-bold text-xs"
                                >
                                    Dismiss
                                </button>
                                <button
                                    type="submit"
                                    disabled={cancelLoading}
                                    className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-lg disabled:opacity-50"
                                >
                                    {cancelLoading ? 'Verifying...' : 'Authorize Void'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
