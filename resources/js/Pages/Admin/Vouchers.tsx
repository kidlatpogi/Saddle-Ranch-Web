import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
    Ticket, 
    Plus, 
    X, 
    ArrowLeft, 
    Trash2,
    Calendar,
    DollarSign,
    Percent
} from 'lucide-react';

interface VoucherItem {
    id: number;
    code: string;
    discount_type: 'percentage' | 'fixed';
    value: number;
    min_spend: number;
    branch?: 'all' | 'bulihan' | 'dasmarinas';
    expires_at?: string;
}

interface VouchersProps {
    vouchers: VoucherItem[];
}

export default function AdminVouchers({ vouchers = [] }: VouchersProps) {
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        code: '',
        discount_type: 'fixed' as 'fixed' | 'percentage',
        value: '',
        min_spend: '0',
        branch: 'all',
        expires_at: '',
    });

    const openAddModal = () => {
        reset();
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/vouchers', {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this voucher code?')) {
            router.delete(`/admin/vouchers/${id}`);
        }
    };

    return (
        <>
            <Head title="Admin Vouchers & Discounts | Saddle Ranch" />

            <div className="min-h-screen bg-[#141416] text-[#f4f4f5] font-sans flex flex-col">
                <header className="h-20 bg-[#1f1f23] border-b border-[#333338] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#b45309] flex items-center justify-center shadow-md shadow-[#f59e0b]/20">
                            <Ticket className="w-6 h-6 text-[#3f2000]" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black font-domine text-white tracking-tight">Voucher & Coupon Codes</h1>
                            <p className="text-xs text-[#a1a1aa]">Marketing Promotions & Checkout Discounts</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/dashboard"
                            className="px-4 py-2 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-white flex items-center gap-1.5 text-xs font-bold transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Return to Dashboard</span>
                        </Link>

                        <button
                            onClick={openAddModal}
                            className="px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Voucher Code</span>
                        </button>
                    </div>
                </header>

                <main className="max-w-[1600px] w-full mx-auto p-6 space-y-6 flex-1">
                    <div className="p-6 rounded-3xl bg-[#202024] border border-[#333338] shadow-xl overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                            <thead>
                                <tr className="border-b border-[#333338] text-[#a1a1aa] uppercase tracking-wider">
                                    <th className="pb-3">Voucher Code</th>
                                    <th className="pb-3">Discount Type</th>
                                    <th className="pb-3">Discount Value</th>
                                    <th className="pb-3">Min. Spend</th>
                                    <th className="pb-3">Expiration</th>
                                    <th className="pb-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#333338]">
                                {vouchers.map((v) => (
                                    <tr key={v.id} className="hover:bg-[#27272a]/50">
                                        <td className="py-4 font-bold text-white font-mono text-sm">{v.code}</td>
                                        <td className="py-4 uppercase text-[#fbbf24] font-bold">{v.discount_type}</td>
                                        <td className="py-4 font-bold text-emerald-400">
                                            {v.discount_type === 'percentage' ? `${v.value}% OFF` : `₱${Number(v.value).toFixed(2)} OFF`}
                                        </td>
                                        <td className="py-4 text-[#a1a1aa]">₱{Number(v.min_spend).toFixed(2)}</td>
                                        <td className="py-4 text-[#a1a1aa]">{v.expires_at ? new Date(v.expires_at).toLocaleDateString() : 'Never'}</td>
                                        <td className="py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(v.id)}
                                                className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* CREATE VOUCHER MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <div className="w-full max-w-md rounded-3xl bg-[#18181b] border border-[#3f3f46] p-6 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-[#3f3f46]">
                            <h3 className="font-domine font-black text-white text-lg">Create Voucher Code</h3>
                            <button onClick={() => setShowModal(false)} className="text-[#a1a1aa] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Voucher Code</label>
                                <input
                                    type="text"
                                    required
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                    placeholder="e.g. SADDLE10"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white font-mono uppercase focus:border-[#f59e0b] focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Discount Type</label>
                                    <select
                                        value={data.discount_type}
                                        onChange={(e) => setData('discount_type', e.target.value as any)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white focus:border-[#f59e0b] focus:outline-none"
                                    >
                                        <option value="fixed">Fixed Amount (₱)</option>
                                        <option value="percentage">Percentage (%)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Value</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={data.value}
                                        onChange={(e) => setData('value', e.target.value)}
                                        placeholder="50"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white font-mono focus:border-[#f59e0b] focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Min. Spend (₱)</label>
                                    <input
                                        type="number"
                                        value={data.min_spend}
                                        onChange={(e) => setData('min_spend', e.target.value)}
                                        placeholder="300"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white font-mono focus:border-[#f59e0b] focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Expiration Date</label>
                                    <input
                                        type="date"
                                        value={data.expires_at}
                                        onChange={(e) => setData('expires_at', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white font-mono focus:border-[#f59e0b] focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-white font-bold text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-3 rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] font-black text-xs uppercase tracking-wider shadow-lg disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Voucher'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
