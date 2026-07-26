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
    AlertCircle,
    ShoppingCart,
    ChevronLeft,
    ChevronRight,
    X,
    Search,
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

interface OrderProps {
    products?: Product[];
}

type CategoryType = 'Popular' | 'Rice Meals' | 'Authentic Filipino' | 'Barkada Platters' | 'Drinks & Extra Rice';

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

    const [region] = useState('Region IV-A (CALABARZON)');
    const [province] = useState('Cavite');
    const [city, setCity] = useState('Silang');
    const [barangay, setBarangay] = useState('Anahaw II');
    const [streetAddress, setStreetAddress] = useState('');
    const [deliveryNotes, setDeliveryNotes] = useState('');

    const [paymentMethod, setPaymentMethod] = useState<string>(initialMode === 'delivery' ? 'Cash on Delivery' : 'GCash');
    const [searchQuery, setSearchQuery] = useState('');
    const [isBasketSheetOpen, setIsBasketSheetOpen] = useState(false);

    // Cart Items Pagination State (> 5 items)
    const [cartPage, setCartPage] = useState(1);
    const cartItemsPerPage = 5;

    const isBulihanAddress = city === 'Silang' && BULIHAN_BARANGAYS.includes(barangay);

    useEffect(() => {
        if (orderType === 'delivery') {
            setPaymentMethod('Cash on Delivery');
        } else {
            setPaymentMethod('GCash');
        }
    }, [orderType]);

    useEffect(() => {
        if (CAVITE_LOCATIONS[city]) {
            setBarangay(CAVITE_LOCATIONS[city][0]);
        }
    }, [city]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [completedOrder, setCompletedOrder] = useState<any>(null);

    const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Popular');

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

    const filteredProducts = allProducts.filter((p) => {
        const matchesCategory = selectedCategory === 'Popular' || getProductCategory(p) === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    const { cart, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount } = useCart();

    // Paginated Cart items for > 5 items
    const totalCartPages = Math.max(1, Math.ceil(cart.length / cartItemsPerPage));
    const paginatedCartItems = cart.slice((cartPage - 1) * cartItemsPerPage, cartPage * cartItemsPerPage);

    useEffect(() => {
        if (cartPage > totalCartPages) {
            setCartPage(totalCartPages);
        }
    }, [cart.length, totalCartPages]);

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

            <div className="min-h-screen bg-[#121213] text-[#f0e0d1] font-sans antialiased pb-28">
                
                {/* Header */}
                <header className="sticky top-0 z-40 bg-[#1A1A1B]/95 backdrop-blur-md border-b border-[#534434]/40 shadow-xl">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-2.5">
                        
                        {/* Top Bar Row 1 */}
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <Link href="/" className="w-8 h-8 rounded-full bg-[#261e15] border border-[#534434] text-[#ffc174] flex items-center justify-center shrink-0 hover:bg-[#31281f] transition-colors">
                                    <ArrowLeft className="w-4 h-4" />
                                </Link>
                                <div className="truncate">
                                    <h1 className="text-sm sm:text-lg font-black font-domine text-[#ffc174] leading-tight truncate">
                                        Saddle Ranch
                                    </h1>
                                    <p className="text-[10px] sm:text-xs text-[#d8c3ad] truncate">Online Ordering</p>
                                </div>
                            </div>

                            <span className="px-3 py-1 rounded-full bg-[#f59e0b] text-[#472a00] font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1 shrink-0 shadow-sm">
                                {orderType === 'delivery' ? <Truck className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                                <span>{orderType === 'delivery' ? 'Delivery' : 'Pick-Up'}</span>
                            </span>
                        </div>

                        {/* Top Bar Row 2 */}
                        <div className="relative w-full">
                            <Search className="w-4 h-4 text-[#8c7a6b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search menu items (sisig, steaks, drinks...)"
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#121213] border border-[#534434]/60 text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                            />
                        </div>

                        {/* Top Bar Row 3 */}
                        <div className="overflow-x-auto border-t border-[#262627] pt-2 flex items-center gap-5 sm:gap-8 scrollbar-none">
                            {(['Popular', 'Rice Meals', 'Authentic Filipino', 'Barkada Platters', 'Drinks & Extra Rice'] as CategoryType[]).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`text-xs font-bold whitespace-nowrap relative pb-1 transition-colors ${
                                        selectedCategory === cat ? 'text-[#ffc174] font-black' : 'text-[#8c7a6b] hover:text-white'
                                    }`}
                                >
                                    <span>{cat}</span>
                                    {selectedCategory === cat && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f59e0b] rounded-full animate-in fade-in duration-200" />
                                    )}
                                </button>
                            ))}
                        </div>

                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    {validationError && (
                        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2.5">
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            <span>{validationError}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Menu Column */}
                        <div className="lg:col-span-7 space-y-6">
                            
                            {/* MOBILE (< md) */}
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
                                                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 bg-[#121213]">
                                                    <img
                                                        src={imgUrl}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                                                    />

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

                            {/* DESKTOP (>= md) */}
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
                                                                Add +
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Menu Pagination */}
                                {totalPages > 1 && (
                                    <div className="pt-4 border-t border-[#534434]/50 flex items-center justify-between">
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 rounded-xl bg-[#1A1A1B] border border-[#534434] text-[#d8c3ad] hover:text-white text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 btn-bevel"
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
                                                                ? 'bg-[#f59e0b] text-[#472a00] font-black shadow'
                                                                : 'bg-[#1A1A1B] border border-[#534434] text-[#d8c3ad] hover:text-white'
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
                                            className="px-4 py-2 rounded-xl bg-[#1A1A1B] border border-[#534434] text-[#d8c3ad] hover:text-white text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 btn-bevel"
                                        >
                                            <span>Next</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* DESKTOP ONLY Cart Form with Payment Method Selector */}
                        <div className="hidden lg:block lg:col-span-5 space-y-6">
                            <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-[#1A1A1B] border border-[#534434]/60 shadow-2xl space-y-6">
                                <div className="pb-4 border-b border-[#534434]/50 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2 font-domine">
                                        <ShoppingCart className="w-5 h-5 text-[#f59e0b]" />
                                        <span>Your Order Cart</span>
                                    </h3>
                                    <span className="px-3 py-1 rounded-full bg-[#f59e0b]/20 text-[#ffc174] text-xs font-bold border border-[#f59e0b]/30">
                                        {itemCount} Items
                                    </span>
                                </div>

                                {/* Cart Item List (Paginated if > 5 items) */}
                                <div className="space-y-3">
                                    {cart.length === 0 ? (
                                        <div className="py-8 text-center text-[#8c7a6b] text-xs">
                                            <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#8c7a6b]" />
                                            Your order cart is empty. Add sizzling items from the menu.
                                        </div>
                                    ) : (
                                        (cart.length > 5 ? paginatedCartItems : cart).map((item) => {
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

                                    {/* Cart Pagination Controls when > 5 items */}
                                    {cart.length > 5 && (
                                        <div className="pt-2 flex items-center justify-between text-xs border-t border-[#534434]/40 text-[#d8c3ad]">
                                            <button
                                                type="button"
                                                onClick={() => setCartPage((p) => Math.max(1, p - 1))}
                                                disabled={cartPage === 1}
                                                className="px-2.5 py-1 rounded-lg bg-[#121213] border border-[#534434] hover:text-white disabled:opacity-40 btn-bevel flex items-center gap-1 text-[11px]"
                                            >
                                                <ChevronLeft className="w-3 h-3" />
                                                <span>Prev</span>
                                            </button>
                                            <span className="font-mono text-[11px] font-bold text-[#ffc174]">
                                                Page {cartPage} of {totalCartPages} ({cart.length} items)
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setCartPage((p) => Math.min(totalCartPages, p + 1))}
                                                disabled={cartPage === totalCartPages}
                                                className="px-2.5 py-1 rounded-lg bg-[#121213] border border-[#534434] hover:text-white disabled:opacity-40 btn-bevel flex items-center gap-1 text-[11px]"
                                            >
                                                <span>Next</span>
                                                <ChevronRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Pick-up vs Delivery Selector */}
                                <div className="space-y-2 pt-2 border-t border-[#534434]/40">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#ffc174]">
                                        Select Fulfillment Method
                                    </label>
                                    <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-[#121213] border border-[#534434]">
                                        <button
                                            type="button"
                                            onClick={() => setOrderType('pickup')}
                                            className={`py-3.5 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 btn-bevel ${
                                                orderType === 'pickup'
                                                    ? 'bg-[#f59e0b] text-[#472a00] shadow-lg'
                                                    : 'text-[#d8c3ad] hover:text-white'
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
                                                    ? 'bg-[#f59e0b] text-[#472a00] shadow-lg'
                                                    : 'text-[#d8c3ad] hover:text-white'
                                            }`}
                                        >
                                            <Truck className="w-4 h-4" />
                                            <span>Delivery</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#d8c3ad] mb-1">Customer Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="e.g. Juan Dela Cruz"
                                            className="w-full px-3.5 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#d8c3ad] mb-1">Philippine Mobile Number *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            placeholder="0917XXXXXXX"
                                            className="w-full px-3.5 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                        />
                                    </div>

                                    {orderType === 'delivery' && (
                                        <div className="space-y-3 p-4 rounded-2xl bg-[#121213] border border-[#534434]">
                                            {isBulihanAddress ? (
                                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                                    <span>FREE Delivery Fee (Bulihan Area, Silang)</span>
                                                </div>
                                            ) : (
                                                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
                                                    <Info className="w-4 h-4 text-amber-400 shrink-0" />
                                                    <span>Delivery via Lalamove: Deliveries outside Bulihan Area are dispatched via Lalamove (customer pays actual rider delivery fee upon arrival).</span>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-[#d8c3ad] mb-1">Municipality / City *</label>
                                                    <select
                                                        value={city}
                                                        onChange={(e) => setCity(e.target.value)}
                                                        className="w-full px-3 py-2 rounded-xl bg-[#1A1A1B] border border-[#534434] text-xs text-white focus:border-[#f59e0b] focus:outline-none"
                                                    >
                                                        {Object.keys(CAVITE_LOCATIONS).map((cityName) => (
                                                            <option key={cityName} value={cityName}>
                                                                {cityName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-[#d8c3ad] mb-1">Barangay / Zone *</label>
                                                    <select
                                                        value={barangay}
                                                        onChange={(e) => setBarangay(e.target.value)}
                                                        className="w-full px-3 py-2 rounded-xl bg-[#1A1A1B] border border-[#534434] text-xs text-white focus:border-[#f59e0b] focus:outline-none"
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
                                                <label className="block text-[11px] font-semibold text-[#d8c3ad] mb-1">Street Address / House No. / Landmark *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={streetAddress}
                                                    onChange={(e) => setStreetAddress(e.target.value)}
                                                    placeholder="House #, Street Name, Landmark"
                                                    className="w-full px-3 py-2 rounded-xl bg-[#1A1A1B] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Payment Method Selector Section */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[#d8c3ad] mb-1">Payment Method</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {orderType === 'delivery' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod('Cash on Delivery')}
                                                    className="col-span-2 py-2.5 rounded-xl text-xs font-black border transition-all btn-bevel bg-[#f59e0b]/20 border-[#f59e0b] text-white"
                                                >
                                                    Cash on Delivery
                                                </button>
                                            ) : (
                                                ['Cash (Pick-Up)', 'GCash'].map((method) => (
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
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-2 flex justify-between text-base font-black text-white">
                                        <span>Total Amount</span>
                                        <span className="text-[#ffc174] font-mono">₱{subtotal.toFixed(2)}</span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={cart.length === 0 || isSubmitting}
                                        className="w-full py-4 rounded-2xl bg-[#f59e0b] hover:bg-[#ffc174] disabled:opacity-40 text-[#472a00] font-black text-sm uppercase tracking-wider shadow-xl shadow-[#f59e0b]/30 transition-all btn-bevel"
                                    >
                                        {isSubmitting ? 'Processing Order...' : `Place Order (₱${subtotal.toFixed(2)})`}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>

                {/* MOBILE ONLY: Sticky Floating Bottom Cart Bar */}
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
                                    <div className="text-sm font-black leading-tight">View your Order</div>
                                    <div className="text-[10px] text-[#472a00]/80 font-bold">Saddle Ranch Online Order</div>
                                </div>
                            </div>

                            <div className="font-mono text-base font-black">
                                ₱ {subtotal.toFixed(2)}
                            </div>
                        </button>
                    </div>
                )}

                {/* MOBILE ONLY: Slide-Up Cart Sheet Drawer */}
                {isBasketSheetOpen && (
                    <div className="block lg:hidden fixed inset-0 z-50 flex items-end justify-center p-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="w-full max-w-md max-h-[85vh] rounded-t-3xl bg-[#1A1A1B] border border-[#ffc174]/30 p-5 shadow-2xl overflow-y-auto space-y-5 animate-in slide-in-from-bottom-8 duration-300">
                            
                            <div className="flex items-center justify-between pb-3 border-b border-[#534434]/50">
                                <div>
                                    <h3 className="text-base font-black text-white font-domine">View your Order</h3>
                                    <p className="text-[10px] text-[#d8c3ad]">Saddle Ranch Online Order</p>
                                </div>
                                <button
                                    onClick={() => setIsBasketSheetOpen(false)}
                                    className="w-8 h-8 rounded-full bg-[#261e15] text-[#d8c3ad] flex items-center justify-center"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Fulfillment Toggle in Mobile Basket Drawer */}
                            <div className="p-1 rounded-2xl bg-[#121213] border border-[#534434]/40 grid grid-cols-2 gap-1 text-xs font-bold">
                                <button
                                    onClick={() => setOrderType('pickup')}
                                    className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all btn-bevel ${
                                        orderType === 'pickup' ? 'bg-[#f59e0b] text-[#472a00] font-black shadow' : 'text-[#d8c3ad]'
                                    }`}
                                >
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    <span>Pick-Up</span>
                                </button>
                                <button
                                    onClick={() => setOrderType('delivery')}
                                    className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all btn-bevel ${
                                        orderType === 'delivery' ? 'bg-[#f59e0b] text-[#472a00] font-black shadow' : 'text-[#d8c3ad]'
                                    }`}
                                >
                                    <Truck className="w-3.5 h-3.5" />
                                    <span>Delivery</span>
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

                            {/* Mobile Form */}
                            <form onSubmit={handleSubmit} className="space-y-4 pt-3 border-t border-[#262627]">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-[#d8c3ad] mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="Your Name"
                                            className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-[#d8c3ad] mb-1">Mobile No. *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            placeholder="0917XXXXXXX"
                                            className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {orderType === 'delivery' && (
                                    <div className="space-y-2 p-3 rounded-2xl bg-[#121213] border border-[#534434]">
                                        {isBulihanAddress ? (
                                            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                <span>FREE Delivery Fee (Bulihan Area, Silang)</span>
                                            </div>
                                        ) : (
                                            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center gap-1.5">
                                                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                                <span>Delivery via Lalamove: Deliveries outside Bulihan Area are dispatched via Lalamove (customer pays actual rider delivery fee upon arrival).</span>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-[10px] font-semibold text-[#d8c3ad] mb-0.5">City / Municipality</label>
                                                <select
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    className="w-full px-2 py-1.5 rounded-lg bg-[#1A1A1B] border border-[#534434] text-xs text-white"
                                                >
                                                    {Object.keys(CAVITE_LOCATIONS).map((c) => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-[#d8c3ad] mb-0.5">Barangay</label>
                                                <select
                                                    value={barangay}
                                                    onChange={(e) => setBarangay(e.target.value)}
                                                    className="w-full px-2 py-1.5 rounded-lg bg-[#1A1A1B] border border-[#534434] text-xs text-white"
                                                >
                                                    {(CAVITE_LOCATIONS[city] || []).map((b) => (
                                                        <option key={b} value={b}>{b}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-semibold text-[#d8c3ad] mb-0.5">Street / House No. / Landmark *</label>
                                            <input
                                                type="text"
                                                required
                                                value={streetAddress}
                                                onChange={(e) => setStreetAddress(e.target.value)}
                                                placeholder="Street address..."
                                                className="w-full px-2.5 py-1.5 rounded-lg bg-[#1A1A1B] border border-[#534434] text-xs text-white placeholder-[#8c7a6b]"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Payment Method Selector Section in Mobile Drawer */}
                                <div>
                                    <label className="block text-[11px] font-semibold text-[#d8c3ad] mb-1">Payment Method</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {orderType === 'delivery' ? (
                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod('Cash on Delivery')}
                                                className="col-span-2 py-2 rounded-xl text-xs font-black border transition-all btn-bevel bg-[#f59e0b]/20 border-[#f59e0b] text-white"
                                            >
                                                Cash on Delivery
                                            </button>
                                        ) : (
                                            ['Cash (Pick-Up)', 'GCash'].map((method) => (
                                                <button
                                                    key={method}
                                                    type="button"
                                                    onClick={() => setPaymentMethod(method)}
                                                    className={`py-2 rounded-xl text-xs font-bold border transition-all btn-bevel ${
                                                        paymentMethod === method
                                                            ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-white font-black'
                                                            : 'bg-[#121213] border-[#534434] text-[#d8c3ad]'
                                                    }`}
                                                >
                                                    {method}
                                                </button>
                                            ))
                                        )}
                                    </div>
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
                                    {isSubmitting ? 'Processing Order...' : `Place Order • ₱ ${subtotal.toFixed(2)}`}
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
                                <h3 className="text-xl font-bold text-[#ffc174] mt-0.5">Order Received</h3>
                                <p className="text-xs text-[#d8c3ad] mt-1">We are preparing your sizzling order.</p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-[#121213] border border-[#534434]/60 text-xs text-left space-y-2 font-mono">
                                <div className="flex justify-between">
                                    <span className="text-[#8c7a6b]">Order Number:</span>
                                    <span className="font-bold text-[#f59e0b]">{completedOrder.order_number}</span>
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
