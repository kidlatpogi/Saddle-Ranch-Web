import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ListOrdered, 
    Utensils, 
    TrendingUp, 
    LogOut, 
    Flame, 
    Search, 
    Filter, 
    CheckCircle2, 
    Clock, 
    ChefHat, 
    ArrowUpRight,
    ShoppingBag,
    Plus,
    Minus,
    Trash2,
    Printer,
    DollarSign,
    CreditCard,
    Smartphone,
    User,
    MapPin,
    Receipt,
    Check,
    X,
    Banknote,
    RotateCcw,
    ShieldAlert,
    Lock,
    Bell
} from 'lucide-react';

interface OrderItem {
    id: string | number;
    order_number?: string;
    type?: 'Dine-In' | 'Pick-Up' | 'Delivery' | string;
    order_type?: string;
    location?: string;
    table_number?: string;
    customer?: string;
    customer_name?: string;
    phone?: string;
    customer_phone?: string;
    amount?: number;
    total_amount?: number;
    payment?: string;
    payment_method?: string;
    status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
    time?: string;
    created_at?: string;
    itemsCount?: number;
    itemsSummary?: string;
    order_items?: any[];
    discount_type?: string;
    discount_amount?: number;
}

interface ProductItem {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    isActive: boolean;
    image: string;
}

interface PosCartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface EmployeeDashboardProps {
    initialOrders?: OrderItem[];
    userBranch?: string;
    products?: any[];
}

