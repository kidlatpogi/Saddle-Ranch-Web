import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Flame, Utensils, ShoppingBag, ArrowRight, ArrowUpRight, X, ShoppingCart, MapPin, Clock, Phone, CheckCircle2 } from 'lucide-react';
import { useCart, CartProduct } from '@/Hooks/useCart';
import CardNav, { CardNavItem } from '@/Components/CardNav';
import AIChatbot from '@/Components/AIChatbot';
import CustomerOrderTracker from '@/Components/CustomerOrderTracker';
import LocationModal from '@/Components/LocationModal';
import PrivacyPolicyModal from '@/Components/PrivacyPolicyModal';

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
    const [scrollY, setScrollY] = useState(0);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [currentBranch, setCurrentBranch] = useState<'Bulihan' | 'Dasma'>(() => (localStorage.getItem('saddle_ranch_branch') as any) || 'Bulihan');
    const [currentLocName, setCurrentLocName] = useState<string>(() => localStorage.getItem('saddle_ranch_location_name') || 'Bulihan, Silang, Cavite');
    const [currentDistance, setCurrentDistance] = useState<string>(() => localStorage.getItem('saddle_ranch_distance') || '1.2 km away');
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('saddle_ranch_branch')) {
            setIsLocationModalOpen(true);
        }

        const handleLocUpdate = (e: any) => {
            if (e.detail) {
                setCurrentBranch(e.detail.branch);
                setCurrentLocName(e.detail.locationName);
                setCurrentDistance(e.detail.distance);
            }
        };

        window.addEventListener('saddle_ranch_location_updated', handleLocUpdate);
        return () => window.removeEventListener('saddle_ranch_location_updated', handleLocUpdate);
    }, []);

    // Parallax Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAddToCart = (product: Product) => {
        if (product.stock_quantity <= 0) return;
        addItem(product as CartProduct, 1);
        setAddedProductId(product.id);
        setTimeout(() => setAddedProductId(null), 1500);
    };

    // CardNav Items Configuration
    const cardNavItems: CardNavItem[] = [
        {
            label: 'Sizzling Menu',
            bgColor: '#261e15',
            textColor: '#f0e0d1',
            links: [
                { label: 'Featured Items', href: '#featured-menu', ariaLabel: 'Featured Sizzling Items' },
                { label: 'Menu Categories', href: '#categories', ariaLabel: 'Sizzling Categories' },
                { label: 'Order Online', href: '/order', ariaLabel: 'Order Online' },
            ],
        },
        {
            label: 'Our Roadhouses',
            bgColor: '#31281f',
            textColor: '#f0e0d1',
            links: [
                { label: 'Bulihan Branch', href: '#locations', ariaLabel: 'Saddle Ranch Bulihan' },
                { label: 'Dasmariñas Branch', href: '#locations', ariaLabel: 'Saddle Ranch Dasmariñas' },
            ],
        },
        {
            label: 'Promos & Offers',
            bgColor: '#1c150e',
            textColor: '#f0e0d1',
            links: [
                { label: 'Online Menu & Delivery', href: '/order', ariaLabel: 'View Full Online Menu' },
                { label: 'Roadhouse Promos', href: '#promos', ariaLabel: 'Special Roadhouse Promos' },
                { label: 'Sizzling Specials', href: '#featured-menu', ariaLabel: 'Sizzling Specials' },
            ],
        },
    ];

    const defaultFeaturedProducts: Product[] = [
        {
            id: 101,
            name: 'Sizzling Chicken Inasal Platter',
            description: 'Chargrilled Bacolod-style chicken served sizzling hot with garlic rice and house-blend sauce.',
            price: 220.00,
            image_path: '/images/chicken_inasal.webp',
            stock_quantity: 40,
            is_active: true,
        },
        {
            id: 102,
            name: 'Sizzling Pork Sisig',
            description: 'Crispy pork belly seasoned with local spices, served on a smoking hot skillet with raw egg and calamansi.',
            price: 180.00,
            image_path: '/images/sisig.webp',
            stock_quantity: 50,
            is_active: true,
        },
        {
            id: 103,
            name: 'Sizzling Spicy Beef Pepper Rice',
            description: 'Thinly sliced tender spicy beef with freshly cracked black pepper and garlic rice on hot cast iron.',
            price: 195.00,
            image_path: '/images/spicy_beef.webp',
            stock_quantity: 35,
            is_active: true,
        },
    ];

    const getFeaturedProductImage = (product: Product, index: number): string => {
        const featuredImages = ['/images/chicken_inasal.webp', '/images/sisig.webp', '/images/spicy_beef.webp'];
        const name = (product.name || '').toLowerCase();
        if (name.includes('inasal') || name.includes('chicken')) return '/images/chicken_inasal.webp';
        if (name.includes('sisig')) return '/images/sisig.webp';
        if (name.includes('beef') || name.includes('spicy') || name.includes('pepper') || name.includes('steak')) return '/images/spicy_beef.webp';
        if (product.image_path) {
            let img = product.image_path;
            if (img.startsWith('http://localhost') || img.startsWith('http://127.0.0.1')) {
                try {
                    img = new URL(img).pathname;
                } catch {}
            }
            if (img.startsWith('http') || img.startsWith('/images/') || img.startsWith('/storage/')) return img;
            if (img.startsWith('/')) return img;
            return `/images/${img}`;
        }
        return featuredImages[index % featuredImages.length];
    };

    const displayedProducts = React.useMemo(() => {
        if (!products || products.length === 0) {
            return defaultFeaturedProducts;
        }

        const inasal = products.find(p => p.name.toLowerCase().includes('inasal') || p.name.toLowerCase().includes('chicken'));
        const sisig = products.find(p => p.name.toLowerCase().includes('sisig'));
        const beef = products.find(p => p.name.toLowerCase().includes('beef') || p.name.toLowerCase().includes('pepper') || p.name.toLowerCase().includes('spicy'));

        return [
            inasal || defaultFeaturedProducts[0],
            sisig || defaultFeaturedProducts[1],
            beef || defaultFeaturedProducts[2],
        ];
    }, [products]);

    return (
        <>
            <Head title="Saddle Ranch | The Wild West of Sizzling Steaks" />

            <div className="font-body text-[#f0e0d1] bg-[#121213] min-h-screen antialiased overflow-x-hidden selection:bg-[#f59e0b] selection:text-[#121213]">

                {/* React Bits CardNav Component Integration */}
                <CardNav
                    logoText="Saddle Ranch"
                    logoAlt="Saddle Ranch Logo"
                    items={cardNavItems}
                    baseColor="#19120a"
                    menuColor="#ffc174"
                    buttonBgColor="#f59e0b"
                    buttonTextColor="#472a00"
                    buttonText="Order Now"
                    onButtonClick={() => setIsOrderModalOpen(true)}
                    cartItemCount={itemCount}
                />

                {/* 1. Hero Section (Strictly 100vh / h-screen with zero pt gap & Parallax Video) */}
                <header className="relative w-full h-screen overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover scale-110 transition-transform duration-75 ease-out"
                            style={{ transform: `scale(1.1) translateY(${scrollY * 0.25}px)` }}
                        >
                            <source src="/landing-video.mp4" type="video/mp4" />
                        </video>
                        {/* Dark Vignette Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121213] via-[#121213]/50 to-[#121213]/40" />
                    </div>

                    {/* Brand Logo in Upper Left Corner (Same level as rotating badge, viewable on Mobile Viewport) */}
                    <div className="absolute top-24 sm:top-28 left-4 sm:left-8 lg:left-16 z-20 flex items-center justify-center">
                        <a href="/" className="group block" aria-label="Saddle Ranch Home">
                            <img
                                src="/images/saddle_ranch_logo.png"
                                alt="Saddle Ranch Logo"
                                className="w-24 xs:w-28 sm:w-36 md:w-44 lg:w-48 max-w-[38vw] h-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)] transition-transform duration-300 group-hover:scale-105"
                            />
                        </a>
                    </div>

                    {/* Rotating Circular Stamp Seal Badge ("SINCE 2008") in Upper Right Corner (Item 1: Complete 360° Text Visibility) */}
                    <div className="absolute top-28 right-8 lg:right-16 z-20 hidden md:flex items-center justify-center">
                        <div className="relative w-40 h-40 flex items-center justify-center group cursor-pointer">
                            {/* Outer Scalloped Dashed Border Ring */}
                            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#f59e0b]/50 bg-[#1c150e]/85 backdrop-blur-md shadow-2xl shadow-[#f59e0b]/25 group-hover:border-[#f59e0b] group-hover:scale-105 transition-all duration-300" />

                            {/* Rotating Curved Text Path */}
                            <svg className="w-36 h-36 animate-[spin_16s_linear_infinite]" viewBox="0 0 140 140">
                                <path
                                    id="stampCirclePath"
                                    d="M 70, 70 m -46, 0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0"
                                    fill="none"
                                />
                                <text fill="#ffc174" fontSize="10" fontWeight="bold" letterSpacing="1.8">
                                    <textPath href="#stampCirclePath" startOffset="0%">
                                        ★ SINCE 2008 ★ ROADHOUSE EXCELLENCE ★
                                    </textPath>
                                </text>
                            </svg>

                            {/* Center Emblem */}
                            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                                <Flame className="w-5 h-5 text-[#f59e0b] group-hover:scale-125 transition-transform duration-300" />
                                <span className="font-domine font-black text-base text-[#ffc174] tracking-tight leading-none mt-0.5">2008</span>
                                <span className="font-mono text-[8px] font-bold text-[#d8c3ad] uppercase tracking-widest">RANCH</span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute z-10 text-center px-6 max-w-4xl mx-auto space-y-6">
                        <h1 className="font-domine text-4xl sm:text-6xl md:text-7xl text-[#ffc174] font-bold tracking-tight drop-shadow-2xl leading-tight">
                            The Wild West of Sizzling Steaks
                        </h1>

                        <p className="font-sans text-lg sm:text-xl text-[#f0e0d1] max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-md">
                            Authentic Filipino Sizzlers meet Roadhouse Spirit. Hear the sizzle.
                        </p>

                        <div className="pt-4 flex items-center justify-center gap-4">
                            <button
                                onClick={() => setIsOrderModalOpen(true)}
                                className="bg-[#f59e0b] text-[#472a00] font-bold px-10 py-4 rounded-lg btn-bevel hover-heat transition-all duration-300 text-lg uppercase tracking-wider shadow-2xl shadow-[#f59e0b]/30 active:scale-95"
                            >
                                Order Online Now
                            </button>
                        </div>
                    </div>
                </header>

                <div className="sizzle-divider w-[92%] sm:w-[88%] md:w-[80%] max-w-[1440px] mx-auto" />

                {/* 2. PROMOTIONS & DEALS SECTION */}
                <section
                    id="promos"
                    className="py-6 sm:py-12 md:py-16 px-4 w-[92%] sm:w-[88%] md:w-[80%] max-w-[1440px] mx-auto transition-transform duration-300"
                    style={{ transform: `translateY(${Math.max(0, (scrollY - 200) * -0.03)}px)` }}
                >
                    <div className="text-center mb-6 sm:mb-12">
                        <span className="font-mono text-[10px] sm:text-xs text-[#f59e0b] bg-[#31281f] px-2.5 sm:px-3 py-1 rounded border border-[#534434] uppercase tracking-widest font-bold inline-block mb-2">
                            Exclusive Roadhouse Specials
                        </span>
                        <h2 className="font-domine text-2xl sm:text-4xl md:text-5xl text-[#ffc174] font-bold tracking-tight">
                            Promotions & Deals
                        </h2>
                    </div>

                    {/* Uniform Responsive Grid (Equal Rectangle Sizes on Mobile View) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {/* Card 1: Sisig Saturdays Deal */}
                        <div className="md:col-span-2 md:row-span-2 relative h-52 sm:h-60 md:h-auto md:min-h-[380px] lg:min-h-[420px] rounded-2xl overflow-hidden raised-layer group hover-heat cursor-pointer bg-[#1A1A1B] border border-[#534434]/60 shadow-2xl flex flex-col justify-end">
                            <div className="absolute inset-0 vignette-overlay">
                                <img
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105"
                                    alt="Sisig promo"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6QEUONokTX7mi1M1Wrie14cxeoNfVq5HyIS1sLOLWKbzZyh6OfegCBaNeH6E7uS37ugVc6jjmILNzIrmvE0tpXkOBCDP29HO1WZL69MsOd6lpwp4oX6ezfDjuAsLMCu57vBpiHDupWu3yDATuk2k_HgpQMi23Y7mifgQKqPJhc0GqDXCCk1tPooIkFyBCXPiESBHm8HKF8cp1ctvD0RZ39YNVxKG_2cPaPyfryUGBbaoIHhqqhq5R9BflPtI6jMfzsP3W6QStlttx"
                                />
                            </div>
                            <div className="relative z-10 p-4 sm:p-5 md:p-8 w-full bg-gradient-to-t from-[#1A1A1B] via-[#1A1A1B]/90 to-transparent">
                                <span className="font-mono text-[9px] sm:text-xs text-[#f59e0b] bg-[#31281f] px-2 py-0.5 sm:px-3 sm:py-1 rounded border border-[#534434] mb-1.5 sm:mb-3 inline-block font-bold shadow">
                                    WEEKEND SPECIAL • 20% OFF
                                </span>
                                <h3 className="font-domine text-lg sm:text-2xl md:text-4xl font-bold text-[#ffc174] mb-1 sm:mb-2 drop-shadow-md">
                                    Sisig Saturdays Deal
                                </h3>
                                <p className="font-sans text-xs sm:text-sm md:text-base text-[#d8c3ad] max-w-lg leading-relaxed line-clamp-2 md:line-clamp-none">
                                    Enjoy 20% off our legendary 24-hour marinated Pork Sisig served on a smoking hot skillet with raw egg and calamansi.
                                </p>
                            </div>
                        </div>

                        {/* Card 2: Cowboy Ribeye Special */}
                        <div className="relative h-52 sm:h-60 md:h-auto md:min-h-[190px] lg:min-h-[200px] rounded-2xl overflow-hidden raised-layer group hover-heat cursor-pointer bg-[#1A1A1B] border border-[#534434]/60 shadow-xl flex flex-col justify-end">
                            <div className="absolute inset-0 vignette-overlay">
                                <img
                                    className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-all duration-500 group-hover:scale-105"
                                    alt="Ribeye Steak"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqtvjGjUsuBGyzBHVhntcLtTHQL442EMNheO8rq-4bOP-zq35cYw-DswcOn6dpMuPv5ukX12iSEzREwKgb6iPoUk64ETmBeEcSAd_ACcZoIibAIU9yR4PAPlj2o5GbDfdalWoY2tkEYUIrX_067eJx75-iVNUhMQQwzXdK3OmEDSQSGelDLgr5zgcY5sN7zsIqaaHUGQXrLpgju8NF3deoQjQPo--R-W6fwR50zfB_tGo3dBdO2gM7hr6EUUVxLgCF5gCn94DbGA_N"
                                />
                            </div>
                            <div className="relative z-10 p-4 sm:p-5 w-full bg-gradient-to-t from-[#1A1A1B] via-[#1A1A1B]/80 to-transparent">
                                <span className="font-mono text-[9px] sm:text-[10px] text-[#f59e0b] bg-[#31281f] px-2 py-0.5 rounded border border-[#534434] mb-1.5 inline-block font-bold">
                                    NEW ARRIVAL
                                </span>
                                <h3 className="font-domine text-base sm:text-lg font-bold text-[#ffc174]">Cowboy Ribeye Special</h3>
                                <p className="font-sans text-xs sm:text-xs text-[#d8c3ad] mt-0.5 line-clamp-2">Bone-in, seared on smoking cast iron.</p>
                            </div>
                        </div>

                        {/* Card 3: Unlimited Rice & Soup */}
                        <div className="relative h-52 sm:h-60 md:h-auto md:min-h-[190px] lg:min-h-[200px] rounded-2xl overflow-hidden raised-layer group hover-heat cursor-pointer bg-[#1A1A1B] border border-[#534434]/60 shadow-xl flex flex-col justify-end">
                            <div className="absolute inset-0 vignette-overlay">
                                <img
                                    className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-all duration-500 group-hover:scale-105"
                                    alt="Unli Rice and Soup"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT2sso9NgKHiCPPIkIfBBCfPNPUK_dgit8ctI0rtoMT_bXyQ21nRcx3ViyVnDNZTyTCVtYOSFJ8h_h3ZG451V7vUFX1LFMWyd6wQrV-4pevn9wO0H-wUZVYl0TBSwWt_bbQikBKmtygbJeYfSzWbAOcd32EpNo8TCvpmAamQoFlFfNvHrmpn32aUcJ7gi5IGdK9xpTad7qU6dSRSu2bty13h9_T3_GKF3mMrUI31pUXtjCvVgiLfQIkBBbjU_zY5SS0IrP8nvbh7QQ"
                                />
                            </div>
                            <div className="relative z-10 p-4 sm:p-5 w-full bg-gradient-to-t from-[#1A1A1B] via-[#1A1A1B]/80 to-transparent">
                                <span className="font-mono text-[9px] sm:text-[10px] text-[#f59e0b] bg-[#31281f] px-2 py-0.5 rounded border border-[#534434] mb-1.5 inline-block font-bold">
                                    DASMARIÑAS BRANCH • ₱79 UNLI RICE & SOUP
                                </span>
                                <h3 className="font-domine text-base sm:text-lg font-bold text-[#f0e0d1]">Unlimited Rice & Soup</h3>
                                <p className="font-sans text-xs sm:text-xs text-[#d8c3ad] mt-0.5 line-clamp-2">Unli rice & soup at selected products for both branches — special offer for only ₱79 at Dasmariñas Branch!</p>
                            </div>
                        </div>

                        {/* Card 4: Pulutan Happy Hour Specials */}
                        <div className="md:col-span-3 relative h-52 sm:h-60 md:h-auto md:min-h-[180px] rounded-2xl overflow-hidden raised-layer group hover-heat cursor-pointer bg-[#221a12] border border-[#534434]/60 shadow-xl flex flex-col justify-end">
                            <div className="absolute inset-0 vignette-overlay">
                                <img
                                    className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-all duration-500 group-hover:scale-105"
                                    alt="Happy hour pulutan"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl"
                                />
                            </div>
                            <div className="relative z-10 p-4 sm:p-5 md:p-8 w-full bg-gradient-to-t from-[#1A1A1B] via-[#1A1A1B]/80 to-transparent flex flex-col justify-between h-full md:h-auto">
                                <div className="space-y-1 sm:space-y-1.5">
                                    <span className="font-mono text-[9px] sm:text-xs text-[#f59e0b] bg-[#31281f] px-2 py-0.5 sm:px-3 sm:py-1 rounded border border-[#534434] inline-block font-bold">
                                        HAPPY HOUR • 4PM - 7PM DAILY
                                    </span>
                                    <h3 className="font-domine text-base sm:text-xl md:text-2xl font-bold text-[#ffc174]">Pulutan Happy Hour Specials</h3>
                                    <p className="font-sans text-xs sm:text-sm text-[#d8c3ad] max-w-xl line-clamp-2 md:line-clamp-none">
                                        Gather 'round the roadhouse hearth with ice-cold beverages and piping hot sizzling pulutan platters.
                                    </p>
                                </div>
                                <button onClick={() => setIsOrderModalOpen(true)} className="text-[#f59e0b] font-mono text-[11px] sm:text-xs font-bold flex items-center hover:text-[#ffc174] transition-colors pt-1.5">
                                    ORDER PULUTAN NOW <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="sizzle-divider w-[92%] sm:w-[88%] md:w-[80%] max-w-[1440px] mx-auto" />

                {/* 3. FEATURED SIZZLING ITEMS SECTION */}
                <section id="featured-menu" className="py-8 sm:py-12 md:py-16 px-4 w-[92%] sm:w-[88%] md:w-[80%] max-w-[1440px] mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-14">
                        <span className="font-mono text-[10px] sm:text-xs text-[#f59e0b] bg-[#31281f] px-2.5 sm:px-3 py-1 rounded border border-[#534434] uppercase tracking-widest font-bold mb-2 sm:mb-3 inline-block">
                            Chef's Sizzling Favorites
                        </span>
                        <h2 className="font-domine text-2xl sm:text-4xl md:text-5xl text-[#ffc174] font-bold tracking-tight mb-2 sm:mb-3">
                            Featured Sizzling Items
                        </h2>
                        <p className="font-sans text-sm sm:text-base md:text-lg text-[#d8c3ad]">
                            Piping hot cast-iron platters seared right off our charcoal fire.
                        </p>
                    </div>

                    {/* Menu Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
                        {displayedProducts.map((product, index) => {
                            const isOutOfStock = product.stock_quantity <= 0;
                            const isAdded = addedProductId === product.id;
                            const productImage = getFeaturedProductImage(product, index);

                            return (
                                <div
                                    key={product.id || index}
                                    className="bg-[#1A1A1B] rounded-xl border border-[#262627] overflow-hidden flex flex-col justify-between hover-heat transition-all duration-300 shadow-xl group"
                                >
                                    {/* Product Image Showcase with exact 16:9 aspect ratio */}
                                    <div className="aspect-video w-full relative overflow-hidden bg-[#121213]">
                                        <img
                                            src={productImage}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between space-y-3 sm:space-y-4">
                                        <div>
                                            <h3 className="font-domine text-base sm:text-lg lg:text-xl font-bold text-[#f0e0d1] group-hover:text-[#ffc174] transition-colors leading-snug">
                                                {product.name}
                                            </h3>
                                            {product.description && (
                                                <p className="font-sans text-xs text-[#d8c3ad] mt-2 line-clamp-2 leading-relaxed">
                                                    {product.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="pt-3 border-t border-[#534434]/50 flex items-center justify-end">
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={isOutOfStock}
                                                className={`w-full py-2.5 sm:py-3 rounded font-bold text-xs uppercase tracking-wider btn-bevel transition-all flex items-center justify-center gap-2 ${isOutOfStock
                                                        ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-800'
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
                                                ) : isOutOfStock ? (
                                                    <span>Currently Unavailable</span>
                                                ) : (
                                                    <>
                                                        <span>Add to Order</span>
                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* View Full Menu & Order Online Redirect Button */}
                    <div className="mt-8 sm:mt-12 text-center flex items-center justify-center">
                        <Link
                            href="/order"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#ffc174] text-[#472a00] font-black px-8 py-4 rounded-xl btn-bevel transition-all text-xs sm:text-sm uppercase tracking-wider shadow-xl"
                        >
                            <span>Explore Full Menu & Order Online</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>

                <div className="sizzle-divider w-[92%] sm:w-[88%] md:w-[80%] max-w-[1440px] mx-auto" />

                {/* 4. SIZZLING MENU CATEGORIES */}
                <section id="categories" className="py-8 sm:py-12 md:py-16 px-4 w-[92%] sm:w-[88%] md:w-[80%] max-w-[1440px] mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <span className="font-mono text-[10px] sm:text-xs text-[#f59e0b] bg-[#31281f] px-2.5 sm:px-3 py-1 rounded border border-[#534434] uppercase tracking-widest font-bold mb-2 sm:mb-3 inline-block">
                            Signature Menu Lineup
                        </span>
                        <h2 className="font-domine text-2xl sm:text-4xl text-[#ffc174] font-bold mb-2">
                            Explore Our Sizzling Categories
                        </h2>
                        <p className="font-sans text-sm sm:text-base text-[#d8c3ad]">Signature sizzling categories straight from the fire.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
                        {/* Category 1: Sizzling Rice Meals (sisig.webp) */}
                        <div className="bg-[#1A1A1B] rounded-xl border border-[#262627] overflow-hidden flex flex-col hover-heat transition-all duration-300 shadow-xl">
                            <div className="aspect-video w-full relative overflow-hidden bg-[#121213]">
                                <img
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    alt="Sizzling Rice Meals category"
                                    src="/images/sisig.webp"
                                />
                            </div>
                            <div className="p-5 sm:p-6 flex-grow flex flex-col justify-center space-y-2">
                                <h3 className="font-domine text-lg sm:text-xl font-bold text-[#f0e0d1] border-b border-[#534434] pb-1 inline-block">
                                    Sizzling Rice Meals
                                </h3>
                                <p className="font-sans text-xs text-[#d8c3ad] leading-relaxed">
                                    Complete hearty platters with garlic rice, topped with tender meats and savory gravies on hot cast iron.
                                </p>
                            </div>
                        </div>

                        {/* Category 2: Authentic Filipino Cuisine (pork_sinigang.webp) */}
                        <div className="bg-[#1A1A1B] rounded-xl border border-[#262627] overflow-hidden flex flex-col hover-heat transition-all duration-300 shadow-xl">
                            <div className="aspect-video w-full relative overflow-hidden bg-[#121213]">
                                <img
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    alt="Authentic Filipino Cuisine category"
                                    src="/images/pork_sinigang.webp"
                                />
                            </div>
                            <div className="p-5 sm:p-6 flex-grow flex flex-col justify-center space-y-2">
                                <h3 className="font-domine text-lg sm:text-xl font-bold text-[#f0e0d1] border-b border-[#534434] pb-1 inline-block">
                                    Authentic Filipino Cuisine
                                </h3>
                                <p className="font-sans text-xs text-[#d8c3ad] leading-relaxed">
                                    Time-honored Filipino heritage recipes cooked sizzling hot with bold local seasonings and native flair.
                                </p>
                            </div>
                        </div>

                        {/* Category 3: Barkada Platters (platter_sisig.webp) */}
                        <div className="bg-[#1A1A1B] rounded-xl border border-[#262627] overflow-hidden flex flex-col hover-heat transition-all duration-300 shadow-xl sm:col-span-2 md:col-span-1">
                            <div className="aspect-video w-full relative overflow-hidden bg-[#121213]">
                                <img
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    alt="Barkada Platters category"
                                    src="/images/platter_sisig.webp"
                                />
                            </div>
                            <div className="p-5 sm:p-6 flex-grow flex flex-col justify-center space-y-2">
                                <h3 className="font-domine text-lg sm:text-xl font-bold text-[#f0e0d1] border-b border-[#534434] pb-1 inline-block">
                                    Barkada Platters
                                </h3>
                                <p className="font-sans text-xs text-[#d8c3ad] leading-relaxed">
                                    Generous sharing platters made for group feasts, family gatherings, and roadhouse celebrations.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="sizzle-divider w-[92%] sm:w-[88%] md:w-[80%] max-w-[1440px] mx-auto" />

                {/* 5. ROADHOUSE LOCATIONS SECTION (Images Removed) */}
                <section id="locations" className="py-6 sm:py-12 md:py-16 px-4 w-[92%] sm:w-[88%] md:w-[80%] max-w-[1440px] mx-auto">
                    <div className="text-center mb-6 sm:mb-12">
                        <span className="font-mono text-[10px] sm:text-xs text-[#f59e0b] bg-[#31281f] px-2.5 sm:px-3 py-1 rounded border border-[#534434] uppercase tracking-widest font-bold mb-2 sm:mb-3 inline-block">
                            Visit Our Roadhouses
                        </span>
                        <h2 className="font-domine text-2xl sm:text-4xl md:text-5xl text-[#ffc174] font-bold">Our Locations</h2>
                        <p className="font-sans text-xs sm:text-base text-[#d8c3ad] mt-1">Come experience the smoky hearth and cast-iron sizzle.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                        {/* Location 1: Saddle Ranch Bulihan */}
                        <div className="bg-[#1A1A1B] rounded-xl border border-[#262627] p-5 sm:p-6 md:p-8 flex flex-col justify-between hover-heat transition-all shadow-xl group">
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-domine text-xl sm:text-2xl font-bold text-[#ffc174]">Saddle Ranch Bulihan</h3>
                                    <span className="font-mono text-[10px] sm:text-xs text-[#f59e0b] bg-[#31281f] px-2.5 py-1 rounded border border-[#534434] uppercase font-bold">
                                        FLAGSHIP
                                    </span>
                                </div>
                                <p className="font-sans text-xs sm:text-sm text-[#d8c3ad] leading-relaxed">
                                    Our flagship sizzling roadhouse serving Bulihan with authentic sizzling steaks, fresh sisig, and cold drinks daily.
                                </p>
                                <div className="space-y-2 font-sans text-xs sm:text-sm text-[#f0e0d1] pt-1">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <MapPin className="w-4 h-4 text-[#f59e0b] flex-shrink-0" />
                                        <span className="font-medium">block 26 lot 17, Anahaw St, Silang, Cavite</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <Clock className="w-4 h-4 text-[#f59e0b] flex-shrink-0" />
                                        <span>Monday - Sunday: 11:00 AM - 11:00 PM</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <Phone className="w-4 h-4 text-[#f59e0b] flex-shrink-0" />
                                        <span>+63 917 123 4567</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 pt-6 border-t border-[#534434]/40 mt-6">
                                <button onClick={() => setIsOrderModalOpen(true)} className="flex-1 py-3 rounded bg-[#f59e0b] text-[#472a00] font-bold text-xs uppercase tracking-wider btn-bevel shadow-lg hover:bg-[#ffc174] transition-all cursor-pointer">
                                    Order from Bulihan Branch
                                </button>
                                <a
                                    href="https://maps.app.goo.gl/7gYiTW5Q9qLJKXeUA"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="py-3 px-4 rounded bg-[#121213] border border-[#534434] hover:border-[#f59e0b] text-[#ffc174] hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 btn-bevel cursor-pointer"
                                >
                                    <MapPin className="w-4 h-4 text-red-400" />
                                    <span>Google Maps</span>
                                </a>
                            </div>
                        </div>

                        {/* Location 2: Saddle Ranch Dasmariñas */}
                        <div className="bg-[#1A1A1B] rounded-xl border border-[#262627] p-5 sm:p-6 md:p-8 flex flex-col justify-between hover-heat transition-all shadow-xl group">
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-domine text-xl sm:text-2xl font-bold text-[#ffc174]">Saddle Ranch Dasmariñas</h3>
                                    <span className="font-mono text-[10px] sm:text-xs text-[#f59e0b] bg-[#31281f] px-2.5 py-1 rounded border border-[#534434] uppercase font-bold">
                                        GOVERNOR'S DR
                                    </span>
                                </div>
                                <p className="font-sans text-xs sm:text-sm text-[#d8c3ad] leading-relaxed">
                                    Our newest roadhouse along Governor's Drive. Bringing sizzling cast-iron comfort food to the heart of Dasmariñas.
                                </p>
                                <div className="space-y-2 font-sans text-xs sm:text-sm text-[#f0e0d1] pt-1">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <MapPin className="w-4 h-4 text-[#f59e0b] flex-shrink-0" />
                                        <span className="font-medium">8X23+Q75, Governor's Dr, San Agustin I, Dasmariñas, 4114 Cavite</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <Clock className="w-4 h-4 text-[#f59e0b] flex-shrink-0" />
                                        <span>Monday - Sunday: 10:00 AM - 10:00 PM</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <Phone className="w-4 h-4 text-[#f59e0b] flex-shrink-0" />
                                        <span>+63 918 987 6543</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 pt-6 border-t border-[#534434]/40 mt-6">
                                <button onClick={() => setIsOrderModalOpen(true)} className="flex-1 py-3 rounded bg-[#f59e0b] text-[#472a00] font-bold text-xs uppercase tracking-wider btn-bevel shadow-lg hover:bg-[#ffc174] transition-all cursor-pointer">
                                    Order from Dasmariñas Branch
                                </button>
                                <a
                                    href="https://maps.app.goo.gl/JAVxVDDNQGo6RQ6U8"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="py-3 px-4 rounded bg-[#121213] border border-[#534434] hover:border-[#f59e0b] text-[#ffc174] hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 btn-bevel cursor-pointer"
                                >
                                    <MapPin className="w-4 h-4 text-red-400" />
                                    <span>Google Maps</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-[#140d06] font-sans text-sm w-full border-t border-[#534434]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-12 w-[92%] sm:w-[88%] md:w-[80%] max-w-[1440px] mx-auto">
                        <div className="flex flex-col space-y-3">
                            <div className="font-domine text-xl font-bold text-[#ffc174]">Saddle Ranch</div>
                            <p className="text-[#d8c3ad] text-xs">Bulihan & Dasmariñas Branches, Cavite</p>
                            <p className="text-[#d8c3ad] font-mono text-xs">MON-SUN: 10 AM - 11 PM</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <h4 className="font-mono text-xs text-[#f0e0d1] mb-1 font-bold">Legal Standards</h4>
                            <button onClick={() => setIsPrivacyModalOpen(true)} className="text-[#d8c3ad] hover:text-[#ffc174] transition-colors text-xs text-left cursor-pointer">
                                Privacy Policy (RA 10173)
                            </button>
                            <button onClick={() => setIsTermsModalOpen(true)} className="text-[#d8c3ad] hover:text-[#ffc174] transition-colors text-xs text-left cursor-pointer">
                                Terms of Service (RA 7394)
                            </button>
                            <button onClick={() => setIsAccessibilityModalOpen(true)} className="text-[#d8c3ad] hover:text-[#ffc174] transition-colors text-xs text-left cursor-pointer">
                                Accessibility (BP 344 / RA 7277)
                            </button>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <h4 className="font-mono text-xs text-[#f0e0d1] mb-1 font-bold">Customer Support</h4>
                            <button onClick={() => setIsContactModalOpen(true)} className="text-[#d8c3ad] hover:text-[#ffc174] transition-colors text-xs text-left cursor-pointer">
                                Contact Us & Branch Support
                            </button>
                            <p className="text-[#d8c3ad] text-xs mt-auto opacity-70">© 2026 Saddle Ranch. Registered Business (Cavite, PH).</p>
                        </div>
                    </div>
                </footer>

                {/* Interactive Order Modal */}
                {isOrderModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="relative w-full max-w-lg rounded-2xl bg-[#1A1A1B]/95 border border-[#ffc174]/30 p-6 sm:p-8 shadow-2xl text-[#f0e0d1] backdrop-blur-md">
                            <button
                                onClick={() => setIsOrderModalOpen(false)}
                                className="absolute top-5 right-5 p-2 rounded-full text-[#d8c3ad] hover:text-white hover:bg-stone-800 transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-6">
                                <h3 className="font-domine text-2xl font-bold text-[#ffc174]">How would you like your order?</h3>
                                <p className="font-sans text-xs text-[#d8c3ad] mt-1">Select your preferred dining or delivery option below.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <button
                                    onClick={() => setSelectedMode('pickup')}
                                    className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between ${selectedMode === 'pickup'
                                            ? 'bg-[#f59e0b]/15 border-[#f59e0b] text-white shadow-lg shadow-[#f59e0b]/10'
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
                                    className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between ${selectedMode === 'delivery'
                                            ? 'bg-[#f59e0b]/15 border-[#f59e0b] text-white shadow-lg shadow-[#f59e0b]/10'
                                            : 'bg-[#121213] border-[#534434] text-[#d8c3ad] hover:border-stone-700'
                                        }`}
                                >
                                    <div>
                                        <Utensils className={`w-6 h-6 mb-3 ${selectedMode === 'delivery' ? 'text-[#f59e0b]' : 'text-stone-500'}`} />
                                        <div className="font-bold text-base text-white">Home Delivery</div>
                                        <p className="text-xs mt-1 text-[#d8c3ad]">Delivered piping hot right to your doorstep.</p>
                                    </div>
                                    <div className="mt-4 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">Free Delivery in Bulihan Area</div>
                                </button>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Link
                                    href={`/order?mode=${selectedMode}`}
                                    className="w-full py-3.5 rounded-xl bg-[#f59e0b] text-[#472a00] font-bold text-center block shadow-xl shadow-[#f59e0b]/20 hover:bg-[#ffc174] transition-all text-sm uppercase tracking-wider btn-bevel"
                                >
                                    Continue to Menu ({selectedMode === 'pickup' ? 'Takeout' : 'Delivery'})
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Floating AI Chatbot at Bottom Left */}
                <AIChatbot />

                {/* Floating Order Tracker at Bottom Right */}
                <CustomerOrderTracker />
                <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
                <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />

                {/* Terms of Service Modal (RA 7394 Consumer Act & RA 8792 E-Commerce Act) */}
                {isTermsModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="w-full max-w-lg rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-6 shadow-2xl space-y-5 text-[#f0e0d1] max-h-[85vh] overflow-y-auto font-sans">
                            <div className="flex items-center justify-between border-b border-[#3D3126] pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#ffc174] flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-domine text-lg font-bold text-[#ffc174]">Terms of Service</h3>
                                        <p className="text-xs text-[#d8c3ad]">Consumer Protection (RA 7394) & E-Commerce Act (RA 8792)</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsTermsModalOpen(false)} className="p-1.5 text-[#d8c3ad] hover:text-white hover:bg-[#31281f] rounded-lg transition-colors cursor-pointer">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4 text-xs leading-relaxed text-[#d8c3ad]">
                                <div className="p-3.5 rounded-2xl bg-[#121213] border border-[#3D3126] space-y-1">
                                    <h4 className="font-bold text-[#ffc174]">1. Online Ordering & Fulfillment</h4>
                                    <p>By placing an order via Saddle Ranch Online Ordering or In-House Table QR, you confirm that all entered details are accurate. Food prep begins immediately upon confirmation.</p>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-[#121213] border border-[#3D3126] space-y-1">
                                    <h4 className="font-bold text-[#ffc174]">2. Pricing & Currency (PHP)</h4>
                                    <p>All prices listed on Saddle Ranch are in Philippine Pesos (₱ PHP) inclusive of applicable taxes under Department of Trade and Industry (DTI) regulations.</p>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-[#121213] border border-[#3D3126] space-y-1">
                                    <h4 className="font-bold text-[#ffc174]">3. Cancellations & Refunds</h4>
                                    <p>Per standard food safety protocols, orders cancelled after kitchen preparation has commenced are non-refundable. For defective orders, contact store management within 30 minutes.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Accessibility Modal (BP 344 & RA 7277 Magna Carta for PWDs) */}
                {isAccessibilityModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="w-full max-w-lg rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-6 shadow-2xl space-y-5 text-[#f0e0d1] max-h-[85vh] overflow-y-auto font-sans">
                            <div className="flex items-center justify-between border-b border-[#3D3126] pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#ffc174] flex items-center justify-center shrink-0">
                                        <Utensils className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-domine text-lg font-bold text-[#ffc174]">Accessibility Statement</h3>
                                        <p className="text-xs text-[#d8c3ad]">Batas Pambansa Blg. 344 & RA 7277 PWD Standards</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsAccessibilityModalOpen(false)} className="p-1.5 text-[#d8c3ad] hover:text-white hover:bg-[#31281f] rounded-lg transition-colors cursor-pointer">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4 text-xs leading-relaxed text-[#d8c3ad]">
                                <div className="p-3.5 rounded-2xl bg-[#121213] border border-[#3D3126] space-y-1">
                                    <h4 className="font-bold text-[#ffc174]">High-Contrast Design & Readable Fonts</h4>
                                    <p>Saddle Ranch digital platforms are built with WCAG 2.1 AA compliant high-contrast dark palette, large readable typography, and aria-labels for assistive screen readers.</p>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-[#121213] border border-[#3D3126] space-y-1">
                                    <h4 className="font-bold text-[#ffc174]">Physical Branch Accessibility</h4>
                                    <p>Our Bulihan and Dasmariñas roadhouse branches feature ground-level PWD ramp access, wide entrance doorways, and accessible seating in compliance with BP 344.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact Us & Support Modal */}
                {isContactModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="w-full max-w-lg rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-6 shadow-2xl space-y-5 text-[#f0e0d1] max-h-[85vh] overflow-y-auto font-sans">
                            <div className="flex items-center justify-between border-b border-[#3D3126] pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#ffc174] flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-domine text-lg font-bold text-[#ffc174]">Contact Us & Support</h3>
                                        <p className="text-xs text-[#d8c3ad]">Saddle Ranch Customer Care (Cavite, Philippines)</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsContactModalOpen(false)} className="p-1.5 text-[#d8c3ad] hover:text-white hover:bg-[#31281f] rounded-lg transition-colors cursor-pointer">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4 text-xs leading-relaxed text-[#d8c3ad]">
                                <div className="p-3.5 rounded-2xl bg-[#121213] border border-[#3D3126] space-y-1.5">
                                    <div className="flex items-center gap-2 text-white font-bold">
                                        <MapPin className="w-4 h-4 text-[#f59e0b]" /> Bulihan Branch Hotline
                                    </div>
                                    <p>Brgy. Bulihan, Silang, Cavite • Operating Hours: 10:00 AM - 11:00 PM</p>
                                    <p className="font-mono text-[#ffc174]">Phone: (046) 889-1234 / +63 917 123 4567</p>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-[#121213] border border-[#3D3126] space-y-1.5">
                                    <div className="flex items-center gap-2 text-white font-bold">
                                        <MapPin className="w-4 h-4 text-[#f59e0b]" /> Dasmariñas Branch Hotline
                                    </div>
                                    <p>Aguinaldo Highway, Dasmariñas, Cavite • Operating Hours: 10:00 AM - 11:00 PM</p>
                                    <p className="font-mono text-[#ffc174]">Phone: (046) 416-5678 / +63 918 765 4321</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
