import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    ShoppingBag, 
    Truck, 
    ArrowLeft, 
    Plus, 
    Minus, 
    Trash2, 
    CheckCircle2, 
    Clock, 
    MapPin, 
    Flame, 
    AlertCircle,
    ShoppingCart,
    ChevronLeft,
    ChevronRight,
    Info,
    Filter,
    X,
    Search
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

interface OrderProps {
    products?: Product[];
}

type CategoryType = 'Popular' | 'Rice Meals' | 'Authentic Filipino' | 'Barkada Platters' | 'Drinks & Extra Rice';

// Official Bulihan District Barangays in Silang, Cavite
const BULIHAN_BARANGAYS = [
    'Anahaw II',
    'Anahaw I',
    'Acacia',
    'Banaba',
    'Ipil I',
    'Ipil II',
    'Narra I',
    'Narra II',
    'Narra III',
    'Yakal',
    'Bulihan Proper',
];

// Cavite Municipality & Barangay Master Data
const CAVITE_LOCATIONS: Record<string, string[]> = {
    'Silang': [
        ...BULIHAN_BARANGAYS,
        'Biga I',
        'Biga II',
        'Carmen',
        'Lucsuhin',
        'Poblacion I',
        'Poblacion II',
        'Sabutan',
        'San Vicente',
        'Tubuan',
        'Other Silang Barangay'
    ],
    'Dasmariñas City': [
        'Sampaloc 1',
        'Sampaloc 2',
        'Salawag',
        'Paliparan 1',
        'Paliparan 2',
        'Paliparan 3',
        'Langgaan',
        'San Agustin 1',
        'San Agustin 2',
        'Other Dasmariñas Barangay'
    ],
    'General Trias': [
        'Manggahan',
        'San Francisco',
        'Navarro',
        'Tejero',
        'Other Gen. Trias Barangay'
    ],
    'Imus City': [
        'Anabu I-A',
        'Bucandala',
        'Malagasang I-A',
        'Poblacion',
        'Other Imus Barangay'
    ],
    'Bacoor City': [
        'Molino 1',
        'Molino 2',
        'Molino 3',
        'Queens Row',
        'Other Bacoor Barangay'
    ],
    'Tagaytay City': [
        'Maharlika',
        'Mendez Crossing',
        'Sungay',
        'Other Tagaytay Barangay'
    ],
    'Other Cavite Municipality': [
        'Poblacion / Local Barangay'
    ]
};

