import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Flame, Utensils, ShoppingBag, ArrowRight, X, ShoppingCart, MapPin, Clock, Phone, CheckCircle2 } from 'lucide-react';
import { useCart, CartProduct } from '@/Hooks/useCart';

interface Banner {
    id: number;
    title: string;
    image_path: string;
    is_active: boolean;
    display_order: number;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number | string;
    image_path?: string;
    stock_quantity: number;
    is_active: boolean;
}

interface LandingProps {
    banners?: Banner[];
    products?: Product[];
}

export default function Landing({ banners = [], products = [] }: LandingProps) {
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [selectedMode, setSelectedMode] = useState<'pickup' | 'delivery'>('pickup');
    const { addItem, itemCount } = useCart();
    const [addedProductId, setAddedProductId] = useState<number | null>(null);

    const handleAddToCart = (product: Product) => {
        if (product.stock_quantity <= 0) return;
        addItem(product as CartProduct, 1);
        setAddedProductId(product.id);
        setTimeout(() => setAddedProductId(null), 1500);
    };

    // Default fallback products matching design spec if DB seeders not yet loaded
    const displayProducts = products.length > 0 ? products : [
        {
            id: 1,
            name: 'Sizzling Pork Sisig',
            description: 'The undisputed king of the sizzling plate. Crispy pork belly seasoned with local spices, served on a cast-iron skillet with egg.',
            price: 180.00,
            stock_quantity: 50,
            is_active: true,
        },
        {
            id: 2,
            name: 'Sizzling Pork T-Bone Steak',
            description: 'Tender T-Bone steak seared hard on cast iron, topped with rich roadhouse gravy and buttered vegetables.',
            price: 280.00,
            stock_quantity: 30,
            is_active: true,
        },
        {
            id: 3,
            name: 'Sizzling Bulalo',
            description: 'Rich beef shank served with simmering marrow gravy on a smoking sizzling plate.',
            price: 450.00,
            stock_quantity: 15,
            is_active: true,
        },
    ];

    return (
        <>
            <Head title="Saddle Ranch | The Wild West of Sizzling Steaks" />

            <div className="font-body text-[#f0e0d1] bg-[#121213] min-h-screen antialiased overflow-x-hidden selection:bg-[#f59e0b] selection:text-[#121213]">
                {/* Top Navigation Bar */}
                <nav className="bg-[#19120a]/95 backdrop-blur-sm fixed top-0 w-full z-50 border-b border-[#534434]">
                    <div className="flex justify-between items-center px-6 h-20 max-w-7xl mx-auto">
                        <Link href="/" className="font-domine text-2xl md:text-3xl font-bold text-[#ffc174] tracking-tighter hover:opacity-90 transition-opacity">
                            Saddle Ranch
                        </Link>

                        {/* Navigation Links: Menu & Locations ONLY */}
                        <div className="hidden md:flex items-center space-x-8 font-sans text-sm font-medium">
                            <a className="text-[#d8c3ad] hover:text-[#f59e0b] transition-colors" href="#menu">
                                Menu
                            </a>
                            <a className="text-[#d8c3ad] hover:text-[#f59e0b] transition-colors" href="#locations">
                                Locations
                            </a>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/order"
                                className="relative p-2.5 rounded bg-[#1A1A1B] border border-white/10 hover:border-[#f59e0b] text-[#d8c3ad] hover:text-white transition-all flex items-center gap-2"
                            >
                                <ShoppingCart className="w-4 h-4 text-[#f59e0b]" />
                                <span className="text-xs font-bold hidden sm:inline">Cart</span>
                                {itemCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-[#f59e0b] text-[#121213] font-bold text-[10px]">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>

                            <button
                                onClick={() => setIsOrderModalOpen(true)}
                                className="bg-[#f59e0b] text-[#472a00] font-bold px-6 py-2.5 rounded btn-bevel hover-heat transition-all duration-300 active:scale-95 text-sm uppercase tracking-wider"
                            >
                                Order Now
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <header className="relative min-h-[80vh] flex items-center justify-center pt-20">
                    <div className="absolute inset-0 z-0">
                        <img
                            alt="Saddle Ranch sizzling skillet steak background"
                            className="w-full h-full object-cover opacity-60"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCatSLXJ-mynm_AwjLXsdG9xKbMwziehShgiNtyXaX2NZEeZFhSXaTmHMgLuACAitSC3WZ0g_9lSTavvnqO4eKFlaC0pnnA9OngEMtRicl0vfSF2_t4WqzxTKxW-H-X0i_tppiClzEOZ-fAuu1ezCbRVOcdVdwZHokttY1ATDIO4BuA185dwrm0QDuPpYjQ7qD9ybH5bl0WPn1wHJ3S5pB6JuCOoocWTfZ95cB0Lfqx1KbjbUwqGJxkhwxmqypEJta64yq1PajT3oWC"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121213] via-[#121213]/50 to-transparent" />
                    </div>

                    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-6">
                        <h1 className="font-domine text-4xl sm:text-6xl md:text-7xl text-[#ffc174] font-bold tracking-tight drop-shadow-lg leading-tight">
                            The Wild West of Sizzling Steaks
                        </h1>

                        <p className="font-sans text-lg sm:text-xl text-[#d8c3ad] max-w-2xl mx-auto font-normal leading-relaxed">
                            Authentic Filipino Sizzlers meet Roadhouse Spirit. Hear the sizzle. Taste the legacy.
                        </p>

                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => setIsOrderModalOpen(true)}
                                className="bg-[#f59e0b] text-[#472a00] font-bold px-8 py-4 rounded-lg btn-bevel hover-heat transition-all duration-300 text-lg uppercase tracking-wider shadow-xl shadow-[#f59e0b]/20"
                            >
                                Order Now
                            </button>
                            <Link
                                href="/dine-in?table=05"
                                className="bg-[#1A1A1B] border border-white/20 text-[#f0e0d1] font-bold px-8 py-4 rounded-lg hover:border-[#f59e0b] hover:text-[#ffc174] transition-all duration-300 text-lg uppercase tracking-wider flex items-center justify-center gap-2"
                            >
                                <Utensils className="w-5 h-5 text-[#f59e0b]" />
                                <span>Scan Table QR</span>
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="sizzle-divider max-w-7xl mx-auto" />

                {/* Promotional Bento-Style Section */}
                <section className="py-16 px-6 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Bento Slide 1 */}
                        <div className="relative h-64 rounded-xl overflow-hidden raised-layer group hover-heat cursor-pointer bg-[#1A1A1B]">
                            <div className="absolute inset-0 vignette-overlay">
                                <img
                                    className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                                    alt="Sisig promo"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6QEUONokTX7mi1M1Wrie14cxeoNfVq5HyIS1sLOLWKbzZyh6OfegCBaNeH6E7uS37ugVc6jjmILNzIrmvE0tpXkOBCDP29HO1WZL69MsOd6lpwp4oX6ezfDjuAsLMCu57vBpiHDupWu3yDATuk2k_HgpQMi23Y7mifgQKqPJhc0GqDXCCk1tPooIkFyBCXPiESBHm8HKF8cp1ctvD0RZ39YNVxKG_2cPaPyfryUGBbaoIHhqqhq5R9BflPtI6jMfzsP3W6QStlttx"
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-[#1A1A1B] to-transparent">
                                <span className="font-mono text-xs text-[#f59e0b] bg-[#31281f] px-2 py-1 rounded border border-[#534434] mb-2 inline-block font-semibold">
                                    PROMO
                                </span>
                                <h3 className="font-domine text-xl font-bold text-[#f0e0d1]">Sisig Saturdays: 20% Off</h3>
                            </div>
                        </div>

                        {/* Bento Slide 2 (Col Span 2) */}
                        <div className="relative h-64 rounded-xl overflow-hidden raised-layer group hover-heat cursor-pointer bg-[#1A1A1B] md:col-span-2">
                            <div className="absolute inset-0 vignette-overlay">
                                <img
                                    className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                                    alt="Ribeye Steak"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqtvjGjUsuBGyzBHVhntcLtTHQL442EMNheO8rq-4bOP-zq35cYw-DswcOn6dpMuPv5ukX12iSEzREwKgb6iPoUk64ETmBeEcSAd_ACcZoIibAIU9yR4PAPlj2o5GbDfdalWoY2tkEYUIrX_067eJx75-iVNUhMQQwzXdK3OmEDSQSGelDLgr5zgcY5sN7zsIqaaHUGQXrLpgju8NF3deoQjQPo--R-W6fwR50zfB_tGo3dBdO2gM7hr6EUUVxLgCF5gCn94DbGA_N"
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-[#1A1A1B] via-[#1A1A1B]/80 to-transparent">
                                <span className="font-mono text-xs text-[#f59e0b] bg-[#31281f] px-2 py-1 rounded border border-[#534434] mb-2 inline-block font-semibold">
                                    NEW ARRIVAL
                                </span>
                                <h3 className="font-domine text-2xl font-bold text-[#ffc174] mb-1">New Cowboy Ribeye Steak</h3>
                                <p className="font-sans text-sm text-[#d8c3ad] hidden md:block">Bone-in, rugged flavor, seared to perfection.</p>
                            </div>
                        </div>

                        {/* Bento Slide 3 (Col Span 3) */}
                        <div className="relative h-64 rounded-xl overflow-hidden raised-layer group hover-heat cursor-pointer bg-[#1A1A1B] md:col-span-3">
                            <div className="absolute inset-0 flex items-center bg-[#221a12]">
                                <div className="w-full md:w-1/2 p-6 z-10">
                                    <span className="font-mono text-xs text-[#f59e0b] bg-[#31281f] px-2 py-1 rounded border border-[#534434] mb-3 inline-block font-semibold">
                                        LATE NIGHT
                                    </span>
                                    <h3 className="font-domine text-2xl font-bold text-[#f0e0d1] mb-2">Happy Hour: Sizzling Pulutan Specials</h3>
                                    <p className="font-sans text-sm text-[#d8c3ad] mb-4">
                                        Gather 'round the hearth with cold drinks and hot iron plates. 4PM - 7PM daily.
                                    </p>
                                    <button onClick={() => setIsOrderModalOpen(true)} className="text-[#ffc174] font-mono text-xs font-bold flex items-center hover:text-[#f59e0b] transition-colors">
                                        VIEW MENU <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                                <div className="hidden md:block w-1/2 h-full vignette-overlay relative">
                                    <img
                                        className="w-full h-full object-cover opacity-60"
                                        alt="Happy Hour"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="sizzle-divider max-w-7xl mx-auto" />

                {/* Category Menu Preview Section: "Choose Your Mount" */}
                <section id="menu" className="py-16 px-6 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-domine text-3xl sm:text-4xl text-[#ffc174] font-bold mb-2">Choose Your Mount</h2>
                        <p className="font-sans text-base sm:text-lg text-[#d8c3ad]">Signature sizzling categories straight from the fire.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Category Card 1: Sisig */}
                        <div className="bg-[#1A1A1B] rounded-lg border border-[#262627] overflow-hidden flex flex-col hover-heat transition-all duration-300">
                            <div className="h-48 relative vignette-overlay">
                                <img
                                    className="w-full h-full object-cover opacity-80"
                                    alt="Sisig category"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t"
                                />
                            </div>
                            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                                <div>
                                    <h3 className="font-domine text-xl font-bold text-[#f0e0d1] mb-2 border-b border-[#534434] pb-1 inline-block">
                                        Sisig
                                    </h3>
                                    <p className="font-sans text-sm text-[#d8c3ad]">
                                        The undisputed king of the sizzling plate. Pork, chicken, or bangus chopped fine and seasoned bold.
                                    </p>
                                </div>
                                <div className="flex gap-2 font-mono text-[10px] font-bold">
                                    <span className="text-[#f0e0d1] border border-[#534434] px-2 py-1 rounded bg-[#261e15]">SPICY</span>
                                    <span className="text-[#f0e0d1] border border-[#534434] px-2 py-1 rounded bg-[#261e15]">CLASSIC</span>
                                </div>
                            </div>
                        </div>

                        {/* Category Card 2: Steaks */}
                        <div className="bg-[#1A1A1B] rounded-lg border border-[#262627] overflow-hidden flex flex-col hover-heat transition-all duration-300">
                            <div className="h-48 relative vignette-overlay">
                                <img
                                    className="w-full h-full object-cover opacity-80"
                                    alt="Steaks category"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuASVSO6N3lzIbdlCDT85viSxOZiQKjWADlA5k7ymludjTdSCB7tqV0bZvXRba3-L4gemLyqy9PxmqnYMBnSsxb5yfI_XM-qajS5ZEnS1Am8OBu5uN8_smBFlDdy4xR0UNE8jDFJP8vNSRQcqqDSG4p-oDij5kCvWALcyBZVeuA1QdnqC9a6I5s9l2ba3Zjfe0xSPjMr0jLCAB1z-oJS5xBL9meeUeFsmiMgjQ96VoXotgHsy3Jl3d9NQIv1liJsKeu_sJec2rrkNziY"
                                />
                            </div>
                            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                                <div>
                                    <h3 className="font-domine text-xl font-bold text-[#f0e0d1] mb-2 border-b border-[#534434] pb-1 inline-block">
                                        Steaks
                                    </h3>
                                    <p className="font-sans text-sm text-[#d8c3ad]">
                                        Prime cuts seared hard on cast iron. Served crackling hot with our signature roadhouse gravies.
                                    </p>
                                </div>
                                <div className="flex gap-2 font-mono text-[10px] font-bold">
                                    <span className="text-[#f0e0d1] border border-[#534434] px-2 py-1 rounded bg-[#261e15]">RIBEYE</span>
                                    <span className="text-[#f0e0d1] border border-[#534434] px-2 py-1 rounded bg-[#261e15]">T-BONE</span>
                                </div>
                            </div>
                        </div>

                        {/* Category Card 3: Sizzling Rice Meals */}
                        <div className="bg-[#1A1A1B] rounded-lg border border-[#262627] overflow-hidden flex flex-col hover-heat transition-all duration-300">
                            <div className="h-48 relative vignette-overlay">
                                <img
                                    className="w-full h-full object-cover opacity-80"
                                    alt="Sizzling Rice Meals category"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT2sso9NgKHiCPPIkIfBBCfPNPUK_dgit8ctI0rtoMT_bXyQ21nRcx3ViyVnDNZTyTCVtYOSFJ8h_h3ZG451V7vUFX1LFMWyd6wQrV-4pevn9wO0H-wUZVYl0TBSwWt_bbQikBKmtygbJeYfSzWbAOcd32EpNo8TCvpmAamQoFlFfNvHrmpn32aUcJ7gi5IGdK9xpTad7qU6dSRSu2bty13h9_T3_GKF3mMrUI31pUXtjCvVgiLfQIkBBbjU_zY5SS0IrP8nvbh7QQ"
                                />
                            </div>
                            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                                <div>
                                    <h3 className="font-domine text-xl font-bold text-[#f0e0d1] mb-2 border-b border-[#534434] pb-1 inline-block">
                                        Sizzling Rice Meals
                                    </h3>
                                    <p className="font-sans text-sm text-[#d8c3ad]">
                                        Complete hearty platters. Savory viands atop a bed of garlic rice that crisps up on the hot iron.
                                    </p>
                                </div>
                                <div className="flex gap-2 font-mono text-[10px] font-bold">
                                    <span className="text-[#f0e0d1] border border-[#534434] px-2 py-1 rounded bg-[#261e15]">BEEF PEPPER</span>
                                    <span className="text-[#f0e0d1] border border-[#534434] px-2 py-1 rounded bg-[#261e15]">CHICKEN</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Menu Product Cards */}
                    <div className="mt-16 pt-12 border-t border-[#534434]">
                        <h3 className="font-domine text-2xl font-bold text-[#ffc174] mb-8 text-center">
                            Featured Sizzling Items
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {displayProducts.map((product) => {
                                const numPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                                const isOutOfStock = product.stock_quantity <= 0;
                                const isAdded = addedProductId === product.id;

                                return (
                                    <div
                                        key={product.id}
                                        className="bg-[#1A1A1B] rounded-lg border border-[#262627] p-6 flex flex-col justify-between hover-heat transition-all duration-300"
                                    >
                                        <div>
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="font-mono text-xs text-[#f59e0b] border border-[#534434] px-2 py-0.5 rounded bg-[#261e15]">
                                                    {isOutOfStock ? 'OUT OF STOCK' : `IN STOCK (${product.stock_quantity})`}
                                                </span>
                                                <span className="font-mono text-lg font-bold text-[#ffc174]">
                                                    ₱{numPrice.toFixed(2)}
                                                </span>
                                            </div>
                                            <h4 className="font-domine text-lg font-bold text-[#f0e0d1] mb-2">{product.name}</h4>
                                            <p className="font-sans text-xs text-[#d8c3ad] leading-relaxed">{product.description}</p>
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={isOutOfStock}
                                            className={`mt-6 w-full py-2.5 rounded font-bold text-xs uppercase tracking-wider btn-bevel transition-all flex items-center justify-center gap-2 ${
                                                isOutOfStock
                                                    ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                                                    : isAdded
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-[#f59e0b] text-[#472a00] hover:bg-[#ffc174]'
                                            }`}
                                        >
                                            {isAdded ? (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span>Added to Order!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Add to Order</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <div className="sizzle-divider max-w-7xl mx-auto" />

                {/* Locations Section */}
                <section id="locations" className="py-16 px-6 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-[#1A1A1B] p-8 sm:p-12 rounded-xl border border-[#262627]">
                        <div className="space-y-6">
                            <span className="font-mono text-xs text-[#f59e0b] bg-[#31281f] px-2 py-1 rounded border border-[#534434] inline-block font-semibold">
                                ROADHOUSE LOCATION
                            </span>
                            <h2 className="font-domine text-3xl font-bold text-[#ffc174]">Saddle Ranch Bulihan</h2>
                            <p className="font-sans text-sm text-[#d8c3ad] leading-relaxed">
                                Come experience the smoky hearth, cast-iron sizzle, and genuine roadhouse hospitality. Serving hearty steaks and sizzling specialties daily.
                            </p>
                            <div className="space-y-3 font-sans text-xs text-[#f0e0d1]">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-[#f59e0b]" />
                                    <span>123 Roadhouse Lane, Barangay Bulihan, Cavite</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-[#f59e0b]" />
                                    <span>Monday - Sunday: 11:00 AM - 11:00 PM</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-[#f59e0b]" />
                                    <span>+63 917 123 4567</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-64 rounded-lg overflow-hidden border border-white/10 relative vignette-overlay">
                            <img
                                className="w-full h-full object-cover opacity-80"
                                alt="Saddle Ranch Roadhouse Storefront"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCatSLXJ-mynm_AwjLXsdG9xKbMwziehShgiNtyXaX2NZEeZFhSXaTmHMgLuACAitSC3WZ0g_9lSTavvnqO4eKFlaC0pnnA9OngEMtRicl0vfSF2_t4WqzxTKxW-H-X0i_tppiClzEOZ-fAuu1ezCbRVOcdVdwZHokttY1ATDIO4BuA185dwrm0QDuPpYjQ7qD9ybH5bl0WPn1wHJ3S5pB6JuCOoocWTfZ95cB0Lfqx1KbjbUwqGJxkhwxmqypEJta64yq1PajT3oWC"
                            />
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-[#140d06] font-sans text-sm w-full border-t border-[#534434]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-12 max-w-7xl mx-auto">
                        <div className="flex flex-col space-y-3">
                            <div className="font-domine text-xl font-bold text-[#ffc174]">Saddle Ranch</div>
                            <p className="text-[#d8c3ad] text-xs">123 Roadhouse Lane, Bulihan</p>
                            <p className="text-[#d8c3ad] font-mono text-xs">MON-SUN: 11 AM - 11 PM</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <h4 className="font-mono text-xs text-[#f0e0d1] mb-1 font-bold">Legal</h4>
                            <a className="text-[#d8c3ad] hover:text-[#ffc174] transition-colors text-xs" href="#">Privacy Policy</a>
                            <a className="text-[#d8c3ad] hover:text-[#ffc174] transition-colors text-xs" href="#">Terms of Service</a>
                            <a className="text-[#d8c3ad] hover:text-[#ffc174] transition-colors text-xs" href="#">Accessibility</a>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <h4 className="font-mono text-xs text-[#f0e0d1] mb-1 font-bold">Connect</h4>
                            <a className="text-[#d8c3ad] hover:text-[#ffc174] transition-colors text-xs" href="#">Contact Us</a>
                            <p className="text-[#d8c3ad] text-xs mt-auto opacity-70">© 2026 Saddle Ranch. Raw, Energetic, Sizzling.</p>
                        </div>
                    </div>
                </footer>

                {/* Interactive Order Modal */}
                {isOrderModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121213]/90 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="relative w-full max-w-lg rounded-xl bg-[#1A1A1B] border border-white/20 p-6 sm:p-8 shadow-2xl text-[#f0e0d1]">
                            <button
                                onClick={() => setIsOrderModalOpen(false)}
                                className="absolute top-6 right-6 p-2 rounded-full text-[#d8c3ad] hover:text-white hover:bg-stone-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-6">
                                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#f59e0b]">Fast & Hot Fulfillment</span>
                                <h3 className="font-domine text-2xl font-bold text-[#f0e0d1] mt-1">How would you like your order?</h3>
                                <p className="font-sans text-xs text-[#d8c3ad] mt-1">Select your preferred dining or delivery option below.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <button
                                    onClick={() => setSelectedMode('pickup')}
                                    className={`p-5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                                        selectedMode === 'pickup'
                                            ? 'bg-[#f59e0b]/10 border-[#f59e0b] text-white shadow-lg shadow-[#f59e0b]/10'
                                            : 'bg-[#121213] border-[#534434] text-[#d8c3ad] hover:border-stone-700'
                                    }`}
                                >
                                    <div>
                                        <ShoppingBag className={`w-6 h-6 mb-3 ${selectedMode === 'pickup' ? 'text-[#f59e0b]' : 'text-stone-500'}`} />
                                        <div className="font-bold text-base text-white">Pick-Up (Takeout)</div>
                                        <p className="text-xs mt-1 text-[#d8c3ad]">Collect your sizzling order at our counter at your requested time.</p>
                                    </div>
                                    <div className="mt-4 font-mono text-[10px] font-bold uppercase tracking-wider text-[#f59e0b]">Ready in 15 mins</div>
                                </button>

                                <button
                                    onClick={() => setSelectedMode('delivery')}
                                    className={`p-5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                                        selectedMode === 'delivery'
                                            ? 'bg-[#f59e0b]/10 border-[#f59e0b] text-white shadow-lg shadow-[#f59e0b]/10'
                                            : 'bg-[#121213] border-[#534434] text-[#d8c3ad] hover:border-stone-700'
                                    }`}
                                >
                                    <div>
                                        <Utensils className={`w-6 h-6 mb-3 ${selectedMode === 'delivery' ? 'text-[#f59e0b]' : 'text-stone-500'}`} />
                                        <div className="font-bold text-base text-white">Home Delivery</div>
                                        <p className="text-xs mt-1 text-[#d8c3ad]">Delivered piping hot right to your doorstep.</p>
                                    </div>
                                    <div className="mt-4 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">FREE in Bulihan Area</div>
                                </button>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Link
                                    href={`/order?mode=${selectedMode}`}
                                    className="w-full py-3.5 rounded-lg bg-[#f59e0b] text-[#472a00] font-bold text-center block shadow-xl shadow-[#f59e0b]/20 hover:bg-[#ffc174] transition-all text-sm uppercase tracking-wider btn-bevel"
                                >
                                    Continue to Menu ({selectedMode === 'pickup' ? 'Takeout' : 'Delivery'})
                                </Link>
                                <Link
                                    href="/dine-in?table=05"
                                    className="w-full py-3 rounded-lg bg-[#121213] border border-[#534434] text-[#d8c3ad] font-bold text-xs text-center block hover:text-white transition-all"
                                >
                                    Seated at Restaurant? Click here for Table Service (QR Scan)
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
