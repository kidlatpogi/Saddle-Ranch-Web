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
    Info,
    ShieldCheck,
    UserCheck,
    Lock,
    Ticket,
    LogOut,
    User,
    RotateCcw,
    Star,
    Sparkles,
    QrCode
} from 'lucide-react';
import { useCart, CartProduct } from '@/Hooks/useCart';
import { PageProps } from '@/types';
import AIChatbot from '@/Components/AIChatbot';
import LocationModal from '@/Components/LocationModal';
import PrivacyPolicyModal from '@/Components/PrivacyPolicyModal';
import ReturnPolicyModal from '@/Components/ReturnPolicyModal';
import OrderConfirmationModal from '@/Components/OrderConfirmationModal';
import RatingModal from '@/Components/RatingModal';
import CustomerAuthModal from '@/Components/CustomerAuthModal';
import CustomerAccountModal from '@/Components/CustomerAccountModal';
import CustomerOrderTracker from '@/Components/CustomerOrderTracker';

interface Product {
    id: number;
    name: string;
    category?: string;
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
    const { flash, auth } = usePage<PageProps>().props;
    const authUser: any = auth?.user;
    const [currentUser, setCurrentUser] = useState<any>(authUser);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        setCurrentUser(authUser);
    }, [authUser]);

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

    const [paymentMethod, setPaymentMethod] = useState<string>(initialMode === 'delivery' ? 'QRPh / e-Wallets' : 'Cash (Pick-Up)');
    const [searchQuery, setSearchQuery] = useState('');
    const [isBasketSheetOpen, setIsBasketSheetOpen] = useState(false);

    // Optional Account Creation State
    const [createAccount, setCreateAccount] = useState(false);
    const [accountEmail, setAccountEmail] = useState('');
    const [accountPassword, setAccountPassword] = useState('');
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

    // Order Confirmation Quick Register State
    const [quickEmail, setQuickEmail] = useState('');
    const [quickPassword, setQuickPassword] = useState('');
    const [isQuickRegistering, setIsQuickRegistering] = useState(false);
    const [accountCreatedSuccess, setAccountCreatedSuccess] = useState(false);

    // Auto-fill details for logged in users
    useEffect(() => {
        if (currentUser) {
            if (currentUser.name && !customerName) setCustomerName(currentUser.name);
            if (currentUser.phone_number && !customerPhone) setCustomerPhone(currentUser.phone_number);
            if (currentUser.address && !streetAddress) setStreetAddress(currentUser.address);
        }
    }, [currentUser]);

    // Cart Items Pagination State (> 5 items)
    const [cartPage, setCartPage] = useState(1);
    const cartItemsPerPage = 5;

    const isBulihanAddress = city === 'Silang' && BULIHAN_BARANGAYS.includes(barangay);

    useEffect(() => {
        if (orderType === 'delivery') {
            setPaymentMethod('QRPh / e-Wallets');
        } else {
            setPaymentMethod('Cash (Pick-Up)');
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
    const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
    const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

    const handleConfirmPaymentSent = async (orderNum: string) => {
        if (!orderNum) return;
        setIsConfirmingPayment(true);
        try {
            const res = await fetch(`/api/v1/orders/${orderNum}/confirm-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });
            if (res.ok) {
                setIsPaymentConfirmed(true);
                window.dispatchEvent(new CustomEvent('saddle_ranch_order_placed'));
            } else {
                setIsPaymentConfirmed(true);
            }
        } catch (e) {
            setIsPaymentConfirmed(true);
        } finally {
            setIsConfirmingPayment(false);
        }
    };

    // Coupon & Voucher State
    const [voucherInput, setVoucherInput] = useState('');
    const [appliedVoucher, setAppliedVoucher] = useState<any | null>(null);
    const [voucherDiscount, setVoucherDiscount] = useState<number>(0);
    const [voucherError, setVoucherError] = useState('');
    const [voucherSuccess, setVoucherSuccess] = useState('');
    const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('success') === '1' && params.get('order_number')) {
            const orderNum = params.get('order_number');
            setCompletedOrder({
                order_number: orderNum,
                total_amount: '0.00',
                customer_name: 'Customer',
                payment_status: 'paid',
            });
            setIsPaymentConfirmed(true);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Popular');
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [currentBranch, setCurrentBranch] = useState<'Bulihan' | 'Dasma'>(() => (localStorage.getItem('saddle_ranch_branch') as any) || 'Bulihan');
    const [currentLocName, setCurrentLocName] = useState<string>(() => localStorage.getItem('saddle_ranch_location_name') || 'Bulihan, Silang, Cavite');
    const [currentDistance, setCurrentDistance] = useState<string>(() => localStorage.getItem('saddle_ranch_distance') || '1.2 km away');

    useEffect(() => {
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

    const fallbackProducts: Product[] = [
        { id: 1, name: 'Kare-Kare', description: 'Traditional Filipino stew featuring tender meat in a rich, savory peanut sauce with fresh vegetables and bagoong.', price: 180.00, image_path: '/images/FilipinoCousines/kare-kare.webp', stock_quantity: 50, is_active: true },
        { id: 2, name: 'Pork Adobo', description: 'Classic savory and tangy braised pork simmered in soy sauce, vinegar, garlic, and bay leaves.', price: 120.00, image_path: '/images/FilipinoCousines/pork_adobo.webp', stock_quantity: 50, is_active: true },
        { id: 3, name: 'Pork Sinigang', description: 'Comforting sour tamarind soup with succulent pork and fresh local vegetables.', price: 150.00, image_path: '/images/FilipinoCousines/pork_sinigang.webp', stock_quantity: 50, is_active: true },
        { id: 4, name: 'Sizzling Bangus', description: 'Marinated milkfish seared on a smoking hot plate served with garlic rice.', price: 125.00, image_path: '/images/Menu/bangus.webp', stock_quantity: 50, is_active: true },
        { id: 5, name: 'Sizzling Beef Teriyaki', description: 'Tender slices of beef glazed with sweet-savory teriyaki sauce on a sizzling platter.', price: 140.00, image_path: '/images/Menu/beef_teriyaki.webp', stock_quantity: 50, is_active: true },
        { id: 6, name: 'Sizzling Burger Steak', description: 'Juicy beef patty smothered with signature mushroom gravy on a sizzling hot plate.', price: 95.00, image_path: '/images/Menu/burger_steak.webp', stock_quantity: 50, is_active: true },
        { id: 7, name: 'Sizzling Chicken Inasal', description: 'Bacolod-style chargrilled chicken quarter served sizzling with savory chicken oil and garlic rice.', price: 120.00, image_path: '/images/Menu/chicken_inasal.webp', stock_quantity: 50, is_active: true },
        { id: 8, name: 'Sizzling Porkchop', description: 'Thick-cut grilled pork chop served with house gravy on cast iron.', price: 120.00, image_path: '/images/Menu/porkchop.webp', stock_quantity: 50, is_active: true },
        { id: 9, name: 'Sizzling Sisig (w/ Egg)', description: 'Crispy chopped pork seasoned with onions, calamansi, and chili, topped with a fresh egg.', price: 100.00, image_path: '/images/Menu/sisig.webp', stock_quantity: 60, is_active: true },
        { id: 10, name: 'Sizzling Spicy Beef', description: 'Sliced tender beef tossed in spicy savory pepper gravy on a hot cast iron platter.', price: 120.00, image_path: '/images/Menu/spicy_beef.webp', stock_quantity: 50, is_active: true },
        { id: 11, name: 'Tapsilog', description: 'Cured beef tapa served with garlic fried rice and a sunny-side up egg.', price: 100.00, image_path: '/images/Menu/tapsilog.webp', stock_quantity: 50, is_active: true },
        { id: 12, name: 'Sizzling Tilapia', description: 'Crisp fried fresh tilapia on a sizzling platter with soy-calamansi dipping sauce.', price: 85.00, image_path: '/images/Menu/tilapia.webp', stock_quantity: 40, is_active: true },
        { id: 13, name: 'Tocilog', description: 'Sweet cured pork tocino served with fragrant garlic rice and fried egg.', price: 75.00, image_path: '/images/Menu/tocilog.webp', stock_quantity: 50, is_active: true },
        { id: 14, name: 'Extra Rice', description: 'Steaming hot serving of plain white rice.', price: 15.00, image_path: '/images/RiceAndDrinks/extra_rice.webp', stock_quantity: 150, is_active: true },
        { id: 15, name: 'Red Iced Tea (1 Litre Pitcher)', description: 'Sweet and refreshing house red iced tea in a 1-litre sharing pitcher.', price: 50.00, image_path: '/images/RiceAndDrinks/beverages_iced_tea.webp', stock_quantity: 80, is_active: true },
        { id: 16, name: 'Cucumber (1 Litre Pitcher)', description: 'Fresh cucumber lemonade cooler in a 1-litre sharing pitcher.', price: 50.00, image_path: '/images/RiceAndDrinks/beverages_cucumber.webp', stock_quantity: 80, is_active: true },
        { id: 17, name: 'Platter Sisig', description: 'Generous barkada-sized platter of sizzling crispy pork sisig.', price: 200.00, image_path: '/images/Platters/platter_sisig.webp', stock_quantity: 30, is_active: true },
        { id: 18, name: 'Platter Tapa', description: 'Barkada-sized platter of savory cured beef tapa.', price: 220.00, image_path: '/images/Platters/platter_tapa.webp', stock_quantity: 30, is_active: true },
        { id: 19, name: 'Platter Teriyaki', description: 'Large sharing platter of sizzling beef teriyaki with sweet glazed sauce.', price: 250.00, image_path: '/images/Platters/platter_tereyaki.webp', stock_quantity: 30, is_active: true },
    ];

    const allProducts = products && products.length > 0 ? products : fallbackProducts;

    const getProductCategory = (p: Product): CategoryType => {
        // 1. Database-backed Category Mapping
        if (p.category) {
            const cat = p.category.toLowerCase().trim();
            if (cat.includes('drink') || cat.includes('extra rice') || cat.includes('beverage')) return 'Drinks & Extra Rice';
            if (cat.includes('platter') || cat.includes('barkada')) return 'Barkada Platters';
            if (cat.includes('filipino') || cat.includes('authentic')) return 'Authentic Filipino';
            if (cat.includes('sizzling') || cat.includes('rice meal') || cat.includes('meal')) return 'Rice Meals';
        }

        const name = (p.name || '').toLowerCase().trim();

        // 2. Explicit Sizzling Meal / Burger Protection (Never matches Drinks & Extra Rice)
        if (
            name.includes('burger') ||
            name.includes('steak') ||
            name.includes('bangus') ||
            name.includes('inasal') ||
            name.includes('porkchop') ||
            (name.includes('sisig') && !name.includes('platter')) ||
            name.includes('beef teriyaki') ||
            name.includes('spicy beef') ||
            name.includes('tapsilog') ||
            name.includes('silog') ||
            name.includes('tilapia') ||
            name.includes('tocilog')
        ) {
            return 'Rice Meals';
        }

        // 3. Barkada Platters (Group sharing platters)
        if (name.includes('platter') || name.includes('barkada') || name.includes('sharing') || name.includes('bilao')) {
            return 'Barkada Platters';
        }

        // 4. Authentic Filipino (Ala Carte / Sharing Bowls)
        if (
            name.includes('kare') ||
            name.includes('adobo') ||
            name.includes('sinigang') ||
            name.includes('bulalo') ||
            name.includes('lechon') ||
            name.includes('pinakbet') ||
            name.includes('filipino')
        ) {
            return 'Authentic Filipino';
        }

        // 5. Drinks & Extra Rice (Only beverages and extra rice portions)
        if (
            name === 'extra rice' ||
            name.includes('extra rice') ||
            name.includes('plain rice') ||
            name.includes('garlic rice') ||
            name.includes('tea') ||
            name.includes('cucumber') ||
            name.includes('pitcher') ||
            name.includes('beverage') ||
            name.includes('drink') ||
            name.includes('juice') ||
            name.includes('soda') ||
            name.includes('water')
        ) {
            return 'Drinks & Extra Rice';
        }

        // Default to Rice Meals
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
        if (p.image_path) {
            let img = p.image_path;
            if (img.startsWith('http://localhost') || img.startsWith('http://127.0.0.1')) {
                try {
                    img = new URL(img).pathname;
                } catch {}
            }
            if (img.startsWith('http') || img.startsWith('/images/') || img.startsWith('/storage/')) return img;
            if (img.startsWith('/')) return img;
            return `/images/${img}`;
        }
        const name = (p.name || '').toLowerCase();
        if (name.includes('inasal') || name.includes('chicken')) return '/images/chicken_inasal.webp';
        if (name.includes('sisig')) return '/images/sisig.webp';
        if (name.includes('beef') || name.includes('pepper') || name.includes('spicy')) return '/images/spicy_beef.webp';
        if (name.includes('sinigang') || name.includes('bulalo')) return '/images/pork_sinigang.webp';
        if (name.includes('platter') || name.includes('t-bone') || name.includes('steak')) return '/images/platter_sisig.webp';
        return '/images/sisig.webp';
    };

    useEffect(() => {
        if (flash?.order) {
            setCompletedOrder(flash.order);
            clearCart();
        }
    }, [flash]);

    const handleApplyVoucher = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!voucherInput.trim()) return;

        if (!currentUser) {
            setVoucherError('You must be logged in to apply a promo coupon or voucher code.');
            setVoucherSuccess('');
            return;
        }

        setIsValidatingVoucher(true);
        setVoucherError('');
        setVoucherSuccess('');

        try {
            const response = await fetch('/api/v1/vouchers/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    code: voucherInput.trim(),
                    total_amount: subtotal,
                }),
            });

            const json = await response.json().catch(() => ({}));
            if (response.ok && json.status === 'success') {
                setAppliedVoucher(json.voucher);
                setVoucherDiscount(json.discount_amount);
                setVoucherSuccess(`Coupon applied! Saved ₱${json.discount_amount.toFixed(2)}.`);
                setVoucherError('');
            } else {
                setAppliedVoucher(null);
                setVoucherDiscount(0);
                let errStr = json.message;
                if (!errStr && json.errors) {
                    const firstKey = Object.keys(json.errors)[0];
                    errStr = Array.isArray(json.errors[firstKey]) ? json.errors[firstKey][0] : json.errors[firstKey];
                }
                setVoucherError(errStr || 'Invalid promo coupon or voucher code.');
            }
        } catch (err: any) {
            setAppliedVoucher(null);
            setVoucherDiscount(0);
            setVoucherError('Failed to validate coupon code.');
        } finally {
            setIsValidatingVoucher(false);
        }
    };

    const handleRemoveVoucher = () => {
        setAppliedVoucher(null);
        setVoucherDiscount(0);
        setVoucherInput('');
        setVoucherError('');
        setVoucherSuccess('');
    };

    const handleCustomerLogout = async () => {
        try {
            await fetch('/api/v1/customer/logout', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });
        } catch (e) {}
        setCurrentUser(null);
        setAppliedVoucher(null);
        setVoucherDiscount(0);
        setVoucherInput('');
        setVoucherSuccess('');
        setVoucherError('');
    };

    const finalTotal = Math.max(0, subtotal - voucherDiscount);

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

        if (customerPhone.trim().length !== 11 || !/^\d{11}$/.test(customerPhone.trim())) {
            setValidationError('Please enter a valid 11-digit mobile number (e.g. 09171234567).');
            return;
        }

        if (orderType === 'delivery' && !streetAddress.trim()) {
            setValidationError('Please provide your delivery street address / house number / landmark.');
            return;
        }

        if (!currentUser && createAccount) {
            if (!accountEmail.trim() || !accountPassword.trim()) {
                setValidationError('Please provide your email address and password (min 8 characters) to create your account.');
                return;
            }
            if (accountPassword.trim().length < 8) {
                setValidationError('Password must be at least 8 characters long.');
                return;
            }
        }

        // Open Confirmation & Non-Refundable Policy Modal before final submission
        setIsConfirmationModalOpen(true);
    };

    const handleExecuteCheckout = () => {
        setIsSubmitting(true);
        setValidationError('');

        const constructedDeliveryAddress = `${streetAddress.trim()}, Brgy. ${barangay}, ${city}, ${province}, ${region}`;

        const payload = {
            order_type: orderType,
            customer_name: customerName,
            customer_phone: customerPhone,
            pickup_time: orderType === 'pickup' ? pickupTime : null,
            delivery_address: orderType === 'delivery' ? constructedDeliveryAddress : null,
            delivery_notes: deliveryNotes,
            payment_method: paymentMethod,
            voucher_code: appliedVoucher ? appliedVoucher.code : null,
            create_account: !currentUser && createAccount,
            account_email: !currentUser && createAccount ? accountEmail.trim() : null,
            account_password: !currentUser && createAccount ? accountPassword.trim() : null,
            items: cart
                .filter((item) => allProducts.some((p) => p.id === item.product.id))
                .map((item) => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                })),
        };

        if (payload.items.length === 0) {
            setIsSubmitting(false);
            setIsConfirmationModalOpen(false);
            setValidationError('Your cart contains invalid or unavailable products. Please re-add items to your cart.');
            return;
        }

        router.post('/order/checkout', payload, {
            onSuccess: (page) => {
                setIsConfirmationModalOpen(false);
                setIsBasketSheetOpen(false);
                const flashOrder = (page.props.flash as any)?.order;
                if (flashOrder?.order_number) {
                    try {
                        const existing = JSON.parse(localStorage.getItem('saddle_ranch_customer_orders') || '[]');
                        const updated = Array.from(new Set([flashOrder.order_number, ...existing]));
                        localStorage.setItem('saddle_ranch_customer_orders', JSON.stringify(updated));
                        localStorage.setItem('saddle_ranch_last_order', flashOrder.order_number);
                        window.dispatchEvent(new CustomEvent('saddle_ranch_order_placed', { detail: flashOrder }));
                    } catch (e) { }
                }
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setIsConfirmationModalOpen(false);
                const itemsErrKey = Object.keys(errors).find(k => k.startsWith('items'));
                if (errors.items) {
                    setValidationError(errors.items);
                } else if (itemsErrKey) {
                    setValidationError('One or more selected items are no longer available. Please update your cart.');
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

                            <div className="flex items-center gap-2 shrink-0">
                                {currentUser ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsAccountModalOpen(true)}
                                        className="hidden sm:flex px-3 py-1 rounded-full bg-[#f59e0b]/20 hover:bg-[#f59e0b] border border-[#f59e0b]/40 text-[#ffc174] hover:text-[#472a00] text-xs font-black uppercase tracking-wider items-center gap-1.5 shrink-0 shadow-sm transition-all cursor-pointer"
                                    >
                                        <User className="w-3.5 h-3.5" />
                                        <span>Account</span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsAuthModalOpen(true)}
                                        className="hidden sm:flex px-3 py-1 rounded-full bg-[#261e15] hover:bg-[#31281f] border border-[#534434] text-[#ffc174] text-xs font-black uppercase tracking-wider items-center gap-1.5 shrink-0 shadow-sm transition-all cursor-pointer"
                                    >
                                        <Lock className="w-3.5 h-3.5 text-[#f59e0b]" />
                                        <span>Sign In</span>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setIsReturnModalOpen(true)}
                                    className="px-2.5 py-1 rounded-full bg-[#261e15] border border-[#534434] text-[#d8c3ad] hover:text-[#ffc174] text-[10px] sm:text-xs font-bold flex items-center gap-1 shrink-0 shadow-sm cursor-pointer"
                                    title="Return & Cancellation Policy"
                                >
                                    <RotateCcw className="w-3.5 h-3.5 text-[#f59e0b]" />
                                    <span>Return Policy</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsPrivacyModalOpen(true)}
                                    className="px-2.5 py-1 rounded-full bg-[#261e15] border border-[#534434] text-[#d8c3ad] hover:text-[#ffc174] text-[10px] sm:text-xs font-bold flex items-center gap-1 shrink-0 shadow-sm cursor-pointer"
                                    title="Privacy & Data Safety Policy"
                                >
                                    <ShieldCheck className="w-3.5 h-3.5 text-[#f59e0b]" />
                                    <span>Privacy</span>
                                </button>

                                <span className="px-3 py-1 rounded-full bg-[#f59e0b] text-[#472a00] font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1 shrink-0 shadow-sm">
                                    {orderType === 'delivery' ? <Truck className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                                    <span>{orderType === 'delivery' ? 'Delivery' : 'Pick-Up'}</span>
                                </span>
                            </div>
                        </div>

                        {/* Top Bar Row 2 - 80% Search & 20% Account Button (Mobile View) */}
                        <div className="flex items-center gap-2 w-full">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 text-[#8c7a6b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search menu items..."
                                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#121213] border border-[#534434]/60 text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                />
                            </div>

                            {/* Mobile Only Sign In / Account Button */}
                            <div className="sm:hidden shrink-0">
                                {currentUser ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsAccountModalOpen(true)}
                                        className="px-3 py-2 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/50 text-[#ffc174] font-bold text-xs uppercase flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                                    >
                                        <User className="w-3.5 h-3.5" />
                                        <span>Account</span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsAuthModalOpen(true)}
                                        className="px-3 py-2 rounded-xl bg-[#261e15] border border-[#534434] text-[#ffc174] font-bold text-xs uppercase flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                                    >
                                        <Lock className="w-3.5 h-3.5 text-[#f59e0b]" />
                                        <span>Sign In</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Top Bar Row 3 */}
                        <div className="overflow-x-auto border-t border-[#262627] pt-2 flex items-center gap-5 sm:gap-8 scrollbar-none">
                            {(['Popular', 'Rice Meals', 'Authentic Filipino', 'Barkada Platters', 'Drinks & Extra Rice'] as CategoryType[]).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`text-xs font-bold whitespace-nowrap relative pb-1 transition-colors ${selectedCategory === cat ? 'text-[#ffc174] font-black' : 'text-[#8c7a6b] hover:text-white'
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
                                        const isUnavailable = product.is_active === false;
                                        const isOutOfStock = !isUnavailable && product.stock_quantity <= 0;
                                        const isOrderable = !isUnavailable && !isOutOfStock;
                                        const cartEntry = cart.find((i) => i.product.id === product.id);
                                        const imgUrl = getProductImage(product);

                                        return (
                                            <div
                                                key={product.id}
                                                className={`bg-[#1A1A1B] rounded-2xl border p-3 flex flex-col justify-between relative group transition-all shadow-md ${
                                                    !isOrderable ? 'border-[#333338] opacity-80' : 'border-[#262627] hover:border-[#534434]'
                                                }`}
                                            >
                                                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 bg-[#121213]">
                                                    <img
                                                        src={imgUrl}
                                                        alt={product.name}
                                                        className={`w-full h-full object-cover rounded-xl transition-transform duration-500 ${
                                                            !isOrderable ? 'opacity-60 grayscale-[15%]' : 'group-hover:scale-105'
                                                        }`}
                                                    />

                                                    {/* Availability / Out of Stock Badges */}
                                                    {isUnavailable && (
                                                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-zinc-800/95 text-zinc-300 text-[9px] font-mono font-bold uppercase tracking-wider border border-zinc-600/50 shadow-md">
                                                            Unavailable
                                                        </span>
                                                    )}
                                                    {isOutOfStock && (
                                                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-rose-600/95 text-white text-[9px] font-mono font-black uppercase tracking-wider shadow-md">
                                                            Out of Stock
                                                        </span>
                                                    )}

                                                    <div className="absolute bottom-1.5 right-1.5 z-10">
                                                        {cartEntry && isOrderable ? (
                                                            <button
                                                                onClick={() => addItem(product as CartProduct, 1)}
                                                                className="w-9 h-9 shrink-0 aspect-square rounded-full bg-[#f59e0b] text-black font-mono font-black text-sm border-2 border-[#121213] shadow-xl flex items-center justify-center btn-bevel cursor-pointer"
                                                            >
                                                                {cartEntry.quantity}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => addItem(product as CartProduct, 1)}
                                                                disabled={!isOrderable}
                                                                className={`w-9 h-9 shrink-0 aspect-square rounded-full font-black text-sm shadow-xl flex items-center justify-center transition-colors btn-bevel ${
                                                                    isOrderable
                                                                        ? 'bg-[#f59e0b] text-black hover:bg-[#ffc174] cursor-pointer'
                                                                        : 'bg-[#27272a] text-[#71717a] border border-[#3f3f46] cursor-not-allowed opacity-60'
                                                                }`}
                                                                title={isUnavailable ? 'Item Unavailable' : (isOutOfStock ? 'Out of Stock' : 'Add to Order')}
                                                            >
                                                                <Plus className="w-5 h-5 stroke-[3]" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <h3 className="font-domine font-bold text-xs text-[#f0e0d1] line-clamp-2 leading-snug">
                                                        {product.name}
                                                    </h3>
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-mono text-xs font-black text-[#ffc174]">
                                                            ₱ {numPrice.toFixed(2)}
                                                        </span>
                                                        {isUnavailable && (
                                                            <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase">Unavailable</span>
                                                        )}
                                                        {isOutOfStock && (
                                                            <span className="text-[9px] font-mono text-rose-400 font-bold uppercase">Out of Stock</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* DESKTOP (>= md) - Clean Row of 3 Products */}
                            <div className="hidden md:block space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                                    {paginatedProducts.map((product) => {
                                        const numPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                                        const isUnavailable = product.is_active === false;
                                        const isOutOfStock = !isUnavailable && product.stock_quantity <= 0;
                                        const isOrderable = !isUnavailable && !isOutOfStock;
                                        const cartEntry = cart.find((i) => i.product.id === product.id);
                                        const imgUrl = getProductImage(product);

                                        return (
                                            <div
                                                key={product.id}
                                                className={`bg-[#1A1A1B] rounded-2xl border overflow-hidden flex flex-col justify-between transition-all shadow-xl group ${
                                                    !isOrderable ? 'border-[#333338] opacity-85' : 'border-[#262627] hover-heat'
                                                }`}
                                            >
                                                <div className="aspect-video w-full relative overflow-hidden bg-[#121213]">
                                                    <img
                                                        src={imgUrl}
                                                        alt={product.name}
                                                        className={`w-full h-full object-cover transition-transform duration-500 ${
                                                            !isOrderable ? 'opacity-60 grayscale-[15%]' : 'group-hover:scale-105'
                                                        }`}
                                                    />

                                                    {/* Availability / Out of Stock Badges */}
                                                    {isUnavailable && (
                                                        <span className="absolute top-2.5 right-2.5 px-3 py-1 rounded-full bg-zinc-800/95 text-zinc-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-zinc-600/60 shadow-lg">
                                                            Unavailable
                                                        </span>
                                                    )}
                                                    {isOutOfStock && (
                                                        <span className="absolute top-2.5 right-2.5 px-3 py-1 rounded-full bg-rose-600/95 text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-lg">
                                                            Out of Stock
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                                                    <div>
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h3 className="font-domine text-lg font-bold text-[#f0e0d1] group-hover:text-[#ffc174] transition-colors leading-snug">
                                                                {product.name}
                                                            </h3>
                                                            <span className="font-mono text-xs font-black text-[#ffc174] bg-[#261e15] border border-[#534434] px-2 py-0.5 rounded whitespace-nowrap shrink-0 shadow">
                                                                ₱{numPrice.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="pt-3 border-t border-[#534434]/50 flex items-center justify-between">
                                                        {isUnavailable ? (
                                                            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Item Unavailable</span>
                                                        ) : isOutOfStock ? (
                                                            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">Out of Stock</span>
                                                        ) : (
                                                            <span className="text-[10px] text-[#d8c3ad] font-semibold">Ready to Sizzle</span>
                                                        )}

                                                        {cartEntry && isOrderable ? (
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
                                                                disabled={!isOrderable}
                                                                className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider btn-bevel transition-all shadow-md ${
                                                                    isOrderable
                                                                        ? 'bg-[#f59e0b] hover:bg-[#ffc174] text-[#472a00] cursor-pointer'
                                                                        : 'bg-[#27272a] text-[#71717a] border border-[#3f3f46] cursor-not-allowed opacity-50'
                                                                }`}
                                                            >
                                                                {isUnavailable ? 'Unavailable' : (isOutOfStock ? 'Out of Stock' : 'Add +')}
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
                                                        className={`w-8 h-8 rounded-xl font-bold text-xs transition-all btn-bevel ${currentPage === pageNum
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
                                            className={`py-3.5 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 btn-bevel ${orderType === 'pickup'
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
                                            className={`py-3.5 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 btn-bevel ${orderType === 'delivery'
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
                                            onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                                            maxLength={11}
                                            pattern="[0-9]{11}"
                                            placeholder="09171234567"
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
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="text-xs font-bold text-[#d8c3ad] uppercase tracking-wider">
                                                Payment Method
                                            </label>
                                            {orderType === 'delivery' && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-[#fbbf24] border border-amber-500/40">
                                                    <Lock className="w-2.5 h-2.5" /> Payment First
                                                </span>
                                            )}
                                        </div>

                                        {orderType === 'delivery' ? (
                                            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#1c1813] to-[#121213] border border-[#f59e0b]/50 space-y-2.5 shadow-md">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 flex items-center justify-center text-[#ffc174] shrink-0">
                                                            <QrCode className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-bold text-white leading-tight">QRPh & e-Wallets</div>
                                                            <div className="text-[10px] text-[#ffc174] font-mono">Instant Scan & Pay</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="px-1.5 py-0.5 rounded bg-[#261e15] border border-[#534434] text-[9px] font-mono font-bold text-[#d8c3ad]">GCash</span>
                                                        <span className="px-1.5 py-0.5 rounded bg-[#261e15] border border-[#534434] text-[9px] font-mono font-bold text-[#d8c3ad]">Maya</span>
                                                        <span className="px-1.5 py-0.5 rounded bg-[#261e15] border border-[#534434] text-[9px] font-mono font-bold text-[#d8c3ad]">Banks</span>
                                                    </div>
                                                </div>

                                                <p className="text-[11px] text-[#d8c3ad]/90 leading-relaxed border-t border-[#3D3126]/60 pt-2">
                                                    Order is confirmed first, then an official QR code is generated for immediate payment before kitchen dispatch.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-2">
                                                {['Cash (Pick-Up)', 'QRPh / e-Wallets'].map((method) => (
                                                    <button
                                                        key={method}
                                                        type="button"
                                                        onClick={() => setPaymentMethod(method)}
                                                        className={`py-2.5 px-1 rounded-xl text-xs font-bold border transition-all btn-bevel cursor-pointer ${
                                                            paymentMethod === method
                                                                ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-white font-black'
                                                                : 'bg-[#121213] border-[#534434] text-[#d8c3ad]'
                                                        }`}
                                                    >
                                                        {method}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Account & Saved Details Section */}
                                    {/* UNIFIED PROMO COUPON & CUSTOMER ACCOUNT CARD */}
                                    {!currentUser ? (
                                        <div className="p-4 rounded-2xl bg-[#121213] border border-[#534434] space-y-3 shadow-lg">
                                            <div className="flex items-center justify-between border-b border-[#534434]/40 pb-2.5">
                                                <div className="flex items-center gap-1.5 text-xs font-black text-[#ffc174] uppercase tracking-wider">
                                                    <Ticket className="w-4 h-4 text-[#f59e0b]" /> Promo Coupon & Account
                                                </div>
                                                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                                    <Lock className="w-3 h-3 text-amber-400" /> Sign In Required
                                                </span>
                                            </div>

                                            <p className="text-[11px] text-[#d8c3ad] leading-relaxed">
                                                Sign in or create a quick account to apply promo coupons, save your delivery address, and track orders.
                                            </p>

                                            <div className="flex gap-2 pt-0.5">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    placeholder="Enter Coupon / Voucher Code"
                                                    value={voucherInput}
                                                    onClick={() => setIsAuthModalOpen(true)}
                                                    className="flex-1 px-3 py-2 rounded-xl bg-[#1A1A1B] border border-[#534434] text-xs text-white uppercase font-mono placeholder:normal-case placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none cursor-pointer"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setIsAuthModalOpen(true)}
                                                    className="px-3.5 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#472a00] font-black text-xs uppercase tracking-wider transition-all btn-bevel cursor-pointer shrink-0 shadow-md flex items-center gap-1.5"
                                                >
                                                    <Lock className="w-3.5 h-3.5" /> Sign In / Register
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-2xl bg-[#121213] border border-emerald-500/30 space-y-3 shadow-lg">
                                            <div className="flex items-center justify-between border-b border-[#534434]/40 pb-2.5">
                                                <div className="flex items-center gap-2 truncate">
                                                    <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                                    <span className="text-white font-bold truncate text-xs">Signed in as {currentUser.name}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="block text-[11px] font-bold text-[#ffc174] uppercase tracking-wider flex items-center gap-1.5">
                                                    <Ticket className="w-3.5 h-3.5 text-[#f59e0b]" /> Promo Coupon / Voucher
                                                </label>

                                                {appliedVoucher ? (
                                                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                            <div>
                                                                <div className="font-mono font-bold text-white">{appliedVoucher.code}</div>
                                                                <div className="text-[10px] text-emerald-300">Saved ₱{voucherDiscount.toFixed(2)} OFF</div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={handleRemoveVoucher}
                                                            className="text-[10px] text-rose-400 hover:text-rose-300 underline font-bold cursor-pointer"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1.5">
                                                        <div className="flex gap-1.5">
                                                            <input
                                                                type="text"
                                                                value={voucherInput}
                                                                onChange={(e) => {
                                                                    setVoucherInput(e.target.value.toUpperCase());
                                                                    setVoucherError('');
                                                                }}
                                                                placeholder="ENTER VOUCHER CODE"
                                                                className="flex-1 px-3 py-2 rounded-xl bg-[#1A1A1B] border border-[#534434] text-xs text-white uppercase font-mono placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={handleApplyVoucher}
                                                                disabled={!voucherInput.trim() || isValidatingVoucher}
                                                                className="px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#ffc174] disabled:opacity-40 text-[#472a00] font-black text-xs uppercase tracking-wider transition-all btn-bevel cursor-pointer"
                                                            >
                                                                {isValidatingVoucher ? '...' : 'Apply'}
                                                            </button>
                                                        </div>
                                                        {voucherError && (
                                                            <div className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                                                                <AlertCircle className="w-3 h-3 shrink-0" />
                                                                <span>{voucherError}</span>
                                                            </div>
                                                        )}
                                                        {voucherSuccess && (
                                                            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                                                                <CheckCircle2 className="w-3 h-3 shrink-0" />
                                                                <span>{voucherSuccess}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1 pt-2 border-t border-[#534434]/50">
                                        <div className="flex justify-between text-xs text-[#d8c3ad]">
                                            <span>Subtotal</span>
                                            <span className="font-mono">₱{subtotal.toFixed(2)}</span>
                                        </div>
                                        {voucherDiscount > 0 && (
                                            <div className="flex justify-between text-xs text-emerald-400 font-bold">
                                                <span>Coupon Discount</span>
                                                <span className="font-mono">- ₱{voucherDiscount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-base font-black text-white pt-1">
                                            <span>Total Amount</span>
                                            <span className="text-[#ffc174] font-mono">₱{finalTotal.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={cart.length === 0 || isSubmitting}
                                        className="w-full py-4 rounded-2xl bg-[#f59e0b] hover:bg-[#ffc174] disabled:opacity-40 text-[#472a00] font-black text-sm uppercase tracking-wider shadow-xl shadow-[#f59e0b]/30 transition-all btn-bevel cursor-pointer"
                                    >
                                        {isSubmitting
                                            ? (orderType === 'delivery' ? 'Processing & Generating Payment...' : 'Processing Order...')
                                            : (orderType === 'delivery'
                                                ? `Proceed to Payment (₱${finalTotal.toFixed(2)})`
                                                : `Place Order (₱${finalTotal.toFixed(2)})`
                                            )
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>

                {/* MOBILE ONLY: Sticky Floating Bottom Cart Bar */}
                {itemCount > 0 && !isBasketSheetOpen && (
                    <div className="block lg:hidden fixed bottom-4 left-4 right-4 z-40">
                        <button
                            onClick={() => setIsBasketSheetOpen(true)}
                            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-[#f59e0b] to-amber-600 text-[#472a00] font-black text-sm uppercase tracking-wider btn-bevel shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-4 duration-300 cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 shrink-0 aspect-square rounded-full bg-[#121213] text-[#f59e0b] font-mono text-sm font-black flex items-center justify-center border-2 border-[#f59e0b] shadow-md">
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
                    <div className="block lg:hidden fixed inset-0 z-[99999] flex items-end justify-center p-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
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
                                    className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all btn-bevel ${orderType === 'pickup' ? 'bg-[#f59e0b] text-[#472a00] font-black shadow' : 'text-[#d8c3ad]'
                                        }`}
                                >
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    <span>Pick-Up</span>
                                </button>
                                <button
                                    onClick={() => setOrderType('delivery')}
                                    className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all btn-bevel ${orderType === 'delivery' ? 'bg-[#f59e0b] text-[#472a00] font-black shadow' : 'text-[#d8c3ad]'
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
                                            onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                                            maxLength={11}
                                            pattern="[0-9]{11}"
                                            placeholder="09171234567"
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
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-[11px] font-bold text-[#d8c3ad] uppercase tracking-wider">
                                            Payment Method
                                        </label>
                                        {orderType === 'delivery' && (
                                            <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-[#fbbf24] border border-amber-500/40">
                                                <Lock className="w-2.5 h-2.5" /> Payment First
                                            </span>
                                        )}
                                    </div>

                                    {orderType === 'delivery' ? (
                                        <div className="p-3 rounded-2xl bg-gradient-to-b from-[#1c1813] to-[#121213] border border-[#f59e0b]/50 space-y-2 shadow-md">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 flex items-center justify-center text-[#ffc174] shrink-0">
                                                        <QrCode className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-white leading-tight">QRPh & e-Wallets</div>
                                                        <div className="text-[9px] text-[#ffc174] font-mono">Instant Scan & Pay</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="px-1.5 py-0.5 rounded bg-[#261e15] border border-[#534434] text-[9px] font-mono font-bold text-[#d8c3ad]">GCash</span>
                                                    <span className="px-1.5 py-0.5 rounded bg-[#261e15] border border-[#534434] text-[9px] font-mono font-bold text-[#d8c3ad]">Maya</span>
                                                </div>
                                            </div>

                                            <p className="text-[10px] text-[#d8c3ad]/90 leading-relaxed border-t border-[#3D3126]/60 pt-1.5">
                                                Order is confirmed first, then an official QR code is generated for immediate payment before kitchen dispatch.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Cash (Pick-Up)', 'QRPh / e-Wallets'].map((method) => (
                                                <button
                                                    key={method}
                                                    type="button"
                                                    onClick={() => setPaymentMethod(method)}
                                                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all btn-bevel cursor-pointer ${
                                                        paymentMethod === method
                                                            ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-white font-black'
                                                            : 'bg-[#121213] border-[#534434] text-[#d8c3ad]'
                                                    }`}
                                                >
                                                    {method}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Account & Saved Details Section (Mobile View Fix) */}
                                {/* UNIFIED PROMO COUPON & CUSTOMER ACCOUNT CARD (MOBILE) */}
                                {!currentUser ? (
                                    <div className="p-3.5 rounded-2xl bg-[#121213] border border-[#534434] space-y-2.5 shadow-lg">
                                        <div className="flex items-center justify-between border-b border-[#534434]/40 pb-2">
                                            <div className="flex items-center gap-1.5 text-xs font-black text-[#ffc174] uppercase tracking-wider">
                                                <Ticket className="w-3.5 h-3.5 text-[#f59e0b]" /> Promo Coupon & Account
                                            </div>
                                            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                                <Lock className="w-2.5 h-2.5 text-amber-400" /> Required
                                            </span>
                                        </div>

                                        <p className="text-[10px] text-[#d8c3ad] leading-relaxed">
                                            Sign in or register to apply promo coupons and save order history.
                                        </p>

                                        <div className="flex gap-1.5 pt-0.5">
                                            <input
                                                type="text"
                                                readOnly
                                                placeholder="Coupon Code..."
                                                value={voucherInput}
                                                onClick={() => setIsAuthModalOpen(true)}
                                                className="flex-1 px-2.5 py-1.5 rounded-xl bg-[#1A1A1B] border border-[#534434] text-xs text-white uppercase font-mono placeholder:normal-case placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none cursor-pointer"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setIsAuthModalOpen(true)}
                                                className="px-3 py-1.5 rounded-xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#472a00] font-black text-xs uppercase tracking-wider transition-all btn-bevel cursor-pointer shrink-0 shadow flex items-center gap-1"
                                            >
                                                <Lock className="w-3 h-3" /> Sign In
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3.5 rounded-2xl bg-[#121213] border border-emerald-500/30 space-y-2.5 shadow-lg">
                                        <div className="flex items-center justify-between border-b border-[#534434]/40 pb-2">
                                            <div className="flex items-center gap-2 truncate">
                                                <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                <span className="text-white font-bold truncate text-xs">Signed in as {currentUser.name}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-bold text-[#ffc174] uppercase tracking-wider flex items-center gap-1">
                                                <Ticket className="w-3.5 h-3.5 text-[#f59e0b]" /> Promo Coupon / Voucher
                                            </label>

                                            {appliedVoucher ? (
                                                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-1.5">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                        <span className="font-mono font-bold text-white">{appliedVoucher.code} (-₱{voucherDiscount.toFixed(2)})</span>
                                                    </div>
                                                    <button type="button" onClick={handleRemoveVoucher} className="text-[10px] text-rose-400 font-bold underline">Remove</button>
                                                </div>
                                            ) : (
                                                <div className="space-y-1.5">
                                                    <div className="flex gap-1.5">
                                                        <input
                                                            type="text"
                                                            value={voucherInput}
                                                            onChange={(e) => {
                                                                setVoucherInput(e.target.value.toUpperCase());
                                                                setVoucherError('');
                                                            }}
                                                            placeholder="Coupon code..."
                                                            className="flex-1 px-2.5 py-1.5 rounded-xl bg-[#1A1A1B] border border-[#534434] text-xs text-white uppercase font-mono"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={handleApplyVoucher}
                                                            disabled={!voucherInput.trim() || isValidatingVoucher}
                                                            className="px-3 py-1.5 rounded-xl bg-[#f59e0b] text-[#472a00] font-black text-xs uppercase"
                                                        >
                                                            {isValidatingVoucher ? '...' : 'Apply'}
                                                        </button>
                                                    </div>
                                                    {voucherError && (
                                                        <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 font-semibold flex items-center gap-1.5">
                                                            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                                            <span>{voucherError}</span>
                                                        </div>
                                                    )}
                                                    {voucherSuccess && (
                                                        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                            <span>{voucherSuccess}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-2 space-y-1">
                                    <div className="flex items-center justify-between text-xs text-[#d8c3ad]">
                                        <span>Subtotal</span>
                                        <span className="font-mono">₱ {subtotal.toFixed(2)}</span>
                                    </div>
                                    {voucherDiscount > 0 && (
                                        <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                                            <span>Discount</span>
                                            <span className="font-mono">- ₱ {voucherDiscount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between text-sm font-black pt-1">
                                        <span className="text-white">Total Amount</span>
                                        <span className="text-[#ffc174] font-mono text-lg">₱ {finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 rounded-2xl bg-[#f59e0b] text-[#472a00] font-black text-sm uppercase tracking-wider shadow-xl shadow-[#f59e0b]/30 hover:bg-[#ffc174] transition-all btn-bevel cursor-pointer"
                                >
                                    {isSubmitting
                                        ? (orderType === 'delivery' ? 'Processing Payment...' : 'Processing Order...')
                                        : (orderType === 'delivery'
                                            ? `Proceed to Payment • ₱ ${finalTotal.toFixed(2)}`
                                            : `Place Order • ₱ ${finalTotal.toFixed(2)}`
                                        )
                                    }
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Order Confirmation Modal */}
                {completedOrder && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="w-full max-w-sm rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-6 shadow-2xl text-center space-y-4 max-h-[90vh] overflow-y-auto">
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
                                    <span className="font-bold text-[#f59e0b]">#{completedOrder.order_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#8c7a6b]">Payment Method:</span>
                                    <span className="font-bold text-white">{completedOrder.payment_method}</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-[#262627]">
                                    <span className="text-[#8c7a6b]">Total Due:</span>
                                    <span className="font-bold text-[#ffc174] text-sm">₱ {parseFloat(completedOrder.total_amount).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* QRPH / E-WALLET PAYMENT FIRST SECTION */}
                            {(completedOrder.payment_method?.includes('QRPh') || completedOrder.order_type === 'delivery') && (
                                <div className="p-4 rounded-2xl bg-[#121213] border-2 border-[#f59e0b] text-left space-y-3 shadow-xl">
                                    <div className="flex items-center justify-between border-b border-[#3D3126] pb-2">
                                        <div className="flex items-center gap-1.5 text-[#ffc174] font-bold text-xs">
                                            <QrCode className="w-4 h-4 text-[#f59e0b]" />
                                            <span>Payment First (QRPh / e-Wallets)</span>
                                        </div>
                                        <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-[#f59e0b] text-[#3f2000] font-black">
                                            Required
                                        </span>
                                    </div>

                                    <p className="text-[11px] text-[#f0e0d1] leading-relaxed">
                                        Please scan the official QRPh code below to settle <strong className="text-[#fbbf24] font-mono font-bold">₱{parseFloat(completedOrder.total_amount).toFixed(2)}</strong> via GCash, Maya, or any banking app:
                                    </p>

                                    {/* QR Code display */}
                                    <div className="bg-white p-3 rounded-2xl w-44 mx-auto flex flex-col items-center justify-center space-y-1.5 shadow-md">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`saddleranch_order_${completedOrder.order_number}_amount_${completedOrder.total_amount}`)}`}
                                            alt="QRPh Payment Code"
                                            className="w-36 h-36 object-contain"
                                        />
                                        <span className="text-[9px] font-mono font-black text-[#141416] uppercase tracking-wider">
                                            Scan via GCash / Maya
                                        </span>
                                    </div>

                                    <div className="space-y-1 text-[11px] font-mono bg-[#1c150e] p-2.5 rounded-xl border border-[#3D3126]">
                                        <div className="flex justify-between text-[#d8c3ad]">
                                            <span>GCash / Maya No.:</span>
                                            <span className="font-bold text-[#ffc174]">0917 123 4567</span>
                                        </div>
                                        <div className="flex justify-between text-[#d8c3ad]">
                                            <span>Account Name:</span>
                                            <span className="font-bold text-white">Saddle Ranch PH</span>
                                        </div>
                                        <div className="flex justify-between text-[#d8c3ad]">
                                            <span>Reference:</span>
                                            <span className="font-bold text-[#fbbf24]">#{completedOrder.order_number}</span>
                                        </div>
                                    </div>

                                    <div className="p-2 rounded-lg bg-[#261e15] border border-[#534434] text-[10px] text-[#fbbf24] text-center font-bold">
                                        Kitchen preparation commences upon verified payment receipt.
                                    </div>

                                    {/* Action Button to Confirm Payment Sent */}
                                    {isPaymentConfirmed ? (
                                        <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-center gap-2 font-bold animate-in fade-in">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                            <span>Payment Received! Sent to kitchen.</span>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled={isConfirmingPayment}
                                            onClick={() => handleConfirmPaymentSent(completedOrder.order_number)}
                                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#3f2000] font-black text-xs uppercase tracking-wider transition-all btn-bevel cursor-pointer flex items-center justify-center gap-1.5 shadow"
                                        >
                                            {isConfirmingPayment ? (
                                                <span>Verifying Payment...</span>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span>I Have Sent Payment (Verify & Settle)</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Optional Account Creation Card for Guests */}
                            {!currentUser && !accountCreatedSuccess && (
                                <div className="p-4 rounded-2xl bg-[#121213] border border-[#f59e0b]/40 text-left space-y-3">
                                    <div className="flex items-center gap-2 text-[#ffc174] font-bold text-xs">
                                        <UserCheck className="w-4 h-4 text-[#f59e0b] shrink-0" />
                                        <span>Save Delivery Address & Purchase History?</span>
                                    </div>
                                    <p className="text-[11px] text-[#d8c3ad] leading-relaxed">
                                        Create a free account to automatically save your delivery address, track live order status, and view past orders anytime!
                                    </p>

                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        if (!quickEmail.trim() || !quickPassword.trim()) return;
                                        setIsQuickRegistering(true);
                                        router.post('/register', {
                                            name: completedOrder.customer_name || customerName || 'Customer',
                                            email: quickEmail,
                                            password: quickPassword,
                                            password_confirmation: quickPassword,
                                            phone_number: completedOrder.customer_phone || customerPhone,
                                            address: completedOrder.delivery_address || streetAddress,
                                            order_number: completedOrder.order_number,
                                        }, {
                                            onSuccess: () => {
                                                setIsQuickRegistering(false);
                                                setAccountCreatedSuccess(true);
                                            },
                                            onError: (errs) => {
                                                setIsQuickRegistering(false);
                                                const firstMsg = Object.values(errs)[0];
                                                alert(typeof firstMsg === 'string' ? firstMsg : 'Registration error. Email may already be registered.');
                                            }
                                        });
                                    }} className="space-y-2 pt-1">
                                        <input
                                            type="email"
                                            required
                                            value={quickEmail}
                                            onChange={(e) => setQuickEmail(e.target.value)}
                                            placeholder="Your email address"
                                            className="w-full px-3 py-2 rounded-xl bg-[#1A1A1B] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                        />
                                        <input
                                            type="password"
                                            required
                                            minLength={8}
                                            value={quickPassword}
                                            onChange={(e) => setQuickPassword(e.target.value)}
                                            placeholder="Create a password (min 8 chars)"
                                            className="w-full px-3 py-2 rounded-xl bg-[#1A1A1B] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isQuickRegistering}
                                            className="w-full py-2.5 rounded-xl bg-[#f59e0b] text-[#472a00] font-black text-xs uppercase tracking-wider hover:bg-[#ffc174] transition-all btn-bevel cursor-pointer"
                                        >
                                            {isQuickRegistering ? 'Creating Account...' : 'Create Free Account & Save Details'}
                                        </button>
                                    </form>

                                    <div className="flex items-center justify-between text-[10px] text-[#8c7a6b] pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setIsPrivacyModalOpen(true)}
                                            className="hover:underline text-[#f59e0b] flex items-center gap-1 cursor-pointer"
                                        >
                                            <ShieldCheck className="w-3 h-3" /> Privacy & Safety Policy
                                        </button>
                                        <span className="font-semibold text-emerald-400">100% Optional</span>
                                    </div>
                                </div>
                            )}

                            {accountCreatedSuccess && (
                                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs text-center space-y-1">
                                    <div className="font-bold text-emerald-400 flex items-center justify-center gap-1">
                                        <CheckCircle2 className="w-4 h-4" /> Account Created Successfully!
                                    </div>
                                    <p className="text-[11px] text-emerald-200">Your delivery address and order history are now saved to your account.</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsBasketSheetOpen(false);
                                        setCompletedOrder(null);
                                        window.dispatchEvent(new CustomEvent('saddle_ranch_open_all_orders'));
                                    }}
                                    className="w-full py-3 rounded-xl bg-[#f59e0b] text-[#472a00] font-bold text-xs uppercase tracking-wider btn-bevel shadow hover:bg-[#ffc174] transition-all cursor-pointer"
                                >
                                    Track Order Live Status
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsRatingModalOpen(true)}
                                    className="w-full py-2.5 rounded-xl bg-[#261e15] border border-[#534434] text-[#ffc174] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                >
                                    <Star className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                                    <span>Rate Your Experience (5★)</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setIsBasketSheetOpen(false);
                                        setCompletedOrder(null);
                                    }}
                                    className="w-full py-2 text-xs font-semibold text-[#8c7a6b] hover:text-white transition-colors cursor-pointer"
                                >
                                    Close & Order More Items
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pre-Checkout Confirmation Modal with Non-Refundable Policy Notice */}
                <OrderConfirmationModal
                    isOpen={isConfirmationModalOpen}
                    onClose={() => setIsConfirmationModalOpen(false)}
                    onConfirm={handleExecuteCheckout}
                    isSubmitting={isSubmitting}
                    orderType={orderType}
                    customerName={customerName}
                    customerPhone={customerPhone}
                    deliveryAddress={orderType === 'delivery' ? `${streetAddress.trim()}, Brgy. ${barangay}, ${city}, ${province}, ${region}` : undefined}
                    paymentMethod={paymentMethod}
                    cart={cart}
                    subtotal={subtotal}
                    discount={voucherDiscount}
                    finalTotal={finalTotal}
                />

                {/* Return & Cancellation Policy Modal */}
                <ReturnPolicyModal
                    isOpen={isReturnModalOpen}
                    onClose={() => setIsReturnModalOpen(false)}
                />

                {/* Customer 5-Star Rating Modal */}
                <RatingModal
                    isOpen={isRatingModalOpen}
                    onClose={() => setIsRatingModalOpen(false)}
                    orderNumber={completedOrder?.order_number}
                    initialCustomerName={customerName}
                    initialCustomerPhone={customerPhone}
                    branch={currentBranch === 'Dasma' ? 'Dasmarinas' : 'Bulihan'}
                />

                {/* Floating AI Chatbot at Bottom Left (Desktop Only on /order) */}
                <div className="hidden sm:block">
                    <AIChatbot />
                </div>
                <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
                <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
                <CustomerOrderTracker />
                <CustomerAuthModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                    onSuccess={(user) => {
                        setCurrentUser(user);
                    }}
                />
                <CustomerAccountModal
                    isOpen={isAccountModalOpen}
                    onClose={() => setIsAccountModalOpen(false)}
                    user={currentUser}
                    onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
                    onLogout={handleCustomerLogout}
                />
            </div>
        </>
    );
}
