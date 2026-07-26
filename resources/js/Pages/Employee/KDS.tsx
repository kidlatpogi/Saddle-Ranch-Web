import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Flame, 
    Clock, 
    CheckCircle2, 
    ArrowLeft, 
    RefreshCw, 
    ChefHat, 
    AlertCircle, 
    Filter, 
    Volume2, 
    VolumeX,
    Bell,
    Check
} from 'lucide-react';

interface KDSOrder {
    id: string;
    tableOrMode: string;
    elapsedMins: number;
    items: { qty: number; name: string; notes?: string }[];
    status: 'pending' | 'preparing' | 'ready' | 'completed';
    timeAgo: string;
    customer: string;
}

export default function KitchenDisplaySystem() {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
    
    // Live KDS Kitchen Orders State
    const [kdsOrders, setKdsOrders] = useState<KDSOrder[]>([
        {
            id: 'SR-1049',
            tableOrMode: 'DINE-IN: TABLE 05',
            customer: 'Juan Dela Cruz',
            elapsedMins: 12,
            items: [
                { qty: 2, name: 'Sizzling Pork Sisig', notes: 'Extra crispy with raw egg & calamansi' },
                { qty: 1, name: 'Signature Red Iced Tea Pitcher' }
            ],
            status: 'preparing',
            timeAgo: '12 mins ago'
        },
        {
            id: 'SR-1048',
            tableOrMode: 'COUNTER PICK-UP',
            customer: 'Marco Reyes',
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
            customer: 'Elena Cruz',
            elapsedMins: 4,
            items: [
                { qty: 1, name: 'Sizzling Bulalo Steak', notes: 'Simmering bone marrow extra hot' },
                { qty: 2, name: 'Sizzling Chicken Inasal' }
            ],
            status: 'pending',
            timeAgo: '4 mins ago'
        }
    ]);

    // Web Audio API Chime Synthesizer
    const playKitchenChimeSound = () => {
        try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();

            // High bell tone 1 (A5 880Hz)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(880, ctx.currentTime);
            gain1.gain.setValueAtTime(0.3, ctx.currentTime);
            gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start();
            osc1.stop(ctx.currentTime + 0.5);

            // High bell chime tone 2 (E6 1320Hz)
            setTimeout(() => {
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(1320, ctx.currentTime);
                gain2.gain.setValueAtTime(0.3, ctx.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.start();
                osc2.stop(ctx.currentTime + 0.6);
            }, 120);
        } catch (e) {
            console.error('Audio play error:', e);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Play chime sound when pending tickets exist
    useEffect(() => {
        const pendingCount = kdsOrders.filter(o => o.status === 'pending').length;
        if (pendingCount > 0 && soundEnabled) {
            playKitchenChimeSound();
        }
    }, [kdsOrders.length, soundEnabled]);

    const updateKdsStatus = (orderId: string, newStatus: KDSOrder['status']) => {
        setKdsOrders(kdsOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };

    const filteredOrders = kdsOrders.filter(o => {
        if (statusFilter !== 'All' && o.status !== statusFilter) return false;
        return true;
    });

    const pendingCount = kdsOrders.filter(o => o.status === 'pending').length;
    const preparingCount = kdsOrders.filter(o => o.status === 'preparing').length;
    const readyCount = kdsOrders.filter(o => o.status === 'ready').length;

    return (
        <>
            <Head title="Kitchen Display System (KDS) | Saddle Ranch" />
            
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
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase border border-emerald-500/30">
                                    TOUCH SCREEN
                                </span>
                            </div>
                            <p className="text-xs text-[#a1a1aa]">Dedicated Grill & Kitchen Display • <span className="font-mono text-[#fbbf24] font-bold">{currentTime}</span></p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Audio Chime Trigger & Sound Toggle */}
                        <button
                            onClick={playKitchenChimeSound}
                            className="px-3.5 py-2 rounded-xl bg-[#202024] border border-[#3f3f46] text-[#fbbf24] hover:bg-[#27272a] flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm"
                            title="Test Kitchen Bell Chime Sound"
                        >
                            <Bell className="w-4 h-4 text-[#f59e0b] animate-bounce" />
                            <span className="hidden sm:inline">Test Bell Chime</span>
                        </button>

                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className={`p-2.5 rounded-xl border transition-all ${
                                soundEnabled ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
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

                {/* KDS Main Container - Expanded Width for Laptop/Desktop & Tablets */}
                <main className="max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 space-y-6">
                    
                    {/* PIPELINE FILTER CHIPS IDENTICAL TO ORDERS QUEUE */}
                    <div className="p-3 rounded-2xl bg-[#202024] border border-[#333338] flex flex-wrap items-center justify-between gap-3 shadow-lg">
                        <div className="flex items-center gap-2 overflow-x-auto">
                            {[
                                { id: 'All', label: 'All Active Tickets', count: kdsOrders.length, color: 'text-white' },
                                { id: 'pending', label: '1. Pending Kitchen', count: pendingCount, color: 'text-amber-400' },
                                { id: 'preparing', label: '2. Preparing (On Grill)', count: preparingCount, color: 'text-amber-300' },
                                { id: 'ready', label: '3. Ready to Serve', count: readyCount, color: 'text-blue-400' },
                            ].map((chip) => (
                                <button
                                    key={chip.id}
                                    onClick={() => setStatusFilter(chip.id)}
                                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                                        statusFilter === chip.id
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
                            <span>Showing <strong className="text-[#fbbf24] font-mono text-sm">{filteredOrders.length}</strong> active tickets</span>
                        </div>
                    </div>

                    {/* KDS CARDS GRID RESPONSIVE FOR TABLET, LAPTOP, DESKTOP */}
                    {filteredOrders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className={`p-6 sm:p-7 rounded-3xl border shadow-2xl space-y-5 flex flex-col justify-between transition-all ${
                                        order.status === 'pending'
                                            ? 'bg-[#202024] border-amber-500/60 shadow-amber-500/10'
                                            : order.status === 'preparing'
                                            ? 'bg-[#202024] border-yellow-500/50'
                                            : 'bg-[#1d2636] border-blue-500/60 shadow-blue-500/10'
                                    }`}
                                >
                                    <div className="space-y-4">
                                        {/* Ticket Header Bar */}
                                        <div className="flex items-center justify-between pb-3 border-b border-[#333338]">
                                            <span className="px-3.5 py-1 rounded-full bg-[#18181b] text-[#fbbf24] text-xs font-mono font-black border border-[#3f3f46]">
                                                [{order.tableOrMode}]
                                            </span>

                                            <span className={`flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full ${
                                                order.elapsedMins >= 10 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' : 'bg-amber-500/20 text-amber-400'
                                            }`}>
                                                <Clock className="w-3.5 h-3.5" />
                                                {order.elapsedMins} mins elapsed
                                            </span>
                                        </div>

                                        {/* Order ID & Customer */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="font-mono text-xl font-black text-white tracking-wider">{order.id}</span>
                                                <div className="text-xs text-[#a1a1aa] font-bold">Guest: {order.customer}</div>
                                            </div>
                                            <span className="text-xs text-[#a1a1aa] font-mono">{order.timeAgo}</span>
                                        </div>

                                        {/* Dish Items list */}
                                        <div className="space-y-2.5 pt-1">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="p-3.5 rounded-2xl bg-[#141416] border border-[#3f3f46] space-y-1">
                                                    <div className="text-base font-black text-white font-domine flex items-center gap-2.5">
                                                        <span className="w-7 h-7 rounded-xl bg-[#f59e0b] text-[#3f2000] text-xs flex items-center justify-center font-mono font-black">
                                                            {item.qty}x
                                                        </span>
                                                        <span>{item.name}</span>
                                                    </div>
                                                    {item.notes && (
                                                        <p className="text-xs text-amber-300 font-sans italic pl-9">
                                                            ★ Note: {item.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CLEAN HIGH-CONTRAST BIG ACTION BUTTONS */}
                                    <div className="pt-2">
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => updateKdsStatus(order.id, 'preparing')}
                                                className="w-full px-4 py-4 sm:py-5 rounded-2xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] font-black text-sm sm:text-base uppercase tracking-wider transition-all shadow-xl shadow-[#f59e0b]/20 flex items-center justify-center gap-3 cursor-pointer active:scale-95"
                                            >
                                                <Flame className="w-6 h-6 flex-shrink-0" />
                                                <span className="text-center">START PREPARING (COOK ON GRILL)</span>
                                            </button>
                                        )}

                                        {order.status === 'preparing' && (
                                            <button
                                                onClick={() => updateKdsStatus(order.id, 'ready')}
                                                className="w-full px-4 py-4 sm:py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm sm:text-base uppercase tracking-wider transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 cursor-pointer active:scale-95"
                                            >
                                                <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                                                <span className="text-center">BUMP / MARK READY TO SERVE</span>
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
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 rounded-3xl bg-[#202024] border border-[#333338] text-center space-y-3">
                            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                            <h3 className="text-xl font-bold text-white font-domine">Kitchen Queue Clear!</h3>
                            <p className="text-xs text-[#a1a1aa]">No active cook tickets in status "{statusFilter}". Tap "Test Bell Chime" or add a walk-in order to test sound.</p>
                        </div>
                    )}

                </main>
            </div>
        </>
    );
}
