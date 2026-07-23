import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Flame, Utensils, ShoppingBag, ArrowRight, X, ShoppingCart, MapPin, Clock, Phone, CheckCircle2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useCart, CartProduct } from '@/Hooks/useCart';
import CardNav, { CardNavItem } from '@/Components/CardNav';

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

                {/* Hero Section with Zoomed Video Background */}
                <header className="relative min-h-[85vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
                    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover scale-110"
                        >
                            <source src="/landing-video.mp4" type="video/mp4" />
                        </video>
                        {/* Dark Vignette Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121213] via-[#121213]/60 to-[#121213]/40" />
                    </div>

                    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-6">
                        <span className="inline-flex items-center gap-2 font-mono text-xs text-[#f59e0b] bg-[#31281f]/90 px-3.5 py-1.5 rounded border border-[#534434] uppercase tracking-widest font-bold shadow-lg">
                            <Flame className="w-4 h-4 text-[#f59e0b]" /> Authentic Sizzling Roadhouse
                        </span>

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

                <div className="sizzle-divider w-[90%] max-w-[1440px] mx-auto" />

                {/* 1. PROMOTIONAL BANNERS SECTION (Width set to 90% of screen to eliminate wide empty margins) */}
                <section id="promos" className="py-12 px-4 w-[90%] max-w-[1440px] mx-auto">
                    <div className="text-center mb-10">
                        <span className="font-mono text-xs text-[#f59e0b] bg-[#31281f] px-3 py-1 rounded border border-[#534434] uppercase tracking-widest font-bold inline-block mb-2">
                            Exclusive Roadhouse Specials
                        </span>
                        <h2 className="font-domine text-3xl sm:text-5xl text-[#ffc174] font-bold">
                            Promotions & Deals
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Deal Banner 1 */}
                        <div className="relative h-64 rounded-xl overflow-hidden raised-layer group hover-heat cursor-pointer bg-[#1A1A1B] border border-[#534434]/50 shadow-xl">
                            <div className="absolute inset-0 vignette-overlay">
                                <img
                                    className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-all duration-500 group-hover:scale-105"
                                    alt="Sisig promo"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6QEUONokTX7mi1M1Wrie14cxeoNfVq5HyIS1sLOLWKbzZyh6OfegCBaNeH6E7uS37ugVc6jjmILNzIrmvE0tpXkOBCDP29HO1WZL69MsOd6lpwp4oX6ezfDjuAsLMCu57vBpiHDupWu3yDATuk2k_HgpQMi23Y7mifgQKqPJhc0GqDXCCk1tPooIkFyBCXPiESBHm8HKF8cp1ctvD0RZ39YNVxKG_2cPaPyfryUGBbaoIHhqqhq5R9BflPtI6jMfzsP3W6QStlttx"
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 p-5 w-full bg-gradient-to-t from-[#1A1A1B] via-[#1A1A1B]/80 to-transparent">
                                <span className="font-mono text-[10px] text-[#f59e0b] bg-[#31281f] px-2 py-0.5 rounded border border-[#534434] mb-2 inline-block font-bold">
                                    20% OFF
                                </span>
                                <h3 className="font-domine text-lg font-bold text-[#f0e0d1]">Sisig Saturdays Deal</h3>
                                <p className="font-sans text-xs text-[#d8c3ad] mt-1">Get 20% off on all sizzling pork sisig orders.</p>
                            </div>
                        </div>

                        {/* Deal Banner 2 */}
                        <div className="relative h-64 rounded-xl overflow-hidden raised-layer group hover-heat cursor-pointer bg-[#1A1A1B] border border-[#534434]/50 shadow-xl">
                            <div className="absolute inset-0 vignette-overlay">
                                <img
                                    className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-all duration-500 group-hover:scale-105"
                                    alt="Ribeye Steak"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqtvjGjUsuBGyzBHVhntcLtTHQL442EMNheO8rq-4bOP-zq35cYw-DswcOn6dpMuPv5ukX12iSEzREwKgb6iPoUk64ETmBeEcSAd_ACcZoIibAIU9yR4PAPlj2o5GbDfdalWoY2tkEYUIrX_067eJx75-iVNUhMQQwzXdK3OmEDSQSGelDLgr5zgcY5sN7zsIqaaHUGQXrLpgju8NF3deoQjQPo--R-W6fwR50zfB_tGo3dBdO2gM7hr6EUUVxLgCF5gCn94DbGA_N"
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 p-5 w-full bg-gradient-to-t from-[#1A1A1B] via-[#1A1A1B]/80 to-transparent">
                                <span className="font-mono text-[10px] text-[#f59e0b] bg-[#31281f] px-2 py-0.5 rounded border border-[#534434] mb-2 inline-block font-bold">
                                    NEW ARRIVAL
                                </span>
                                <h3 className="font-domine text-lg font-bold text-[#ffc174]">Cowboy Ribeye Special</h3>
                                <p className="font-sans text-xs text-[#d8c3ad] mt-1">Bone-in, seared on smoking cast iron.</p>
                            </div>
                        </div>

                        {/* Deal Banner 3 */}
                        <div className="relative h-64 rounded-xl overflow-hidden raised-layer group hover-heat cursor-pointer bg-[#1A1A1B] border border-[#534434]/50 shadow-xl">
                            <div className="absolute inset-0 vignette-overlay">
                                <img
                                    className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-all duration-500 group-hover:scale-105"
                                    alt="Unli Rice"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT2sso9NgKHiCPPIkIfBBCfPNPUK_dgit8ctI0rtoMT_bXyQ21nRcx3ViyVnDNZTyTCVtYOSFJ8h_h3ZG451V7vUFX1LFMWyd6wQrV-4pevn9wO0H-wUZVYl0TBSwWt_bbQikBKmtygbJeYfSzWbAOcd32EpNo8TCvpmAamQoFlFfNvHrmpn32aUcJ7gi5IGdK9xpTad7qU6dSRSu2bty13h9_T3_GKF3mMrUI31pUXtjCvVgiLfQIkBBbjU_zY5SS0IrP8nvbh7QQ"
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 p-5 w-full bg-gradient-to-t from-[#1A1A1B] via-[#1A1A1B]/80 to-transparent">
                                <span className="font-mono text-[10px] text-emerald-400 bg-[#31281f] px-2 py-0.5 rounded border border-[#534434] mb-2 inline-block font-bold">
                                    UNLIMITED
                                </span>
                                <h3 className="font-domine text-lg font-bold text-[#f0e0d1]">Free Unli-Rice & Gravy</h3>
                                <p className="font-sans text-xs text-[#d8c3ad] mt-1">Free unlimited rice upgrade on all sizzling steaks.</p>
                            </div>
                        </div>

                        {/* Deal Banner 4 */}
                        <div className="relative h-64 rounded-xl overflow-hidden raised-layer group hover-heat cursor-pointer bg-[#1A1A1B] border border-[#534434]/50 shadow-xl">
                            <div className="absolute inset-0 vignette-overlay">
                                <img
                                    className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-all duration-500 group-hover:scale-105"
                                    alt="Happy hour"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl"
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 p-5 w-full bg-gradient-to-t from-[#1A1A1B] via-[#1A1A1B]/80 to-transparent">
                                <span className="font-mono text-[10px] text-amber-300 bg-[#31281f] px-2 py-0.5 rounded border border-[#534434] mb-2 inline-block font-bold">
                                    4PM - 7PM DAILY
                                </span>
                                <h3 className="font-domine text-lg font-bold text-[#ffc174]">Pulutan Happy Hour</h3>
                                <p className="font-sans text-xs text-[#d8c3ad] mt-1">Cold drinks & hot sizzling pulutan platters.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="sizzle-divider w-[90%] max-w-[1440px] mx-auto" />

                {/* 2. FEATURED SIZZLING ITEMS SECTION (Width set to 90% of screen to eliminate wide side margins) */}
                <section id="featured-menu" className="py-12 px-4 w-[90%] max-w-[1440px] mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <span className="font-mono text-xs text-[#f59e0b] bg-[#31281f] px-3 py-1 rounded border border-[#534434] uppercase tracking-widest font-bold mb-3 inline-block">
                            Chef's Sizzling Favorites
                        </span>
                        <h2 className="font-domine text-3xl sm:text-5xl text-[#ffc174] font-bold tracking-tight mb-3">
                            Featured Sizzling Items
                        </h2>
                        <p className="font-sans text-base sm:text-lg text-[#d8c3ad]">
                            Piping hot cast-iron platters seared right off our charcoal fire.
                        </p>
                    </div>

                    {/* Menu Items Grid (Shows 6 initially, expands to 12 when Show More clicked) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
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
                                    <div className="h-56 w-full relative vignette-overlay overflow-hidden">
                                        <img
                                            src={product.image_path || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                                        />
                                        <div className="absolute top-3 right-3 z-10">
                                            <span className="font-mono text-sm font-black text-[#121213] bg-[#ffc174] px-3 py-1 rounded shadow-md">
                                                ₱{numPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product Details (No stock badge) */}
                                    <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                                        <div>
                                            <h3 className="font-domine text-xl font-bold text-[#f0e0d1] group-hover:text-[#ffc174] transition-colors mb-2">
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
                                                className={`w-full py-3 rounded font-bold text-xs uppercase tracking-wider btn-bevel transition-all flex items-center justify-center gap-2 ${
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

                    {/* View More Button (Show More / Show Less Toggle) */}
                    <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => setShowAllMenu(!showAllMenu)}
                            className="inline-flex items-center gap-2 bg-[#1A1A1B] border border-[#534434] hover:border-[#f59e0b] text-[#ffc174] hover:text-white font-bold px-8 py-3.5 rounded-lg btn-bevel transition-all text-sm uppercase tracking-wider shadow-lg"
                        >
                            <span>{showAllMenu ? 'Show Less' : `Show More (${allProductsList.length} Total Items)`}</span>
                            {showAllMenu ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <Link
                            href="/order"
                            className="inline-flex items-center gap-2 bg-[#f59e0b] text-[#472a00] font-bold px-8 py-3.5 rounded-lg btn-bevel hover:bg-[#ffc174] transition-all text-sm uppercase tracking-wider shadow-lg"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Cart {itemCount > 0 ? `(${itemCount})` : ''}</span>
                        </Link>
                    </div>
                </section>

                <div className="sizzle-divider w-[90%] max-w-[1440px] mx-auto" />

                {/* 3. SIZZLING MENU CATEGORIES (Width set to 90%) */}
                <section id="categories" className="py-12 px-4 w-[90%] max-w-[1440px] mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-domine text-3xl sm:text-4xl text-[#ffc174] font-bold mb-2">
                            Explore Our Sizzling Categories
                        </h2>
                        <p className="font-sans text-base text-[#d8c3ad]">Signature sizzling categories straight from the fire.</p>
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
                                    <p className="font-sans text-xs text-[#d8c3ad]">
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
                                    <p className="font-sans text-xs text-[#d8c3ad]">
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
                                    <p className="font-sans text-xs text-[#d8c3ad]">
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
                </section>

                <div className="sizzle-divider w-[90%] max-w-[1440px] mx-auto" />

                {/* 4. ROADHOUSE LOCATIONS SECTION (Includes Images for Both Bulihan & Dasmarinas Branches) */}
                <section id="locations" className="py-16 px-4 w-[90%] max-w-[1440px] mx-auto">
                    <div className="text-center mb-12">
                        <span className="font-mono text-xs text-[#f59e0b] bg-[#31281f] px-3 py-1 rounded border border-[#534434] uppercase tracking-widest font-bold mb-3 inline-block">
                            Visit Our Roadhouses
                        </span>
                        <h2 className="font-domine text-3xl sm:text-5xl text-[#ffc174] font-bold">Our Locations</h2>
                        <p className="font-sans text-base text-[#d8c3ad] mt-1">Come experience the smoky hearth and cast-iron sizzle.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Location 1: Saddle Ranch Bulihan */}
                        <div className="bg-[#1A1A1B] rounded-xl border border-[#262627] overflow-hidden flex flex-col justify-between space-y-6 hover-heat transition-all shadow-xl">
                            <div className="h-56 w-full relative vignette-overlay">
                                <img
                                    className="w-full h-full object-cover opacity-85"
                                    alt="Saddle Ranch Bulihan Branch Storefront"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCatSLXJ-mynm_AwjLXsdG9xKbMwziehShgiNtyXaX2NZEeZFhSXaTmHMgLuACAitSC3WZ0g_9lSTavvnqO4eKFlaC0pnnA9OngEMtRicl0vfSF2_t4WqzxTKxW-H-X0i_tppiClzEOZ-fAuu1ezCbRVOcdVdwZHokttY1ATDIO4BuA185dwrm0QDuPpYjQ7qD9ybH5bl0WPn1wHJ3S5pB6JuCOoocWTfZ95cB0Lfqx1KbjbUwqGJxkhwxmqypEJta64yq1PajT3oWC"
                                />
                                <div className="absolute top-3 left-3 z-10">
                                    <span className="font-mono text-[10px] text-[#f59e0b] bg-[#31281f]/90 px-2.5 py-1 rounded border border-[#534434] font-bold shadow">
                                        ORIGINAL FLAGSHIP BRANCH
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-6">
                                <div>
                                    <h3 className="font-domine text-2xl font-bold text-[#ffc174] mb-2">Saddle Ranch Bulihan</h3>
                                    <p className="font-sans text-xs text-[#d8c3ad] leading-relaxed mb-4">
                                        Our flagship sizzling roadhouse serving Bulihan with authentic sizzling steaks, fresh sisig, and cold drinks daily.
                                    </p>
                                    <div className="space-y-2 font-sans text-xs text-[#f0e0d1]">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-4 h-4 text-[#f59e0b] flex-shrink-0" />
                                            <span>123 Roadhouse Lane, Barangay Bulihan, Cavite</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-[#f59e0b] flex-shrink-0" />
                                            <span>Monday - Sunday: 11:00 AM - 11:00 PM</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-4 h-4 text-[#f59e0b] flex-shrink-0" />
                                            <span>+63 917 123 4567</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsOrderModalOpen(true)} className="w-full py-3.5 rounded bg-[#f59e0b] text-[#472a00] font-bold text-xs uppercase tracking-wider btn-bevel shadow-lg">
                                    Order from Bulihan Branch
                                </button>
                            </div>
                        </div>

                        {/* Location 2: Saddle Ranch Dasmariñas */}
                        <div className="bg-[#1A1A1B] rounded-xl border border-[#262627] overflow-hidden flex flex-col justify-between space-y-6 hover-heat transition-all shadow-xl">
                            <div className="h-56 w-full relative vignette-overlay">
                                <img
                                    className="w-full h-full object-cover opacity-85"
                                    alt="Saddle Ranch Dasmarinas Branch Storefront"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl"
                                />
                                <div className="absolute top-3 left-3 z-10">
                                    <span className="font-mono text-[10px] text-[#f59e0b] bg-[#31281f]/90 px-2.5 py-1 rounded border border-[#534434] font-bold shadow">
                                        NEW BRANCH LOCATION
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-6">
                                <div>
                                    <h3 className="font-domine text-2xl font-bold text-[#ffc174] mb-2">Saddle Ranch Dasmariñas</h3>
                                    <p className="font-sans text-xs text-[#d8c3ad] leading-relaxed mb-4">
                                        Our newest roadhouse along Governor's Drive. Bringing sizzling cast-iron comfort food to the heart of Dasmariñas.
                                    </p>
                                    <div className="space-y-2 font-sans text-xs text-[#f0e0d1]">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-4 h-4 text-[#f59e0b] flex-shrink-0" />
                                            <span>Governors Drive, Barangay Sampaloc 1, Dasmariñas City, Cavite</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-[#f59e0b] flex-shrink-0" />
                                            <span>Monday - Sunday: 10:00 AM - 10:00 PM</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-4 h-4 text-[#f59e0b] flex-shrink-0" />
                                            <span>+63 918 987 6543</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsOrderModalOpen(true)} className="w-full py-3.5 rounded bg-[#f59e0b] text-[#472a00] font-bold text-xs uppercase tracking-wider btn-bevel shadow-lg">
                                    Order from Dasmariñas Branch
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-[#140d06] font-sans text-sm w-full border-t border-[#534434]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-12 w-[90%] max-w-[1440px] mx-auto">
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

                {/* Interactive Order Modal ("How would you like your order?") */}
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
                                    <div className="mt-4 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">FREE in Bulihan / Dasma</div>
                                </button>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Link
                                    href={`/order?mode=${selectedMode}`}
                                    className="w-full py-3.5 rounded-lg bg-[#f59e0b] text-[#472a00] font-bold text-center block shadow-xl shadow-[#f59e0b]/20 hover:bg-[#ffc174] transition-all text-sm uppercase tracking-wider btn-bevel"
                                >
                                    Continue to Menu ({selectedMode === 'pickup' ? 'Takeout' : 'Delivery'})
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
