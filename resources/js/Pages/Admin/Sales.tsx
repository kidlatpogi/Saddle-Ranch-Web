import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    TrendingUp, 
    DollarSign, 
    ShoppingBag, 
    ArrowLeft, 
    BarChart3, 
    PieChart, 
    CheckCircle2, 
    RotateCcw,
    UtensilsCrossed
} from 'lucide-react';

interface Metrics {
    totalRevenue: number;
    cancelledRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
}

interface FulfillmentItem {
    order_type: string;
    total_orders: number;
    total_revenue: number;
}

interface TopProduct {
    product_name: string;
    total_qty: number;
    total_sales: number;
}

interface DailyTrend {
    date: string;
    revenue: number;
}

interface SalesProps {
    metrics: Metrics;
    fulfillmentBreakdown: FulfillmentItem[];
    topSellingProducts: TopProduct[];
    dailyTrends: DailyTrend[];
}

export default function AdminSales({ metrics, fulfillmentBreakdown = [], topSellingProducts = [], dailyTrends = [] }: SalesProps) {
    const safeMetrics = metrics || { totalRevenue: 0, cancelledRevenue: 0, totalOrders: 0, avgOrderValue: 0 };

    return (
        <>
            <Head title="Admin Sales Analytics & Revenue | Saddle Ranch" />

            <div className="min-h-screen bg-[#141416] text-[#f4f4f5] font-sans flex flex-col">
                <header className="h-20 bg-[#1f1f23] border-b border-[#333338] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#b45309] flex items-center justify-center shadow-md shadow-[#f59e0b]/20">
                            <TrendingUp className="w-6 h-6 text-[#3f2000]" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black font-domine text-white tracking-tight">Financial Sales & Revenue Analytics</h1>
                            <p className="text-xs text-[#a1a1aa]">Executive Reports & Fulfillment Performance</p>
                        </div>
                    </div>

                    <Link
                        href="/admin/dashboard"
                        className="px-4 py-2 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-white flex items-center gap-1.5 text-xs font-bold transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Return to Dashboard</span>
                    </Link>
                </header>

                <main className="max-w-[1600px] w-full mx-auto p-6 space-y-6 flex-1">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-6 rounded-3xl bg-[#202024] border border-[#333338] shadow-xl space-y-2">
                            <span className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">Total Completed Revenue</span>
                            <div className="text-3xl font-mono font-black text-[#fbbf24]">₱ {Number(safeMetrics.totalRevenue).toFixed(2)}</div>
                            <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Gross Fulfilled Sales
                            </p>
                        </div>

                        <div className="p-6 rounded-3xl bg-[#202024] border border-[#333338] shadow-xl space-y-2">
                            <span className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">Average Order Value (AOV)</span>
                            <div className="text-3xl font-mono font-black text-white">₱ {Number(safeMetrics.avgOrderValue).toFixed(2)}</div>
                            <p className="text-[11px] text-[#a1a1aa]">Per Customer Ticket</p>
                        </div>

                        <div className="p-6 rounded-3xl bg-[#202024] border border-[#333338] shadow-xl space-y-2">
                            <span className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">Total Orders Processed</span>
                            <div className="text-3xl font-mono font-black text-white">{safeMetrics.totalOrders}</div>
                            <p className="text-[11px] text-[#a1a1aa]">All fulfillment modes</p>
                        </div>

                        <div className="p-6 rounded-3xl bg-[#202024] border border-[#333338] shadow-xl space-y-2">
                            <span className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">Void / Cancelled Value</span>
                            <div className="text-3xl font-mono font-black text-rose-400">₱ {Number(safeMetrics.cancelledRevenue).toFixed(2)}</div>
                            <p className="text-[11px] text-rose-400 font-bold">Restored Stock Quantity</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Fulfillment Breakdown */}
                        <div className="p-6 rounded-3xl bg-[#202024] border border-[#333338] shadow-xl space-y-4">
                            <div className="flex items-center gap-2 pb-3 border-b border-[#333338]">
                                <PieChart className="w-5 h-5 text-[#f59e0b]" />
                                <h3 className="font-domine font-black text-white text-base">Fulfillment Mode Breakdown</h3>
                            </div>

                            <div className="space-y-3">
                                {fulfillmentBreakdown.map((item, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-[#141416] border border-[#3f3f46] flex items-center justify-between font-mono text-xs">
                                        <div>
                                            <div className="font-bold text-white uppercase">{item.order_type.replace('_', ' ')}</div>
                                            <div className="text-[#a1a1aa]">{item.total_orders} total orders</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-[#fbbf24] text-sm">₱ {Number(item.total_revenue).toFixed(2)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Selling Products */}
                        <div className="p-6 rounded-3xl bg-[#202024] border border-[#333338] shadow-xl space-y-4">
                            <div className="flex items-center gap-2 pb-3 border-b border-[#333338]">
                                <UtensilsCrossed className="w-5 h-5 text-[#f59e0b]" />
                                <h3 className="font-domine font-black text-white text-base">Top Selling Menu Items</h3>
                            </div>

                            <div className="space-y-3">
                                {topSellingProducts.map((p, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-[#141416] border border-[#3f3f46] flex items-center justify-between font-mono text-xs">
                                        <div className="flex items-center gap-3">
                                            <span className="w-7 h-7 rounded-xl bg-[#f59e0b] text-[#3f2000] font-black flex items-center justify-center text-xs">
                                                #{idx + 1}
                                            </span>
                                            <div>
                                                <div className="font-bold text-white font-domine text-sm">{p.product_name}</div>
                                                <div className="text-[#a1a1aa]">{p.total_qty} units sold</div>
                                            </div>
                                        </div>
                                        <div className="font-black text-emerald-400 text-sm">
                                            ₱ {Number(p.total_sales).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
