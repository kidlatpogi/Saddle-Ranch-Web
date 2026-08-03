import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Flame, Utensils, ShoppingBag, ArrowRight, X, ShoppingCart, MapPin, Clock, Phone, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart, CartProduct } from '@/Hooks/useCart';
import CardNav, { CardNavItem } from '@/Components/CardNav';
import AIChatbot from '@/Components/AIChatbot';
import CustomerOrderTracker from '@/Components/CustomerOrderTracker';
import LocationModal from '@/Components/LocationModal';

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
    const [showAllMenu, setShowAllMenu] = useState(false);
    const { addItem, itemCount } = useCart();
    const [addedProductId, setAddedProductId] = useState<number | null>(null);
    const [scrollY, setScrollY] = useState(0);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [currentBranch, setCurrentBranch] = useState<'Bulihan' | 'Dasma'>(() => (localStorage.getItem('saddle_ranch_branch') as any) || 'Bulihan');
    const [currentLocName, setCurrentLocName] = useState<string>(() => localStorage.getItem('saddle_ranch_location_name') || 'Bulihan, Silang, Cavite');
    const [currentDistance, setCurrentDistance] = useState<string>(() => localStorage.getItem('saddle_ranch_distance') || '1.2 km away');

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
                { label: 'Table QR Service', href: '/dine-in?table=05', ariaLabel: 'Dine-In Table QR' },
            ],
        },
        {
            label: 'Promos & Access',
            bgColor: '#1c150e',
            textColor: '#f0e0d1',
            links: [
                { label: 'All Customer Orders', href: '/order', ariaLabel: 'View All Customer Live Orders' },
                { label: 'Roadhouse Promos', href: '#promos', ariaLabel: 'Special Roadhouse Promos' },
                { label: 'Staff Portal', href: '/login', ariaLabel: 'Staff Login Portal' },
            ],
        },
    ];

    // 12 High-fidelity fallback products with images
    const fallbackProducts: Product[] = [
        {
            id: 1,
            name: 'Sizzling Pork Sisig',
            description: 'Crispy pork belly seasoned with local spices, served on a sizzling cast-iron skillet with fresh egg and chilies.',
            price: 180.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t',
            stock_quantity: 50,
            is_active: true,
        },
        {
            id: 2,
            name: 'Sizzling Pork T-Bone Steak',
            description: 'Tender T-Bone steak seared hard on cast iron, topped with rich roadhouse gravy and buttered vegetables.',
            price: 280.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASVSO6N3lzIbdlCDT85viSxOZiQKjWADlA5k7ymludjTdSCB7tqV0bZvXRba3-L4gemLyqy9PxmqnYMBnSsxb5yfI_XM-qajS5ZEnS1Am8OBu5uN8_smBFlDdy4xR0UNE8jDFJP8vNSRQcqqDSG4p-oDij5kCvWALcyBZVeuA1QdnqC9a6I5s9l2ba3Zjfe0xSPjMr0jLCAB1z-oJS5xBL9meeUeFsmiMgjQ96VoXotgHsy3Jl3d9NQIv1liJsKeu_sJec2rrkNziY',
            stock_quantity: 30,
            is_active: true,
        },
        {
            id: 3,
            name: 'Sizzling Bulalo Steak',
            description: 'Rich beef shank served with simmering bone marrow gravy on a smoking sizzling plate.',
            price: 450.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCatSLXJ-mynm_AwjLXsdG9xKbMwziehShgiNtyXaX2NZEeZFhSXaTmHMgLuACAitSC3WZ0g_9lSTavvnqO4eKFlaC0pnnA9OngEMtRicl0vfSF2_t4WqzxTKxW-H-X0i_tppiClzEOZ-fAuu1ezCbRVOcdVdwZHokttY1ATDIO4BuA185dwrm0QDuPpYjQ7qD9ybH5bl0WPn1wHJ3S5pB6JuCOoocWTfZ95cB0Lfqx1KbjbUwqGJxkhwxmqypEJta64yq1PajT3oWC',
            stock_quantity: 15,
            is_active: true,
        },
        {
            id: 4,
            name: 'Sizzling Chicken Inasal Platter',
            description: 'Chargrilled Bacolod-style chicken served sizzling hot with annatto garlic butter oil and rice.',
            price: 220.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6QEUONokTX7mi1M1Wrie14cxeoNfVq5HyIS1sLOLWKbzZyh6OfegCBaNeH6E7uS37ugVc6jjmILNzIrmvE0tpXkOBCDP29HO1WZL69MsOd6lpwp4oX6ezfDjuAsLMCu57vBpiHDupWu3yDATuk2k_HgpQMi23Y7mifgQKqPJhc0GqDXCCk1tPooIkFyBCXPiESBHm8HKF8cp1ctvD0RZ39YNVxKG_2cPaPyfryUGBbaoIHhqqhq5R9BflPtI6jMfzsP3W6QStlttx',
            stock_quantity: 40,
            is_active: true,
        },
        {
            id: 5,
            name: 'Sizzling Beef Pepper Rice',
            description: 'Thinly sliced tender beef with ground black pepper, sweet corn, and garlic rice on hot iron.',
            price: 195.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT2sso9NgKHiCPPIkIfBBCfPNPUK_dgit8ctI0rtoMT_bXyQ21nRcx3ViyVnDNZTyTCVtYOSFJ8h_h3ZG451V7vUFX1LFMWyd6wQrV-4pevn9wO0H-wUZVYl0TBSwWt_bbQikBKmtygbJeYfSzWbAOcd32EpNo8TCvpmAamQoFlFfNvHrmpn32aUcJ7gi5IGdK9xpTad7qU6dSRSu2bty13h9_T3_GKF3mMrUI31pUXtjCvVgiLfQIkBBbjU_zY5SS0IrP8nvbh7QQ',
            stock_quantity: 35,
            is_active: true,
        },
        {
            id: 6,
            name: 'Sizzling Gambas Al Ajillo',
            description: 'Succulent shrimp sautéed in garlic oil, chili flakes, and butter on a smoking cast-iron platter.',
            price: 260.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl',
            stock_quantity: 25,
            is_active: true,
        },
        {
            id: 7,
            name: 'Sizzling Pork Chop Supreme',
            description: 'Thick-cut marinating pork chops seared on hot cast iron with savory house gravy.',
            price: 210.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASVSO6N3lzIbdlCDT85viSxOZiQKjWADlA5k7ymludjTdSCB7tqV0bZvXRba3-L4gemLyqy9PxmqnYMBnSsxb5yfI_XM-qajS5ZEnS1Am8OBu5uN8_smBFlDdy4xR0UNE8jDFJP8vNSRQcqqDSG4p-oDij5kCvWALcyBZVeuA1QdnqC9a6I5s9l2ba3Zjfe0xSPjMr0jLCAB1z-oJS5xBL9meeUeFsmiMgjQ96VoXotgHsy3Jl3d9NQIv1liJsKeu_sJec2rrkNziY',
            stock_quantity: 30,
            is_active: true,
        },
        {
            id: 8,
            name: 'Sizzling Bangus Sisig',
            description: 'Deboned milkfish flaked and crisp-fried with onions, calamansi, and chili on a sizzling plate.',
            price: 190.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t',
            stock_quantity: 45,
            is_active: true,
        },
        {
            id: 9,
            name: 'Sizzling Ribeye Steak Deluxe',
            description: 'Premium bone-in cowboy ribeye steak with signature herb butter and roasted garlic cloves.',
            price: 490.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqtvjGjUsuBGyzBHVhntcLtTHQL442EMNheO8rq-4bOP-zq35cYw-DswcOn6dpMuPv5ukX12iSEzREwKgb6iPoUk64ETmBeEcSAd_ACcZoIibAIU9yR4PAPlj2o5GbDfdalWoY2tkEYUIrX_067eJx75-iVNUhMQQwzXdK3OmEDSQSGelDLgr5zgcY5sN7zsIqaaHUGQXrLpgju8NF3deoQjQPo--R-W6fwR50zfB_tGo3dBdO2gM7hr6EUUVxLgCF5gCn94DbGA_N',
            stock_quantity: 20,
            is_active: true,
        },
        {
            id: 10,
            name: 'Sizzling Lechon Kawali',
            description: 'Super crispy deep-fried pork belly served sizzling with lechon sauce and chili peppers.',
            price: 240.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6QEUONokTX7mi1M1Wrie14cxeoNfVq5HyIS1sLOLWKbzZyh6OfegCBaNeH6E7uS37ugVc6jjmILNzIrmvE0tpXkOBCDP29HO1WZL69MsOd6lpwp4oX6ezfDjuAsLMCu57vBpiHDupWu3yDATuk2k_HgpQMi23Y7mifgQKqPJhc0GqDXCCk1tPooIkFyBCXPiESBHm8HKF8cp1ctvD0RZ39YNVxKG_2cPaPyfryUGBbaoIHhqqhq5R9BflPtI6jMfzsP3W6QStlttx',
            stock_quantity: 28,
            is_active: true,
        },
        {
            id: 11,
            name: 'Sizzling Squid Flower',
            description: 'Tender ocean squid scored into flowers and seared in sweet-spicy garlic glaze.',
            price: 230.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl',
            stock_quantity: 22,
            is_active: true,
        },
        {
            id: 12,
            name: 'Sizzling Garlic Butter Shrimp',
            description: 'Plump jumbo tiger prawns tossed in melted butter, roasted garlic, and scallions on cast iron.',
            price: 275.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT2sso9NgKHiCPPIkIfBBCfPNPUK_dgit8ctI0rtoMT_bXyQ21nRcx3ViyVnDNZTyTCVtYOSFJ8h_h3ZG451V7vUFX1LFMWyd6wQrV-4pevn9wO0H-wUZVYl0TBSwWt_bbQikBKmtygbJeYfSzWbAOcd32EpNo8TCvpmAamQoFlFfNvHrmpn32aUcJ7gi5IGdK9xpTad7qU6dSRSu2bty13h9_T3_GKF3mMrUI31pUXtjCvVgiLfQIkBBbjU_zY5SS0IrP8nvbh7QQ',
            stock_quantity: 25,
            is_active: true,
        },
    ];

    const allProductsList = products && products.length > 0 ? products : fallbackProducts;
    const displayedProducts = showAllMenu ? allProductsList : allProductsList.slice(0, 6);

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
                        {displayedProducts.map((product) => {
                            const numPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                            const isOutOfStock = product.stock_quantity <= 0;
                            const isAdded = addedProductId === product.id;

                            return (
                                <div
                                    key={product.id}
                                    className="bg-[#1A1A1B] rounded-xl border border-[#262627] overflow-hidden flex flex-col justify-between hover-heat transition-all duration-300 shadow-xl group"
                                >
                                    {/* Product Image Showcase */}
                                    <div className="h-44 sm:h-48 md:h-52 lg:h-56 w-full relative vignette-overlay overflow-hidden">
                                        <img
                                            src={product.image_path || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                                        />
                                        <div className="absolute top-3 right-3 z-10">
                                            <span className="font-mono text-xs sm:text-sm font-black text-[#121213] bg-[#ffc174] px-2.5 py-1 rounded shadow-md">
                                                ₱{numPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className="p-4 sm:p-5 md:p-6 flex-grow flex flex-col justify-between space-y-3 sm:space-y-4">
                                        <div>
                                            <h3 className="font-domine text-lg sm:text-xl font-bold text-[#f0e0d1] group-hover:text-[#ffc174] transition-colors mb-1.5 sm:mb-2">
                                                {product.name}
                                            </h3>
                                            <p className="font-sans text-xs text-[#d8c3ad] leading-relaxed line-clamp-3">
                                                {product.description}
                                            </p>
                                        </div>

                                        <div className="pt-3 border-t border-[#534434]/50 flex items-center justify-end">
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={isOutOfStock}
                                                className={`w-full py-2.5 sm:py-3 rounded font-bold text-xs uppercase tracking-wider btn-bevel transition-all flex items-center justify-center gap-2 ${
                                                    isOutOfStock
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

                    {/* View More Button */}
                    <div className="mt-8 sm:mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => setShowAllMenu(!showAllMenu)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1A1A1B] border border-[#534434] hover:border-[#f59e0b] text-[#ffc174] hover:text-white font-bold px-8 py-3.5 rounded-lg btn-bevel transition-all text-xs sm:text-sm uppercase tracking-wider shadow-lg"
                        >
                            <span>{showAllMenu ? 'Show Less' : `Show More (${allProductsList.length} Total Items)`}</span>
                            {showAllMenu ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <Link
                            href="/order"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#f59e0b] text-[#472a00] font-bold px-8 py-3.5 rounded-lg btn-bevel hover:bg-[#ffc174] transition-all text-xs sm:text-sm uppercase tracking-wider shadow-lg"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Cart {itemCount > 0 ? `(${itemCount})` : ''}</span>
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
                        {/* Category 1: Sizzling Rice Meals */}
                        <div className="bg-[#1A1A1B] rounded-xl border border-[#262627] overflow-hidden flex flex-col hover-heat transition-all duration-300 shadow-xl">
                            <div className="h-40 sm:h-44 md:h-48 relative vignette-overlay">
                                <img
                                    className="w-full h-full object-cover opacity-80"
                                    alt="Sizzling Rice Meals category"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT2sso9NgKHiCPPIkIfBBCfPNPUK_dgit8ctI0rtoMT_bXyQ21nRcx3ViyVnDNZTyTCVtYOSFJ8h_h3ZG451V7vUFX1LFMWyd6wQrV-4pevn9wO0H-wUZVYl0TBSwWt_bbQikBKmtygbJeYfSzWbAOcd32EpNo8TCvpmAamQoFlFfNvHrmpn32aUcJ7gi5IGdK9xpTad7qU6dSRSu2bty13h9_T3_GKF3mMrUI31pUXtjCvVgiLfQIkBBbjU_zY5SS0IrP8nvbh7QQ"
                                />
                            </div>
                            <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
                                <div>
                                    <h3 className="font-domine text-lg sm:text-xl font-bold text-[#f0e0d1] mb-2 border-b border-[#534434] pb-1 inline-block">
                                        Sizzling Rice Meals
                                    </h3>
                                    <p className="font-sans text-xs text-[#d8c3ad] leading-relaxed">
                                        Complete hearty platters with garlic rice, topped with tender meats and savory gravies on hot cast iron.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 font-mono text-[10px] font-bold">
                                    <span className="text-[#f0e0d1] border border-[#534434] px-2 py-1 rounded bg-[#261e15]">BEEF PEPPER</span>
                                    <span className="text-[#f0e0d1] border border-[#534434] px-2 py-1 rounded bg-[#261e15]">PORK CHOP</span>
                                </div>
                            </div>
                        </div>

                        {/* Category 2: Authentic Filipino Cuisine */}
                        <div className="bg-[#1A1A1B] rounded-xl border border-[#262627] overflow-hidden flex flex-col hover-heat transition-all duration-300 shadow-xl">
                            <div className="h-40 sm:h-44 md:h-48 relative vignette-overlay">
                                <img
                                    className="w-full h-full object-cover opacity-80"
                                    alt="Authentic Filipino Cuisine category"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t"
                                />
                            </div>
                            <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
                                <div>
                                    <h3 className="font-domine text-lg sm:text-xl font-bold text-[#f0e0d1] mb-2 border-b border-[#534434] pb-1 inline-block">
                                        Authentic Filipino Cuisine
                                    </h3>
                                    <p className="font-sans text-xs text-[#d8c3ad] leading-relaxed">
                                        Time-honored Filipino heritage recipes cooked sizzling hot with bold local seasonings and native flair.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 font-mono text-[10px] font-bold">
                                    <span className="text-[#f0e0d1] border border-[#534434] px-2 py-1 rounded bg-[#261e15]">SISIG</span>
                                    <span className="text-[#f0e0d1] border border-[#534434] px-2 py-1 rounded bg-[#261e15]">LECHON KAWALI</span>
                                </div>
                            </div>
                        </div>

                        {/* Category 3: Barkada Platters */}
                        <div className="bg-[#1A1A1B] rounded-xl border border-[#262627] overflow-hidden flex flex-col hover-heat transition-all duration-300 shadow-xl sm:col-span-2 md:col-span-1">
                            <div className="h-40 sm:h-44 md:h-48 relative vignette-overlay">
                                <img
                                    className="w-full h-full object-cover opacity-80"
                                    alt="Barkada Platters category"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuASVSO6N3lzIbdlCDT85viSxOZiQKjWADlA5k7ymludjTdSCB7tqV0bZvXRba3-L4gemLyqy9PxmqnYMBnSsxb5yfI_XM-qajS5ZEnS1Am8OBu5uN8_smBFlDdy4xR0UNE8jDFJP8vNSRQcqqDSG4p-oDij5kCvWALcyBZVeuA1QdnqC9a6I5s9l2ba3Zjfe0xSPjMr0jLCAB1z-oJS5xBL9meeUeFsmiMgjQ96VoXotgHsy3Jl3d9NQIv1liJsKeu_sJec2rrkNziY"
                                />
                            </div>
                            <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
                                <div>
                                    <h3 className="font-domine text-lg sm:text-xl font-bold text-[#f0e0d1] mb-2 border-b border-[#534434] pb-1 inline-block">
                                        Barkada Platters
                                    </h3>
                                    <p className="font-sans text-xs text-[#d8c3ad] leading-relaxed">
                                        Generous sharing platters made for group feasts, family gatherings, and roadhouse celebrations.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 font-mono text-[10px] font-bold">
                                    <span className="text-[#f0e0d1] border border-[#534434] px-2 py-1 rounded bg-[#261e15]">SHARING</span>
                                    <span className="text-[#f0e0d1] border border-[#534434] px-2 py-1 rounded bg-[#261e15]">FEAST</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="sizzle-divider w-[92%] sm:w-[88%] md:w-[80%] max-w-[1440px] mx-auto" />

                {/* 5. ROADHOUSE LOCATIONS SECTION */}
                <section id="locations" className="py-6 sm:py-12 md:py-16 px-4 w-[92%] sm:w-[88%] md:w-[80%] max-w-[1440px] mx-auto">
                    <div className="text-center mb-5 sm:mb-12">
                        <span className="font-mono text-[10px] sm:text-xs text-[#f59e0b] bg-[#31281f] px-2.5 sm:px-3 py-1 rounded border border-[#534434] uppercase tracking-widest font-bold mb-2 sm:mb-3 inline-block">
                            Visit Our Roadhouses
                        </span>
                        <h2 className="font-domine text-2xl sm:text-4xl md:text-5xl text-[#ffc174] font-bold">Our Locations</h2>
                        <p className="font-sans text-xs sm:text-base text-[#d8c3ad] mt-1">Come experience the smoky hearth and cast-iron sizzle.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                        {/* Location 1: Saddle Ranch Bulihan */}
                        <div className="bg-[#1A1A1B] rounded-xl border border-[#262627] overflow-hidden flex flex-col justify-between hover-heat transition-all shadow-xl group">
                            <a
                                href="https://maps.app.goo.gl/7gYiTW5Q9qLJKXeUA"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-32 sm:h-44 md:h-60 w-full relative vignette-overlay overflow-hidden block cursor-pointer"
                            >
                                <img
                                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                                    alt="Google Maps View - Saddle Ranch Bulihan"
                                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80"
                                />
                                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex flex-wrap gap-1.5">
                                    <span className="font-mono text-[8px] sm:text-[10px] text-[#f59e0b] bg-[#31281f]/90 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border border-[#534434] font-bold shadow">
                                        ORIGINAL FLAGSHIP BRANCH
                                    </span>
                                    <span className="font-mono text-[8px] sm:text-[10px] text-white bg-red-600/90 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded font-bold shadow flex items-center gap-1">
                                        <MapPin className="w-2.5 h-2.5" /> GOOGLE MAPS LOCATION
                                    </span>
                                </div>
                            </a>
                            <div className="p-3.5 sm:p-6 md:p-8 flex-grow flex flex-col justify-between space-y-3 sm:space-y-6">
                                <div>
                                    <h3 className="font-domine text-lg sm:text-2xl font-bold text-[#ffc174] mb-1 sm:mb-2">Saddle Ranch Bulihan</h3>
                                    <p className="font-sans text-xs sm:text-sm text-[#d8c3ad] leading-snug sm:leading-relaxed mb-2.5 sm:mb-4 line-clamp-2 sm:line-clamp-none">
                                        Our flagship sizzling roadhouse serving Bulihan with authentic sizzling steaks, fresh sisig, and cold drinks daily.
                                    </p>
                                    <div className="space-y-1.5 sm:space-y-2.5 font-sans text-xs sm:text-sm text-[#f0e0d1]">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f59e0b] flex-shrink-0" />
                                            <span className="font-medium">block 26 lot 17, Anahaw St, Silang, Cavite</span>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f59e0b] flex-shrink-0" />
                                            <span>Monday - Sunday: 11:00 AM - 11:00 PM</span>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f59e0b] flex-shrink-0" />
                                            <span>+63 917 123 4567</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                                    <button onClick={() => setIsOrderModalOpen(true)} className="flex-1 py-2.5 sm:py-3 rounded bg-[#f59e0b] text-[#472a00] font-bold text-[11px] sm:text-xs uppercase tracking-wider btn-bevel shadow-lg hover:bg-[#ffc174] transition-all cursor-pointer">
                                        Order from Bulihan Branch
                                    </button>
                                    <a
                                        href="https://maps.app.goo.gl/7gYiTW5Q9qLJKXeUA"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="py-2.5 sm:py-3 px-3.5 rounded bg-[#121213] border border-[#534434] hover:border-[#f59e0b] text-[#ffc174] hover:text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 btn-bevel cursor-pointer"
                                    >
                                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                                        <span>Google Maps</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Location 2: Saddle Ranch Dasmariñas */}
                        <div className="bg-[#1A1A1B] rounded-xl border border-[#262627] overflow-hidden flex flex-col justify-between hover-heat transition-all shadow-xl group">
                            <a
                                href="https://maps.app.goo.gl/JAVxVDDNQGo6RQ6U8"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-32 sm:h-44 md:h-60 w-full relative vignette-overlay overflow-hidden block cursor-pointer"
                            >
                                <img
                                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                                    alt="Google Maps View - Saddle Ranch Dasmarinas"
                                    src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=1200&q=80"
                                />
                                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex flex-wrap gap-1.5">
                                    <span className="font-mono text-[8px] sm:text-[10px] text-[#f59e0b] bg-[#31281f]/90 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border border-[#534434] font-bold shadow">
                                        NEW BRANCH LOCATION
                                    </span>
                                    <span className="font-mono text-[8px] sm:text-[10px] text-white bg-red-600/90 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded font-bold shadow flex items-center gap-1">
                                        <MapPin className="w-2.5 h-2.5" /> GOOGLE MAPS LOCATION
                                    </span>
                                </div>
                            </a>
                            <div className="p-3.5 sm:p-6 md:p-8 flex-grow flex flex-col justify-between space-y-3 sm:space-y-6">
                                <div>
                                    <h3 className="font-domine text-lg sm:text-2xl font-bold text-[#ffc174] mb-1 sm:mb-2">Saddle Ranch Dasmariñas</h3>
                                    <p className="font-sans text-xs sm:text-sm text-[#d8c3ad] leading-snug sm:leading-relaxed mb-2.5 sm:mb-4 line-clamp-2 sm:line-clamp-none">
                                        Our newest roadhouse along Governor's Drive. Bringing sizzling cast-iron comfort food to the heart of Dasmariñas.
                                    </p>
                                    <div className="space-y-1.5 sm:space-y-2.5 font-sans text-xs sm:text-sm text-[#f0e0d1]">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f59e0b] flex-shrink-0" />
                                            <span className="font-medium">8X23+Q75, Governor's Dr, San Agustin I, Dasmariñas, 4114 Cavite</span>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f59e0b] flex-shrink-0" />
                                            <span>Monday - Sunday: 10:00 AM - 10:00 PM</span>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f59e0b] flex-shrink-0" />
                                            <span>+63 918 987 6543</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                                    <button onClick={() => setIsOrderModalOpen(true)} className="flex-1 py-2.5 sm:py-3 rounded bg-[#f59e0b] text-[#472a00] font-bold text-[11px] sm:text-xs uppercase tracking-wider btn-bevel shadow-lg hover:bg-[#ffc174] transition-all cursor-pointer">
                                        Order from Dasmariñas Branch
                                    </button>
                                    <a
                                        href="https://maps.app.goo.gl/JAVxVDDNQGo6RQ6U8"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="py-2.5 sm:py-3 px-3.5 rounded bg-[#121213] border border-[#534434] hover:border-[#f59e0b] text-[#ffc174] hover:text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 btn-bevel cursor-pointer"
                                    >
                                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                                        <span>Google Maps</span>
                                    </a>
                                </div>
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
                                    className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                        selectedMode === 'pickup'
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
                                    className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                        selectedMode === 'delivery'
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
            </div>
        </>
    );
}
