import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, CheckCircle2, AlertCircle, Sparkles, UserPlus, LogIn } from 'lucide-react';

interface CustomerAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (user: any) => void;
}

export default function CustomerAuthModal({ isOpen, onClose, onSuccess }: CustomerAuthModalProps) {
    const [mode, setMode] = useState<'login' | 'register'>('login');

    // Login form state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register form state
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regPassword, setRegPassword] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    if (!isOpen) return null;

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/v1/customer/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    email: loginEmail.trim(),
                    password: loginPassword,
                }),
            });

            const json = await response.json();

            if (response.ok && json.status === 'success') {
                setSuccessMsg('Logged in successfully!');
                setTimeout(() => {
                    onSuccess(json.user);
                    onClose();
                }, 400);
            } else {
                setErrorMsg(json.message || 'Invalid email or password.');
            }
        } catch (err: any) {
            setErrorMsg('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (regPhone.trim() && (regPhone.trim().length !== 11 || !/^\d{11}$/.test(regPhone.trim()))) {
            setErrorMsg('Mobile number must be exactly 11 numeric digits (e.g. 09171234567).');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/v1/customer/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    name: regName.trim(),
                    email: regEmail.trim(),
                    phone_number: regPhone.trim() || null,
                    password: regPassword,
                }),
            });

            const json = await response.json();

            if (response.ok && json.status === 'success') {
                setSuccessMsg('Account created and logged in!');
                setTimeout(() => {
                    onSuccess(json.user);
                    onClose();
                }, 400);
            } else {
                setErrorMsg(json.message || (json.errors ? Object.values(json.errors)[0] as string : 'Registration failed.'));
            }
        } catch (err: any) {
            setErrorMsg('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-5 sm:p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">

                {/* Header with Close Button */}
                <div className="flex items-center justify-between pb-3 border-b border-[#534434]/50">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 flex items-center justify-center text-[#f59e0b]">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-white font-domine tracking-tight">Customer Portal</h3>
                            <p className="text-[11px] text-[#d8c3ad]">Sign in or register to use coupons</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-[#261e15] hover:bg-[#3d2f21] text-[#d8c3ad] hover:text-white flex items-center justify-center transition-colors"
                        aria-label="Close Modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Mode Selector Tabs */}
                <div className="grid grid-cols-2 gap-2 bg-[#121213] p-1 rounded-2xl border border-[#534434]/40">
                    <button
                        type="button"
                        onClick={() => { setMode('login'); setErrorMsg(''); }}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${mode === 'login'
                                ? 'bg-[#f59e0b] text-[#472a00] font-black shadow-md'
                                : 'text-[#8c7a6b] hover:text-[#d8c3ad]'
                            }`}
                    >
                        <LogIn className="w-3.5 h-3.5" /> Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => { setMode('register'); setErrorMsg(''); }}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${mode === 'register'
                                ? 'bg-[#f59e0b] text-[#472a00] font-black shadow-md'
                                : 'text-[#8c7a6b] hover:text-[#d8c3ad]'
                            }`}
                    >
                        <UserPlus className="w-3.5 h-3.5" /> Create Account
                    </button>
                </div>

                {/* Feedback Alerts */}
                {errorMsg && (
                    <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {successMsg && (
                    <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span>{successMsg}</span>
                    </div>
                )}

                {/* SIGN IN FORM */}
                {mode === 'login' && (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-bold text-[#d8c3ad] mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-[#8c7a6b] absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    required
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-[#d8c3ad] mb-1">Password</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-[#8c7a6b] absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    required
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 rounded-2xl bg-[#f59e0b] hover:bg-[#ffc174] disabled:opacity-40 text-[#472a00] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#f59e0b]/20 transition-all btn-bevel cursor-pointer"
                        >
                            {isSubmitting ? 'Signing In...' : 'Sign In to Apply Coupons'}
                        </button>
                    </form>
                )}

                {/* REGISTER FORM */}
                {mode === 'register' && (
                    <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                        <div>
                            <label className="block text-[11px] font-bold text-[#d8c3ad] mb-1">Full Name *</label>
                            <div className="relative">
                                <User className="w-4 h-4 text-[#8c7a6b] absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    required
                                    value={regName}
                                    onChange={(e) => setRegName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-[#d8c3ad] mb-1">Email Address *</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-[#8c7a6b] absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    required
                                    value={regEmail}
                                    onChange={(e) => setRegEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-[#d8c3ad] mb-1">Mobile Number (Optional - 11 digits)</label>
                            <div className="relative">
                                <Phone className="w-4 h-4 text-[#8c7a6b] absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="tel"
                                    maxLength={11}
                                    value={regPhone}
                                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                                    placeholder="09171234567"
                                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-[#d8c3ad] mb-1">Password (min 8 characters) *</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-[#8c7a6b] absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={regPassword}
                                    onChange={(e) => setRegPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 rounded-2xl bg-[#f59e0b] hover:bg-[#ffc174] disabled:opacity-40 text-[#472a00] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#f59e0b]/20 transition-all btn-bevel cursor-pointer"
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create Account & Continue'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