export default function EmployeeDashboard({ initialOrders, userBranch = 'Bulihan', products: serverProducts }: EmployeeDashboardProps) {
    // POS is default active tab for Cashiers!
    const [activeTab, setActiveTab] = useState<'pos' | 'queue' | 'menu' | 'sales'>('pos');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // Live State Orders Dataset
    const [orders, setOrders] = useState<OrderItem[]>(initialOrders || []);

    // Live Polling Engine
    const fetchLatestOrders = async () => {
        try {
            const res = await fetch('/api/v1/kitchen/orders');
            if (res.ok) {
                const json = await res.json();
                if (json.data) {
                    setOrders(json.data);
                }
            }
        } catch (e) {
            // fallback gracefully
        }
    };

    const [activeWaiterCalls, setActiveWaiterCalls] = useState<any[]>([]);

    const fetchWaiterCalls = async () => {
        try {
            const res = await fetch('/api/v1/waiter-calls');
            if (res.ok) {
                const json = await res.json();
                setActiveWaiterCalls(json.data || []);
            }
        } catch (e) {}
    };

    const handleDismissWaiterCall = async (tableNumber: string) => {
        try {
            await fetch('/api/v1/waiter-calls/dismiss', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ table_number: tableNumber }),
            });
            setActiveWaiterCalls((prev) => prev.filter((c) => c.table_number !== tableNumber));
        } catch (e) {}
    };

    useEffect(() => {
        fetchLatestOrders();
        fetchWaiterCalls();
        const interval = setInterval(() => {
            fetchLatestOrders();
            fetchWaiterCalls();
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // POS Walk-In Cart State
    const [posCart, setPosCart] = useState<PosCartItem[]>([]);
    const [posCustomerName, setPosCustomerName] = useState('Walk-In Guest');
    const [posTableNumber, setPosTableNumber] = useState('01');
    const [posOrderType, setPosOrderType] = useState<'Dine-In' | 'Pick-Up'>('Dine-In');
    const [posPaymentMethod, setPosPaymentMethod] = useState<'Cash' | 'GCash'>('Cash');
    const [posDiscountType, setPosDiscountType] = useState<'NONE' | 'SENIOR' | 'PWD'>('NONE');
    const [cashTendered, setCashTendered] = useState<string>('');
    const [showReceiptModal, setShowReceiptModal] = useState<OrderItem | null>(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Security Void Modal State
    const [cancelModalOrder, setCancelModalOrder] = useState<OrderItem | null>(null);
    const [cancelPassword, setCancelPassword] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    const [cancelError, setCancelError] = useState('');
    const [cancelLoading, setCancelLoading] = useState(false);

    const getProductCategory = (name: string): string => {
        const n = name.toLowerCase();
        if ((n.includes('rice') && !n.includes('pepper') && !n.includes('inasal') && !n.includes('meal')) || n.includes('tea') || n.includes('cucumber') || n.includes('pitcher') || n.includes('beverage') || n.includes('juice') || n.includes('drink')) {
            return 'Drinks & Extra Rice';
        }
        if (n.includes('platter') || n.includes('barkada')) {
            return 'Barkada Platters';
        }
        if (n.includes('kare') || n.includes('adobo') || n.includes('sinigang') || n.includes('filipino') || n.includes('bulalo')) {
            return 'Authentic Filipino Cuisine';
        }
        return 'Sizzling Rice Meals';
    };

    const fallbackProducts: ProductItem[] = [
        { id: 1, name: 'Kare-Kare', category: 'Authentic Filipino Cuisine', price: 180, stock: 50, isActive: true, image: '/images/FilipinoCousines/kare-kare.webp' },
        { id: 2, name: 'Pork Adobo', category: 'Authentic Filipino Cuisine', price: 120, stock: 50, isActive: true, image: '/images/FilipinoCousines/pork_adobo.webp' },
        { id: 3, name: 'Pork Sinigang', category: 'Authentic Filipino Cuisine', price: 150, stock: 50, isActive: true, image: '/images/FilipinoCousines/pork_sinigang.webp' },
        { id: 4, name: 'Sizzling Bangus', category: 'Sizzling Rice Meals', price: 125, stock: 50, isActive: true, image: '/images/Menu/bangus.webp' },
        { id: 5, name: 'Sizzling Beef Teriyaki', category: 'Sizzling Rice Meals', price: 140, stock: 50, isActive: true, image: '/images/Menu/beef_teriyaki.webp' },
        { id: 6, name: 'Sizzling Burger Steak', category: 'Sizzling Rice Meals', price: 95, stock: 50, isActive: true, image: '/images/Menu/burger_steak.webp' },
        { id: 7, name: 'Sizzling Chicken Inasal', category: 'Sizzling Rice Meals', price: 120, stock: 50, isActive: true, image: '/images/Menu/chicken_inasal.webp' },
        { id: 8, name: 'Sizzling Porkchop', category: 'Sizzling Rice Meals', price: 120, stock: 50, isActive: true, image: '/images/Menu/porkchop.webp' },
        { id: 9, name: 'Sizzling Sisig (w/ Egg)', category: 'Sizzling Rice Meals', price: 100, stock: 60, isActive: true, image: '/images/Menu/sisig.webp' },
        { id: 10, name: 'Sizzling Spicy Beef', category: 'Sizzling Rice Meals', price: 120, stock: 50, isActive: true, image: '/images/Menu/spicy_beef.webp' },
        { id: 11, name: 'Tapsilog', category: 'Sizzling Rice Meals', price: 100, stock: 50, isActive: true, image: '/images/Menu/tapsilog.webp' },
        { id: 12, name: 'Sizzling Tilapia', category: 'Sizzling Rice Meals', price: 85, stock: 40, isActive: true, image: '/images/Menu/tilapia.webp' },
        { id: 13, name: 'Tocilog', category: 'Sizzling Rice Meals', price: 75, stock: 50, isActive: true, image: '/images/Menu/tocilog.webp' },
        { id: 14, name: 'Extra Rice', category: 'Drinks & Extra Rice', price: 15, stock: 150, isActive: true, image: '/images/RiceAndDrinks/extra_rice.webp' },
        { id: 15, name: 'Red Iced Tea (1 Litre Pitcher)', category: 'Drinks & Extra Rice', price: 50, stock: 80, isActive: true, image: '/images/RiceAndDrinks/beverages_iced_tea.webp' },
        { id: 16, name: 'Cucumber (1 Litre Pitcher)', category: 'Drinks & Extra Rice', price: 50, stock: 80, isActive: true, image: '/images/RiceAndDrinks/beverages_cucumber.webp' },
        { id: 17, name: 'Platter Sisig', category: 'Barkada Platters', price: 200, stock: 30, isActive: true, image: '/images/Platters/platter_sisig.webp' },
        { id: 18, name: 'Platter Tapa', category: 'Barkada Platters', price: 220, stock: 30, isActive: true, image: '/images/Platters/platter_tapa.webp' },
        { id: 19, name: 'Platter Teriyaki', category: 'Barkada Platters', price: 250, stock: 30, isActive: true, image: '/images/Platters/platter_tereyaki.webp' },
    ];

    const resolveImageUrl = (img?: string | null): string => {
        if (!img) return fallbackProducts[0].image;
        if (img.startsWith('http://localhost') || img.startsWith('http://127.0.0.1')) {
            try {
                const urlObj = new URL(img);
                return urlObj.pathname;
            } catch {
                return fallbackProducts[0].image;
            }
        }
        if (img.startsWith('http://') || img.startsWith('https://')) {
            return img;
        }
        if (img.startsWith('/images/') || img.startsWith('/storage/')) {
            return img;
        }
        if (img.startsWith('/')) {
            return img;
        }
        return `/images/${img}`;
    };

    const products: ProductItem[] = React.useMemo(() => {
        if (serverProducts && serverProducts.length > 0) {
            return serverProducts.map((p) => ({
                id: p.id,
                name: p.name,
                category: p.category || getProductCategory(p.name),
                price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
                stock: p.stock_quantity ?? p.stock ?? 50,
                isActive: p.is_active ?? true,
                image: resolveImageUrl(p.image_path || p.image),
            }));
        }
        return fallbackProducts;
    }, [serverProducts]);

    // POS Cart Helpers
    const addToPosCart = (product: ProductItem) => {
        const existing = posCart.find(item => item.id === product.id);
        if (existing) {
            setPosCart(posCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setPosCart([...posCart, { id: product.id, name: product.name, price: product.price, quantity: 1 }]);
        }
    };

    const updatePosQuantity = (productId: number, delta: number) => {
        setPosCart(posCart.map(item => {
            if (item.id === productId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
        }).filter(Boolean) as PosCartItem[]);
    };

    const removePosItem = (productId: number) => {
        setPosCart(posCart.filter(item => item.id !== productId));
    };

    const posSubtotal = posCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const posDiscountRate = (posDiscountType === 'SENIOR' || posDiscountType === 'PWD') ? 0.20 : 0;
    const posDiscountAmount = posSubtotal * posDiscountRate;
    const posCartTotal = posSubtotal - posDiscountAmount;
    const posTenderedAmount = parseFloat(cashTendered) || 0;
    const posChangeAmount = Math.max(0, posTenderedAmount - posCartTotal);

    const handleCheckoutWalkInOrder = (e: React.FormEvent) => {
        e.preventDefault();
        if (posCart.length === 0) return;

        const nextNum = (orders.length + 50).toString().padStart(4, '0');
        const newOrderId = `SR-${nextNum}`;
        const itemsSummaryText = posCart.map(i => `${i.quantity}x ${i.name}`).join(', ');

        const newOrder: OrderItem = {
            id: newOrderId,
            order_number: newOrderId,
            type: posOrderType,
            order_type: posOrderType.toLowerCase().replace('-', '_'),
            location: posOrderType === 'Dine-In' ? `Table ${posTableNumber}` : 'Counter Pick-Up',
            customer: posCustomerName || 'Walk-In Customer',
            customer_name: posCustomerName || 'Walk-In Customer',
            phone: 'Walk-In Counter',
            amount: posCartTotal,
            total_amount: posCartTotal,
            payment: `${posPaymentMethod} (Walk-In POS${posDiscountType !== 'NONE' ? ` - ${posDiscountType} 20%` : ''})`,
            status: 'preparing',
            time: 'Just now',
            itemsCount: posCart.reduce((sum, i) => sum + i.quantity, 0),
            itemsSummary: itemsSummaryText,
            discount_type: posDiscountType,
            discount_amount: posDiscountAmount,
        };

        setOrders([newOrder, ...orders]);
        setShowReceiptModal(newOrder);

        // Reset Cart
        setPosCart([]);
        setPosDiscountType('NONE');
        setCashTendered('');
        setPosCustomerName('Walk-In Guest');
    };

    // Update Status Endpoint Handler (PATCH /orders/{id}/status)
    const updateOrderStatus = async (orderId: string | number, newStatus: OrderItem['status']) => {
        try {
            await fetch(`/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ status: newStatus }),
            });
        } catch (e) {
            console.error('Failed to update status on server:', e);
        }
        setOrders(orders.map(o => (o.id === orderId || o.order_number === orderId) ? { ...o, status: newStatus } : o));
    };

    // Cancellation Handler (POST /orders/{id}/cancel)
    const handleCancelOrderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cancelModalOrder) return;

        setCancelLoading(true);
        setCancelError('');

        try {
            const res = await fetch(`/orders/${cancelModalOrder.id}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    password: cancelPassword,
                    reason: cancelReason,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setOrders(orders.map(o => o.id === cancelModalOrder.id ? { ...o, status: 'cancelled' } : o));
                setCancelModalOrder(null);
                setCancelPassword('');
                setCancelReason('');
            } else {
                setCancelError(data.message || 'Invalid authorization password');
            }
        } catch (err) {
            setCancelError('Network error verifying cancellation.');
        } finally {
            setCancelLoading(false);
        }
    };

    const filteredOrders = orders.filter(o => {
        if (statusFilter !== 'All' && o.status !== statusFilter) return false;
        if (searchQuery) {
            const num = (o.order_number || o.id || '').toString().toLowerCase();
            const cust = (o.customer_name || o.customer || '').toLowerCase();
            if (!num.includes(searchQuery.toLowerCase()) && !cust.includes(searchQuery.toLowerCase())) {
                return false;
            }
        }
        return true;
    });

    const filteredProducts = products.filter(p => {
        if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const shiftRevenue = orders.filter(o => o.status === 'completed' || o.status === 'ready' || o.status === 'preparing').reduce((acc, o) => acc + (o.amount || o.total_amount || 0), 0);

    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const preparingCount = orders.filter(o => o.status === 'preparing').length;
    const readyCount = orders.filter(o => o.status === 'ready').length;
    const completedCount = orders.filter(o => o.status === 'completed').length;
    const cancelledCount = orders.filter(o => o.status === 'cancelled').length;

    return (
        <>
            <Head title="Cashier POS & Employee Portal | Saddle Ranch" />
            <div className="min-h-screen bg-[#141416] text-[#f4f4f5] font-sans selection:bg-[#f59e0b] selection:text-[#3f2000] flex flex-col">
                
                {/* Header */}
                <header className="h-20 bg-[#1f1f23] border-b border-[#333338] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#b45309] flex items-center justify-center shadow-md shadow-[#f59e0b]/20">
                            <Flame className="w-6 h-6 text-[#3f2000]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-black font-domine text-[#fbbf24] tracking-tight">Saddle Ranch Cashier POS</h1>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                                    userBranch === 'Dasma' || userBranch === 'Dasmariñas'
                                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                }`}>
                                    {userBranch === 'Dasma' ? 'Dasmariñas Branch' : `${userBranch} Branch`} Cashier
                                </span>
                            </div>
                            <p className="text-xs text-[#a1a1aa]">Touchscreen Tablet Register & Live Ready-Order Serve Control</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/employee/kitchen"
                            className="px-4 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                        >
                            <ChefHat className="w-4 h-4" />
                            <span>Kitchen KDS Terminal</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setShowLogoutModal(true)}
                            className="px-3.5 py-2.5 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-rose-400 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </header>

                {/* Main Content Area - Expanded Width for Tablets */}
                <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
                    
                    {/* Navigation Tabs Bar */}
                    <div className="p-2 rounded-2xl bg-[#202024] border border-[#333338] flex flex-wrap items-center justify-between gap-4 shadow-lg">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab('pos')}
                                className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                                    activeTab === 'pos' ? 'bg-[#f59e0b] text-[#3f2000] font-black shadow-lg' : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]'
                                }`}
                            >
                                <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Register</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('queue')}
                                className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                                    activeTab === 'queue' ? 'bg-[#f59e0b] text-[#3f2000] font-black shadow-lg' : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]'
                                }`}
                            >
                                <ListOrdered className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Orders Queue ({orders.length})</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('menu')}
                                className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                                    activeTab === 'menu' ? 'bg-[#f59e0b] text-[#3f2000] font-black shadow-lg' : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]'
                                }`}
                            >
                                <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Menu Availability</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('sales')}
                                className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                                    activeTab === 'sales' ? 'bg-[#f59e0b] text-[#3f2000] font-black shadow-lg' : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]'
                                }`}
                            >
                                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Shift Sales</span>
                            </button>
                        </div>

                        {/* Search Control */}
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search menu or order..."
                                className="w-64 pl-10 pr-4 py-2 bg-[#18181b] border border-[#3f3f46] rounded-xl text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#f59e0b]"
                            />
                        </div>
                    </div>

                    {/* Active Waiter Call Notification Banner */}
                    {activeWaiterCalls.length > 0 && (
                        <div className="mb-6 p-4 rounded-2xl bg-amber-500 text-[#3f2000] border-2 border-[#ffc174] shadow-2xl flex flex-wrap items-center justify-between gap-3 animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
                                    <Bell className="w-6 h-6 text-[#3f2000] animate-bounce" />
                                </div>
                                <div>
                                    <div className="font-black text-sm uppercase tracking-wider">WAITER ASSISTANCE REQUESTED!</div>
                                    <div className="text-xs font-bold">
                                        {activeWaiterCalls.map((c) => `Table #${c.table_number} (${c.branch || 'Bulihan'} Branch)`).join(' • ')}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                {activeWaiterCalls.map((c) => (
                                    <button
                                        key={c.id || c.table_number}
                                        onClick={() => handleDismissWaiterCall(c.table_number)}
                                        className="px-3.5 py-1.5 rounded-xl bg-[#121213] text-[#ffc174] hover:bg-black font-black text-xs transition-all shadow cursor-pointer border border-[#f59e0b]"
                                    >
                                        Acknowledge Table #{c.table_number}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 0: ERGONOMIC TOUCHSCREEN TABLET POS REGISTER */}
                    {activeTab === 'pos' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            
                            {/* Left Column (7/12 Width): High-Resolution Touch Menu Catalog */}
                            <div className="lg:col-span-7 space-y-4">
                                <div className="p-4 rounded-2xl bg-[#202024] border border-[#333338]">
                                    {/* Touch Category Filter Chips */}
                                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                        {['All', 'Sizzling Rice Meals', 'Authentic Filipino Cuisine', 'Barkada Platters', 'Drinks & Extra Rice'].map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setCategoryFilter(cat)}
                                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                                    categoryFilter === cat
                                                        ? 'bg-[#f59e0b] text-[#3f2000] font-black shadow'
                                                        : 'bg-[#18181b] border border-[#3f3f46] text-[#a1a1aa] hover:text-white'
                                                }`}
                                            >
                                                {cat === 'All' ? 'All Dishes' : cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Spacious Dish Touch Cards */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                                    {filteredProducts.map((product) => {
                                        const cartItem = posCart.find(i => i.id === product.id);
                                        return (
                                            <button
                                                key={product.id}
                                                onClick={() => addToPosCart(product)}
                                                className={`p-4 rounded-3xl bg-[#202024] border shadow-xl text-left space-y-3 group transition-all relative active:scale-95 flex flex-col justify-between ${
                                                    cartItem ? 'border-[#f59e0b] ring-2 ring-[#f59e0b]/40' : 'border-[#333338] hover:border-[#3f3f46]'
                                                }`}
                                            >
                                                {cartItem && (
                                                    <span className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-[#f59e0b] text-[#3f2000] font-mono font-black text-sm flex items-center justify-center shadow-2xl border border-[#fbbf24] z-30">
                                                        {cartItem.quantity}
                                                    </span>
                                                )}

                                                <div className="h-36 sm:h-40 w-full rounded-2xl overflow-hidden bg-[#18181b] border border-[#3f3f46] relative z-10">
                                                    <img 
                                                        src={resolveImageUrl(product.image)} 
                                                        alt={product.name} 
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = fallbackProducts[0].image;
                                                        }}
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <h4 className="text-sm sm:text-base font-bold text-white font-domine line-clamp-1 group-hover:text-[#fbbf24] transition-colors">{product.name}</h4>
                                                    <div className="flex items-center justify-between pt-1">
                                                        <span className="font-mono font-black text-sm sm:text-base text-[#fbbf24]">₱ {product.price.toFixed(2)}</span>
                                                        <span className="text-xs text-[#71717a] font-mono">{product.stock} left</span>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right Column (5/12 Width): Touchscreen Tablet Order Command Ticket */}
                            <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-[#202024] border border-[#333338] shadow-2xl space-y-6 sticky top-28">
                                
                                <div className="flex items-center justify-between pb-4 border-b border-[#333338]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 flex items-center justify-center text-[#f59e0b]">
                                            <Receipt className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-domine font-black text-white text-lg">Walk-In Register Ticket</h3>
                                            <p className="text-xs text-[#a1a1aa]">Touch Register Terminal</p>
                                        </div>
                                    </div>

                                    {posCart.length > 0 && (
                                        <button
                                            onClick={() => setPosCart([])}
                                            className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-bold flex items-center gap-1 transition-all"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" /> Clear Ticket
                                        </button>
                                    )}
                                </div>

                                {/* Order Type & Customer Inputs */}
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setPosOrderType('Dine-In')}
                                            className={`py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                                posOrderType === 'Dine-In' ? 'bg-[#f59e0b] text-[#3f2000] font-black shadow-lg' : 'bg-[#18181b] border border-[#3f3f46] text-[#a1a1aa]'
                                            }`}
                                        >
                                            <Utensils className="w-4 h-4" /> Dine-In Order
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPosOrderType('Pick-Up')}
                                            className={`py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                                posOrderType === 'Pick-Up' ? 'bg-[#f59e0b] text-[#3f2000] font-black shadow-lg' : 'bg-[#18181b] border border-[#3f3f46] text-[#a1a1aa]'
                                            }`}
                                        >
                                            <ShoppingBag className="w-4 h-4" /> Takeout Order
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Customer Name</label>
                                            <input
                                                type="text"
                                                value={posCustomerName}
                                                onChange={(e) => setPosCustomerName(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-2xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-bold"
                                            />
                                        </div>

                                        {posOrderType === 'Dine-In' && (
                                            <div>
                                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Table #</label>
                                                <input
                                                    type="text"
                                                    value={posTableNumber}
                                                    onChange={(e) => setPosTableNumber(e.target.value)}
                                                    className="w-full px-3 py-2.5 rounded-2xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-mono text-center font-bold"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Cart Items List with Wide Touch Buttons */}
                                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                                    {posCart.length > 0 ? (
                                        posCart.map((item) => (
                                            <div key={item.id} className="p-3.5 rounded-2xl bg-[#18181b] border border-[#3f3f46] flex items-center justify-between gap-3 text-xs sm:text-sm">
                                                <div className="flex-1 truncate">
                                                    <div className="font-bold text-white truncate font-domine">{item.name}</div>
                                                    <div className="text-xs font-mono text-[#fbbf24]">₱{item.price.toFixed(2)} x {item.quantity} = <strong>₱{(item.price * item.quantity).toFixed(2)}</strong></div>
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    <button onClick={() => updatePosQuantity(item.id, -1)} className="w-8 h-8 rounded-xl bg-[#27272a] text-white hover:bg-[#f59e0b] hover:text-[#3f2000] flex items-center justify-center font-black transition-colors">-</button>
                                                    <span className="font-mono font-bold text-white px-2 text-sm">{item.quantity}</span>
                                                    <button onClick={() => updatePosQuantity(item.id, 1)} className="w-8 h-8 rounded-xl bg-[#27272a] text-white hover:bg-[#f59e0b] hover:text-[#3f2000] flex items-center justify-center font-black transition-colors">+</button>
                                                    <button onClick={() => removePosItem(item.id)} className="p-2 text-rose-400 hover:text-rose-300 ml-1"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-xs sm:text-sm text-[#71717a] border border-dashed border-[#3f3f46] rounded-3xl space-y-2">
                                            <Receipt className="w-8 h-8 text-[#71717a] mx-auto" />
                                            <div>Ticket is currently empty</div>
                                            <p className="text-[11px]">Touch dish tiles on catalog to add items</p>
                                        </div>
                                    )}
                                </div>

                                {/* Payment Method & QUICK BILL PRESET NUMPAD */}
                                {posCart.length > 0 && (
                                    <form onSubmit={handleCheckoutWalkInOrder} className="space-y-4 pt-4 border-t border-[#333338]">
                                        <div>
                                            <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Discount Type</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {(['NONE', 'SENIOR', 'PWD'] as const).map((dType) => (
                                                    <button
                                                        key={dType}
                                                        type="button"
                                                        onClick={() => setPosDiscountType(dType)}
                                                        className={`py-2 rounded-2xl text-xs font-bold transition-all ${
                                                            posDiscountType === dType
                                                                ? 'bg-[#f59e0b] text-[#3f2000] font-black border border-[#f59e0b]'
                                                                : 'bg-[#18181b] border border-[#3f3f46] text-[#a1a1aa] hover:text-white'
                                                        }`}
                                                    >
                                                        {dType === 'NONE' ? 'NONE' : `${dType} (20%)`}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Payment Method</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {(['Cash', 'GCash'] as const).map((method) => (
                                                    <button
                                                        key={method}
                                                        type="button"
                                                        onClick={() => setPosPaymentMethod(method)}
                                                        className={`py-2.5 rounded-2xl text-xs font-bold transition-all ${
                                                            posPaymentMethod === method
                                                                ? 'bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]'
                                                                : 'bg-[#18181b] border border-[#3f3f46] text-[#a1a1aa]'
                                                        }`}
                                                    >
                                                        {method}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* QUICK CASH BILL PRESETS FOR TABLETS */}
                                        {posPaymentMethod === 'Cash' && (
                                            <div className="space-y-2 bg-[#18181b] p-3.5 rounded-2xl border border-[#3f3f46]">
                                                <div className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider">Quick Cash Bill Presets</div>
                                                <div className="grid grid-cols-5 gap-1.5">
                                                    {[100, 200, 500, 1000].map((bill) => (
                                                        <button
                                                            key={bill}
                                                            type="button"
                                                            onClick={() => setCashTendered(bill.toString())}
                                                            className="py-1.5 rounded-xl bg-[#27272a] text-xs font-mono font-bold text-white hover:bg-[#f59e0b] hover:text-[#3f2000] border border-[#3f3f46]"
                                                        >
                                                            ₱{bill}
                                                        </button>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => setCashTendered(posCartTotal.toString())}
                                                        className="py-1.5 rounded-xl bg-[#f59e0b]/20 text-xs font-mono font-bold text-[#fbbf24] border border-[#f59e0b]/40"
                                                    >
                                                        Exact
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 pt-2">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-[#a1a1aa] mb-1">Tendered (₱)</label>
                                                        <input
                                                            type="number"
                                                            required
                                                            value={cashTendered}
                                                            onChange={(e) => setCashTendered(e.target.value)}
                                                            placeholder={posCartTotal.toString()}
                                                            className="w-full px-3.5 py-2 rounded-xl bg-[#141416] border border-[#3f3f46] text-sm text-white font-mono font-bold"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-[#a1a1aa] mb-1">Change (₱)</label>
                                                        <div className="w-full px-3.5 py-2 rounded-xl bg-[#141416] border border-[#3f3f46] text-sm font-mono font-black text-emerald-400">
                                                            ₱ {posChangeAmount.toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-1.5 pt-2">
                                            <div className="flex justify-between text-xs text-[#a1a1aa]">
                                                <span>Subtotal</span>
                                                <span className="font-mono">₱{posSubtotal.toFixed(2)}</span>
                                            </div>
                                            {posDiscountType !== 'NONE' && (
                                                <div className="flex justify-between text-xs font-bold text-emerald-400">
                                                    <span>Discount ({posDiscountType} 20%)</span>
                                                    <span className="font-mono">-₱{posDiscountAmount.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-xs text-[#a1a1aa]">
                                                <span>12% VAT</span>
                                                <span className="font-mono">₱{(posCartTotal * 0.12).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-black text-white pt-2 border-t border-[#333338]">
                                                <span>Grand Total</span>
                                                <span className="font-mono text-[#fbbf24]">₱{posCartTotal.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        {/* Large Touch Action Button */}
                                        <button
                                            type="submit"
                                            disabled={posCart.length === 0 || (posPaymentMethod === 'Cash' && posTenderedAmount < posCartTotal)}
                                            className="w-full px-4 py-4 rounded-2xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] font-black text-sm sm:text-base uppercase tracking-wider transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer active:scale-95"
                                        >
                                            <Printer className="w-5 h-5 flex-shrink-0" />
                                            <span>COMPLETE ORDER & PRINT RECEIPT</span>
                                        </button>
                                    </form>
                                )}
                            </div>

                        </div>
                    )}

                    {/* TAB 1: TABBED ORDER QUEUE VIEW WITH PENDING | PREPARING | READY | COMPLETED | CANCELLED */}
                    {activeTab === 'queue' && (
                        <div className="space-y-6">
                            {/* TABBED STATUS PIPELINE CHIPS */}
                            <div className="p-3 rounded-2xl bg-[#202024] border border-[#333338] flex flex-wrap items-center justify-between gap-3 shadow-lg">
                                <div className="flex items-center gap-2 overflow-x-auto">
                                    {[
                                        { id: 'All', label: 'All Orders', count: orders.length, color: 'text-white' },
                                        { id: 'pending', label: 'Pending', count: pendingCount, color: 'text-amber-400' },
                                        { id: 'preparing', label: 'Preparing', count: preparingCount, color: 'text-yellow-300' },
                                        { id: 'ready', label: 'Ready to Serve', count: readyCount, color: 'text-blue-400' },
                                        { id: 'completed', label: 'Completed', count: completedCount, color: 'text-emerald-400' },
                                        { id: 'cancelled', label: 'Cancelled', count: cancelledCount, color: 'text-rose-400' },
                                    ].map((chip) => (
                                        <button
                                            key={chip.id}
                                            onClick={() => setStatusFilter(chip.id)}
                                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                                                statusFilter === chip.id
                                                    ? 'bg-[#f59e0b] text-[#3f2000] font-black shadow-md'
                                                    : 'bg-[#18181b] border border-[#3f3f46] text-[#a1a1aa] hover:text-white'
                                            }`}
                                        >
                                            <span>{chip.label}</span>
                                            <span className={`px-2 py-0.5 rounded-full bg-[#141416] text-[11px] font-mono font-black ${chip.color}`}>
                                                {chip.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <div className="text-xs text-[#a1a1aa]">
                                    Order Queue: <strong className="text-[#fbbf24] font-mono text-sm">{filteredOrders.length}</strong> tickets
                                </div>
                            </div>

                            {/* CASHIER ORDER QUEUE CARDS GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((o) => {
                                        const orderNum = o.order_number || o.id;
                                        const custName = o.customer_name || o.customer || 'Guest';
                                        const custPhone = o.customer_phone || o.phone || 'Counter';
                                        const oType = o.order_type || o.type || 'dine_in';
                                        const oLoc = o.table_number ? `Table ${o.table_number}` : (o.location || 'Counter');
                                        const totalVal = o.total_amount || o.amount || 0;
                                        const payMethod = o.payment_method || o.payment || 'Cash';
                                        const itemsText = o.itemsSummary || (o.order_items || []).map(i => `${i.quantity}x ${i.product?.name || 'Dish'}`).join(', ');

                                        return (
                                            <div
                                                key={o.id}
                                                className={`p-6 sm:p-7 rounded-3xl border shadow-2xl space-y-5 flex flex-col justify-between transition-all ${
                                                    o.status === 'pending' ? 'bg-[#1f1a14] border-amber-500/50' :
                                                    o.status === 'preparing' ? 'bg-[#1e1c18] border-yellow-500/50' :
                                                    o.status === 'ready' ? 'bg-[#1b2638] border-blue-500/80 shadow-blue-500/20' :
                                                    o.status === 'completed' ? 'bg-[#19261f] border-emerald-500/50' :
                                                    'bg-[#261517] border-rose-500/50'
                                                }`}
                                            >
                                                <div className="space-y-4">
                                                    {/* Header Bar */}
                                                    <div className="flex items-center justify-between pb-3 border-b border-[#333338]">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-mono text-xl font-black text-white tracking-wider">#{orderNum}</span>
                                                            <span className="px-3 py-1 rounded-full bg-[#18181b] text-[#fbbf24] text-xs font-mono font-bold border border-[#3f3f46]">
                                                                [{oType.toUpperCase()}: {oLoc}]
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                                                o.status === 'ready' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 animate-pulse' :
                                                                o.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                                                                o.status === 'preparing' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' :
                                                                o.status === 'cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                                                                'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                                            }`}>
                                                                {o.status}
                                                            </span>

                                                            {o.status !== 'cancelled' && o.status !== 'completed' && (
                                                                <button
                                                                    onClick={() => setCancelModalOrder(o)}
                                                                    className="text-xs text-rose-400 hover:text-rose-300 font-bold p-1"
                                                                    title="Void Order"
                                                                >
                                                                    <ShieldAlert className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Customer & Dishes Items List */}
                                                    <div className="space-y-2">
                                                        <div className="text-xs sm:text-sm font-bold text-white flex justify-between">
                                                            <span>Customer: <strong className="text-[#fbbf24]">{custName}</strong></span>
                                                            <span className="text-[#a1a1aa] font-mono">{custPhone}</span>
                                                        </div>

                                                        <div className="p-4 rounded-2xl bg-[#141416] border border-[#3f3f46] space-y-1">
                                                            <div className="text-[10px] font-mono font-bold text-[#f59e0b] uppercase tracking-wider">Dishes Summary:</div>
                                                            <div className="text-xs sm:text-sm font-mono font-bold text-zinc-100 leading-relaxed">
                                                                {itemsText || 'Ordered items list'}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center text-xs font-mono text-[#a1a1aa]">
                                                        <span>Payment: <strong className="text-white">{payMethod}</strong></span>
                                                        <span className="text-base font-black text-[#fbbf24]">Total: ₱{Number(totalVal).toFixed(2)}</span>
                                                    </div>
                                                </div>

                                                {/* CASHIER ACTION BUTTONS */}
                                                <div className="pt-2 space-y-2">
                                                    {o.status === 'ready' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(o.id, 'completed')}
                                                            className="w-full px-4 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 cursor-pointer active:scale-95"
                                                        >
                                                            <Check className="w-5 h-5 flex-shrink-0" />
                                                            <span className="text-center">COMPLETE ORDER (HAND OVER)</span>
                                                        </button>
                                                    )}

                                                    {(o.status === 'ready' || o.status === 'completed') && (
                                                        <button
                                                            onClick={() => setShowReceiptModal(o)}
                                                            className="w-full py-3 rounded-2xl bg-[#27272a] border border-[#3f3f46] hover:bg-[#3f3f46] text-[#fbbf24] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                                                        >
                                                            <Printer className="w-4 h-4" />
                                                            <span>Print Thermal Receipt</span>
                                                        </button>
                                                    )}

                                                    {o.status === 'pending' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(o.id, 'preparing')}
                                                            className="w-full px-4 py-3.5 rounded-2xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                                                        >
                                                            <Flame className="w-4 h-4 flex-shrink-0" />
                                                            <span>Start Preparing</span>
                                                        </button>
                                                    )}

                                                    {o.status === 'preparing' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(o.id, 'ready')}
                                                            className="w-full px-4 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                                            <span>Mark Ready to Serve</span>
                                                        </button>
                                                    )}
                                                </div>

                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-3 p-12 rounded-3xl bg-[#202024] border border-[#333338] text-center space-y-2">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                                        <div className="text-base font-bold text-white font-domine">No orders in status "{statusFilter}"</div>
                                        <p className="text-xs text-[#a1a1aa]">Select another tab or place a new order from /order.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB 2: MENU & STOCK AVAILABILITY WITH TOUCH CATEGORY CHIPS */}
                    {activeTab === 'menu' && (
                        <div className="space-y-6">
                            <div className="p-4 rounded-2xl bg-[#202024] border border-[#333338]">
                                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                    {['All', 'Sizzling Rice Meals', 'Authentic Filipino Cuisine', 'Barkada Platters', 'Drinks & Extra Rice'].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setCategoryFilter(cat)}
                                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                                categoryFilter === cat
                                                    ? 'bg-[#f59e0b] text-[#3f2000] font-black shadow'
                                                    : 'bg-[#18181b] border border-[#3f3f46] text-[#a1a1aa] hover:text-white'
                                            }`}
                                        >
                                            {cat === 'All' ? 'All Dishes' : cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredProducts.map((p) => (
                                    <div key={p.id} className="p-5 rounded-3xl bg-[#202024] border border-[#333338] shadow-lg space-y-3 flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-[#3f3f46] bg-[#18181b]">
                                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                                <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-[#18181b]/90 text-[#fbbf24] font-mono font-black text-xs border border-[#f59e0b]/30">
                                                    ₱ {p.price.toFixed(2)}
                                                </span>
                                            </div>

                                            <div>
                                                <span className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider block">{p.category}</span>
                                                <h4 className="text-base font-bold text-white font-domine">{p.name}</h4>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-[#333338] flex items-center justify-between text-xs font-mono">
                                            <span className="text-[#a1a1aa]">Stock Level: <strong className="text-white">{p.stock}</strong></span>
                                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                                                In Stock
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 3: SHIFT SALES SUMMARY */}
                    {activeTab === 'sales' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 rounded-3xl bg-[#202024] border border-[#333338] shadow-lg space-y-2">
                                    <span className="text-xs font-bold text-[#a1a1aa] uppercase">Current Shift Gross Sales</span>
                                    <div className="text-3xl font-mono font-black text-[#fbbf24]">₱ {shiftRevenue.toFixed(2)}</div>
                                    <p className="text-[11px] text-emerald-400 font-bold">Shift Active</p>
                                </div>

                                <div className="p-6 rounded-3xl bg-[#202024] border border-[#333338] shadow-lg space-y-2">
                                    <span className="text-xs font-bold text-[#a1a1aa] uppercase">Total Shift Orders</span>
                                    <div className="text-3xl font-mono font-black text-[#ffffff]">{orders.length} Orders</div>
                                    <p className="text-[11px] text-[#a1a1aa]">Processed today</p>
                                </div>

                                <div className="p-6 rounded-3xl bg-[#202024] border border-[#333338] shadow-lg space-y-2">
                                    <span className="text-xs font-bold text-[#a1a1aa] uppercase">Average Order Value</span>
                                    <div className="text-3xl font-mono font-black text-[#ffffff]">₱ {(shiftRevenue / Math.max(1, orders.length)).toFixed(2)}</div>
                                    <p className="text-[11px] text-emerald-400 font-bold">Good throughput</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* PRINTABLE CUSTOMER WALK-IN RECEIPT MODAL */}
            {showReceiptModal && (
                <div id="printable-pos-receipt" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <div className="w-full max-w-sm rounded-3xl bg-[#141416] text-[#f4f4f5] border-2 border-[#f59e0b] p-6 shadow-2xl space-y-4 text-center animate-in fade-in duration-200">
                        <div className="flex justify-between items-center pb-2 border-b border-[#333338]">
                            <span className="font-domine font-black text-[#fbbf24] text-sm">SADDLE RANCH ROADHOUSE</span>
                            <button onClick={() => setShowReceiptModal(null)} className="text-[#a1a1aa] hover:text-white no-print">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div>
                            <div className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-widest">OFFICIAL CASHIER RECEIPT</div>
                            <h3 className="text-2xl font-black font-domine text-[#fbbf24] mt-0.5">#{showReceiptModal.order_number || showReceiptModal.id}</h3>
                            <div className="text-xs text-[#a1a1aa] font-mono">{showReceiptModal.location || showReceiptModal.table_number || 'Counter'} • {showReceiptModal.customer_name || showReceiptModal.customer || 'Guest'}</div>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#202024] border border-[#333338] text-xs text-left space-y-2 font-mono">
                            <div className="text-amber-400 font-bold border-b border-[#333338] pb-1">Items Summary:</div>
                            <div className="text-[#a1a1aa] leading-relaxed">{showReceiptModal.itemsSummary || 'Ordered items list'}</div>
                            
                            <div className="pt-2 border-t border-[#333338] space-y-1">
                                <div className="flex justify-between text-[#a1a1aa]">
                                    <span>Payment Mode:</span>
                                    <span className="text-white font-bold">{showReceiptModal.payment_method || showReceiptModal.payment || 'Cash'}</span>
                                </div>
                                {showReceiptModal.discount_type && showReceiptModal.discount_type !== 'NONE' && (
                                    <div className="flex justify-between text-emerald-400 font-bold">
                                        <span>Discount ({showReceiptModal.discount_type} 20%):</span>
                                        <span>-₱{Number(showReceiptModal.discount_amount || 0).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm font-bold text-white pt-1">
                                    <span>Total Paid:</span>
                                    <span className="text-[#fbbf24]">₱{Number(showReceiptModal.total_amount || showReceiptModal.amount || 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 flex gap-2 no-print">
                            <button
                                onClick={() => window.print()}
                                className="w-full py-3.5 rounded-2xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                            >
                                <Printer className="w-4 h-4" />
                                <span>Print Thermal Customer Receipt</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SECURITY MODAL FOR CANCELLED ORDERS */}
            {cancelModalOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <div className="w-full max-w-md rounded-3xl bg-[#18181b] border-2 border-rose-500/80 p-6 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-[#3f3f46]">
                            <div className="flex items-center gap-2 text-rose-400">
                                <ShieldAlert className="w-6 h-6" />
                                <h3 className="font-domine font-black text-white text-lg">Security Password Void</h3>
                            </div>
                            <button onClick={() => setCancelModalOrder(null)} className="text-[#a1a1aa] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="text-xs text-[#a1a1aa]">
                            Authorizing void cancellation for <strong className="text-white font-mono">#{cancelModalOrder.order_number || cancelModalOrder.id}</strong>. Stock quantities will be restored and logged to audit trails.
                        </div>

                        {cancelError && (
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
                                <Lock className="w-4 h-4 flex-shrink-0" />
                                <span>{cancelError}</span>
                            </div>
                        )}

                        <form onSubmit={handleCancelOrderSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Reason for Cancellation</label>
                                <input
                                    type="text"
                                    required
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="e.g. Customer changed mind / Out of stock"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white focus:border-rose-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Manager/Employee Password</label>
                                <input
                                    type="password"
                                    required
                                    value={cancelPassword}
                                    onChange={(e) => setCancelPassword(e.target.value)}
                                    placeholder="Enter your account password"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white focus:border-rose-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setCancelModalOrder(null)}
                                    className="flex-1 py-3 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-white font-bold text-xs"
                                >
                                    Dismiss
                                </button>
                                <button
                                    type="submit"
                                    disabled={cancelLoading}
                                    className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-lg disabled:opacity-50"
                                >
                                    {cancelLoading ? 'Verifying...' : 'Authorize Void'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-[#1f1f23] border border-[#333338] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 transform transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                                <LogOut className="w-6 h-6 text-rose-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black font-domine text-white">Log Out Confirmation</h3>
                                <p className="text-xs text-[#a1a1aa] mt-1">Are you sure you want to log out?</p>
                            </div>
                        </div>

                        <p className="text-xs text-[#71717a] leading-relaxed bg-[#141416] p-3.5 rounded-xl border border-[#27272a]">
                            You will be signed out of the register terminal session. Any active order transactions will be safely preserved.
                        </p>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowLogoutModal(false)}
                                className="px-5 py-2.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white text-xs font-bold transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => router.post('/logout')}
                                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Log Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
