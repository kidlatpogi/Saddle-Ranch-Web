import React from 'react';
import { ShieldCheck, Lock, EyeOff, UserCheck, X } from 'lucide-react';

interface PrivacyPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200000] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl sm:rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 text-[#f0e0d1] max-h-[92vh] overflow-y-auto font-sans relative">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#3D3126] pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#ffc174] flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-domine text-lg font-bold text-[#ffc174]">
                                Privacy & Data Safety
                            </h3>
                            <p className="text-xs text-[#d8c3ad]">Your trust and data security are our top priorities</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-[#d8c3ad] hover:text-white hover:bg-[#31281f] rounded-lg transition-colors"
                        title="Close Policy Modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="space-y-4 text-xs leading-relaxed">
                    <div className="p-3.5 rounded-2xl bg-[#121213] border border-[#3D3126] flex items-start gap-3">
                        <Lock className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-[#ffc174] mb-0.5">Encrypted & Secure Storage</h4>
                            <p className="text-[#d8c3ad]">
                                All customer personal details, phone numbers, and delivery addresses are transmitted via HTTPS encryption and stored using industry-standard database protection.
                            </p>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#121213] border border-[#3D3126] flex items-start gap-3">
                        <EyeOff className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-emerald-400 mb-0.5">Zero Third-Party Data Selling</h4>
                            <p className="text-[#d8c3ad]">
                                We never sell, lease, or share your personal data with third-party advertisers. Your information is used strictly to fulfill food orders and manage your account.
                            </p>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#121213] border border-[#3D3126] flex items-start gap-3">
                        <UserCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-amber-400 mb-0.5">100% Optional Account Creation</h4>
                            <p className="text-[#d8c3ad]">
                                Creating an account is completely optional. Guest checkout is always supported. Account creation allows you to save delivery addresses and view full order history for fast future checkouts.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-[#f59e0b] text-[#472a00] font-black text-xs uppercase tracking-wider hover:bg-[#ffc174] transition-all btn-bevel"
                    >
                        Understood & Close
                    </button>
                </div>
            </div>
        </div>
    );
}
