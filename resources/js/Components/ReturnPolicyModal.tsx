import React from 'react';
import { RotateCcw, AlertTriangle, CheckCircle2, Clock, Utensils, X, ShieldAlert, Phone } from 'lucide-react';

interface ReturnPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReturnPolicyModal({ isOpen, onClose }: ReturnPolicyModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-6 shadow-2xl space-y-5 text-[#f0e0d1] max-h-[90vh] overflow-y-auto font-sans">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#3D3126] pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#ffc174] flex items-center justify-center shrink-0">
                            <RotateCcw className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-domine text-lg font-bold text-[#ffc174]">
                                Return & Cancellation Policy
                            </h3>
                            <p className="text-xs text-[#d8c3ad]">Standard Roadhouse Kitchen & Fulfillment Terms</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-[#d8c3ad] hover:text-white hover:bg-[#31281f] rounded-lg transition-colors cursor-pointer"
                        title="Close Return Policy"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Important Notice Alert */}
                <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-[#ffc174] text-xs flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold block text-white">Orders are Cooked Fresh to Order</span>
                        <span>Because our sizzling dishes and Filipino cuisines are prepared on cast-iron platters immediately upon confirmation, confirmed and in-process orders cannot be cancelled or refunded.</span>
                    </div>
                </div>

                {/* Policy Clauses */}
                <div className="space-y-3.5 text-xs leading-relaxed">
                    <div className="p-3.5 rounded-2xl bg-[#121213] border border-[#3D3126] flex items-start gap-3">
                        <Utensils className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-[#ffc174] mb-0.5">1. Non-Refundable Processed Orders</h4>
                            <p className="text-[#d8c3ad]">
                                Once an order is confirmed by customer checkout and accepted by our kitchen staff, preparation begins immediately. Completed, ready, or dispatched orders are strictly non-refundable and cannot be cancelled.
                            </p>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#121213] border border-[#3D3126] flex items-start gap-3">
                        <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-emerald-400 mb-0.5">2. Order Discrepancies & Quality Concerns</h4>
                            <p className="text-[#d8c3ad]">
                                If you receive an incorrect dish, missing item, or experience a quality concern, please notify our branch management within <strong className="text-white">30 minutes</strong> of receiving your order with a photo of the receipt and food.
                            </p>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#121213] border border-[#3D3126] flex items-start gap-3">
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-rose-400 mb-0.5">3. Food Safety & Hygiene Standards</h4>
                            <p className="text-[#d8c3ad]">
                                In compliance with Philippine Food Safety protocols (RA 10611), cooked meals that have left our store premises or dining tables cannot be returned for restock or exchange once received.
                            </p>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#121213] border border-[#3D3126] flex items-start gap-3">
                        <Phone className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-blue-400 mb-0.5">4. Branch Direct Support</h4>
                            <p className="text-[#d8c3ad]">
                                For immediate assistance or order status inquiries, reach out directly to Bulihan Branch (0917 123 4567) or Dasmariñas Branch (0918 987 6543).
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-[#f59e0b] text-[#472a00] font-black text-xs uppercase tracking-wider hover:bg-[#ffc174] transition-all btn-bevel cursor-pointer"
                    >
                        I Understand & Close
                    </button>
                </div>
            </div>
        </div>
    );
}
