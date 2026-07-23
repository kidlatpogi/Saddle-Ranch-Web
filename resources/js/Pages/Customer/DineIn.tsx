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
    Info
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

type CategoryType = 'All' | 'Rice Meals' | 'Authentic Filipino' | 'Barkada Platters' | 'Drinks & Extra Rice';

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
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
    const [isBasketSheetOpen, setIsBasketSheetOpen] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [completedOrder, setCompletedOrder] = useState<any>(null);

    const { cart, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount } = useCart();

    // Fallback products
    const fallbackProducts: Product[] = [
        {
            id: 1,
            name: 'Sizzling Pork Sisig',
            description: 'Crispy pork belly seasoned with local spices, served on a sizzling cast-iron skillet with fresh egg.',
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
        const matchesCategory = selectedCategory === 'All' || getProductCategory(p) === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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
                
                {/* 1. GrabFood/Foodpanda Style Fixed App Header */}
                <header className="sticky top-0 z-40 bg-[#1A1A1B]/95 backdrop-blur-md border-b border-[#534434]/40 shadow-xl">
                    <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="p-2 rounded-full bg-[#261e15] text-[#ffc174] hover:bg-[#31281f] transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-base font-bold text-[#ffc174] leading-tight">Saddle Ranch</h1>
                                    <span className="px-2.5 py-0.5 rounded-full bg-[#f59e0b] text-[#472a00] font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                        <QrCode className="w-3 h-3" />
                                        Table #{tableNumber}
                                    </span>
                                </div>
                                <p className="text-[11px] text-[#d8c3ad]">Order Sizzling Meals to your Table</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setFulfillmentMode(fulfillmentMode === 'dine_in' ? 'express_takeout' : 'dine_in')}
                                className="px-3 py-1.5 rounded-full bg-[#261e15] border border-[#534434] text-[11px] font-bold text-[#ffc174] flex items-center gap-1.5"
                            >
                                <Utensils className="w-3.5 h-3.5 text-[#f59e0b]" />
                                <span>{fulfillmentMode === 'dine_in' ? 'Dine-In' : 'Takeout'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Quick Search Bar */}
                    <div className="max-w-3xl mx-auto px-4 pb-3">
                        <div className="relative">
                            <Search className="w-4 h-4 text-[#d8c3ad] absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search sisig, steaks, drinks..."
                                className="w-full pl-10 pr-4 py-2 rounded-full bg-[#121213] border border-[#534434]/60 text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Sticky Horizontal Category Pills (Grab/Foodpanda Swipe Carousel) */}
                    <div className="max-w-3xl mx-auto px-4 overflow-x-auto pb-3 flex items-center gap-2 scrollbar-none">
                        {(['All', 'Rice Meals', 'Authentic Filipino', 'Barkada Platters', 'Drinks & Extra Rice'] as CategoryType[]).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                                    selectedCategory === cat
                                        ? 'bg-[#f59e0b] text-[#472a00] shadow-md shadow-[#f59e0b]/20 font-black'
                                        : 'bg-[#261e15] border border-[#534434]/50 text-[#d8c3ad] hover:text-white'
                                }`}
                            >
                                {cat === 'All' ? '🔥 Popular' : cat === 'Rice Meals' ? '🍚 Rice Meals' : cat}
                            </button>
                        ))}
                    </div>
                </header>

                {/* 2. Menu Items Showcase (Foodpanda / Grab Native Mobile Card Layout) */}
                <main className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
                    {validationError && (
                        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2.5">
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            <span>{validationError}</span>
                        </div>
                    )}

                    <div className="space-y-3">
                        {filteredProducts.map((product) => {
                            const numPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                            const isOutOfStock = product.stock_quantity <= 0;
                            const cartEntry = cart.find((i) => i.product.id === product.id);
                            const imgUrl = getProductImage(product);

                            return (
                                <div
                                    key={product.id}
                                    className="p-3.5 rounded-2xl bg-[#1A1A1B] border border-[#262627] flex items-center justify-between gap-3 shadow-lg hover:border-[#534434] transition-all"
                                >
                                    {/* Left: Item Info */}
                                    <div className="flex-1 pr-2 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-domine font-bold text-sm text-[#f0e0d1] leading-tight">
                                                {product.name}
                                            </h3>
                                        </div>
                                        <p className="text-[11px] text-[#d8c3ad] line-clamp-2 leading-relaxed">
                                            {product.description}
                                        </p>
                                        <div className="pt-1 flex items-baseline gap-2">
                                            <span className="font-mono text-sm font-black text-[#ffc174]">
                                                ₱{numPrice.toFixed(2)}
                                            </span>
                                            {isOutOfStock && (
                                                <span className="text-[10px] text-rose-400 font-bold uppercase">Sold Out</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Food Image + Grab-style Floating Add/Stepper Button */}
                                    <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-[#121213]">
                                        <img
                                            src={imgUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover rounded-xl"
                                        />

                                        {/* Floating + Add / - 1 + Stepper Button */}
                                        <div className="absolute bottom-1 right-1 z-10">
                                            {cartEntry ? (
                                                <div className="flex items-center gap-1 bg-[#121213]/95 border border-[#f59e0b] rounded-lg p-0.5 shadow-lg backdrop-blur-md">
                                                    <button
                                                        onClick={() => updateQuantity(product.id, cartEntry.quantity - 1)}
                                                        className="w-6 h-6 rounded-md bg-[#261e15] hover:bg-[#31281f] text-[#ffc174] flex items-center justify-center"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="font-mono font-bold text-xs px-1 text-white">{cartEntry.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(product.id, cartEntry.quantity + 1)}
                                                        disabled={cartEntry.quantity >= product.stock_quantity}
                                                        className="w-6 h-6 rounded-md bg-[#f59e0b] text-[#472a00] flex items-center justify-center disabled:opacity-40"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => addItem(product as CartProduct, 1)}
                                                    disabled={isOutOfStock}
                                                    className="px-3 py-1 rounded-lg bg-[#f59e0b] hover:bg-[#ffc174] text-[#472a00] font-black text-xs shadow-md transition-all flex items-center gap-1 active:scale-95 disabled:opacity-40"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                    <span>ADD</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>

                {/* 3. GrabFood/Foodpanda Signature Floating Bottom Basket Bar */}
                {itemCount > 0 && (
                    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-lg z-40 animate-in slide-in-from-bottom-6 duration-300">
                        <button
                            onClick={() => setIsBasketSheetOpen(true)}
                            className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-[#472a00] font-bold shadow-2xl shadow-[#f59e0b]/30 flex items-center justify-between hover:scale-[1.02] active:scale-98 transition-all btn-bevel"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#121213]/20 flex items-center justify-center relative">
                                    <ShoppingBag className="w-5 h-5 text-[#472a00]" />
                                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#121213] text-[#ffc174] text-[10px] font-black flex items-center justify-center border border-[#ffc174]">
                                        {itemCount}
                                    </span>
                                </div>
                                <div className="text-left">
                                    <div className="text-xs uppercase tracking-wider font-extrabold opacity-80">Table #{tableNumber} Basket</div>
                                    <div className="text-lg font-black leading-none mt-0.5">₱{subtotal.toFixed(2)}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-black bg-[#121213] text-[#ffc174] px-4 py-2 rounded-xl shadow">
                                <span>View Basket</span>
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </button>
                    </div>
                )}

                {/* 4. Grab/Foodpanda Slide-Up Basket & Checkout Bottom Sheet */}
                {isBasketSheetOpen && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="w-full max-w-xl max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/30 p-6 shadow-2xl overflow-y-auto space-y-6 animate-in slide-in-from-bottom-8 duration-300">
                            
                            <div className="flex items-center justify-between pb-4 border-b border-[#534434]/50">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#f59e0b]">Table Order Checkout</span>
                                    <h3 className="text-xl font-bold text-[#ffc174] flex items-center gap-2">
                                        <QrCode className="w-5 h-5 text-[#f59e0b]" />
                                        <span>Table #{tableNumber} Basket</span>
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setIsBasketSheetOpen(false)}
                                    className="p-2 rounded-full text-[#d8c3ad] hover:bg-stone-800 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Itemized Cart Breakdown */}
                            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                                {cart.map((item) => {
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
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Guest Info & Special Notes */}
                            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                                <div>
                                    <label className="block text-xs font-semibold text-[#d8c3ad] mb-1">Seated Guest Name (Optional)</label>
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="e.g. Table 5 Guest"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#d8c3ad] mb-1">Kitchen Request / Special Notes</label>
                                    <input
                                        type="text"
                                        value={specialNotes}
                                        onChange={(e) => setSpecialNotes(e.target.value)}
                                        placeholder="e.g. Extra hot sizzler plate, medium rare..."
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
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
                                                className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
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

                                <div className="pt-4 border-t border-[#534434]/50 flex items-center justify-between text-base font-black">
                                    <span>Total Amount Due</span>
                                    <span className="text-[#ffc174] font-mono text-xl">₱{subtotal.toFixed(2)}</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 rounded-2xl bg-[#f59e0b] text-[#472a00] font-black text-sm uppercase tracking-wider shadow-xl shadow-[#f59e0b]/30 hover:bg-[#ffc174] transition-all btn-bevel"
                                >
                                    {isSubmitting ? 'Sending to Kitchen...' : `Confirm & Send to Kitchen (₱${subtotal.toFixed(2)})`}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Order Confirmation Modal */}
                {completedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="w-full max-w-md rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-8 shadow-2xl text-center space-y-6">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>

                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Order Placed!</span>
                                <h3 className="text-2xl font-bold text-[#ffc174] mt-1">Sizzling Order Sent</h3>
                                <p className="text-xs text-[#d8c3ad] mt-1">Our kitchen is preparing your order for Table #{completedOrder.table_number || tableNumber}.</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#121213] border border-[#534434]/60 text-xs text-left space-y-2 font-mono">
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
                                    <span className="font-bold text-[#ffc174]">₱{parseFloat(completedOrder.total_amount).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setCompletedOrder(null)}
                                className="w-full py-3.5 rounded-xl bg-[#f59e0b] text-[#472a00] font-black text-xs uppercase tracking-wider hover:bg-[#ffc174] transition-all block btn-bevel"
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
