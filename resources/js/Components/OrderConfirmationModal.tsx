import React, { useState } from 'react';
import { ShoppingBag, Truck, AlertTriangle, CheckCircle2, X, ShieldAlert, ArrowLeft, Utensils } from 'lucide-react';

interface CartItem {
    product: {
        id: number;
        name: string;
        price: number | string;
    };
    quantity: number;
}

interface OrderConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isSubmitting: boolean;
    orderType: 'pickup' | 'delivery' | 'dine_in' | 'express_takeout';
    customerName: string;
    customerPhone: string;
    deliveryAddress?: string;
    tableNumber?: string;
    paymentMethod: string;
    cart: CartItem[];
    subtotal: number;
    discount: number;
    finalTotal: number;
}

export default function OrderConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    isSubmitting,
    orderType,
    customerName,
    customerPhone,
    deliveryAddress,
    tableNumber,
    paymentMethod,
    cart,
    subtotal,
    discount,
    finalTotal,
}: OrderConfirmationModalProps) {
    const [hasAgreed, setHasAgreed] = useState(false);

    React.useEffect(() => {
        if (isOpen) {
            setHasAgreed(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const getOrderTypeLabel = () => {
        switch (orderType) {
            case 'delivery': return 'Home Delivery';
            case 'pickup': return 'Pick-Up (Takeout)';
            case 'dine_in': return `Dine-In (Table #${tableNumber || '05'})`;
            case 'express_takeout': return `Express Takeout (Table #${tableNumber || '05'})`;
            default: return 'Order';
        }
    };

    return (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-5 sm:p-6 shadow-2xl space-y-4 text-[#f0e0d1] max-h-[90vh] overflow-y-auto font-sans">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#3D3126] pb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#b45309] flex items-center justify-center text-[#3f2000] shadow-md shadow-[#f59e0b]/20 shrink-0">
                            {orderType === 'delivery' ? <Truck className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className="font-domine text-base sm:text-lg font-bold text-[#ffc174]">
                                Confirm Your Order
                            </h3>
                            <p className="text-[11px] text-[#d8c3ad]">{getOrderTypeLabel()} • Saddle Ranch</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-1.5 text-[#d8c3ad] hover:text-white hover:bg-[#31281f] rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* CRITICAL NON-REFUNDABLE NOTICE */}
                <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-[#ffc174] space-y-1.5 shadow-sm">
                    <div className="flex items-center gap-2 font-bold text-xs text-white">
                        <ShieldAlert className="w-4 h-4 text-[#f59e0b] shrink-0" />
                        <span>Return & Cancellation Policy Notice</span>
                    </div>
                    <p className="text-[11px] text-[#f0e0d1]/90 leading-relaxed">
                        Please review your order details carefully before proceeding. Once your order is placed, it is immediately sent to the kitchen for fresh preparation. 
                        <strong className="text-[#fbbf24] font-bold"> Confirmed and in-process orders are strictly non-refundable and cannot be cancelled.</strong>
                    </p>
                </div>

                {/* Order Summary Box */}
                <div className="p-3.5 rounded-2xl bg-[#121213] border border-[#3D3126] space-y-2.5 text-xs">
                    <div className="flex items-center justify-between border-b border-[#262627] pb-2">
                        <span className="font-bold text-[#d8c3ad]">Recipient / Customer</span>
                        <span className="font-bold text-white truncate max-w-[200px]">{customerName || 'Guest'} ({customerPhone || 'N/A'})</span>
                    </div>

                    {orderType === 'delivery' && deliveryAddress && (
                        <div className="border-b border-[#262627] pb-2">
                            <span className="text-[10px] text-[#8c7a6b] uppercase tracking-wider block font-bold">Delivery Address</span>
                            <span className="text-[#f0e0d1] text-[11px] font-medium leading-snug">{deliveryAddress}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between border-b border-[#262627] pb-2">
                        <span className="text-[#d8c3ad]">Payment Method</span>
                        <span className="font-black text-[#fbbf24] px-2 py-0.5 rounded bg-[#261e15] border border-[#534434] text-[11px]">
                            {paymentMethod}
                        </span>
                    </div>

                    {/* Compact Items List */}
                    <div className="space-y-1 pt-1 max-h-32 overflow-y-auto">
                        <span className="text-[10px] text-[#8c7a6b] uppercase tracking-wider block font-bold">Items ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                        {cart.map((item) => (
                            <div key={item.product.id} className="flex justify-between items-center text-[11px]">
                                <span className="text-[#f0e0d1] truncate pr-2">
                                    <strong className="text-[#ffc174]">{item.quantity}x</strong> {item.product.name}
                                </span>
                                <span className="font-mono text-[#d8c3ad] shrink-0">
                                    ₱{(Number(item.product.price) * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Total Calculation */}
                    <div className="pt-2 border-t border-[#3D3126] space-y-1">
                        <div className="flex justify-between text-[11px] text-[#d8c3ad]">
                            <span>Subtotal</span>
                            <span className="font-mono">₱{subtotal.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-[11px] text-emerald-400 font-bold">
                                <span>Promo Discount</span>
                                <span className="font-mono">- ₱{discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm font-black text-white pt-1 border-t border-[#262627]">
                            <span>Total Amount</span>
                            <span className="text-[#ffc174] font-mono text-base">₱{finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Agreement Checkbox */}
                <label className="flex items-start gap-2.5 p-2 rounded-xl bg-[#121213]/60 border border-[#262627] cursor-pointer">
                    <input
                        type="checkbox"
                        checked={hasAgreed}
                        onChange={(e) => setHasAgreed(e.target.checked)}
                        className="mt-0.5 rounded border-[#534434] bg-[#1A1A1B] text-[#f59e0b] focus:ring-[#f59e0b]"
                    />
                    <span className="text-[11px] text-[#d8c3ad] leading-tight select-none">
                        I understand and agree that confirmed orders are immediately cooked fresh and are strictly non-refundable and non-cancellable.
                    </span>
                </label>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-[#261e15] border border-[#534434] hover:bg-[#31281f] text-[#d8c3ad] hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Edit Cart</span>
                    </button>
                    <button
                        type="button"
                        disabled={!hasAgreed || isSubmitting}
                        onClick={onConfirm}
                        className="flex-1 py-3 rounded-xl bg-[#f59e0b] hover:bg-[#ffc174] disabled:opacity-40 text-[#472a00] font-black text-xs uppercase tracking-wider shadow-xl shadow-[#f59e0b]/20 transition-all btn-bevel cursor-pointer flex items-center justify-center gap-1.5"
                    >
                        {isSubmitting ? (
                            <span>Placing Order...</span>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Confirm & Place Order</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
