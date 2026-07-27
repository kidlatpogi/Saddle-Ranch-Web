import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
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
    Lock
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
}

export default function EmployeeDashboard({ initialOrders }: EmployeeDashboardProps) {
    // POS is default active tab for Cashiers!
    const [activeTab, setActiveTab] = useState<'pos' | 'queue' | 'menu' | 'sales'>('pos');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // Live State Orders Dataset
    const [orders, setOrders] = useState<OrderItem[]>(initialOrders || [
        { id: 'SR-1049', order_number: 'SR-1049', type: 'Dine-In', order_type: 'dine_in', location: 'Table 05', customer: 'Juan Dela Cruz', customer_name: 'Juan Dela Cruz', phone: '09171234567', amount: 640, total_amount: 640, payment: 'GCash', status: 'ready', time: '10 mins ago', itemsCount: 3, itemsSummary: '2x Sizzling Pork Sisig, 1x Red Iced Tea Pitcher' },
        { id: 'SR-1048', order_number: 'SR-1048', type: 'Pick-Up', order_type: 'pickup', location: 'Counter', customer: 'Marco Reyes', customer_name: 'Marco Reyes', phone: '09189876543', amount: 460, total_amount: 460, payment: 'Cash (Pick-Up)', status: 'ready', time: '25 mins ago', itemsCount: 2, itemsSummary: '1x Sizzling T-Bone Steak, 1x Extra Garlic Rice' },
        { id: 'SR-1047', order_number: 'SR-1047', type: 'Delivery', order_type: 'delivery', location: 'Bulihan Area (Anahaw II)', customer: 'Elena Cruz', customer_name: 'Elena Cruz', phone: '09223334444', amount: 890, total_amount: 890, payment: 'Cash on Delivery', status: 'preparing', time: '30 mins ago', itemsCount: 4, itemsSummary: '1x Sizzling Bulalo Steak, 2x Chicken Inasal, 1x Red Iced Tea' },
        { id: 'SR-1046', order_number: 'SR-1046', type: 'Dine-In', order_type: 'dine_in', location: 'Table 02', customer: 'Seated Guest', customer_name: 'Seated Guest', phone: '09175556666', amount: 360, total_amount: 360, payment: 'GCash', status: 'completed', time: '1 hour ago', itemsCount: 2, itemsSummary: '2x Sizzling Pork Sisig' },
    ]);

    // Live Polling Engine
    const fetchLatestOrders = async () => {
        try {
            const res = await fetch('/api/v1/kitchen/orders');
            if (res.ok) {
                const json = await res.json();
                if (json.data && json.data.length > 0) {
                    setOrders(json.data);
                }
            }
        } catch (e) {
            // fallback gracefully
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchLatestOrders, 3000);
        return () => clearInterval(interval);
    }, []);

    // POS Walk-In Cart State
    const [posCart, setPosCart] = useState<PosCartItem[]>([]);
    const [posCustomerName, setPosCustomerName] = useState('Walk-In Guest');
    const [posTableNumber, setPosTableNumber] = useState('01');
    const [posOrderType, setPosOrderType] = useState<'Dine-In' | 'Pick-Up'>('Dine-In');
    const [posPaymentMethod, setPosPaymentMethod] = useState<'Cash' | 'GCash'>('Cash');
    const [cashTendered, setCashTendered] = useState<string>('');
    const [showReceiptModal, setShowReceiptModal] = useState<OrderItem | null>(null);

    // Security Void Modal State
    const [cancelModalOrder, setCancelModalOrder] = useState<OrderItem | null>(null);
    const [cancelPassword, setCancelPassword] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    const [cancelError, setCancelError] = useState('');
    const [cancelLoading, setCancelLoading] = useState(false);

    // Live State Products Dataset
    const [products] = useState<ProductItem[]>([
        { id: 1, name: 'Sizzling Pork Sisig', category: 'Authentic Filipino Cuisine', price: 180, stock: 50, isActive: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t' },
        { id: 2, name: 'Sizzling Pork T-Bone Steak', category: 'Barkada Platters', price: 280, stock: 30, isActive: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASVSO6N3lzIbdlCDT85viSxOZiQKjWADlA5k7ymludjTdSCB7tqV0bZvXRba3-L4gemLyqy9PxmqnYMBnSsxb5yfI_XM-qajS5ZEnS1Am8OBu5uN8_smBFlDdy4xR0UNE8jDFJP8vNSRQcqqDSG4p-oDij5kCvWALcyBZVeuA1QdnqC9a6I5s9l2ba3Zjfe0xSPjMr0jLCAB1z-oJS5xBL9meeUeFsmiMgjQ96VoXotgHsy3Jl3d9NQIv1liJsKeu_sJec2rrkNziY' },
        { id: 3, name: 'Sizzling Bulalo Steak', category: 'Authentic Filipino Cuisine', price: 450, stock: 15, isActive: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCatSLXJ-mynm_AwjLXsdG9xKbMwziehShgiNtyXaX2NZEeZFhSXaTmHMgLuACAitSC3WZ0g_9lSTavvnqO4eKFlaC0pnnA9OngEMtRicl0vfSF2_t4WqzxTKxW-H-X0i_tppiClzEOZ-fAuu1ezCbRVOcdVdwZHokttY1ATDIO4BuA185dwrm0QDuPpYjQ7qD9ybH5bl0WPn1wHJ3S5pB6JuCOoocWTfZ95cB0Lfqx1KbjbUwqGJxkhwxmqypEJta64yq1PajT3oWC' },
        { id: 4, name: 'Sizzling Chicken Inasal', category: 'Sizzling Rice Meals', price: 220, stock: 40, isActive: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6QEUONokTX7mi1M1Wrie14cxeoNfVq5HyIS1sLOLWKbzZyh6OfegCBaNeH6E7uS37ugVc6jjmILNzIrmvE0tpXkOBCDP29HO1WZL69MsOd6lpwp4oX6ezfDjuAsLMCu57vBpiHDupWu3yDATuk2k_HgpQMi23Y7mifgQKqPJhc0GqDXCCk1tPooIkFyBCXPiESBHm8HKF8cp1ctvD0RZ39YNVxKG_2cPaPyfryUGBbaoIHhqqhq5R9BflPtI6jMfzsP3W6QStlttx' },
        { id: 5, name: 'Signature Red Iced Tea (1L)', category: 'Drinks & Extra Rice', price: 95, stock: 100, isActive: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl' },
    ]);

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

    const posCartTotal = posCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
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
            payment: `${posPaymentMethod} (Walk-In POS)`,
            status: 'preparing',
            time: 'Just now',
            itemsCount: posCart.reduce((sum, i) => sum + i.quantity, 0),
            itemsSummary: itemsSummaryText
        };

        setOrders([newOrder, ...orders]);
        setShowReceiptModal(newOrder);

        // Reset Cart
        setPosCart([]);
        setCashTendered('');
        setPosCustomerName('Walk-In Guest');
    };

    // Update Status Endpoint Handler (PATCH /orders/{id}/status)
    const updateOrderStatus = async (orderId: string | number, newStatus: OrderItem['status']) => {
        try {
            const res = await fetch(`/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            } else {
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            }
        } catch (e) {
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        }
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
                            <h1 className="text-lg font-black font-domine text-[#fbbf24] tracking-tight">Saddle Ranch Cashier POS & Employee Terminal</h1>
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

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="px-3.5 py-2.5 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-rose-400 flex items-center gap-1.5 text-xs font-bold transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </Link>
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
                                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4">
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
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
                                                <span className="font-mono">₱{(posCartTotal * 0.88).toFixed(2)}</span>
                                            </div>
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
        </>
    );
}
