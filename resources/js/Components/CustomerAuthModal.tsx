import React, { useEffect, useState } from 'react';
import { X, User, Mail, Lock, Phone, CheckCircle2, AlertCircle, LogIn, UserPlus, KeyRound, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface CustomerAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (user: any) => void;
}

type AuthMode = 'login' | 'register' | 'verify' | 'forgot' | 'reset';

const RESEND_COOLDOWN_DEFAULT = 60;

function csrfHeaders(): HeadersInit {
    return {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
    };
}

export default function CustomerAuthModal({ isOpen, onClose, onSuccess }: CustomerAuthModalProps) {
    const [mode, setMode] = useState<AuthMode>('login');

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regPasswordConfirmation, setRegPasswordConfirmation] = useState('');

    const [verifyEmail, setVerifyEmail] = useState('');
    const [verifyCode, setVerifyCode] = useState('');

    const [forgotEmail, setForgotEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [resetPassword, setResetPassword] = useState('');
    const [resetPasswordConfirmation, setResetPasswordConfirmation] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [debugCode, setDebugCode] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegPassword, setShowRegPassword] = useState(false);
    const [showRegPasswordConfirm, setShowRegPasswordConfirm] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showResetPasswordConfirm, setShowResetPasswordConfirm] = useState(false);

    const resetForm = () => {
        setMode('login');
        setLoginEmail('');
        setLoginPassword('');
        setRegName('');
        setRegEmail('');
        setRegPhone('');
        setRegPassword('');
        setRegPasswordConfirmation('');
        setVerifyEmail('');
        setVerifyCode('');
        setForgotEmail('');
        setResetCode('');
        setResetPassword('');
        setResetPasswordConfirmation('');
        setIsSubmitting(false);
        setErrorMsg('');
        setSuccessMsg('');
        setDebugCode('');
        setResendCooldown(0);
        setShowLoginPassword(false);
        setShowRegPassword(false);
        setShowRegPasswordConfirm(false);
        setShowResetPassword(false);
        setShowResetPasswordConfirm(false);
    };

    // Modal stays mounted while closed — clear leftover verify/login state on each open.
    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen]);

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = window.setTimeout(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
        return () => window.clearTimeout(timer);
    }, [resendCooldown]);

    if (!isOpen) return null;

    const startResendCooldown = (seconds?: number) => {
        setResendCooldown(Math.max(0, seconds ?? RESEND_COOLDOWN_DEFAULT));
    };

    const applyDebugCode = (json: any, fill: 'verify' | 'reset') => {
        if (json?.debug_code) {
            setDebugCode(String(json.debug_code));
            if (fill === 'verify') setVerifyCode(String(json.debug_code));
            if (fill === 'reset') setResetCode(String(json.debug_code));
        } else {
            setDebugCode('');
        }
    };

    const goMode = (next: AuthMode) => {
        setMode(next);
        setErrorMsg('');
        setSuccessMsg('');
        if (next !== 'verify' && next !== 'reset') {
            setDebugCode('');
            setResendCooldown(0);
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/v1/customer/login', {
                method: 'POST',
                headers: csrfHeaders(),
                body: JSON.stringify({
                    email: loginEmail.trim(),
                    password: loginPassword,
                }),
            });

            const json = await response.json();

            if (json.status === 'needs_verification' || json.requires_email_verification || json.needs_verification) {
                setVerifyEmail(json.email || loginEmail.trim());
                setVerifyCode('');
                applyDebugCode(json, 'verify');
                startResendCooldown(json.retry_after ?? RESEND_COOLDOWN_DEFAULT);
                setMode('verify');
                setErrorMsg('');
                setSuccessMsg(json.message || 'Enter the 6-digit code sent to your email.');
                return;
            }

            if (response.ok && json.status === 'success') {
                setSuccessMsg('Logged in successfully!');
                setTimeout(() => {
                    onSuccess(json.user);
                    onClose();
                }, 400);
            } else {
                setErrorMsg(json.message || 'Invalid email or password.');
            }
        } catch {
            setErrorMsg('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (regPassword !== regPasswordConfirmation) {
            setErrorMsg('Account password and confirmation password do not match.');
            return;
        }

        if (regPhone.trim() && (regPhone.trim().length !== 11 || !/^\d{11}$/.test(regPhone.trim()))) {
            setErrorMsg('Mobile number must be exactly 11 numeric digits (e.g. 09171234567).');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/v1/customer/register', {
                method: 'POST',
                headers: csrfHeaders(),
                body: JSON.stringify({
                    name: regName.trim(),
                    email: regEmail.trim(),
                    phone_number: regPhone.trim() || null,
                    password: regPassword,
                    password_confirmation: regPasswordConfirmation,
                }),
            });

            const json = await response.json();

            if (
                (response.ok || response.status === 201)
                && (json.status === 'needs_verification' || json.requires_email_verification || json.needs_verification)
            ) {
                setVerifyEmail(json.email || regEmail.trim());
                setVerifyCode('');
                applyDebugCode(json, 'verify');
                startResendCooldown(json.retry_after ?? RESEND_COOLDOWN_DEFAULT);
                setMode('verify');
                setErrorMsg('');
                setSuccessMsg(json.message || 'Enter the 6-digit code sent to your email.');
            } else if (response.ok && json.status === 'success' && !json.requires_email_verification) {
                setSuccessMsg('Account created and logged in!');
                setTimeout(() => {
                    onSuccess(json.user);
                    onClose();
                }, 400);
            } else {
                const firstError = json.errors ? (Object.values(json.errors)[0] as string[])?.[0] : null;
                setErrorMsg(json.message || firstError || 'Registration failed.');
            }
        } catch {
            setErrorMsg('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/v1/customer/verify-email', {
                method: 'POST',
                headers: csrfHeaders(),
                body: JSON.stringify({
                    email: verifyEmail.trim(),
                    code: verifyCode.trim(),
                }),
            });
            const json = await response.json();

            if (response.ok && json.status === 'success') {
                setSuccessMsg('Email verified! You are signed in.');
                setTimeout(() => {
                    onSuccess(json.user);
                    onClose();
                }, 400);
            } else {
                setErrorMsg(json.message || 'Invalid verification code.');
            }
        } catch {
            setErrorMsg('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendCode = async () => {
        if (resendCooldown > 0 || isSubmitting) return;
        setErrorMsg('');
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/v1/customer/resend-verification', {
                method: 'POST',
                headers: csrfHeaders(),
                body: JSON.stringify({ email: verifyEmail.trim() }),
            });
            const json = await response.json();
            if (response.ok) {
                applyDebugCode(json, 'verify');
                startResendCooldown(json.retry_after ?? RESEND_COOLDOWN_DEFAULT);
                setSuccessMsg(json.message || 'A new code was sent.');
            } else if (response.status === 429) {
                startResendCooldown(json.retry_after ?? RESEND_COOLDOWN_DEFAULT);
                setErrorMsg(json.message || 'Please wait before requesting a new code.');
            } else {
                setErrorMsg(json.message || 'Could not resend code.');
            }
        } catch {
            setErrorMsg('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/v1/customer/forgot-password', {
                method: 'POST',
                headers: csrfHeaders(),
                body: JSON.stringify({ email: forgotEmail.trim() }),
            });
            const json = await response.json();

            if (response.ok && json.status === 'success') {
                setResetCode('');
                setResetPassword('');
                setResetPasswordConfirmation('');
                applyDebugCode(json, 'reset');
                setMode('reset');
                setErrorMsg('');
                setSuccessMsg(json.message || 'Check your email for a 6-digit code.');
            } else {
                setErrorMsg(json.message || 'Could not send reset code.');
            }
        } catch {
            setErrorMsg('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (resetPassword !== resetPasswordConfirmation) {
            setErrorMsg('New password and confirmation do not match.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/v1/customer/reset-password', {
                method: 'POST',
                headers: csrfHeaders(),
                body: JSON.stringify({
                    email: forgotEmail.trim(),
                    code: resetCode.trim(),
                    password: resetPassword,
                    password_confirmation: resetPasswordConfirmation,
                }),
            });
            const json = await response.json();

            if (response.ok && json.status === 'success') {
                setSuccessMsg('Password updated! You are signed in.');
                setTimeout(() => {
                    onSuccess(json.user);
                    onClose();
                }, 400);
            } else {
                setErrorMsg(json.message || 'Could not reset password.');
            }
        } catch {
            setErrorMsg('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const title =
        mode === 'verify' ? 'Verify Email' :
        mode === 'forgot' ? 'Forgot Password' :
        mode === 'reset' ? 'Reset Password' :
        'Customer Portal';

    const subtitle =
        mode === 'verify' ? `Enter the 6-digit code sent to ${verifyEmail}` :
        mode === 'forgot' ? 'We will email you a 6-digit reset code' :
        mode === 'reset' ? `Enter the code sent to ${forgotEmail}` :
        'Sign in or register to use coupons';

    return (
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-5 sm:p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">

                <div className="flex items-center justify-between pb-3 border-b border-[#534434]/50">
                    <div>
                        <h3 className="text-base font-black text-white font-domine tracking-tight">{title}</h3>
                        <p className="text-[11px] text-[#d8c3ad]">{subtitle}</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-[#261e15] hover:bg-[#3d2f21] text-[#d8c3ad] hover:text-white flex items-center justify-center transition-colors"
                        aria-label="Close Modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {(mode === 'login' || mode === 'register') && (
                    <div className="grid grid-cols-2 gap-2 bg-[#121213] p-1 rounded-2xl border border-[#534434]/40">
                        <button
                            type="button"
                            onClick={() => goMode('login')}
                            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${mode === 'login'
                                ? 'bg-[#f59e0b] text-[#472a00] font-black shadow-md'
                                : 'text-[#8c7a6b] hover:text-[#d8c3ad]'
                            }`}
                        >
                            <LogIn className="w-3.5 h-3.5" /> Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => goMode('register')}
                            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${mode === 'register'
                                ? 'bg-[#f59e0b] text-[#472a00] font-black shadow-md'
                                : 'text-[#8c7a6b] hover:text-[#d8c3ad]'
                            }`}
                        >
                            <UserPlus className="w-3.5 h-3.5" /> Create Account
                        </button>
                    </div>
                )}

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

                {debugCode && (mode === 'verify' || mode === 'reset') && (
                    <div className="p-3 rounded-2xl bg-[#f59e0b]/15 border border-[#f59e0b]/40 text-[#ffc174] text-xs font-semibold space-y-1">
                        <p className="uppercase tracking-wider text-[10px] font-black text-[#f59e0b]">Local test code</p>
                        <p className="text-2xl tracking-[0.35em] font-black text-white text-center">{debugCode}</p>
                        <p className="text-[10px] text-[#8c7a6b] text-center">Local only. Configure Gmail in .env to receive codes in your inbox.</p>
                    </div>
                )}

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
                                <Lock className="w-4 h-4 text-[#8c7a6b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-[1]" />
                                <input
                                    type={showLoginPassword ? 'text' : 'password'}
                                    required
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-11 py-2.5 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowLoginPassword((v) => !v)}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-[#ffc174] hover:bg-[#261e15] hover:text-white"
                                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setForgotEmail(loginEmail);
                                goMode('forgot');
                            }}
                            className="text-[11px] text-[#f59e0b] hover:text-[#ffc174] font-bold"
                        >
                            Forgot password?
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 rounded-2xl bg-[#f59e0b] hover:bg-[#ffc174] disabled:opacity-40 text-[#472a00] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#f59e0b]/20 transition-all btn-bevel cursor-pointer"
                        >
                            {isSubmitting ? 'Signing In...' : 'Sign In to Apply Coupons'}
                        </button>
                    </form>
                )}

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
                                <Lock className="w-4 h-4 text-[#8c7a6b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-[1]" />
                                <input
                                    type={showRegPassword ? 'text' : 'password'}
                                    required
                                    minLength={8}
                                    value={regPassword}
                                    onChange={(e) => setRegPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-11 py-2.5 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowRegPassword((v) => !v)}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-[#ffc174] hover:bg-[#261e15] hover:text-white"
                                    aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-[#d8c3ad] mb-1">Confirm Password *</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-[#8c7a6b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-[1]" />
                                <input
                                    type={showRegPasswordConfirm ? 'text' : 'password'}
                                    required
                                    minLength={8}
                                    value={regPasswordConfirmation}
                                    onChange={(e) => setRegPasswordConfirmation(e.target.value)}
                                    placeholder="Re-enter password..."
                                    className="w-full pl-9 pr-11 py-2.5 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowRegPasswordConfirm((v) => !v)}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-[#ffc174] hover:bg-[#261e15] hover:text-white"
                                    aria-label={showRegPasswordConfirm ? 'Hide password' : 'Show password'}
                                >
                                    {showRegPasswordConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 rounded-2xl bg-[#f59e0b] hover:bg-[#ffc174] disabled:opacity-40 text-[#472a00] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#f59e0b]/20 transition-all btn-bevel cursor-pointer"
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create Account & Verify Email'}
                        </button>
                    </form>
                )}

                {mode === 'verify' && (
                    <form onSubmit={handleVerifySubmit} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-bold text-[#d8c3ad] mb-1">6-Digit Code</label>
                            <div className="relative">
                                <KeyRound className="w-4 h-4 text-[#8c7a6b] absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    required
                                    maxLength={6}
                                    value={verifyCode}
                                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="000000"
                                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#121213] border border-[#534434] text-sm tracking-[0.35em] text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || verifyCode.length !== 6}
                            className="w-full py-3.5 rounded-2xl bg-[#f59e0b] hover:bg-[#ffc174] disabled:opacity-40 text-[#472a00] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#f59e0b]/20 transition-all btn-bevel cursor-pointer"
                        >
                            {isSubmitting ? 'Verifying...' : 'Verify Account'}
                        </button>

                        <div className="flex items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => goMode('login')}
                                className="text-[11px] text-[#8c7a6b] hover:text-[#d8c3ad] font-bold inline-flex items-center gap-1"
                            >
                                <ArrowLeft className="w-3 h-3" /> Back to Sign In
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting || resendCooldown > 0}
                                onClick={handleResendCode}
                                className="text-[11px] text-[#f59e0b] hover:text-[#ffc174] font-bold disabled:opacity-40 disabled:hover:text-[#f59e0b]"
                            >
                                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                            </button>
                        </div>
                    </form>
                )}

                {mode === 'forgot' && (
                    <form onSubmit={handleForgotSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-bold text-[#d8c3ad] mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-[#8c7a6b] absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    required
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 rounded-2xl bg-[#f59e0b] hover:bg-[#ffc174] disabled:opacity-40 text-[#472a00] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#f59e0b]/20 transition-all btn-bevel cursor-pointer"
                        >
                            {isSubmitting ? 'Sending Code...' : 'Send Reset Code'}
                        </button>

                        <button
                            type="button"
                            onClick={() => goMode('login')}
                            className="text-[11px] text-[#8c7a6b] hover:text-[#d8c3ad] font-bold inline-flex items-center gap-1"
                        >
                            <ArrowLeft className="w-3 h-3" /> Back to Sign In
                        </button>
                    </form>
                )}

                {mode === 'reset' && (
                    <form onSubmit={handleResetSubmit} className="space-y-3.5">
                        <div>
                            <label className="block text-[11px] font-bold text-[#d8c3ad] mb-1">6-Digit Code</label>
                            <div className="relative">
                                <KeyRound className="w-4 h-4 text-[#8c7a6b] absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    required
                                    maxLength={6}
                                    value={resetCode}
                                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="000000"
                                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#121213] border border-[#534434] text-sm tracking-[0.35em] text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-[#d8c3ad] mb-1">New Password *</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-[#8c7a6b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-[1]" />
                                <input
                                    type={showResetPassword ? 'text' : 'password'}
                                    required
                                    minLength={8}
                                    value={resetPassword}
                                    onChange={(e) => setResetPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-11 py-2.5 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowResetPassword((v) => !v)}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-[#ffc174] hover:bg-[#261e15] hover:text-white"
                                    aria-label={showResetPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-[#d8c3ad] mb-1">Confirm New Password *</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-[#8c7a6b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-[1]" />
                                <input
                                    type={showResetPasswordConfirm ? 'text' : 'password'}
                                    required
                                    minLength={8}
                                    value={resetPasswordConfirmation}
                                    onChange={(e) => setResetPasswordConfirmation(e.target.value)}
                                    placeholder="Re-enter password..."
                                    className="w-full pl-9 pr-11 py-2.5 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowResetPasswordConfirm((v) => !v)}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-[#ffc174] hover:bg-[#261e15] hover:text-white"
                                    aria-label={showResetPasswordConfirm ? 'Hide password' : 'Show password'}
                                >
                                    {showResetPasswordConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || resetCode.length !== 6}
                            className="w-full py-3.5 rounded-2xl bg-[#f59e0b] hover:bg-[#ffc174] disabled:opacity-40 text-[#472a00] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#f59e0b]/20 transition-all btn-bevel cursor-pointer"
                        >
                            {isSubmitting ? 'Updating...' : 'Reset Password & Sign In'}
                        </button>

                        <button
                            type="button"
                            onClick={() => goMode('forgot')}
                            className="text-[11px] text-[#8c7a6b] hover:text-[#d8c3ad] font-bold inline-flex items-center gap-1"
                        >
                            <ArrowLeft className="w-3 h-3" /> Resend to another email
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
