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

interface OrderProps {
    products?: Product[];
}

type CategoryType = 'All' | 'Rice Meals' | 'Authentic Filipino' | 'Barkada Platters' | 'Drinks & Extra Rice';

// Official Bulihan District Barangays in Silang, Cavite (All qualify for FREE Delivery)
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
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');

    // Auto-detect Bulihan address: FREE delivery applies to all Bulihan district barangays in Silang
    const isBulihanAddress = city === 'Silang' && BULIHAN_BARANGAYS.includes(barangay);

    // Fallback menu list with 15 items including drinks & rice
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
        {
            id: 15,
            name: 'Fresh Dalandan Juice (1 Litro)',
            description: 'Freshly squeezed citrus dalandan juice pitcher (1 Litro).',
            price: 110.00,
            image_path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT2sso9NgKHiCPPIkIfBBCfPNPUK_dgit8ctI0rtoMT_bXyQ21nRcx3ViyVnDNZTyTCVtYOSFJ8h_h3ZG451V7vUFX1LFMWyd6wQrV-4pevn9wO0H-wUZVYl0TBSwWt_bbQikBKmtygbJeYfSzWbAOcd32EpNo8TCvpmAamQoFlFfNvHrmpn32aUcJ7gi5IGdK9xpTad7qU6dSRSu2bty13h9_T3_GKF3mMrUI31pUXtjCvVgiLfQIkBBbjU_zY5SS0IrP8nvbh7QQ',
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

    // Filter products based on selected category tab
    const filteredProducts = selectedCategory === 'All'
        ? allProducts
        : allProducts.filter((p) => getProductCategory(p) === selectedCategory);

    // Pagination State (3 rows = 6 items per page in 2-column grid)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset pagination to page 1 whenever category changes
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

            <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-orange-500 selection:text-white">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-black text-white flex items-center gap-2">
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
                        {/* Menu Selection (Left 7 Cols) - Paginated 3 rows (6 items) with Category Filters */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-800">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Flame className="w-5 h-5 text-orange-500" />
                                    <span>Select Sizzling Plates</span>
                                </h2>
                                <span className="text-xs text-stone-400">
                                    Showing {filteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} Items
                                </span>
                            </div>

                            {/* Category Filter Tabs */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                                {(['All', 'Rice Meals', 'Authentic Filipino', 'Barkada Platters', 'Drinks & Extra Rice'] as CategoryType[]).map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                                : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700'
                                            }`}
                                    >
                                        {cat === 'All' ? 'All Items' : cat === 'Rice Meals' ? 'Sizzling Rice Meals' : cat}
                                    </button>
                                ))}
                            </div>

                            {/* 3 Rows x 2 Columns Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 min-h-[540px]">
                                {paginatedProducts.length === 0 ? (
                                    <div className="col-span-2 flex flex-col items-center justify-center py-16 text-stone-500 text-xs">
                                        <Filter className="w-8 h-8 mb-2 opacity-40 text-stone-600" />
                                        No items available in this category.
                                    </div>
                                ) : (
                                    paginatedProducts.map((product) => {
                                        const numPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                                        const isOutOfStock = product.stock_quantity <= 0;
                                        const cartEntry = cart.find((i) => i.product.id === product.id);
                                        const imgUrl = getProductImage(product);

                                        return (
                                            <div
                                                key={product.id}
                                                className={`p-4 rounded-2xl bg-stone-900 border flex flex-col justify-between transition-all group shadow-lg ${isOutOfStock ? 'border-stone-800/40 opacity-70' : 'border-stone-800 hover:border-orange-500/50'
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

                                                    <h3 className="font-bold text-white text-base group-hover:text-orange-400 transition-colors">{product.name}</h3>
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
                                                            className="px-3.5 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500 border border-orange-500/30 text-orange-400 hover:text-white font-bold text-xs transition-all disabled:opacity-40"
                                                        >
                                                            Add +
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-orange-500 text-stone-300 hover:text-white text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5"
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
                                                    className={`w-8 h-8 rounded-xl font-bold text-xs transition-all ${currentPage === pageNum
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
                                        className="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-orange-500 text-stone-300 hover:text-white text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5"
                                    >
                                        <span>Next</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Cart Drawer & Checkout Form (Right 5 Cols) */}
                        <div className="lg:col-span-5 space-y-6">
                            <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl space-y-6">
                                <div className="pb-4 border-b border-stone-800 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
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
                                            className={`py-3.5 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${orderType === 'pickup'
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
                                            className={`py-3.5 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${orderType === 'delivery'
                                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
                                                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                                                }`}
                                        >
                                            <Truck className="w-4 h-4" />
                                            <span>Delivery</span>
                                        </button>
                                    </div>

                                    {/* Lalamove Delivery Notice */}
                                    {orderType === 'delivery' && (
                                        <div className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                                            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                            <div className="space-y-1">
                                                <p className="font-bold">Roadhouse Delivery Policy</p>
                                                <p className="text-[11px] text-stone-300 leading-relaxed">
                                                    Orders within <strong className="text-white">Bulihan District, Silang</strong> (Anahaw, Acacia, Banaba, Ipil, Narra, Yakal) qualify for <strong className="text-emerald-400">Free Direct Delivery</strong>. Delivery outside Bulihan is dispatched via <strong className="text-orange-400">Lalamove</strong> (delivery fee paid to rider upon receipt).
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Cart Items List */}
                                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                    {cart.length === 0 ? (
                                        <div className="py-8 text-center text-stone-500 text-xs">
                                            <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40 text-stone-600" />
                                            Your cart is currently empty. Add items from the menu.
                                        </div>
                                    ) : (
                                        cart.map((item) => {
                                            const numPrice = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
                                            const itemImg = getProductImage(item.product as Product);
                                            return (
                                                <div key={item.product.id} className="p-2.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between text-xs gap-3">
                                                    <div className="flex items-center gap-3 truncate">
                                                        <img src={itemImg} alt={item.product.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                                                        <div className="truncate">
                                                            <div className="font-bold text-white truncate">{item.product.name}</div>
                                                            <div className="text-[10px] text-stone-400">₱{numPrice.toFixed(2)} each</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 flex-shrink-0">
                                                        <div className="flex items-center gap-1 border border-stone-800 rounded-lg p-0.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                                className="p-1 hover:bg-stone-800 text-stone-400 hover:text-white"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="font-bold px-1 text-xs">{item.quantity}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                                disabled={item.quantity >= item.product.stock_quantity}
                                                                className="p-1 hover:bg-stone-800 text-stone-400 hover:text-white disabled:opacity-30"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                        <span className="font-bold text-amber-400 text-xs">
                                                            ₱{(numPrice * item.quantity).toFixed(2)}
                                                        </span>
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

                                {/* Customer Form Fields */}
                                <div className="space-y-4 pt-4 border-t border-stone-800">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
                                        {orderType === 'pickup' ? 'Pick-Up Details' : 'Structured Delivery Address'}
                                    </h4>

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

                                    {orderType === 'pickup' ? (
                                        <div>
                                            <label className="block text-xs font-semibold text-stone-300 mb-1">Requested Pick-Up Time</label>
                                            <select
                                                value={pickupTime}
                                                onChange={(e) => setPickupTime(e.target.value)}
                                                className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:border-orange-500 focus:outline-none"
                                            >
                                                <option value="ASAP (15-20 mins)">ASAP (15-20 mins)</option>
                                                <option value="30 Minutes from now">30 Minutes from now</option>
                                                <option value="1 Hour from now">1 Hour from now</option>
                                                <option value="Special requested time">Custom requested time</option>
                                            </select>
                                        </div>
                                    ) : (
                                        /* High-Precision Structured Philippine Address Selector with Official Bulihan Barangays */
                                        <div className="space-y-3 p-4 rounded-2xl bg-stone-950/80 border border-stone-800">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Region</label>
                                                    <input
                                                        type="text"
                                                        disabled
                                                        value={region}
                                                        className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-400 font-medium"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Province</label>
                                                    <input
                                                        type="text"
                                                        disabled
                                                        value={province}
                                                        className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-400 font-medium"
                                                    />
                                                </div>
                                            </div>

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
                                                <label className="block text-[11px] font-semibold text-stone-300 mb-1">House No. / Street Name / Subdivision / Landmark *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={streetAddress}
                                                    onChange={(e) => setStreetAddress(e.target.value)}
                                                    placeholder="e.g. Block 12 Lot 5 Phase 2, Sunshine Village"
                                                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-600 focus:border-orange-500 focus:outline-none"
                                                />
                                            </div>

                                            {/* Automatic Delivery Fee Status Banner */}
                                            {isBulihanAddress ? (
                                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Truck className="w-4 h-4 text-emerald-400" />
                                                        <span>Delivery Fee (Bulihan, Silang)</span>
                                                    </div>
                                                    <span className="font-black uppercase tracking-wider">FREE (₱0.00)</span>
                                                </div>
                                            ) : (
                                                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Truck className="w-4 h-4 text-orange-400" />
                                                        <span>Outside Bulihan ({city})</span>
                                                    </div>
                                                    <span className="font-bold text-[11px]">Via Lalamove (Fee paid to rider)</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-semibold text-stone-300 mb-1">Special Notes (Optional)</label>
                                        <input
                                            type="text"
                                            value={deliveryNotes}
                                            onChange={(e) => setDeliveryNotes(e.target.value)}
                                            placeholder="e.g. Extra hot plate, cutlery needed..."
                                            className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:border-orange-500 focus:outline-none"
                                        />
                                    </div>

                                    {/* Payment Method Selection */}
                                    <div>
                                        <label className="block text-xs font-semibold text-stone-300 mb-1">Payment Method</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {orderType === 'pickup' ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPaymentMethod('GCash')}
                                                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${paymentMethod === 'GCash'
                                                                ? 'bg-orange-500/20 border-orange-500 text-white'
                                                                : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                                                            }`}
                                                    >
                                                        GCash
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPaymentMethod('Cash')}
                                                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${paymentMethod === 'Cash'
                                                                ? 'bg-orange-500/20 border-orange-500 text-white'
                                                                : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                                                            }`}
                                                    >
                                                        Cash
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    type="button"
                                                    disabled
                                                    className="col-span-2 py-3 rounded-xl text-xs font-bold border bg-orange-500/20 border-orange-500 text-white flex items-center justify-center gap-2 cursor-default"
                                                >
                                                    <CheckCircle2 className="w-4 h-4 text-orange-400" />
                                                    <span>Cash on Delivery</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Summary Breakdown */}
                                <div className="pt-4 border-t border-stone-800 space-y-2 text-xs">
                                    <div className="flex justify-between text-stone-400">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-white">₱{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-stone-400">
                                        <span>Fulfillment Fee ({orderType === 'pickup' ? 'Pick-Up' : isBulihanAddress ? 'Bulihan Delivery' : 'Lalamove Delivery'})</span>
                                        <span className="font-bold text-emerald-400">
                                            {orderType === 'pickup' || isBulihanAddress ? '₱0.00 (FREE)' : 'Paid to Rider'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-base font-black text-white pt-2 border-t border-stone-800">
                                        <span>Total Amount</span>
                                        <span className="text-amber-400">₱{subtotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={cart.length === 0 || isSubmitting}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-40 text-white font-bold text-sm shadow-xl shadow-orange-600/30 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <span>Processing Order...</span>
                                    ) : (
                                        <>
                                            <ShoppingBag className="w-4 h-4" />
                                            <span>Place Order (₱{subtotal.toFixed(2)})</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </main>

                {/* Order Confirmation Modal */}
                {completedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="w-full max-w-md rounded-3xl bg-stone-900 border border-stone-800 p-8 shadow-2xl text-center space-y-6">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>

                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Order Confirmed!</span>
                                <h3 className="text-2xl font-black text-white mt-1">Thank you for your order</h3>
                                <p className="text-xs text-stone-400 mt-1">Our kitchen has received your sizzling order.</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-left space-y-2 font-mono">
                                <div className="flex justify-between">
                                    <span className="text-stone-500">Order Number:</span>
                                    <span className="font-bold text-orange-400">{completedOrder.order_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-500">Fulfillment:</span>
                                    <span className="font-bold text-white uppercase">{completedOrder.order_type}</span>
                                </div>
                                <div className="flex justify-between flex-col gap-1 pt-1 border-t border-stone-800/50">
                                    <span className="text-stone-500">Delivery Address:</span>
                                    <span className="font-bold text-stone-200 text-[11px] leading-tight">{completedOrder.delivery_address || 'Pick-Up Counter'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-500">Total Paid/Due:</span>
                                    <span className="font-bold text-amber-400">₱{parseFloat(completedOrder.total_amount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-500">Payment Method:</span>
                                    <span className="font-bold text-white">{completedOrder.payment_method}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/"
                                    onClick={() => setCompletedOrder(null)}
                                    className="w-full py-3.5 rounded-xl bg-orange-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-orange-600 transition-all block"
                                >
                                    Back to Saddle Ranch Home
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
