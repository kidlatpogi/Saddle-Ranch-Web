import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Phone, ShoppingBag, Edit3, Trash2, LogOut, CheckCircle2, AlertCircle, Clock, ShieldAlert } from 'lucide-react';

interface CustomerAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onUpdateUser: (user: any) => void;
    onLogout: () => void;
}

export default function CustomerAccountModal({
    isOpen,
    onClose,
    user,
    onUpdateUser,
    onLogout,
}: CustomerAccountModalProps) {
    const [activeTab, setActiveTab] = useState<'history' | 'edit' | 'settings'>('history');

    // Purchase History State
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);

    // Profile Edit Form State
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone_number || '');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const [isUpdating, setIsUpdating] = useState(false);
    const [editError, setEditError] = useState('');
    const [editSuccess, setEditSuccess] = useState('');

    // Account Delete State
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone_number || '');
        }
    }, [user]);

    useEffect(() => {
        if (isOpen && activeTab === 'history') {
            fetchPurchaseHistory();
        }
    }, [isOpen, activeTab]);

    const fetchPurchaseHistory = async () => {
        setIsLoadingOrders(true);
        try {
            const res = await fetch('/api/v1/customer/orders');
            if (res.ok) {
                const json = await res.json();
                if (json.data) {
                    setOrders(json.data);
                }
            }
        } catch (e) {
            console.error('Failed to load purchase history:', e);
        } finally {
            setIsLoadingOrders(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditError('');
        setEditSuccess('');

        if (password && password !== passwordConfirmation) {
            setEditError('New password and confirmation password do not match.');
            return;
        }

        if (phone.trim() && (phone.trim().length !== 11 || !/^\d{11}$/.test(phone.trim()))) {
            setEditError('Mobile number must be exactly 11 numeric digits (e.g. 09171234567).');
            return;
        }

        setIsUpdating(true);

        try {
            const response = await fetch('/api/v1/customer/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    phone_number: phone.trim() || null,
                    password: password || undefined,
                    password_confirmation: passwordConfirmation || undefined,
                }),
            });

            const json = await response.json();

            if (response.ok && json.status === 'success') {
                setEditSuccess('Account profile updated successfully!');
                onUpdateUser(json.user);
                setPassword('');
                setPasswordConfirmation('');
            } else {
                let err = json.message;
                if (!err && json.errors) {
                    const k = Object.keys(json.errors)[0];
                    err = Array.isArray(json.errors[k]) ? json.errors[k][0] : json.errors[k];
                }
                setEditError(err || 'Failed to update account.');
            }
        } catch (err) {
            setEditError('Network error updating profile.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeletingAccount(true);
        try {
            const res = await fetch('/api/v1/customer/account/delete', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });
            if (res.ok) {
                onLogout();
                onClose();
            }
        } catch (e) {
            console.error('Account deletion error:', e);
        } finally {
            setIsDeletingAccount(false);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-xl rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col overflow-hidden">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#534434]/40 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b] font-black text-lg flex items-center justify-center">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                            <div>
                                <h3 className="text-base font-bold text-white">{user.name}</h3>
                                <p className="text-xs text-[#8c7a6b] font-mono">{user.email}</p>
                            </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-[#121213] border border-[#534434] text-[#8c7a6b] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-3 gap-2 bg-[#121213] p-1 rounded-2xl border border-[#534434]/60">
                    <button
                        type="button"
                        onClick={() => setActiveTab('history')}
                        className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            activeTab === 'history' ? 'bg-[#f59e0b] text-[#472a00] font-black shadow' : 'text-[#8c7a6b] hover:text-white'
                        }`}
                    >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Purchase History</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('edit')}
                        className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            activeTab === 'edit' ? 'bg-[#f59e0b] text-[#472a00] font-black shadow' : 'text-[#8c7a6b] hover:text-white'
                        }`}
                    >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Account Edit</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('settings')}
                        className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            activeTab === 'settings' ? 'bg-[#f59e0b] text-[#472a00] font-black shadow' : 'text-[#8c7a6b] hover:text-white'
                        }`}
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out & Delete</span>
                    </button>
                </div>

                {/* Content Container */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                    
                    {/* TAB 1: PURCHASE HISTORY */}
                    {activeTab === 'history' && (
                        <div className="space-y-3">
                            {isLoadingOrders ? (
                                <div className="p-8 text-center text-xs text-[#8c7a6b]">Loading purchase history...</div>
                            ) : orders.length === 0 ? (
                                <div className="p-8 text-center space-y-2 bg-[#121213] rounded-2xl border border-dashed border-[#534434]/60">
                                    <ShoppingBag className="w-8 h-8 text-[#8c7a6b] mx-auto opacity-50" />
                                    <p className="text-xs text-[#8c7a6b]">No past orders found for your account.</p>
                                </div>
                            ) : (
                                orders.map((order) => (
                                    <div key={order.id} className="p-3.5 rounded-2xl bg-[#121213] border border-[#534434]/60 space-y-2">
                                        <div className="flex items-center justify-between text-xs border-b border-[#534434]/40 pb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-[#f59e0b]">#{order.order_number || order.id}</span>
                                                <span className="text-[10px] text-[#8c7a6b] uppercase font-bold">{order.order_type}</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                                                order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                                                order.status === 'ready' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' :
                                                order.status === 'cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                                                'bg-amber-500/20 text-[#ffc174] border border-amber-500/40'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="text-xs space-y-1">
                                            {order.order_items && order.order_items.map((item: any) => (
                                                <div key={item.id} className="flex justify-between text-[#d8c3ad]">
                                                    <span>{item.quantity}x {item.product?.name || 'Item'}</span>
                                                    <span className="font-mono">₱{(Number(item.price) * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-[#534434]/40 text-xs">
                                            <span className="text-[10px] text-[#8c7a6b]">
                                                {order.created_at ? new Date(order.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                            <span className="font-bold text-[#ffc174] font-mono text-sm">
                                                Total: ₱{parseFloat(order.total_amount || 0).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* TAB 2: ACCOUNT EDIT */}
                    {activeTab === 'edit' && (
                        <form onSubmit={handleUpdateProfile} className="space-y-3.5">
                            {editError && (
                                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{editError}</span>
                                </div>
                            )}

                            {editSuccess && (
                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    <span>{editSuccess}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-[11px] font-bold text-[#d8c3ad] mb-1">Full Name *</label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-[#8c7a6b] absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-[#d8c3ad] mb-1">Mobile Number (11 digits)</label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 text-[#8c7a6b] absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="tel"
                                        maxLength={11}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                                        placeholder="09171234567"
                                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-[#534434]/40 pt-3 space-y-3">
                                <span className="block text-xs font-bold text-[#ffc174]">Change Password (Leave blank to keep current)</span>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#d8c3ad] mb-1">New Password</label>
                                    <div className="relative">
                                        <Lock className="w-4 h-4 text-[#8c7a6b] absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="password"
                                            minLength={8}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-[#d8c3ad] mb-1">Confirm New Password</label>
                                    <div className="relative">
                                        <Lock className="w-4 h-4 text-[#8c7a6b] absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="password"
                                            minLength={8}
                                            value={passwordConfirmation}
                                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                                            placeholder="Re-enter new password..."
                                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full py-3 rounded-2xl bg-[#f59e0b] hover:bg-[#ffc174] disabled:opacity-40 text-[#472a00] font-black text-xs uppercase tracking-wider transition-all btn-bevel cursor-pointer"
                            >
                                {isUpdating ? 'Saving Changes...' : 'Save Profile Changes'}
                            </button>
                        </form>
                    )}

                    {/* TAB 3: SETTINGS (SIGN-OUT & DELETE ACCOUNT) */}
                    {activeTab === 'settings' && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-[#121213] border border-[#534434]/60 space-y-3">
                                <div>
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Account Sign Out</h4>
                                    <p className="text-[11px] text-[#8c7a6b] mt-0.5">End your current session on this device.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onLogout();
                                        onClose();
                                    }}
                                    className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 border border-amber-500/40 text-amber-300 hover:text-[#3f2000] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out Customer Account</span>
                                </button>
                            </div>

                            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                                <div>
                                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <ShieldAlert className="w-4 h-4 text-rose-400" /> Danger Zone: Delete Account
                                    </h4>
                                    <p className="text-[11px] text-rose-300/80 mt-0.5">
                                        Permanently remove your account and credentials from Saddle Ranch. This action cannot be undone.
                                    </p>
                                </div>

                                {!showDeleteConfirm ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 border border-rose-500/40 text-rose-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete My Account</span>
                                    </button>
                                ) : (
                                    <div className="p-3 rounded-xl bg-rose-900/40 border border-rose-500/60 space-y-3 text-center animate-in fade-in duration-200">
                                        <p className="text-xs text-rose-200 font-bold">Are you sure you want to permanently delete your account?</p>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowDeleteConfirm(false)}
                                                className="flex-1 py-2 rounded-xl bg-[#1A1A1B] text-zinc-300 font-bold text-xs cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleDeleteAccount}
                                                disabled={isDeletingAccount}
                                                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                                            >
                                                {isDeletingAccount ? 'Deleting...' : 'Yes, Delete Permanently'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