export default function CustomerOrder({ products = [] }: OrderProps) {
    const { flash } = usePage<PageProps>().props;

    const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const initialMode = (queryParams.get('mode') === 'delivery' ? 'delivery' : 'pickup') as 'pickup' | 'delivery';

    const [orderType, setOrderType] = useState<'pickup' | 'delivery'>(initialMode);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [pickupTime, setPickupTime] = useState('ASAP (15-20 mins)');

    // Structured Philippine Delivery Address State
    const [region] = useState('Region IV-A (CALABARZON)');
    const [province] = useState('Cavite');
    const [city, setCity] = useState('Silang');
    const [barangay, setBarangay] = useState('Anahaw II');
    const [streetAddress, setStreetAddress] = useState('');
    const [deliveryNotes, setDeliveryNotes] = useState('');

    // Payment method rules (GCash & Cash for Pick-up; Cash on Delivery for Delivery)
    const [paymentMethod, setPaymentMethod] = useState<string>(initialMode === 'delivery' ? 'Cash on Delivery' : 'GCash');
    const [isBasketSheetOpen, setIsBasketSheetOpen] = useState(false);

    // Update payment method when orderType changes
    useEffect(() => {
        if (orderType === 'delivery') {
            setPaymentMethod('Cash on Delivery');
        } else {
            setPaymentMethod('GCash');
        }
    }, [orderType]);

    // Update barangay dropdown when city changes
    useEffect(() => {
        if (CAVITE_LOCATIONS[city]) {
            setBarangay(CAVITE_LOCATIONS[city][0]);
        }
    }, [city]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [completedOrder, setCompletedOrder] = useState<any>(null);

    // Category Sort Filter State
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Popular');

    // Auto-detect Bulihan address
    const isBulihanAddress = city === 'Silang' && BULIHAN_BARANGAYS.includes(barangay);

    // Fallback menu list
    const fallbackProducts: Product[] = [
        {
            id: 1,
            name: 'Sizzling Pork Sisig',
            description: 'Crispy pork belly seasoned with local spices, served on a sizzling cast-iron skillet.',
            price: 180.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t',
            stock_quantity: 50,
            is_active: true,
        },
        {
            id: 2,
            name: 'Sizzling Pork T-Bone Steak',
            description: 'Tender T-Bone steak seared hard on cast iron, topped with rich roadhouse gravy.',
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
            description: 'Chargrilled Bacolod-style chicken served sizzling hot with garlic rice.',
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
    const filteredProducts = selectedCategory === 'Popular'
        ? allProducts
        : allProducts.filter((p) => getProductCategory(p) === selectedCategory);

    // Desktop Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    const { cart, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount } = useCart();

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
            setValidationError('Your cart is empty. Please add sizzling items before placing your order.');
            return;
        }

        if (!customerName.trim() || !customerPhone.trim()) {
            setValidationError('Please provide your name and mobile number.');
            return;
        }

        if (orderType === 'delivery' && !streetAddress.trim()) {
            setValidationError('Please provide your street address / landmark.');
            return;
        }

        setIsSubmitting(true);

        const constructedDeliveryAddress = `${streetAddress.trim()}, Brgy. ${barangay}, ${city}, ${province}, ${region}`;

        const payload = {
            order_type: orderType,
            customer_name: customerName,
            customer_phone: customerPhone,
            pickup_time: orderType === 'pickup' ? pickupTime : null,
            delivery_address: orderType === 'delivery' ? constructedDeliveryAddress : null,
            delivery_notes: deliveryNotes,
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
            <Head title="Online Ordering | Saddle Ranch" />

            <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-orange-500 selection:text-white pb-28">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-black text-white flex items-center gap-2 font-domine">
                                    <span>Saddle Ranch Menu & Cart</span>
                                </h1>
                                <p className="text-xs text-stone-400">Order online for fast pickup or hot delivery</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {validationError && (
                        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                            <span>{validationError}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Menu Selection Column */}
                        <div className="lg:col-span-7 space-y-6">
                            
                            {/* Category Filter Carousel */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                                {(['Popular', 'Rice Meals', 'Authentic Filipino', 'Barkada Platters', 'Drinks & Extra Rice'] as CategoryType[]).map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all btn-bevel ${
                                            selectedCategory === cat
                                                ? 'bg-orange-500 text-stone-950 font-black shadow-lg shadow-orange-500/20'
                                                : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white'
                                        }`}
                                    >
                                        {cat === 'Popular' ? '🔥 Popular' : cat}
                                    </button>
                                ))}
                            </div>

                            {/* MOBILE VIEWPORT (< md): 2-Column Mobile Grid */}
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
                                                className="bg-stone-900 rounded-2xl border border-stone-800 p-3 flex flex-col justify-between relative group hover:border-orange-500/50 transition-all shadow-md"
                                            >
                                                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2.5 bg-stone-950">
                                                    <img
                                                        src={imgUrl}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 opacity-90"
                                                    />

                                                    <div className="absolute bottom-1.5 right-1.5 z-10">
                                                        {cartEntry ? (
                                                            <button
                                                                onClick={() => addItem(product as CartProduct, 1)}
                                                                className="w-7 h-7 rounded-full bg-stone-950 text-orange-400 font-black text-xs border border-orange-500 shadow-lg flex items-center justify-center btn-bevel"
                                                            >
                                                                {cartEntry.quantity}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => addItem(product as CartProduct, 1)}
                                                                disabled={isOutOfStock}
                                                                className="w-7 h-7 rounded-full bg-orange-500 text-white font-black text-sm shadow-lg flex items-center justify-center transition-colors btn-bevel disabled:opacity-40"
                                                            >
                                                                +
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <h3 className="font-domine font-bold text-xs text-white line-clamp-2 leading-snug">
                                                        {product.name}
                                                    </h3>
                                                    <div className="font-mono text-xs font-black text-amber-400">
                                                        ₱ {numPrice.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* DESKTOP VIEWPORT (>= md): Full Desktop Grid */}
                            <div className="hidden md:block space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {paginatedProducts.map((product) => {
                                        const numPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                                        const isOutOfStock = product.stock_quantity <= 0;
                                        const cartEntry = cart.find((i) => i.product.id === product.id);
                                        const imgUrl = getProductImage(product);

                                        return (
                                            <div
                                                key={product.id}
                                                className={`p-4 rounded-2xl bg-stone-900 border flex flex-col justify-between transition-all group shadow-lg ${
                                                    isOutOfStock ? 'border-stone-800/40 opacity-70' : 'border-stone-800 hover:border-orange-500/50'
                                                }`}
                                            >
                                                <div>
                                                    <div className="h-36 w-full relative overflow-hidden rounded-xl mb-3 bg-stone-950">
                                                        <img
                                                            src={imgUrl}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 opacity-90"
                                                        />
                                                        <div className="absolute top-2.5 right-2.5">
                                                            <span className="font-mono text-xs font-black text-[#121213] bg-[#ffc174] px-2.5 py-0.5 rounded shadow">
                                                                ₱{numPrice.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <h3 className="font-bold text-white text-base group-hover:text-orange-400 transition-colors font-domine">{product.name}</h3>
                                                    <p className="text-xs text-stone-400 mt-1 line-clamp-2">{product.description}</p>
                                                </div>

                                                <div className="mt-4 pt-3 border-t border-stone-800/60 flex items-center justify-between">
                                                    {isOutOfStock ? (
                                                        <span className="text-[10px] font-bold text-rose-400 uppercase">Out of Stock</span>
                                                    ) : (
                                                        <span className="text-[10px] text-stone-500 font-semibold">Ready to Sizzle</span>
                                                    )}

                                                    {cartEntry ? (
                                                        <div className="flex items-center gap-2 bg-stone-950 border border-stone-800 rounded-xl p-1">
                                                            <button
                                                                onClick={() => updateQuantity(product.id, cartEntry.quantity - 1)}
                                                                className="p-1 rounded-lg hover:bg-stone-800 text-stone-300"
                                                            >
                                                                <Minus className="w-3.5 h-3.5" />
                                                            </button>
                                                            <span className="text-xs font-bold px-2">{cartEntry.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(product.id, cartEntry.quantity + 1)}
                                                                disabled={cartEntry.quantity >= product.stock_quantity}
                                                                className="p-1 rounded-lg hover:bg-stone-800 text-stone-300 disabled:opacity-40"
                                                            >
                                                                <Plus className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => addItem(product as CartProduct, 1)}
                                                            disabled={isOutOfStock}
                                                            className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-amber-500 text-white font-bold text-xs transition-all btn-bevel disabled:opacity-40 shadow-md"
                                                        >
                                                            Add +
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-orange-500 text-stone-300 hover:text-white text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 btn-bevel"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            <span>Previous</span>
                                        </button>

                                        <div className="flex items-center gap-2">
                                            {Array.from({ length: totalPages }).map((_, idx) => {
                                                const pageNum = idx + 1;
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className={`w-8 h-8 rounded-xl font-bold text-xs transition-all btn-bevel ${
                                                            currentPage === pageNum
                                                                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                                                                : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-orange-500 text-stone-300 hover:text-white text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 btn-bevel"
                                        >
                                            <span>Next</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* DESKTOP ONLY Right Side Cart Drawer Form */}
                        <div className="hidden lg:block lg:col-span-5 space-y-6">
                            <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl space-y-6">
                                <div className="pb-4 border-b border-stone-800 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2 font-domine">
                                        <ShoppingCart className="w-5 h-5 text-orange-400" />
                                        <span>Your Order Cart</span>
                                    </h3>
                                    <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">
                                        {itemCount} Items
                                    </span>
                                </div>

                                {/* Pick-up vs Delivery Selector */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-orange-400">
                                        Select Fulfillment Method
                                    </label>
                                    <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-stone-950 border border-stone-800">
                                        <button
                                            type="button"
                                            onClick={() => setOrderType('pickup')}
                                            className={`py-3.5 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 btn-bevel ${
                                                orderType === 'pickup'
                                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
                                                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                                            }`}
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            <span>Pick-Up</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setOrderType('delivery')}
                                            className={`py-3.5 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 btn-bevel ${
                                                orderType === 'delivery'
                                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
                                                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                                            }`}
                                        >
                                            <Truck className="w-4 h-4" />
                                            <span>Delivery</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-4 pt-4 border-t border-stone-800">
                                    <div>
                                        <label className="block text-xs font-semibold text-stone-300 mb-1">Customer Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="e.g. Juan Dela Cruz"
                                            className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:border-orange-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-stone-300 mb-1">Philippine Mobile Number *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            placeholder="0917XXXXXXX"
                                            className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:border-orange-500 focus:outline-none"
                                        />
                                    </div>

                                    {orderType === 'delivery' && (
                                        <div className="space-y-3 p-4 rounded-2xl bg-stone-950/80 border border-stone-800">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Municipality / City *</label>
                                                    <select
                                                        value={city}
                                                        onChange={(e) => setCity(e.target.value)}
                                                        className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:border-orange-500 focus:outline-none"
                                                    >
                                                        {Object.keys(CAVITE_LOCATIONS).map((cityName) => (
                                                            <option key={cityName} value={cityName}>
                                                                {cityName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Barangay / Zone *</label>
                                                    <select
                                                        value={barangay}
                                                        onChange={(e) => setBarangay(e.target.value)}
                                                        className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:border-orange-500 focus:outline-none"
                                                    >
                                                        {city === 'Silang' && (
                                                            <optgroup label="Bulihan District (FREE Delivery)">
                                                                {BULIHAN_BARANGAYS.map((brgy) => (
                                                                    <option key={brgy} value={brgy}>
                                                                        {brgy} (Bulihan)
                                                                    </option>
                                                                ))}
                                                            </optgroup>
                                                        )}
                                                        <optgroup label={city === 'Silang' ? "Other Silang Barangays" : "Barangays"}>
                                                            {(CAVITE_LOCATIONS[city] || [])
                                                                .filter((b) => city !== 'Silang' || !BULIHAN_BARANGAYS.includes(b))
                                                                .map((brgy) => (
                                                                    <option key={brgy} value={brgy}>
                                                                        {brgy}
                                                                    </option>
                                                                ))}
                                                        </optgroup>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-stone-300 mb-1">Street Address / House No. / Landmark *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={streetAddress}
                                                    onChange={(e) => setStreetAddress(e.target.value)}
                                                    placeholder="House #, Street Name, Landmark"
                                                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-600 focus:border-orange-500 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-2 flex justify-between text-base font-black text-white">
                                        <span>Total Amount</span>
                                        <span className="text-amber-400">₱{subtotal.toFixed(2)}</span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={cart.length === 0 || isSubmitting}
                                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-40 text-white font-bold text-sm uppercase tracking-wider shadow-xl shadow-orange-600/30 transition-all btn-bevel"
                                    >
                                        {isSubmitting ? 'Processing Order...' : `Place Order (₱${subtotal.toFixed(2)})`}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>

                {/* MOBILE ONLY: Floating Sticky Cart Bar */}
                {itemCount > 0 && (
                    <div className="block lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-40 animate-in slide-in-from-bottom-6 duration-300">
                        <button
                            onClick={() => setIsBasketSheetOpen(true)}
                            className="w-full h-14 rounded-2xl bg-orange-500 text-stone-950 font-bold shadow-2xl shadow-orange-500/30 px-4 flex items-center justify-between hover:scale-[1.02] active:scale-98 transition-all btn-bevel"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-stone-950 text-amber-400 text-xs font-black flex items-center justify-center border border-amber-400">
                                    {itemCount}
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-black leading-tight">View your cart</div>
                                    <div className="text-[10px] text-stone-900 font-bold">Saddle Ranch Online Order</div>
                                </div>
                            </div>

                            <div className="font-mono text-base font-black">
                                ₱ {subtotal.toFixed(2)}
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
