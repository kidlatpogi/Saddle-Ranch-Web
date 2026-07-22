import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Flame, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function KitchenDisplaySystem() {
    return (
        <>
            <Head title="Kitchen Display System (KDS) | Saddle Ranch" />
            <div className="min-h-screen bg-stone-950 text-stone-100 p-6 font-sans">
                <header className="max-w-7xl mx-auto flex items-center justify-between pb-6 border-b border-stone-800">
                    <div className="flex items-center gap-3">
                        <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
                        <div>
                            <h1 className="text-2xl font-black text-white">Saddle Ranch KDS (Kitchen Display System)</h1>
                            <p className="text-xs text-stone-400">Dedicated Touch View for Cooks & Grills</p>
                        </div>
                    </div>
                    <Link href="/employee/dashboard" className="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white flex items-center gap-2 text-xs font-bold">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </Link>
                </header>
                <main className="max-w-7xl mx-auto py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-stone-900/90 border border-red-500/40 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">[DINE-IN: TABLE 05]</span>
                            <span className="flex items-center gap-1.5 text-xs text-amber-400 font-bold"><Clock className="w-4 h-4" /> 12 mins elapsed</span>
                        </div>
                        <h3 className="text-2xl font-black text-white">2x Sizzling Pork Sisig (Extra Hot)</h3>
                        <p className="text-sm text-stone-300">Special Instructions: Extra crispy and more onions please.</p>
                        <button className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-6 h-6" />
                            <span>BUMP / MARK READY TO SERVE</span>
                        </button>
                    </div>
                </main>
            </div>
        </>
    );
}
