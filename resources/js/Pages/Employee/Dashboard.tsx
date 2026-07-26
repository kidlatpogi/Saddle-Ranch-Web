import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    ListOrdered, 
    Utensils, 
    TrendingUp, 
    LogOut, 
    Flame, 
    Search, 
    Filter, 
    CheckCircle2, 
    Clock, 
    ChefHat, 
    ArrowUpRight,
    ShoppingBag
} from 'lucide-react';

interface OrderItem {
    id: string;
    type: 'Dine-In' | 'Pick-Up' | 'Delivery';
    location: string;
    customer: string;
    phone: string;
    amount: number;
    payment: string;
    status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
    time: string;
    itemsCount: number;
    itemsSummary: string;
}

interface ProductItem {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    isActive: boolean;
    image: string;
}

export default function EmployeeDashboard() {
    const [activeTab, setActiveTab] = useState<'queue' | 'menu' | 'sales'>('queue');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // Live State Orders Dataset
    const [orders, setOrders] = useState<OrderItem[]>([
        { id: 'SR-1049', type: 'Dine-In', location: 'Table 05', customer: 'Juan Dela Cruz', phone: '09171234567', amount: 640, payment: 'GCash', status: 'preparing', time: '10 mins ago', itemsCount: 3, itemsSummary: '2x Sizzling Pork Sisig, 1x Red Iced Tea Pitcher' },
        { id: 'SR-1048', type: 'Pick-Up', location: 'Counter', customer: 'Marco Reyes', phone: '09189876543', amount: 460, payment: 'Cash (Pick-Up)', status: 'ready', time: '25 mins ago', itemsCount: 2, itemsSummary: '1x Sizzling T-Bone Steak, 1x Extra Garlic Rice' },
        { id: 'SR-1047', type: 'Delivery', location: 'Bulihan Area (Anahaw II)', customer: 'Elena Cruz', phone: '09223334444', amount: 890, payment: 'Cash on Delivery', status: 'pending', time: '30 mins ago', itemsCount: 4, itemsSummary: '1x Sizzling Bulalo Steak, 2x Chicken Inasal, 1x Red Iced Tea' },
        { id: 'SR-1046', type: 'Dine-In', location: 'Table 02', customer: 'Seated Guest', phone: '09175556666', amount: 360, payment: 'GCash', status: 'completed', time: '1 hour ago', itemsCount: 2, itemsSummary: '2x Sizzling Pork Sisig' },
    ]);

    // Live State Products Dataset
    const [products] = useState<ProductItem[]>([
        { id: 1, name: 'Sizzling Pork Sisig', category: 'Authentic Filipino Cuisine', price: 180, stock: 50, isActive: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t' },
        { id: 2, name: 'Sizzling Pork T-Bone Steak', category: 'Barkada Platters', price: 280, stock: 30, isActive: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASVSO6N3lzIbdlCDT85viSxOZiQKjWADlA5k7ymludjTdSCB7tqV0bZvXRba3-L4gemLyqy9PxmqnYMBnSsxb5yfI_XM-qajS5ZEnS1Am8OBu5uN8_smBFlDdy4xR0UNE8jDFJP8vNSRQcqqDSG4p-oDij5kCvWALcyBZVeuA1QdnqC9a6I5s9l2ba3Zjfe0xSPjMr0jLCAB1z-oJS5xBL9meeUeFsmiMgjQ96VoXotgHsy3Jl3d9NQIv1liJsKeu_sJec2rrkNziY' },
        { id: 3, name: 'Sizzling Bulalo Steak', category: 'Authentic Filipino Cuisine', price: 450, stock: 15, isActive: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCatSLXJ-mynm_AwjLXsdG9xKbMwziehShgiNtyXaX2NZEeZFhSXaTmHMgLuACAitSC3WZ0g_9lSTavvnqO4eKFlaC0pnnA9OngEMtRicl0vfSF2_t4WqzxTKxW-H-X0i_tppiClzEOZ-fAuu1ezCbRVOcdVdwZHokttY1ATDIO4BuA185dwrm0QDuPpYjQ7qD9ybH5bl0WPn1wHJ3S5pB6JuCOoocWTfZ95cB0Lfqx1KbjbUwqGJxkhwxmqypEJta64yq1PajT3oWC' },
        { id: 4, name: 'Sizzling Chicken Inasal', category: 'Sizzling Rice Meals', price: 220, stock: 40, isActive: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6QEUONokTX7mi1M1Wrie14cxeoNfVq5HyIS1sLOLWKbzZyh6OfegCBaNeH6E7uS37ugVc6jjmILNzIrmvE0tpXkOBCDP29HO1WZL69MsOd6lpwp4oX6ezfDjuAsLMCu57vBpiHDupWu3yDATuk2k_HgpQMi23Y7mifgQKqPJhc0GqDXCCk1tPooIkFyBCXPiESBHm8HKF8cp1ctvD0RZ39YNVxKG_2cPaPyfryUGBbaoIHhqqhq5R9BflPtI6jMfzsP3W6QStlttx' },
        { id: 5, name: 'Signature Red Iced Tea (1L)', category: 'Drinks & Extra Rice', price: 95, stock: 100, isActive: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl' },
    ]);

    const updateOrderStatus = (orderId: string, newStatus: OrderItem['status']) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };

    const filteredOrders = orders.filter(o => {
        if (statusFilter !== 'All' && o.status !== statusFilter) return false;
        if (searchQuery && !o.id.toLowerCase().includes(searchQuery.toLowerCase()) && !o.customer.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const filteredProducts = products.filter(p => {
        if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const shiftRevenue = orders.filter(o => o.status === 'completed' || o.status === 'ready' || o.status === 'preparing').reduce((acc, o) => acc + o.amount, 0);

    return (
        <>
            <Head title="Employee Portal | Saddle Ranch" />
            <div className="min-h-screen bg-[#141416] text-[#f4f4f5] font-sans selection:bg-[#f59e0b] selection:text-[#3f2000] flex flex-col">
                
                {/* Header */}
                <header className="h-20 bg-[#1f1f23] border-b border-[#333338] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#b45309] flex items-center justify-center shadow-md shadow-[#f59e0b]/20">
                            <Flame className="w-6 h-6 text-[#3f2000]" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black font-domine text-[#fbbf24] tracking-tight">Saddle Ranch Employee Portal</h1>
                            <p className="text-xs text-[#a1a1aa]">Staff Cashier & Front-of-House Order Terminal</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/employee/kitchen"
                            className="px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md btn-bevel"
                        >
                            <ChefHat className="w-4 h-4" />
                            <span>Kitchen KDS Terminal</span>
                        </Link>

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="px-3.5 py-2 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-rose-400 flex items-center gap-1.5 text-xs font-bold transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </Link>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-6">
                    
                    {/* Navigation Tabs Bar */}
                    <div className="p-2 rounded-2xl bg-[#202024] border border-[#333338] flex flex-wrap items-center justify-between gap-4 shadow-lg">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab('queue')}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                                    activeTab === 'queue' ? 'bg-[#f59e0b] text-[#3f2000] font-black shadow-md btn-bevel' : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]'
                                }`}
                            >
                                <ListOrdered className="w-4 h-4" />
                                <span>Orders Queue ({orders.length})</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('menu')}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                                    activeTab === 'menu' ? 'bg-[#f59e0b] text-[#3f2000] font-black shadow-md btn-bevel' : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]'
                                }`}
                            >
                                <Utensils className="w-4 h-4" />
                                <span>Menu & Stock Availability</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('sales')}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                                    activeTab === 'sales' ? 'bg-[#f59e0b] text-[#3f2000] font-black shadow-md btn-bevel' : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]'
                                }`}
                            >
                                <TrendingUp className="w-4 h-4" />
                                <span>Shift Sales Summary</span>
                            </button>
                        </div>

                        {/* Search Control */}
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search order ID or items..."
                                className="w-56 pl-9 pr-4 py-1.5 bg-[#18181b] border border-[#3f3f46] rounded-xl text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#f59e0b]"
                            />
                        </div>
                    </div>

                    {/* TAB 1: INTERACTIVE ORDER QUEUE */}
                    {activeTab === 'queue' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-[#a1a1aa]">Filter Status:</span>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="bg-[#202024] border border-[#333338] text-xs font-bold text-[#fbbf24] px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
                                    >
                                        <option value="All" className="bg-[#18181b]">All Statuses</option>
                                        <option value="pending" className="bg-[#18181b]">Pending Kitchen</option>
                                        <option value="preparing" className="bg-[#18181b]">Preparing</option>
                                        <option value="ready" className="bg-[#18181b]">Ready for Serve/Pick-Up</option>
                                        <option value="completed" className="bg-[#18181b]">Completed</option>
                                    </select>
                                </div>

                                <div className="text-xs text-[#a1a1aa]">
                                    Showing <strong className="text-white font-mono">{filteredOrders.length}</strong> live orders
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredOrders.map((o) => (
                                    <div key={o.id} className="p-6 rounded-3xl bg-[#202024] border border-[#333338] shadow-xl space-y-4 flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between pb-3 border-b border-[#333338]">
                                                <div>
                                                    <span className="font-mono text-sm font-black text-white">{o.id}</span>
                                                    <span className="text-xs font-bold text-[#fbbf24] ml-2 font-mono">({o.type} - {o.location})</span>
                                                </div>

                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                                    o.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                    o.status === 'ready' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                                    o.status === 'preparing' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                    'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                                }`}>
                                                    {o.status}
                                                </span>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="text-xs font-bold text-white flex justify-between">
                                                    <span>Customer: {o.customer}</span>
                                                    <span className="text-[#a1a1aa] text-[11px] font-mono">{o.phone}</span>
                                                </div>
                                                <div className="text-xs text-[#a1a1aa] font-mono p-2.5 rounded-xl bg-[#18181b] border border-[#3f3f46]">
                                                    {o.itemsSummary}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-[#333338] flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-[#a1a1aa]">Total Amount ({o.payment}):</div>
                                                <div className="font-mono font-black text-lg text-amber-400">₱{o.amount.toFixed(2)}</div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {o.status === 'pending' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(o.id, 'preparing')}
                                                        className="px-4 py-2 rounded-xl bg-amber-500 text-[#3f2000] font-black text-xs hover:bg-[#fbbf24] transition-all btn-bevel"
                                                    >
                                                        Start Preparing
                                                    </button>
                                                )}
                                                {o.status === 'preparing' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(o.id, 'ready')}
                                                        className="px-4 py-2 rounded-xl bg-blue-500 text-white font-black text-xs hover:bg-blue-400 transition-all btn-bevel"
                                                    >
                                                        Mark Ready
                                                    </button>
                                                )}
                                                {o.status === 'ready' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(o.id, 'completed')}
                                                        className="px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-black text-xs hover:bg-emerald-400 transition-all btn-bevel"
                                                    >
                                                        Complete Order
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 2: MENU & STOCK AVAILABILITY */}
                    {activeTab === 'menu' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#a1a1aa]">Category:</span>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="bg-[#202024] border border-[#333338] text-xs font-bold text-[#fbbf24] px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
                                >
                                    <option value="All" className="bg-[#18181b]">All Categories</option>
                                    <option value="Sizzling Rice Meals" className="bg-[#18181b]">Sizzling Rice Meals</option>
                                    <option value="Authentic Filipino Cuisine" className="bg-[#18181b]">Authentic Filipino Cuisine</option>
                                    <option value="Barkada Platters" className="bg-[#18181b]">Barkada Platters</option>
                                    <option value="Drinks & Extra Rice" className="bg-[#18181b]">Drinks & Extra Rice</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {filteredProducts.map((p) => (
                                    <div key={p.id} className="p-5 rounded-3xl bg-[#202024] border border-[#333338] shadow-lg space-y-3">
                                        <div className="relative h-36 w-full rounded-2xl overflow-hidden border border-[#3f3f46] bg-[#18181b]">
                                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                            <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-[#18181b]/90 text-[#fbbf24] font-mono font-black text-xs border border-[#f59e0b]/30">
                                                ₱ {p.price.toFixed(2)}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider block">{p.category}</span>
                                            <h4 className="text-sm font-bold text-white font-domine">{p.name}</h4>
                                        </div>

                                        <div className="pt-2 border-t border-[#333338] flex items-center justify-between text-xs font-mono">
                                            <span className="text-[#a1a1aa]">Stock Level: <strong className="text-white">{p.stock}</strong></span>
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                                                In Stock
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 3: SHIFT SALES SUMMARY */}
                    {activeTab === 'sales' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 rounded-3xl bg-[#202024] border border-[#333338] shadow-lg space-y-2">
                                    <span className="text-xs font-bold text-[#a1a1aa] uppercase">Current Shift Gross Sales</span>
                                    <div className="text-3xl font-mono font-black text-[#fbbf24]">₱ {shiftRevenue.toFixed(2)}</div>
                                    <p className="text-[11px] text-emerald-400 font-bold">Shift Active</p>
                                </div>

                                <div className="p-6 rounded-3xl bg-[#202024] border border-[#333338] shadow-lg space-y-2">
                                    <span className="text-xs font-bold text-[#a1a1aa] uppercase">Total Shift Orders</span>
                                    <div className="text-3xl font-mono font-black text-white">{orders.length} Orders</div>
                                    <p className="text-[11px] text-[#a1a1aa]">Processed today</p>
                                </div>

                                <div className="p-6 rounded-3xl bg-[#202024] border border-[#333338] shadow-lg space-y-2">
                                    <span className="text-xs font-bold text-[#a1a1aa] uppercase">Average Order Value</span>
                                    <div className="text-3xl font-mono font-black text-white">₱ {(shiftRevenue / Math.max(1, orders.length)).toFixed(2)}</div>
                                    <p className="text-[11px] text-emerald-400 font-bold">Good throughput</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}
