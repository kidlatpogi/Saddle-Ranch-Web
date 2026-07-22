import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    ListOrdered, 
    Utensils, 
    QrCode, 
    Image as ImageIcon, 
    Ticket, 
    Users, 
    FileText, 
    TrendingUp, 
    Flame, 
    Bell, 
    LogOut, 
    ArrowUpRight, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    Search
} from 'lucide-react';

interface KPIProps {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: React.ReactNode;
}

const KPICard: React.FC<KPIProps> = ({ title, value, change, isPositive, icon }) => (
    <div className="rounded-2xl bg-stone-900/80 border border-stone-800 p-5 flex items-start justify-between shadow-lg relative overflow-hidden group hover:border-stone-700 transition-all">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-orange-500/5 rounded-full blur-xl group-hover:bg-orange-500/10 transition-all" />
        <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">{title}</p>
            <h4 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">{value}</h4>
            <div className="flex items-center gap-1.5 mt-3 text-xs">
                <span className={`font-bold flex items-center ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {change}
                </span>
                <span className="text-stone-500">vs yesterday</span>
            </div>
        </div>
        <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/60 text-orange-400 group-hover:scale-110 transition-transform">
            {icon}
        </div>
    </div>
);

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const sidebarLinks = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'orders', label: 'Orders Queue', icon: <ListOrdered className="w-4 h-4" />, badge: '6' },
        { id: 'products', label: 'Products & Stock', icon: <Utensils className="w-4 h-4" /> },
        { id: 'tables', label: 'Tables & QR Generator', icon: <QrCode className="w-4 h-4" /> },
        { id: 'banners', label: 'Promo Banners', icon: <ImageIcon className="w-4 h-4" /> },
        { id: 'vouchers', label: 'Vouchers', icon: <Ticket className="w-4 h-4" /> },
        { id: 'employees', label: 'Employees', icon: <Users className="w-4 h-4" /> },
        { id: 'audit', label: 'Audit Logs', icon: <FileText className="w-4 h-4" /> },
        { id: 'sales', label: 'Sales & Revenue', icon: <TrendingUp className="w-4 h-4" /> },
    ];

    return (
        <>
            <Head title="Admin Dashboard | Saddle Ranch" />

            <div className="min-h-screen bg-stone-950 text-stone-100 flex font-sans selection:bg-orange-500 selection:text-white">
                {/* Dark Sidebar */}
                <aside className="w-64 bg-stone-900 border-r border-stone-800 flex flex-col flex-shrink-0 hidden md:flex">
                    <div className="h-20 px-6 flex items-center gap-3 border-b border-stone-800/80">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Flame className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="font-black text-base tracking-tight text-white block">SADDLE RANCH</span>
                            <span className="text-[10px] tracking-widest uppercase text-orange-500 font-bold block">Admin Portal</span>
                        </div>
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto space-y-1">
                        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-500">Core Management</div>
                        {sidebarLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => setActiveTab(link.id)}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                    activeTab === link.id
                                        ? 'bg-gradient-to-r from-orange-500/20 to-transparent border-l-2 border-orange-500 text-white shadow-sm'
                                        : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={activeTab === link.id ? 'text-orange-400' : 'text-stone-500'}>
                                        {link.icon}
                                    </span>
                                    <span>{link.label}</span>
                                </div>
                                {link.badge && (
                                    <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold">
                                        {link.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 border-t border-stone-800">
                        <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 flex items-center justify-between">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                                <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-xs font-bold text-orange-400">
                                    SA
                                </div>
                                <div className="truncate">
                                    <span className="block text-xs font-bold text-white truncate">Saddle Ranch Admin</span>
                                    <span className="block text-[10px] text-stone-500">Principal Administrator</span>
                                </div>
                            </div>
                            <Link href="/logout" method="post" as="button" className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-colors">
                                <LogOut className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-w-0">
                    {/* Top Header */}
                    <header className="h-20 bg-stone-900/50 border-b border-stone-800 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-bold text-white tracking-tight capitalize">
                                {sidebarLinks.find(l => l.id === activeTab)?.label ?? 'Dashboard'}
                            </h2>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wide uppercase flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                Live TiDB / Laravel Sync
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative hidden sm:block">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                                <input
                                    type="text"
                                    placeholder="Search order number or product..."
                                    className="w-64 pl-9 pr-4 py-1.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-orange-500 transition-colors"
                                />
                            </div>
                            <button className="p-2 rounded-xl bg-stone-800 border border-stone-700/60 text-stone-300 hover:text-white relative">
                                <Bell className="w-4 h-4" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            </button>
                        </div>
                    </header>

                    {/* Dashboard Body */}
                    <div className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto">
                        {/* KPI Cards Section */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">
                                Philippine Peso (₱) Revenue & Operational Metrics
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                <KPICard
                                    title="Today's Sizzling Revenue"
                                    value="₱28,450.00"
                                    change="+18.4%"
                                    isPositive={true}
                                    icon={<TrendingUp className="w-5 h-5" />}
                                />
                                <KPICard
                                    title="Pending & Kitchen Orders"
                                    value="14 Orders"
                                    change="-2.1%"
                                    isPositive={false}
                                    icon={<ListOrdered className="w-5 h-5" />}
                                />
                                <KPICard
                                    title="Active Menu Products"
                                    value="24 Items"
                                    change="+4 Items"
                                    isPositive={true}
                                    icon={<Utensils className="w-5 h-5" />}
                                />
                                <KPICard
                                    title="Active Promo Vouchers"
                                    value="3 Codes"
                                    change="100% Active"
                                    isPositive={true}
                                    icon={<Ticket className="w-5 h-5" />}
                                />
                            </div>
                        </div>

                        {/* Recent Activity / Live Orders Queue Preview Table */}
                        <div className="rounded-2xl bg-stone-900/80 border border-stone-800 overflow-hidden shadow-xl">
                            <div className="p-6 border-b border-stone-800 flex items-center justify-between">
                                <div>
                                    <h4 className="text-base font-bold text-white">Live Sizzling Orders Queue</h4>
                                    <p className="text-xs text-stone-400 mt-0.5">Real-time status updates across Dine-In, Pick-Up, and Delivery.</p>
                                </div>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold hover:bg-orange-500 hover:text-white transition-all flex items-center gap-1.5"
                                >
                                    <span>Manage Full Queue</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-stone-950/60 text-stone-400 uppercase tracking-wider font-semibold border-b border-stone-800">
                                        <tr>
                                            <th className="py-3.5 px-6">Order #</th>
                                            <th className="py-3.5 px-6">Mode / Table</th>
                                            <th className="py-3.5 px-6">Customer</th>
                                            <th className="py-3.5 px-6">Total Amount (₱)</th>
                                            <th className="py-3.5 px-6">Payment</th>
                                            <th className="py-3.5 px-6">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-800 text-stone-200">
                                        {[
                                            { id: 'SR-1049', type: 'Dine-In', table: 'Table 05', customer: 'Seated Guest', amount: '₱640.00', payment: 'GCash', status: 'preparing', statusColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
                                            { id: 'SR-1048', type: 'Pick-Up', table: 'Counter', customer: 'Marco Reyes', amount: '₱460.00', payment: 'Cash', status: 'ready', statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
                                            { id: 'SR-1047', type: 'Delivery', table: 'Bulihan Area', customer: 'Elena Cruz', amount: '₱890.00', payment: 'Maya', status: 'pending', statusColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
                                            { id: 'SR-1046', type: 'Dine-In', table: 'Table 02', customer: 'Seated Guest', amount: '₱360.00', payment: 'GCash', status: 'completed', statusColor: 'bg-stone-500/10 text-stone-400 border-stone-500/30' },
                                        ].map((row, index) => (
                                            <tr key={index} className="hover:bg-stone-800/40 transition-colors">
                                                <td className="py-4 px-6 font-mono font-bold text-white">{row.id}</td>
                                                <td className="py-4 px-6">
                                                    <span className="font-semibold text-white">{row.type}</span>
                                                    <span className="block text-[10px] text-stone-400">{row.table}</span>
                                                </td>
                                                <td className="py-4 px-6 text-stone-300">{row.customer}</td>
                                                <td className="py-4 px-6 font-bold text-amber-400">{row.amount}</td>
                                                <td className="py-4 px-6">
                                                    <span className="px-2 py-1 rounded-md bg-stone-800 text-stone-300 font-medium">
                                                        {row.payment}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${row.statusColor}`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
