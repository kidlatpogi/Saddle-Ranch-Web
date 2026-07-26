import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Flame, Clock, CheckCircle2, ArrowLeft, RefreshCw, ChefHat, AlertCircle, Filter } from 'lucide-react';

interface KDSOrder {
    id: string;
    tableOrMode: string;
    elapsedMins: number;
    items: { qty: number; name: string; notes?: string }[];
    status: 'pending' | 'preparing' | 'ready';
    timeAgo: string;
}

export default function KitchenDisplaySystem() {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [filterStatus, setFilterStatus] = useState<string>('All');
    
    // Live KDS Kitchen Orders State
    const [kdsOrders, setKdsOrders] = useState<KDSOrder[]>([
        {
            id: 'SR-1049',
            tableOrMode: 'DINE-IN: TABLE 05',
            elapsedMins: 12,
            items: [
                { qty: 2, name: 'Sizzling Pork Sisig', notes: 'Extra crispy with raw egg & calamity slice' },
                { qty: 1, name: 'Signature Red Iced Tea Pitcher' }
            ],
            status: 'preparing',
            timeAgo: '12 mins ago'
        },
        {
            id: 'SR-1048',
            tableOrMode: 'COUNTER PICK-UP',
            elapsedMins: 8,
            items: [
                { qty: 1, name: 'Sizzling Pork T-Bone Steak', notes: 'Well done steak, extra gravy boat' },
                { qty: 1, name: 'Extra Garlic Butter Rice' }
            ],
            status: 'preparing',
            timeAgo: '8 mins ago'
        },
        {
            id: 'SR-1047',
            tableOrMode: 'FREE BULIHAN DELIVERY',
            elapsedMins: 4,
            items: [
                { qty: 1, name: 'Sizzling Bulalo Steak', notes: 'Simmering bone marrow extra hot' },
                { qty: 2, name: 'Sizzling Chicken Inasal' }
            ],
            status: 'pending',
            timeAgo: '4 mins ago'
        }
    ]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const bumpOrderReady = (orderId: string) => {
        setKdsOrders(kdsOrders.map(o => o.id === orderId ? { ...o, status: 'ready' } : o));
    };

    const activeOrders = kdsOrders.filter(o => o.status !== 'ready');
    const filteredOrders = activeOrders.filter(o => {
        if (filterStatus === 'pending') return o.status === 'pending';
        if (filterStatus === 'preparing') return o.status === 'preparing';
        return true;
    });

    return (
        <>
            <Head title="Kitchen Display System (KDS) | Saddle Ranch" />
            
            <div className="min-h-screen bg-[#141416] text-[#f4f4f5] font-sans p-6 selection:bg-[#f59e0b] selection:text-[#3f2000] flex flex-col">
                
                {/* KDS Touch Header */}
                <header className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#333338] gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Flame className="w-7 h-7 text-[#3f2000] animate-bounce" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-black text-white font-domine">Saddle Ranch KDS</h1>
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase border border-emerald-500/30">
                                    LIVE TOUCH DISPLAY
                                </span>
                            </div>
                            <p className="text-xs text-[#a1a1aa]">Dedicated Kitchen Grill & Cook Screen • <span className="font-mono text-[#fbbf24] font-bold">{currentTime}</span></p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-[#202024] border border-[#333338] px-3.5 py-2 rounded-xl text-xs">
                            <Filter className="w-4 h-4 text-[#f59e0b]" />
                            <span className="text-[#a1a1aa] font-bold">Filter:</span>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                            >
                                <option value="All" className="bg-[#18181b]">All Active Tickets ({activeOrders.length})</option>
                                <option value="pending" className="bg-[#18181b]">Pending Only</option>
                                <option value="preparing" className="bg-[#18181b]">Preparing Only</option>
                            </select>
                        </div>

                        <Link
                            href="/employee/dashboard"
                            className="px-4 py-2.5 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-white flex items-center gap-2 text-xs font-bold transition-all shadow-md"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Return to Employee Portal</span>
                        </Link>
                    </div>
                </header>

                {/* KDS Orders Grid */}
                <main className="max-w-7xl w-full mx-auto py-8 flex-1 space-y-6">
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
                            <ChefHat className="w-4 h-4 text-[#f59e0b]" />
                            <span>Active Cook Queue: <strong className="text-[#fbbf24] font-mono text-sm">{filteredOrders.length} Tickets Pending Grill</strong></span>
                        </div>

                        <span className="text-[11px] text-[#a1a1aa] font-mono">
                            Tap "BUMP ORDER" when dish is plated and ready for server pick-up
                        </span>
                    </div>

                    {filteredOrders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className={`p-6 rounded-3xl border shadow-2xl space-y-5 flex flex-col justify-between transition-all ${
                                        order.elapsedMins >= 10
                                            ? 'bg-[#251515] border-rose-500/50 shadow-rose-500/10'
                                            : 'bg-[#202024] border-[#333338]'
                                    }`}
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between pb-3 border-b border-[#333338]">
                                            <span className="px-3 py-1 rounded-full bg-[#f59e0b]/20 text-[#fbbf24] text-xs font-mono font-black border border-[#f59e0b]/30">
                                                [{order.tableOrMode}]
                                            </span>

                                            <span className={`flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                                                order.elapsedMins >= 10 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' : 'bg-amber-500/20 text-amber-400'
                                            }`}>
                                                <Clock className="w-3.5 h-3.5" />
                                                {order.elapsedMins} mins elapsed
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-base font-black text-white">{order.id}</span>
                                            <span className="text-xs text-[#a1a1aa] font-mono">{order.timeAgo}</span>
                                        </div>

                                        {/* Dish Items list */}
                                        <div className="space-y-3 pt-1">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="p-3 rounded-2xl bg-[#18181b] border border-[#3f3f46] space-y-1">
                                                    <div className="text-base font-black text-white font-domine flex items-center gap-2">
                                                        <span className="w-6 h-6 rounded-lg bg-[#f59e0b] text-[#3f2000] text-xs flex items-center justify-center font-mono font-bold">
                                                            {item.qty}x
                                                        </span>
                                                        <span>{item.name}</span>
                                                    </div>
                                                    {item.notes && (
                                                        <p className="text-xs text-amber-300 font-sans italic pl-8">
                                                            ★ Note: {item.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Large Touchable Bump Button */}
                                    <button
                                        onClick={() => bumpOrderReady(order.id)}
                                        className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 btn-bevel cursor-pointer active:scale-95"
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span>BUMP / MARK READY TO SERVE</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 rounded-3xl bg-[#202024] border border-[#333338] text-center space-y-3">
                            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                            <h3 className="text-xl font-bold text-white font-domine">Kitchen Queue Clear!</h3>
                            <p className="text-xs text-[#a1a1aa]">All pending dishes have been bumped and marked ready for service.</p>
                        </div>
                    )}

                </main>
            </div>
        </>
    );
}
