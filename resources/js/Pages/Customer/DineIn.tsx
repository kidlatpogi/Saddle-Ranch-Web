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
    ShoppingCart
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

export default function DineInOrder({ products = [], tableNumber: initialTableNumber = '05' }: DineInProps) {
    const { flash } = usePage<PageProps>().props;

    const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const urlTable = queryParams.get('table');
    const tableNumber = urlTable || initialTableNumber || '05';

    const [fulfillmentMode, setFulfillmentMode] = useState<'dine_in' | 'express_takeout'>('dine_in');
    const [customerName, setCustomerName] = useState('');
    const [specialNotes, setSpecialNotes] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [completedOrder, setCompletedOrder] = useState<any>(null);

    const { cart, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount } = useCart();

    const getProductImage = (p: Product) => {
        if (p.image_path && p.image_path.startsWith('http')) return p.image_path;
        if (p.name.toLowerCase().includes('sisig')) {
            return 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t';
        }
        if (p.name.toLowerCase().includes('steak') || p.name.toLowerCase().includes('t-bone')) {
            return 'https://lh3.googleusercontent.com/aida-public/AB6AXuASVSO6N3lzIbdlCDT85viSxOZiQKjWADlA5k7ymludjTdSCB7tqV0bZvXRba3-L4gemLyqy9PxmqnYMBnSsxb5yfI_XM-qajS5ZEnS1Am8OBu5uN8_smBFlDdy4xR0UNE8jDFJP8vNSRQcqqDSG4p-oDij5kCvWALcyBZVeuA1QdnqC9a6I5s9l2ba3Zjfe0xSPjMr0jLCAB1z-oJS5xBL9meeUeFsmiMgjQ96VoXotgHsy3Jl3d9NQIv1liJsKeu_sJec2rrkNziY';
        }
        if (p.name.toLowerCase().includes('bulalo')) {
            return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCatSLXJ-mynm_AwjLXsdG9xKbMwziehShgiNtyXaX2NZEeZFhSXaTmHMgLuACAitSC3WZ0g_9lSTavvnqO4eKFlaC0pnnA9OngEMtRicl0vfSF2_t4WqzxTKxW-H-X0i_tppiClzEOZ-fAuu1ezCbRVOcdVdwZHokttY1ATDIO4BuA185dwrm0QDuPpYjQ7qD9ybH5bl0WPn1wHJ3S5pB6JuCOoocWTfZ95cB0Lfqx1KbjbUwqGJxkhwxmqypEJta64yq1PajT3oWC';
        }
        if (p.name.toLowerCase().includes('chicken')) {
            return 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6QEUONokTX7mi1M1Wrie14cxeoNfVq5HyIS1sLOLWKbzZyh6OfegCBaNeH6E7uS37ugVc6jjmILNzIrmvE0tpXkOBCDP29HO1WZL69MsOd6lpwp4oX6ezfDjuAsLMCu57vBpiHDupWu3yDATuk2k_HgpQMi23Y7mifgQKqPJhc0GqDXCCk1tPooIkFyBCXPiESBHm8HKF8cp1ctvD0RZ39YNVxKG_2cPaPyfryUGBbaoIHhqqhq5R9BflPtI6jMfzsP3W6QStlttx';
        }
        if (p.name.toLowerCase().includes('rice') || p.name.toLowerCase().includes('pepper')) {
            return 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT2sso9NgKHiCPPIkIfBBCfPNPUK_dgit8ctI0rtoMT_bXyQ21nRcx3ViyVnDNZTyTCVtYOSFJ8h_h3ZG451V7vUFX1LFMWyd6wQrV-4pevn9wO0H-wUZVYl0TBSwWt_bbQikBKmtygbJeYfSzWbAOcd32EpNo8TCvpmAamQoFlFfNvHrmpn32aUcJ7gi5IGdK9xpTad7qU6dSRSu2bty13h9_T3_GKF3mMrUI31pUXtjCvVgiLfQIkBBbjU_zY5SS0IrP8nvbh7QQ';
        }
        return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl';
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
            setValidationError('Your table order cart is empty. Add sizzling items before checking out.');
            return;
        }

        setIsSubmitting(true);

        const payload = {
            order_type: fulfillmentMode,
            table_number: tableNumber,
            customer_name: customerName.trim() ? customerName : 'Seated Guest',
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
            <Head title={`Table ${tableNumber} Ordering | Saddle Ranch`} />

            <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-orange-500 selection:text-white">
                {/* Sticky Header with Locked Table Badge */}
                <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-black text-white">Saddle Ranch Table Menu</h1>
                                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs uppercase tracking-wider border border-amber-500/40 flex items-center gap-1.5 shadow-sm animate-pulse">
                                        <QrCode className="w-3.5 h-3.5 text-amber-400" />
                                        Seated at Table {tableNumber}
                                    </span>
                                </div>
                                <p className="text-xs text-stone-400">Piping hot sizzling plates served straight to your table</p>
                            </div>
                        </div>

                        {/* Mode Selector (Dine-In Service vs Express In-Store Takeout) */}
                        <div className="hidden sm:flex items-center p-1 rounded-2xl bg-stone-950 border border-stone-800">
                            <button
                                onClick={() => setFulfillmentMode('dine_in')}
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    fulfillmentMode === 'dine_in'
                                        ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                                        : 'text-stone-400 hover:text-stone-200'
                                }`}
                            >
                                <Utensils className="w-3.5 h-3.5" />
                                <span>Table Service</span>
                            </button>
                            <button
                                onClick={() => setFulfillmentMode('express_takeout')}
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    fulfillmentMode === 'express_takeout'
                                        ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                                        : 'text-stone-400 hover:text-stone-200'
                                }`}
                            >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Express Takeout</span>
                            </button>
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
                        {/* Table Menu Items with Images */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Flame className="w-5 h-5 text-orange-500" />
                                    <span>Sizzling Specialties (Table Order)</span>
                                </h2>
                                <span className="text-xs text-stone-400">{products.length} Items Available</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {products.map((product) => {
                                    const numPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                                    const isOutOfStock = product.stock_quantity <= 0;
                                    const cartEntry = cart.find((i) => i.product.id === product.id);
                                    const imgUrl = getProductImage(product);

                                    return (
                                        <div
                                            key={product.id}
                                            className={`p-4 rounded-2xl bg-stone-900 border flex flex-col justify-between transition-all group shadow-lg ${
                                                isOutOfStock ? 'border-stone-800/40 opacity-70' : 'border-stone-800 hover:border-amber-500/50'
                                            }`}
                                        >
                                            <div>
                                                {/* Product Image Header */}
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

                                                <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">{product.name}</h3>
                                                <p className="text-xs text-stone-400 mt-1 line-clamp-2">{product.description}</p>
                                            </div>

                                            <div className="mt-4 pt-3 border-t border-stone-800/60 flex items-center justify-between">
                                                {isOutOfStock ? (
                                                    <span className="text-[10px] font-bold text-rose-400 uppercase">Out of Stock</span>
                                                ) : (
                                                    <span className="text-[10px] text-stone-500 font-semibold">Table Service</span>
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
                                                        className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 text-amber-400 hover:text-stone-950 font-bold text-xs transition-all disabled:opacity-40"
                                                    >
                                                        Add to Table +
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Table Order Summary & Checkout Form (Right 5 Cols) */}
                        <div className="lg:col-span-5 space-y-6">
                            <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl space-y-6">
                                <div className="pb-4 border-b border-stone-800 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <ShoppingCart className="w-5 h-5 text-amber-400" />
                                            <span>Table {tableNumber} Cart</span>
                                        </h3>
                                        <p className="text-xs text-stone-400">Direct kitchen order for Table {tableNumber}</p>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                                        {itemCount} Items
                                    </span>
                                </div>

                                {/* Cart List with Thumbnail Images */}
                                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                    {cart.length === 0 ? (
                                        <div className="py-8 text-center text-stone-500 text-xs">
                                            <Utensils className="w-8 h-8 mx-auto mb-2 opacity-40 text-stone-600" />
                                            Your table cart is empty. Tap "Add to Table +" on menu items.
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

                                {/* Dine-In Fields (Address/ZIP/Delivery fee skipped) */}
                                <div className="space-y-4 pt-4 border-t border-stone-800">
                                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                                        <span className="font-bold flex items-center gap-1.5">
                                            <QrCode className="w-4 h-4 text-amber-400" />
                                            Fulfillment Locked
                                        </span>
                                        <span className="font-bold uppercase text-[10px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full">
                                            Table Service ({tableNumber})
                                        </span>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-stone-300 mb-1">Your Name (Optional)</label>
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="Guest or Table Lead Name"
                                            className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:border-amber-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-stone-300 mb-1">Special Dietary / Kitchen Instructions (Optional)</label>
                                        <textarea
                                            rows={2}
                                            value={specialNotes}
                                            onChange={(e) => setSpecialNotes(e.target.value)}
                                            placeholder="e.g. Extra hot sizzling plate, no onions, extra gravy..."
                                            className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:border-amber-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-stone-300 mb-1">Payment Method</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['Cash', 'GCash', 'Maya'].map((method) => (
                                                <button
                                                    key={method}
                                                    type="button"
                                                    onClick={() => setPaymentMethod(method)}
                                                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                                                        paymentMethod === method
                                                            ? 'bg-amber-500/20 border-amber-500 text-white'
                                                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                                                    }`}
                                                >
                                                    {method}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Total Breakdown */}
                                <div className="pt-4 border-t border-stone-800 space-y-2 text-xs">
                                    <div className="flex justify-between text-stone-400">
                                        <span>Items Subtotal</span>
                                        <span className="font-bold text-white">₱{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-stone-400">
                                        <span>Table Service Charge</span>
                                        <span className="font-bold text-emerald-400">₱0.00</span>
                                    </div>
                                    <div className="flex justify-between text-base font-black text-white pt-2 border-t border-stone-800">
                                        <span>Total Table Bill</span>
                                        <span className="text-amber-400">₱{subtotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={cart.length === 0 || isSubmitting}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 text-stone-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <span>Sending Order to Kitchen...</span>
                                    ) : (
                                        <>
                                            <Utensils className="w-4 h-4" />
                                            <span>Send Order to Kitchen (Table {tableNumber})</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </main>

                {/* Table Order Confirmation Overlay */}
                {completedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="w-full max-w-md rounded-3xl bg-stone-900 border border-stone-800 p-8 shadow-2xl text-center space-y-6">
                            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center">
                                <Utensils className="w-8 h-8 animate-bounce" />
                            </div>

                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Order Sent to Kitchen!</span>
                                <h3 className="text-2xl font-black text-white mt-1">Table {completedOrder.table_number} Service Active</h3>
                                <p className="text-xs text-stone-400 mt-1">Our chefs are preparing your sizzling plates right now.</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-left space-y-2 font-mono">
                                <div className="flex justify-between">
                                    <span className="text-stone-500">Order Number:</span>
                                    <span className="font-bold text-orange-400">{completedOrder.order_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-500">Table Number:</span>
                                    <span className="font-bold text-amber-400">Table {completedOrder.table_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-500">Status:</span>
                                    <span className="font-bold text-emerald-400 uppercase">PENDING KITCHEN</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-500">Table Total:</span>
                                    <span className="font-bold text-amber-400">₱{parseFloat(completedOrder.total_amount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-500">Payment:</span>
                                    <span className="font-bold text-white">{completedOrder.payment_method}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Link
                                    href={`/dine-in?table=${tableNumber}`}
                                    onClick={() => setCompletedOrder(null)}
                                    className="w-full py-3.5 rounded-xl bg-amber-500 text-stone-950 font-black text-xs uppercase tracking-wider hover:bg-amber-400 transition-all block"
                                >
                                    Order More Items for Table {tableNumber}
                                </Link>
                                <Link
                                    href="/"
                                    onClick={() => setCompletedOrder(null)}
                                    className="w-full py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-400 text-xs font-semibold hover:text-white transition-all block"
                                >
                                    Return to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
