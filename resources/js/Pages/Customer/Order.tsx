import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Flame, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CustomerOrder() {
    return (
        <>
            <Head title="Online Ordering | Saddle Ranch" />
            <div className="min-h-screen bg-stone-950 text-stone-100 p-6 flex flex-col items-center justify-center font-sans">
                <div className="max-w-xl w-full text-center space-y-6 bg-stone-900 border border-stone-800 p-8 rounded-3xl shadow-2xl">
                    <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/40 mx-auto flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-orange-400" />
                    </div>
                    <h1 className="text-3xl font-black text-white">Sizzling Online Ordering</h1>
                    <p className="text-sm text-stone-400">
                        Pick-Up & Bulihan Delivery mode active. Select your favorite sizzling plates and check out with GCash, Maya, or Cash!
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
