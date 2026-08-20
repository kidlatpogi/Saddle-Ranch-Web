import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
    Image as ImageIcon, 
    Plus, 
    X, 
    ArrowLeft, 
    Flame,
    Upload,
    Check
} from 'lucide-react';

interface BannerItem {
    id: number;
    title: string;
    branch?: 'all' | 'bulihan' | 'dasmarinas';
    display_order: number;
    is_active: boolean;
    image_path?: string;
}

interface BannersProps {
    banners: BannerItem[];
}

export default function AdminBanners({ banners = [] }: BannersProps) {
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        branch: 'all',
        display_order: '1',
        is_active: true,
        image: null as File | null,
    });

    const openAddModal = () => {
        setEditingBanner(null);
        reset();
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBanner) {
            post(`/admin/banners/${editingBanner.id}`, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        } else {
            post('/admin/banners', {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleToggleActive = (id: number) => {
        router.delete(`/admin/banners/${id}`);
    };

    return (
        <>
            <Head title="Admin Banners Management | Saddle Ranch" />

            <div className="min-h-screen bg-[#141416] text-[#f4f4f5] font-sans flex flex-col">
                <header className="h-20 bg-[#1f1f23] border-b border-[#333338] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#b45309] flex items-center justify-center shadow-md shadow-[#f59e0b]/20">
                            <ImageIcon className="w-6 h-6 text-[#3f2000]" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black font-domine text-white tracking-tight">Promo Banners Management</h1>
                            <p className="text-xs text-[#a1a1aa]">Hero Banners & Customer Promotions</p>
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
                            <span>Add New Banner</span>
                        </button>
                    </div>
                </header>

                <main className="max-w-[1600px] w-full mx-auto p-6 space-y-6 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {banners.map((b) => (
                            <div key={b.id} className="p-5 rounded-3xl bg-[#202024] border border-[#333338] shadow-xl flex flex-col justify-between space-y-4">
                                <div className="space-y-3">
                                    <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-[#18181b] border border-[#3f3f46]">
                                        <img src={b.image_path} alt={b.title} className="w-full h-full object-cover" />
                                        <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                                            b.is_active ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
                                        }`}>
                                            Order #{b.display_order} • {b.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <h3 className="font-domine font-bold text-white text-base">{b.title}</h3>
                                </div>

                                <div className="pt-3 border-t border-[#333338] flex items-center justify-between">
                                    <button
                                        onClick={() => handleToggleActive(b.id)}
                                        className={`w-full py-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                                            b.is_active
                                                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white'
                                                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950'
                                        }`}
                                    >
                                        {b.is_active ? 'Deactivate Banner' : 'Activate Banner'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

            {/* ADD MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <div className="w-full max-w-md rounded-3xl bg-[#18181b] border border-[#3f3f46] p-6 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-[#3f3f46]">
                            <h3 className="font-domine font-black text-white text-lg">Add Promo Banner</h3>
                            <button onClick={() => setShowModal(false)} className="text-[#a1a1aa] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Banner Title</label>
                                <input
                                    type="text"
                                    required
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Weekend Sizzling Special"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white focus:border-[#f59e0b] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Display Order</label>
                                <input
                                    type="number"
                                    required
                                    value={data.display_order}
                                    onChange={(e) => setData('display_order', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white focus:border-[#f59e0b] focus:outline-none"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs font-bold text-[#a1a1aa]">Banner Image File</label>
                                    <span className="text-[10px] text-[#f59e0b] font-mono">WebP, PNG, JPG (Max 10 MB)</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/webp,image/png,image/jpeg,image/jpg,image/gif,image/svg+xml,image/*"
                                    onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                    className="text-xs text-[#a1a1aa] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#27272a] file:text-white hover:file:bg-[#3f3f46] cursor-pointer"
                                />
                                {errors.image && (
                                    <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.image}</p>
                                )}
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
                                    {processing ? 'Saving...' : 'Save Banner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
