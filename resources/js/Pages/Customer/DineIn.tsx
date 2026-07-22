import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Utensils, QrCode, ArrowLeft } from 'lucide-react';

export default function DineInOrder() {
    return (
        <>
            <Head title="In-House QR Ordering | Saddle Ranch" />
            <div className="min-h-screen bg-stone-950 text-stone-100 p-6 flex flex-col items-center justify-center font-sans">
                <div className="max-w-xl w-full text-center space-y-6 bg-stone-900 border border-stone-800 p-8 rounded-3xl shadow-2xl">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-amber-400" />
                    </div>
                    <div className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase">
                        [Dine-In Mode • Table QR Scan]
                    </div>
                    <h1 className="text-3xl font-black text-white">Seated at Table Service</h1>
                    <p className="text-sm text-stone-400">
                        Address and delivery fee fields are skipped. Your food will be brought directly to your table hot and sizzling!
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs uppercase tracking-wider transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Return to Landing Page</span>
                    </Link>
                </div>
            </div>
        </>
    );
}
