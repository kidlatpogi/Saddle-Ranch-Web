import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ListOrdered, Utensils, TrendingUp, LogOut } from 'lucide-react';

export default function EmployeeDashboard() {
    return (
        <>
            <Head title="Employee Portal | Saddle Ranch" />
            <div className="min-h-screen bg-stone-950 text-stone-100 p-6 font-sans">
                <header className="max-w-7xl mx-auto flex items-center justify-between pb-6 border-b border-stone-800">
                    <div>
                        <h1 className="text-2xl font-black text-white">Saddle Ranch Employee Portal</h1>
                        <p className="text-xs text-stone-400">Cashier & Front-of-House Order Queue View</p>
                    </div>
                    <Link href="/logout" method="post" as="button" className="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-rose-400 flex items-center gap-2 text-xs font-bold">
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </Link>
                </header>
                <main className="max-w-7xl mx-auto py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800">
                        <ListOrdered className="w-6 h-6 text-orange-400 mb-3" />
                        <h3 className="text-lg font-bold text-white">Order Queue (Full Access)</h3>
                        <p className="text-xs text-stone-400 mt-1">Manage pending, preparing, ready, and completed orders.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800">
                        <Utensils className="w-6 h-6 text-amber-400 mb-3" />
                        <h3 className="text-lg font-bold text-white">Products & Menu (Read-Only)</h3>
                        <p className="text-xs text-stone-400 mt-1">View price, image, and stock count for active items.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800">
                        <TrendingUp className="w-6 h-6 text-emerald-400 mb-3" />
                        <h3 className="text-lg font-bold text-white">Shift Sales Summary</h3>
                        <p className="text-xs text-stone-400 mt-1">Basic read-only shift revenue overview.</p>
                    </div>
                </main>
            </div>
        </>
    );
}
