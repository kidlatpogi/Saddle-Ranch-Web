import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Flame, Utensils, ShoppingBag, Clock, MapPin, Phone, ArrowRight, Star, X, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';

export default function Landing() {
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [selectedMode, setSelectedMode] = useState<'pickup' | 'delivery'>('pickup');

    return (
        <>
            <Head title="Saddle Ranch | Sizzling House Bulihan" />

            <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-orange-500 selection:text-white">
                {/* Top Promo Banner */}
                <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 px-4 py-2 text-center text-xs sm:text-sm font-semibold tracking-wide text-white shadow-lg animate-pulse flex items-center justify-center gap-2">
                    <Flame className="w-4 h-4 text-yellow-300 animate-bounce" />
                    <span>BULIHAN FIESTA SPECIAL: Get 10% OFF on Sizzling Pork Sisig orders over ₱300 using code <strong className="underline decoration-yellow-300">SADDLE10</strong>!</span>
                </div>

                {/* Navigation Header */}
                <header className="sticky top-0 z-40 backdrop-blur-md bg-stone-950/80 border-b border-stone-800/80 transition-all">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                                <Flame className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-white via-stone-200 to-orange-400 bg-clip-text text-transparent">
                                    SADDLE RANCH
                                </span>
                                <span className="block text-[10px] tracking-widest text-orange-500 font-bold uppercase">
                                    Sizzling House • Bulihan
                                </span>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-300">
                            <a href="#menu" className="hover:text-orange-400 transition-colors">Our Sizzling Specialties</a>
                            <a href="#about" className="hover:text-orange-400 transition-colors">The Bulihan Story</a>
                            <a href="#location" className="hover:text-orange-400 transition-colors">Location & Hours</a>
                        </nav>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/login"
                                className="text-xs font-semibold text-stone-400 hover:text-white transition-colors px-3 py-2"
                            >
                                Staff Portal
                            </Link>
                            <button
                                onClick={() => setIsOrderModalOpen(true)}
                                className="relative group overflow-hidden rounded-full p-px font-semibold text-white shadow-xl shadow-orange-600/20 active:scale-95 transition-transform"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 animate-gradient" />
                                <span className="relative flex items-center gap-2 px-6 py-2.5 rounded-full bg-stone-950/90 transition-colors group-hover:bg-transparent">
                                    <ShoppingBag className="w-4 h-4 text-orange-400 group-hover:text-white transition-colors" />
                                    <span>Order Now</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Hero Section with Sizzling Plate Banner */}
                <section className="relative overflow-hidden py-20 lg:py-32 border-b border-stone-800/60">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-900/20 via-stone-950/50 to-stone-950 pointer-events-none" />
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
                                    <Star className="w-3.5 h-3.5 fill-orange-400" />
                                    Voted #1 Sizzling House in Bulihan
                                </div>

                                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                                    Hear the Sizzle. <br />
                                    <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                                        Taste the Tradition.
                                    </span>
                                </h1>

                                <p className="text-lg sm:text-xl text-stone-400 max-w-2xl font-light leading-relaxed">
                                    Experience authentic Filipino sizzling comfort food right here in Bulihan. From our legendary 24-hour marinated Pork Sisig to rich, gravy-drenched T-Bone Steaks served on smoking cast iron plates.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                                    <button
                                        onClick={() => setIsOrderModalOpen(true)}
                                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-lg shadow-xl shadow-orange-600/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        <span>Order Online</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                    <Link
                                        href="/dine-in"
                                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-stone-300 font-bold text-lg hover:bg-stone-800 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <Utensils className="w-5 h-5 text-orange-400" />
                                        <span>Scan Dine-In Table QR</span>
                                    </Link>
                                </div>

                                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-stone-800/80 max-w-lg">
                                    <div>
                                        <div className="text-2xl font-black text-white">100%</div>
                                        <div className="text-xs text-stone-400">Authentic Recipes</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-orange-400">Free</div>
                                        <div className="text-xs text-stone-400">Bulihan Delivery</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-white">15-20m</div>
                                        <div className="text-xs text-stone-400">Fast Preparation</div>
                                    </div>
                                </div>
                            </div>

                            {/* Sizzling Plate Banner Card / Graphic */}
                            <div className="lg:col-span-5 relative">
                                <div className="relative mx-auto max-w-md lg:max-w-none">
                                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 opacity-30 blur-2xl animate-pulse" />
                                    <div className="relative rounded-3xl bg-stone-900/90 border border-stone-800 p-6 shadow-2xl overflow-hidden">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs font-bold uppercase tracking-widest text-orange-400 flex items-center gap-1.5">
                                                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                                                Chef's Sizzling Recommendation
                                            </span>
                                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                                                In Stock
                                            </span>
                                        </div>

                                        <div className="aspect-video rounded-2xl bg-gradient-to-br from-stone-800 to-stone-950 flex flex-col items-center justify-center p-6 text-center border border-stone-700/50 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <Utensils className="w-16 h-16 text-orange-500/40 mb-3 animate-pulse" />
                                            <h3 className="text-2xl font-black text-white">Sizzling Pork Sisig</h3>
                                            <p className="text-xs text-stone-400 mt-1 max-w-xs">
                                                Crispy pork belly topped with farm-fresh egg, onions, and spicy chili peppers on a cast-iron skillet.
                                            </p>
                                            <div className="mt-4 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 font-bold text-sm">
                                                ₱180.00
                                            </div>
                                        </div>

                                        <div className="mt-6 space-y-3">
                                            <div className="flex items-center gap-3 text-xs text-stone-300">
                                                <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                                                <span>Served sizzling hot right off the charcoal grill</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-stone-300">
                                                <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                                                <span>Complimentary special garlic gravy & spiced vinegar</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setIsOrderModalOpen(true)}
                                            className="w-full mt-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all shadow-lg shadow-orange-500/20"
                                        >
                                            Order This Special
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Specialties Grid Section */}
                <section id="menu" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">Our Signature Menu</h2>
                        <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">Sizzling Favorites Built for the Bulihan Appetite</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Sizzling Pork Sisig',
                                desc: 'Crispy pork belly seasoned with local spices, served on a sizzling hot plate with egg.',
                                price: '₱180.00',
                                badge: 'Best Seller',
                            },
                            {
                                name: 'Sizzling Pork T-Bone Steak',
                                desc: 'Tender T-Bone steak topped with gravy and buttered vegetables on hot cast iron.',
                                price: '₱280.00',
                                badge: 'Chef Choice',
                            },
                            {
                                name: 'Sizzling Bulalo',
                                desc: 'Rich beef shank served with simmering marrow gravy on a smoking sizzling plate.',
                                price: '₱450.00',
                                badge: 'Specialty',
                            },
                        ].map((item, idx) => (
                            <div key={idx} className="rounded-3xl bg-stone-900/60 border border-stone-800/80 p-6 flex flex-col justify-between hover:border-orange-500/50 transition-all group">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                                            {item.badge}
                                        </span>
                                        <span className="text-xl font-black text-amber-400">{item.price}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">{item.name}</h3>
                                    <p className="text-sm text-stone-400 mt-2 font-light leading-relaxed">{item.desc}</p>
                                </div>
                                <button
                                    onClick={() => setIsOrderModalOpen(true)}
                                    className="mt-6 w-full py-2.5 rounded-xl bg-stone-800 hover:bg-orange-500 text-stone-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                                >
                                    <span>Add to Order</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-stone-800/80 py-12 bg-stone-950/90 text-stone-500 text-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <Flame className="w-5 h-5 text-orange-500" />
                            <span className="font-bold text-stone-300">Saddle Ranch Sizzling House • Bulihan</span>
                        </div>
                        <p className="text-xs">© 2026 Saddle Ranch PH. All rights reserved. Week 1 Foundation Build.</p>
                    </div>
                </footer>

                {/* Interactive Order Mode Selector Modal */}
                {isOrderModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="relative w-full max-w-lg rounded-3xl bg-stone-900 border border-stone-800 p-6 sm:p-8 shadow-2xl text-stone-100">
                            <button
                                onClick={() => setIsOrderModalOpen(false)}
                                className="absolute top-6 right-6 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-6">
                                <span className="text-xs font-bold uppercase tracking-widest text-orange-500">Fast & Hot Fulfillment</span>
                                <h3 className="text-2xl font-black text-white mt-1">How would you like your order?</h3>
                                <p className="text-xs text-stone-400 mt-1">Select your preferred dining or delivery option below.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <button
                                    onClick={() => setSelectedMode('pickup')}
                                    className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                                        selectedMode === 'pickup'
                                            ? 'bg-orange-500/10 border-orange-500 text-white shadow-lg shadow-orange-500/10'
                                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                                    }`}
                                >
                                    <div>
                                        <ShoppingBag className={`w-6 h-6 mb-3 ${selectedMode === 'pickup' ? 'text-orange-400' : 'text-stone-500'}`} />
                                        <div className="font-bold text-base text-white">Pick-Up (Takeout)</div>
                                        <p className="text-xs mt-1 text-stone-400">Collect your sizzling order at our counter at your requested time.</p>
                                    </div>
                                    <div className="mt-4 text-[10px] font-bold uppercase tracking-wider text-orange-400">Ready in 15 mins</div>
                                </button>

                                <button
                                    onClick={() => setSelectedMode('delivery')}
                                    className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                                        selectedMode === 'delivery'
                                            ? 'bg-orange-500/10 border-orange-500 text-white shadow-lg shadow-orange-500/10'
                                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                                    }`}
                                >
                                    <div>
                                        <Truck className={`w-6 h-6 mb-3 ${selectedMode === 'delivery' ? 'text-orange-400' : 'text-stone-500'}`} />
                                        <div className="font-bold text-base text-white">Home Delivery</div>
                                        <p className="text-xs mt-1 text-stone-400">Delivered piping hot right to your doorstep.</p>
                                    </div>
                                    <div className="mt-4 text-[10px] font-bold uppercase tracking-wider text-emerald-400">FREE in Bulihan Area</div>
                                </button>
                            </div>

                            <Link
                                href={`/order?mode=${selectedMode}`}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-center block shadow-xl shadow-orange-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Continue to Menu ({selectedMode === 'pickup' ? 'Takeout' : 'Delivery'})
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
