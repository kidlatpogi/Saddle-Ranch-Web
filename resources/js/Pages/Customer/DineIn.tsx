import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    QrCode, 
    Flame, 
    ArrowLeft, 
    Plus, 
    Minus, 
    Trash2, 
    CheckCircle2, 
    Utensils, 
    ShoppingBag, 
    AlertCircle,
    ShoppingCart,
    X,
    Search,
    ChevronRight,
    Filter
} from 'lucide-react';
import { useCart, CartProduct } from '@/Hooks/useCart';
import { PageProps } from '@/types';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number | string;
    image_path?: string;
    stock_quantity: number;
    is_active: boolean;
}

interface DineInProps {
    products?: Product[];
    tableNumber?: string;
}

type CategoryType = 'Popular' | 'Rice Meals' | 'Authentic Filipino' | 'Barkada Platters' | 'Drinks & Extra Rice';

export default function DineInOrder({ products = [], tableNumber: initialTableNumber = '05' }: DineInProps) {
    const { flash } = usePage<PageProps>().props;

    const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const urlTable = queryParams.get('table');
    const tableNumber = urlTable || initialTableNumber || '05';

    const [fulfillmentMode, setFulfillmentMode] = useState<'dine_in' | 'express_takeout'>('dine_in');
    const [customerName, setCustomerName] = useState('');
    const [specialNotes, setSpecialNotes] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Popular');
    const [isBasketSheetOpen, setIsBasketSheetOpen] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [completedOrder, setCompletedOrder] = useState<any>(null);

    const { cart, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount } = useCart();

    // Fallback menu items
    const fallbackProducts: Product[] = [
        {
            id: 1,
            name: 'Sizzling Pork Sisig',
            description: 'Crispy pork belly seasoned with local spices, served on a sizzling skillet.',
            price: 180.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t',
            stock_quantity: 50,
            is_active: true,
        },
        {
            id: 2,
            name: 'Sizzling Pork T-Bone Steak',
            description: 'Tender T-Bone steak seared hard on cast iron with rich gravy.',
            price: 280.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASVSO6N3lzIbdlCDT85viSxOZiQKjWADlA5k7ymludjTdSCB7tqV0bZvXRba3-L4gemLyqy9PxmqnYMBnSsxb5yfI_XM-qajS5ZEnS1Am8OBu5uN8_smBFlDdy4xR0UNE8jDFJP8vNSRQcqqDSG4p-oDij5kCvWALcyBZVeuA1QdnqC9a6I5s9l2ba3Zjfe0xSPjMr0jLCAB1z-oJS5xBL9meeUeFsmiMgjQ96VoXotgHsy3Jl3d9NQIv1liJsKeu_sJec2rrkNziY',
            stock_quantity: 30,
            is_active: true,
        },
        {
            id: 3,
            name: 'Sizzling Bulalo Steak',
            description: 'Rich beef shank served with simmering bone marrow gravy.',
            price: 450.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCatSLXJ-mynm_AwjLXsdG9xKbMwziehShgiNtyXaX2NZEeZFhSXaTmHMgLuACAitSC3WZ0g_9lSTavvnqO4eKFlaC0pnnA9OngEMtRicl0vfSF2_t4WqzxTKxW-H-X0i_tppiClzEOZ-fAuu1ezCbRVOcdVdwZHokttY1ATDIO4BuA185dwrm0QDuPpYjQ7qD9ybH5bl0WPn1wHJ3S5pB6JuCOoocWTfZ95cB0Lfqx1KbjbUwqGJxkhwxmqypEJta64yq1PajT3oWC',
            stock_quantity: 15,
            is_active: true,
        },
        {
            id: 4,
            name: 'Sizzling Chicken Inasal Platter',
            description: 'Chargrilled Bacolod-style chicken served sizzling with garlic rice.',
            price: 220.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6QEUONokTX7mi1M1Wrie14cxeoNfVq5HyIS1sLOLWKbzZyh6OfegCBaNeH6E7uS37ugVc6jjmILNzIrmvE0tpXkOBCDP29HO1WZL69MsOd6lpwp4oX6ezfDjuAsLMCu57vBpiHDupWu3yDATuk2k_HgpQMi23Y7mifgQKqPJhc0GqDXCCk1tPooIkFyBCXPiESBHm8HKF8cp1ctvD0RZ39YNVxKG_2cPaPyfryUGBbaoIHhqqhq5R9BflPtI6jMfzsP3W6QStlttx',
            stock_quantity: 40,
            is_active: true,
        },
        {
            id: 5,
            name: 'Sizzling Beef Pepper Rice',
            description: 'Thinly sliced tender beef with ground black pepper and garlic rice.',
            price: 195.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT2sso9NgKHiCPPIkIfBBCfPNPUK_dgit8ctI0rtoMT_bXyQ21nRcx3ViyVnDNZTyTCVtYOSFJ8h_h3ZG451V7vUFX1LFMWyd6wQrV-4pevn9wO0H-wUZVYl0TBSwWt_bbQikBKmtygbJeYfSzWbAOcd32EpNo8TCvpmAamQoFlFfNvHrmpn32aUcJ7gi5IGdK9xpTad7qU6dSRSu2bty13h9_T3_GKF3mMrUI31pUXtjCvVgiLfQIkBBbjU_zY5SS0IrP8nvbh7QQ',
            stock_quantity: 35,
            is_active: true,
        },
        {
            id: 6,
            name: 'Sizzling Gambas Al Ajillo',
            description: 'Succulent shrimp sautéed in garlic oil and chili flakes.',
            price: 260.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl',
            stock_quantity: 25,
            is_active: true,
        },
        {
            id: 13,
            name: 'Extra Garlic Rice',
            description: 'Fragrant fried garlic rice served piping hot.',
            price: 35.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT2sso9NgKHiCPPIkIfBBCfPNPUK_dgit8ctI0rtoMT_bXyQ21nRcx3ViyVnDNZTyTCVtYOSFJ8h_h3ZG451V7vUFX1LFMWyd6wQrV-4pevn9wO0H-wUZVYl0TBSwWt_bbQikBKmtygbJeYfSzWbAOcd32EpNo8TCvpmAamQoFlFfNvHrmpn32aUcJ7gi5IGdK9xpTad7qU6dSRSu2bty13h9_T3_GKF3mMrUI31pUXtjCvVgiLfQIkBBbjU_zY5SS0IrP8nvbh7QQ',
            stock_quantity: 100,
            is_active: true,
        },
        {
            id: 14,
            name: 'Signature Red Iced Tea (1 Litro)',
            description: 'Chilled house-brewed red iced tea pitcher (1 Litro).',
            price: 95.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl',
            stock_quantity: 60,
            is_active: true,
        },
    ];

    const allProducts = products && products.length > 0 ? products : fallbackProducts;

    // Helper to categorize products
    const getProductCategory = (p: Product): CategoryType => {
        const name = p.name.toLowerCase();
        if (name.includes('tea') || name.includes('juice') || name.includes('extra garlic rice') || name.includes('beverage')) {
            return 'Drinks & Extra Rice';
        }
        if (name.includes('pepper rice') || name.includes('pork chop supreme') || name.includes('inasal')) {
            return 'Rice Meals';
        }
        if (name.includes('sisig') || name.includes('lechon') || name.includes('bulalo')) {
            return 'Authentic Filipino';
        }
        if (name.includes('ribeye') || name.includes('t-bone') || name.includes('gambas') || name.includes('squid')) {
            return 'Barkada Platters';
        }
        return 'Rice Meals';
    };

    // Filter products
    const filteredProducts = allProducts.filter((p) => {
        const matchesCategory = selectedCategory === 'Popular' || getProductCategory(p) === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const recommendedAddOns = allProducts.filter((p) => p.name.includes('Rice') || p.name.includes('Tea') || p.name.includes('Juice'));

    const getProductImage = (p: Product) => {
        if (p.image_path && p.image_path.startsWith('http')) return p.image_path;
        return fallbackProducts[0].image_path;
    };

    useEffect(() => {
        if (flash?.order) {
            setCompletedOrder(flash.order);
            clearCart();
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError('');

        if (cart.length === 0) {
            setValidationError('Your basket is empty. Please add items before placing your order.');
            return;
        }

        setIsSubmitting(true);

        const payload = {
            order_type: fulfillmentMode,
            table_number: tableNumber,
            customer_name: customerName.trim() ? customerName : `Table ${tableNumber} Guest`,
            delivery_notes: specialNotes,
            payment_method: paymentMethod,
            items: cart.map((item) => ({
                product_id: item.product.id,
                quantity: item.quantity,
            })),
        };

        router.post('/order/checkout', payload, {
            onError: (errors) => {
                setIsSubmitting(false);
                if (errors.items) {
                    setValidationError(errors.items);
                } else {
                    const firstErr = Object.values(errors)[0];
                    setValidationError(typeof firstErr === 'string' ? firstErr : 'An error occurred during checkout.');
                }
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <>
            <Head title={`Table ${tableNumber} QR Menu | Saddle Ranch`} />

            <div className="min-h-screen bg-[#121213] text-[#f0e0d1] font-sans antialiased pb-28">
                
                {/* Responsive Header: Desktop Banner vs Mobile App Bar */}
                <header className="sticky top-0 z-40 bg-[#1A1A1B]/95 backdrop-blur-md border-b border-[#534434]/40 shadow-xl">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="p-2 rounded-full md:rounded-xl bg-[#261e15] border border-[#534434] text-[#ffc174] hover:bg-[#31281f] transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-base sm:text-xl font-bold font-domine text-[#ffc174] leading-tight">Saddle Ranch Table Menu</h1>
                                    <span className="px-3 py-1 rounded-full bg-[#f59e0b] text-[#472a00] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                                        <QrCode className="w-3.5 h-3.5" />
                                        Table #{tableNumber}
                                    </span>
                                </div>
                                <p className="text-xs text-[#d8c3ad] hidden sm:block">Piping hot sizzling plates served straight to your table</p>
                            </div>
                        </div>

                        {/* Mode Selector */}
                        <div className="flex items-center p-1 rounded-xl bg-[#121213] border border-[#534434]">
                            <button
                                onClick={() => setFulfillmentMode('dine_in')}
                                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 btn-bevel ${
                                    fulfillmentMode === 'dine_in'
                                        ? 'bg-[#f59e0b] text-[#472a00] font-black shadow'
                                        : 'text-[#d8c3ad] hover:text-white'
                                }`}
                            >
                                <Utensils className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Dine-In Service</span>
                                <span className="sm:hidden">Dine-In</span>
                            </button>
                            <button
                                onClick={() => setFulfillmentMode('express_takeout')}
                                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 btn-bevel ${
                                    fulfillmentMode === 'express_takeout'
                                        ? 'bg-[#f59e0b] text-[#472a00] font-black shadow'
                                        : 'text-[#d8c3ad] hover:text-white'
                                }`}
                            >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Takeout</span>
                                <span className="sm:hidden">Takeout</span>
                            </button>
                        </div>
                    </div>

                    {/* Category Carousel Bar */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto border-t border-[#262627] flex items-center gap-4 sm:gap-8 scrollbar-none py-2.5">
                        {(['Popular', 'Rice Meals', 'Authentic Filipino', 'Barkada Platters', 'Drinks & Extra Rice'] as CategoryType[]).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`text-xs font-bold whitespace-nowrap relative pb-1 transition-colors ${
                                    selectedCategory === cat ? 'text-[#ffc174] font-black' : 'text-[#8c7a6b] hover:text-white'
                                }`}
                            >
                                <span>{cat === 'Popular' ? '🔥 Popular' : cat}</span>
                                {selectedCategory === cat && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f59e0b] rounded-full animate-in fade-in duration-200" />
                                )}
                            </button>
                        ))}
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    {validationError && (
                        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                            <span>{validationError}</span>
                        </div>
                    )}

                    {/* Responsive Dual Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* LEFT COLUMN: Menu Products */}
                        <div className="lg:col-span-7 space-y-6">
                            
                            {/* MOBILE VIEWPORT ONLY (< md): Grab/Foodpanda 2-Column Grid */}
                            <div className="block md:hidden">
                                <div className="grid grid-cols-2 gap-3.5">
                                    {filteredProducts.map((product) => {
                                        const numPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                                        const isOutOfStock = product.stock_quantity <= 0;
                                        const cartEntry = cart.find((i) => i.product.id === product.id);
                                        const imgUrl = getProductImage(product);

                                        return (
                                            <div
                                                key={product.id}
                                                className="bg-[#1A1A1B] rounded-2xl border border-[#262627] p-3 flex flex-col justify-between relative group hover:border-[#534434] transition-all shadow-md"
                                            >
                                                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2.5 bg-[#121213]">
                                                    <img
                                                        src={imgUrl}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                                                    />

                                                    {/* Saddle Ranch Beveled Floating + Button */}
                                                    <div className="absolute bottom-1.5 right-1.5 z-10">
                                                        {cartEntry ? (
                                                            <button
                                                                onClick={() => addItem(product as CartProduct, 1)}
                                                                className="w-7 h-7 rounded-full bg-[#121213] text-[#ffc174] font-black text-xs border border-[#f59e0b] shadow-lg flex items-center justify-center btn-bevel"
                                                            >
                                                                {cartEntry.quantity}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => addItem(product as CartProduct, 1)}
                                                                disabled={isOutOfStock}
                                                                className="w-7 h-7 rounded-full bg-[#f59e0b] text-[#472a00] hover:bg-[#ffc174] font-black text-sm shadow-lg flex items-center justify-center transition-colors btn-bevel disabled:opacity-40"
                                                                aria-label={`Add ${product.name} to cart`}
                                                            >
                                                                +
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <h3 className="font-domine font-bold text-xs text-[#f0e0d1] line-clamp-2 leading-snug">
                                                        {product.name}
                                                    </h3>
                                                    <div className="font-mono text-xs font-black text-[#ffc174]">
                                                        ₱ {numPrice.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* DESKTOP VIEWPORT ONLY (>= md): Full Desktop Cards Layout */}
                            <div className="hidden md:grid grid-cols-2 gap-6">
                                {filteredProducts.map((product) => {
                                    const numPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                                    const isOutOfStock = product.stock_quantity <= 0;
                                    const cartEntry = cart.find((i) => i.product.id === product.id);
                                    const imgUrl = getProductImage(product);

                                    return (
                                        <div
                                            key={product.id}
                                            className="bg-[#1A1A1B] rounded-2xl border border-[#262627] overflow-hidden flex flex-col justify-between hover-heat transition-all shadow-xl group"
                                        >
                                            <div className="h-44 w-full relative vignette-overlay overflow-hidden">
                                                <img
                                                    src={imgUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                                                />
                                                <div className="absolute top-3 right-3 z-10">
                                                    <span className="font-mono text-xs font-black text-[#121213] bg-[#ffc174] px-2.5 py-1 rounded shadow">
                                                        ₱{numPrice.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                                                <div>
                                                    <h3 className="font-domine text-lg font-bold text-[#f0e0d1] group-hover:text-[#ffc174] transition-colors mb-1">
                                                        {product.name}
                                                    </h3>
                                                    <p className="font-sans text-xs text-[#d8c3ad] leading-relaxed line-clamp-2">
                                                        {product.description}
                                                    </p>
                                                </div>

                                                <div className="pt-3 border-t border-[#534434]/50 flex items-center justify-between">
                                                    {isOutOfStock ? (
                                                        <span className="text-[10px] font-bold text-rose-400 uppercase">Sold Out</span>
                                                    ) : (
                                                        <span className="text-[10px] text-[#d8c3ad] font-semibold">Ready to Sizzle</span>
                                                    )}

                                                    {cartEntry ? (
                                                        <div className="flex items-center gap-2 bg-[#121213] border border-[#534434] rounded-xl p-1">
                                                            <button
                                                                onClick={() => updateQuantity(product.id, cartEntry.quantity - 1)}
                                                                className="p-1 rounded-lg hover:bg-[#261e15] text-[#d8c3ad]"
                                                            >
                                                                <Minus className="w-3.5 h-3.5" />
                                                            </button>
                                                            <span className="font-mono font-bold text-xs px-2">{cartEntry.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(product.id, cartEntry.quantity + 1)}
                                                                disabled={cartEntry.quantity >= product.stock_quantity}
                                                                className="p-1 rounded-lg hover:bg-[#261e15] text-[#d8c3ad] disabled:opacity-40"
                                                            >
                                                                <Plus className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => addItem(product as CartProduct, 1)}
                                                            disabled={isOutOfStock}
                                                            className="px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#472a00] font-black text-xs uppercase tracking-wider btn-bevel transition-all shadow-md disabled:opacity-40"
                                                        >
                                                            Add to Table +
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>

                        {/* RIGHT COLUMN: DESKTOP ONLY Persistent Cart Drawer (hidden on mobile) */}
                        <div className="hidden lg:block lg:col-span-5 space-y-6">
                            <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-[#1A1A1B] border border-[#534434]/60 shadow-2xl space-y-6">
                                <div className="pb-4 border-b border-[#534434]/50 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2 font-domine">
                                        <ShoppingCart className="w-5 h-5 text-[#f59e0b]" />
                                        <span>Table #{tableNumber} Basket</span>
                                    </h3>
                                    <span className="px-3 py-1 rounded-full bg-[#f59e0b]/20 text-[#ffc174] text-xs font-bold border border-[#f59e0b]/30">
                                        {itemCount} Items
                                    </span>
                                </div>

                                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                                    {cart.length === 0 ? (
                                        <div className="py-8 text-center text-[#8c7a6b] text-xs">
                                            <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#8c7a6b]" />
                                            Your table basket is empty. Add items from the menu.
                                        </div>
                                    ) : (
                                        cart.map((item) => {
                                            const numPrice = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
                                            const imgUrl = getProductImage(item.product as Product);
                                            return (
                                                <div key={item.product.id} className="p-3 rounded-2xl bg-[#121213] border border-[#534434]/40 flex items-center justify-between text-xs gap-3">
                                                    <div className="flex items-center gap-3 truncate">
                                                        <img src={imgUrl} alt={item.product.name} className="w-12 h-12 rounded-xl object-cover" />
                                                        <div className="truncate">
                                                            <div className="font-bold text-white truncate">{item.product.name}</div>
                                                            <div className="text-[10px] text-[#d8c3ad]">₱{numPrice.toFixed(2)} each</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <div className="flex items-center gap-1 border border-[#534434] rounded-lg p-0.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                                className="p-1 text-[#d8c3ad] hover:text-white"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="font-mono font-bold px-1">{item.quantity}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                                disabled={item.quantity >= item.product.stock_quantity}
                                                                className="p-1 text-[#d8c3ad] hover:text-white disabled:opacity-30"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                        <span className="font-mono font-bold text-[#ffc174]">₱{(numPrice * item.quantity).toFixed(2)}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(item.product.id)}
                                                            className="text-stone-500 hover:text-rose-400"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                <div className="space-y-4 pt-4 border-t border-[#534434]/50">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#d8c3ad] mb-1">Seated Guest Name (Optional)</label>
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="e.g. Table 5 Guest"
                                            className="w-full px-3.5 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#d8c3ad] mb-1">Special Notes / Kitchen Request</label>
                                        <input
                                            type="text"
                                            value={specialNotes}
                                            onChange={(e) => setSpecialNotes(e.target.value)}
                                            placeholder="e.g. Extra sizzling sauce, no onions..."
                                            className="w-full px-3.5 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#d8c3ad] mb-1">Payment Method</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Cash', 'GCash'].map((method) => (
                                                <button
                                                    key={method}
                                                    type="button"
                                                    onClick={() => setPaymentMethod(method)}
                                                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all btn-bevel ${
                                                        paymentMethod === method
                                                            ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-white font-black'
                                                            : 'bg-[#121213] border-[#534434] text-[#d8c3ad]'
                                                    }`}
                                                >
                                                    {method}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-2 flex items-center justify-between text-base font-black">
                                        <span>Total Amount</span>
                                        <span className="text-[#ffc174] font-mono text-xl">₱{subtotal.toFixed(2)}</span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={cart.length === 0 || isSubmitting}
                                        className="w-full py-4 rounded-2xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#472a00] font-black text-sm uppercase tracking-wider shadow-xl shadow-[#f59e0b]/30 transition-all btn-bevel disabled:opacity-40"
                                    >
                                        {isSubmitting ? 'Sending to Kitchen...' : `Place Order (₱${subtotal.toFixed(2)})`}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>

                {/* MOBILE ONLY: GrabFood Floating Bottom Sticky Cart Bar */}
                {itemCount > 0 && (
                    <div className="block lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-40 animate-in slide-in-from-bottom-6 duration-300">
                        <button
                            onClick={() => setIsBasketSheetOpen(true)}
                            className="w-full h-14 rounded-2xl bg-[#f59e0b] text-[#472a00] font-bold shadow-2xl shadow-[#f59e0b]/30 px-4 flex items-center justify-between hover:scale-[1.02] active:scale-98 transition-all btn-bevel"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#121213] text-[#ffc174] text-xs font-black flex items-center justify-center border border-[#ffc174]">
                                    {itemCount}
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-black leading-tight">View your cart</div>
                                    <div className="text-[10px] text-[#472a00]/80 font-bold">Table #{tableNumber} • Saddle Ranch</div>
                                </div>
                            </div>

                            <div className="font-mono text-base font-black">
                                ₱ {subtotal.toFixed(2)}
                            </div>
                        </button>
                    </div>
                )}

                {/* MOBILE ONLY: Slide-Up Cart Bottom Sheet Drawer */}
                {isBasketSheetOpen && (
                    <div className="block lg:hidden fixed inset-0 z-50 flex items-end justify-center p-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="w-full max-w-md max-h-[85vh] rounded-t-3xl bg-[#1A1A1B] border border-[#ffc174]/30 p-5 shadow-2xl overflow-y-auto space-y-5 animate-in slide-in-from-bottom-8 duration-300">
                            
                            <div className="flex items-center justify-between pb-3 border-b border-[#534434]/50">
                                <div>
                                    <h3 className="text-base font-black text-white font-domine">Cart</h3>
                                    <p className="text-[10px] text-[#d8c3ad]">Table #{tableNumber} • Saddle Ranch</p>
                                </div>
                                <button
                                    onClick={() => setIsBasketSheetOpen(false)}
                                    className="w-8 h-8 rounded-full bg-[#261e15] text-[#d8c3ad] flex items-center justify-center"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Itemized Cart List */}
                            <div className="space-y-3">
                                {cart.map((item) => {
                                    const numPrice = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
                                    const imgUrl = getProductImage(item.product as Product);
                                    return (
                                        <div key={item.product.id} className="p-3 rounded-2xl bg-[#121213] border border-[#262627] flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 truncate">
                                                <img src={imgUrl} alt={item.product.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                                                <div className="truncate">
                                                    <div className="font-bold text-sm text-white truncate">{item.product.name}</div>
                                                    <div className="font-mono text-xs text-[#ffc174]">₱ {numPrice.toFixed(2)}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 bg-[#1A1A1B] border border-[#534434] rounded-full px-2 py-1 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    className="text-[#d8c3ad] hover:text-white p-0.5"
                                                >
                                                    {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-rose-400" /> : <Minus className="w-3.5 h-3.5" />}
                                                </button>
                                                <span className="font-mono font-bold text-xs px-1 text-white">{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.product.stock_quantity}
                                                    className="text-[#d8c3ad] hover:text-white p-0.5 disabled:opacity-30"
                                                >
                                                    <Plus className="w-3.5 h-3.5 text-[#f59e0b]" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Guest Details & Checkout Form */}
                            <form onSubmit={handleSubmit} className="space-y-4 pt-3 border-t border-[#262627]">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-[#d8c3ad] mb-1">Seated Guest Name</label>
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="Guest Name"
                                            className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-[#d8c3ad] mb-1">Payment Method</label>
                                        <select
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white focus:border-[#f59e0b] focus:outline-none"
                                        >
                                            <option value="Cash">Cash (Table)</option>
                                            <option value="GCash">GCash</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-[#d8c3ad] mb-1">Special Notes / Kitchen Request</label>
                                    <input
                                        type="text"
                                        value={specialNotes}
                                        onChange={(e) => setSpecialNotes(e.target.value)}
                                        placeholder="e.g. Extra sizzling sauce, no onions..."
                                        className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                    />
                                </div>

                                <div className="pt-2 flex items-center justify-between text-sm font-black">
                                    <span className="text-[#d8c3ad]">Total Amount</span>
                                    <span className="text-[#ffc174] font-mono text-lg">₱ {subtotal.toFixed(2)}</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 rounded-2xl bg-[#f59e0b] text-[#472a00] font-black text-sm uppercase tracking-wider shadow-xl shadow-[#f59e0b]/30 hover:bg-[#ffc174] transition-all btn-bevel"
                                >
                                    {isSubmitting ? 'Sending to Kitchen...' : `Place Order • ₱ ${subtotal.toFixed(2)}`}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Order Confirmation Modal */}
                {completedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="w-full max-w-sm rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-6 shadow-2xl text-center space-y-5">
                            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>

                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Order Placed!</span>
                                <h3 className="text-xl font-bold text-[#ffc174] mt-0.5">Sizzling Order Sent</h3>
                                <p className="text-xs text-[#d8c3ad] mt-1">Kitchen staff is preparing your order for Table #{completedOrder.table_number || tableNumber}.</p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-[#121213] border border-[#534434]/60 text-xs text-left space-y-2 font-mono">
                                <div className="flex justify-between">
                                    <span className="text-[#8c7a6b]">Order Number:</span>
                                    <span className="font-bold text-[#f59e0b]">{completedOrder.order_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#8c7a6b]">Table:</span>
                                    <span className="font-bold text-white">Table #{completedOrder.table_number || tableNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#8c7a6b]">Total Due:</span>
                                    <span className="font-bold text-[#ffc174]">₱ {parseFloat(completedOrder.total_amount).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setCompletedOrder(null)}
                                className="w-full py-3 rounded-xl bg-[#f59e0b] text-[#472a00] font-black text-xs uppercase tracking-wider hover:bg-[#ffc174] transition-all block btn-bevel"
                            >
                                Order More Items
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
