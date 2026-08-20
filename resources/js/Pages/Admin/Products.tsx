import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
    Utensils, 
    Search, 
    Plus, 
    Edit2, 
    Trash2, 
    X, 
    Upload, 
    Check, 
    ArrowLeft,
    Flame,
    Eye,
    Filter,
    RefreshCw
} from 'lucide-react';

interface ProductItem {
    id: number;
    name: string;
    description?: string;
    price: number;
    price_bulihan?: number;
    price_dasmarinas?: number;
    stock_quantity: number;
    stock_bulihan?: number;
    stock_dasmarinas?: number;
    is_active: boolean;
    image_path?: string;
}

interface ProductsProps {
    products: ProductItem[];
}

export default function AdminProducts({ products = [] }: ProductsProps) {
    const defaultImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t';

    const resolveImageUrl = (img?: string | null): string => {
        if (!img) return defaultImg;
        if (img.startsWith('http://localhost') || img.startsWith('http://127.0.0.1')) {
            try {
                const urlObj = new URL(img);
                return urlObj.pathname;
            } catch {
                return defaultImg;
            }
        }
        if (img.startsWith('http://') || img.startsWith('https://')) {
            return img;
        }
        if (img.startsWith('/images/') || img.startsWith('/storage/')) {
            return img;
        }
        if (img.startsWith('/')) {
            return img;
        }
        return `/images/${img}`;
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Out of Stock'>('All');
    const [branchFilter, setBranchFilter] = useState<'Bulihan' | 'Dasmarinas'>('Bulihan');
    
    // Add/Edit Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Delete Modal state
    const [deletingProduct, setDeletingProduct] = useState<ProductItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        price: '',
        price_bulihan: '',
        price_dasmarinas: '',
        stock_quantity: '50',
        stock_bulihan: '30',
        stock_dasmarinas: '20',
        is_active: true,
        image: null as File | null,
    });

    const openAddModal = () => {
        setEditingProduct(null);
        setImagePreview(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (product: ProductItem) => {
        setEditingProduct(product);
        setImagePreview(product.image_path || null);
        setData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            price_bulihan: (product.price_bulihan ?? product.price).toString(),
            price_dasmarinas: (product.price_dasmarinas ?? product.price).toString(),
            stock_quantity: product.stock_quantity.toString(),
            stock_bulihan: (product.stock_bulihan ?? Math.floor(product.stock_quantity * 0.6)).toString(),
            stock_dasmarinas: (product.stock_dasmarinas ?? Math.floor(product.stock_quantity * 0.4)).toString(),
            is_active: product.is_active,
            image: null,
        });
        setShowModal(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            post(`/admin/products/${editingProduct.id}`, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        } else {
            post('/admin/products', {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/products/${id}/toggle`, {}, { preserveScroll: true });
    };

    const handleConfirmDelete = () => {
        if (!deletingProduct) return;
        setIsDeleting(true);
        router.delete(`/admin/products/${deletingProduct.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeletingProduct(null);
                setIsDeleting(false);
            },
            onError: (err) => {
                console.error('Failed to delete product:', err);
                setIsDeleting(false);
            },
            onFinish: () => {
                setIsDeleting(false);
            }
        });
    };

    const filteredProducts = products.filter(p => {
        if (statusFilter === 'Active' && !p.is_active) return false;
        if (statusFilter === 'Out of Stock' && p.stock_quantity > 0) return false;
        if (branchFilter === 'Bulihan' && (p.stock_bulihan !== undefined && p.stock_bulihan <= 0)) return false;
        if (branchFilter === 'Dasmarinas' && (p.stock_dasmarinas !== undefined && p.stock_dasmarinas <= 0)) return false;
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <>
            <Head title="Admin Product Management | Saddle Ranch" />

            <div className="min-h-screen bg-[#141416] text-[#f4f4f5] font-sans flex flex-col">
                {/* Admin Header */}
                <header className="h-20 bg-[#1f1f23] border-b border-[#333338] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#b45309] flex items-center justify-center shadow-md shadow-[#f59e0b]/20">
                            <Flame className="w-6 h-6 text-[#3f2000]" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black font-domine text-white tracking-tight">Product Management & Stock Control</h1>
                            <p className="text-xs text-[#a1a1aa]">Saddle Ranch Executive Admin Suite</p>
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
                            <span>Add New Product</span>
                        </button>
                    </div>
                </header>

                <main className="max-w-[1600px] w-full mx-auto p-6 space-y-6 flex-1">
                    {/* Controls Bar */}
                    <div className="p-3 rounded-2xl bg-[#202024] border border-[#333338] flex flex-wrap items-center justify-between gap-4 shadow-lg">
                        <div className="flex flex-wrap items-center gap-2">
                            {(['All', 'Active', 'Out of Stock'] as const).map((chip) => (
                                <button
                                    key={chip}
                                    onClick={() => setStatusFilter(chip)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        statusFilter === chip
                                            ? 'bg-[#f59e0b] text-[#3f2000] font-black shadow'
                                            : 'bg-[#18181b] border border-[#3f3f46] text-[#a1a1aa] hover:text-white'
                                    }`}
                                >
                                    {chip}
                                </button>
                            ))}

                            <div className="h-6 w-[1px] bg-[#3f3f46] mx-1 hidden sm:block" />

                            <span className="text-xs text-[#a1a1aa] font-bold">Branch View:</span>
                            {(['Bulihan', 'Dasmarinas'] as const).map((b) => (
                                <button
                                    key={b}
                                    onClick={() => setBranchFilter(b)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                        branchFilter === b
                                            ? 'bg-[#fbbf24]/20 border border-[#f59e0b] text-[#fbbf24]'
                                            : 'bg-[#18181b] border border-[#3f3f46] text-[#a1a1aa] hover:text-white'
                                    }`}
                                >
                                    {`${b} Branch`}
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-64 pl-10 pr-4 py-2 bg-[#18181b] border border-[#3f3f46] rounded-xl text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#f59e0b]"
                            />
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((p) => (
                            <div key={p.id} className="p-5 rounded-3xl bg-[#202024] border border-[#333338] shadow-xl flex flex-col justify-between space-y-4">
                                <div className="space-y-3">
                                    <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-[#18181b] border border-[#3f3f46]">
                                        <img 
                                            src={resolveImageUrl(p.image_path)} 
                                            alt={p.name} 
                                            className="w-full h-full object-cover" 
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = defaultImg;
                                            }}
                                        />
                                        <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                                            p.is_active ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
                                        }`}>
                                            {p.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="font-domine font-bold text-white text-base">{p.name}</h3>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-3 border-t border-[#333338]">
                                    <div className="space-y-1.5 text-xs font-mono">
                                        <div className="flex items-center justify-between p-2 rounded-xl bg-[#141416] border border-amber-500/20">
                                            <span className="text-[#a1a1aa] text-[10px] font-bold uppercase">Bulihan:</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[#fbbf24] font-black">₱ {Number(p.price_bulihan ?? p.price).toFixed(2)}</span>
                                                <span className="px-1.5 py-0.5 rounded bg-[#27272a] text-white text-[10px]">Stk: {p.stock_bulihan ?? Math.floor(p.stock_quantity * 0.6)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-2 rounded-xl bg-[#141416] border border-blue-500/20">
                                            <span className="text-[#a1a1aa] text-[10px] font-bold uppercase">Dasmariñas:</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[#fbbf24] font-black">₱ {Number(p.price_dasmarinas ?? p.price).toFixed(2)}</span>
                                                <span className="px-1.5 py-0.5 rounded bg-[#27272a] text-white text-[10px]">Stk: {p.stock_dasmarinas ?? Math.floor(p.stock_quantity * 0.4)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-1">
                                        <button
                                            onClick={() => openEditModal(p)}
                                            className="flex-1 py-2 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" /> Edit
                                        </button>

                                        <button
                                            onClick={() => handleToggleActive(p.id)}
                                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                                                p.is_active
                                                    ? 'bg-amber-500/10 border-amber-500/30 text-[#ffc174] hover:bg-[#f59e0b] hover:text-zinc-950'
                                                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950'
                                            }`}
                                        >
                                            {p.is_active ? 'Deactivate' : 'Activate'}
                                        </button>

                                        <button
                                            onClick={() => setDeletingProduct(p)}
                                            className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                                            title="Delete Product"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

            {/* ADD / EDIT PRODUCT MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <div className="w-full max-w-xl rounded-3xl bg-[#18181b] border border-[#3f3f46] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-[#3f3f46]">
                            <h3 className="font-domine font-black text-white text-lg">
                                {editingProduct ? 'Edit Product Details' : 'Add New Product'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-[#a1a1aa] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Sizzling Pork Sisig"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white focus:border-[#f59e0b] focus:outline-none"
                                />
                            </div>

                            {/* Default Base Price & Stock */}
                            <div className="grid grid-cols-2 gap-4 p-3 rounded-2xl bg-[#141416] border border-[#333338]">
                                <div>
                                    <label className="block text-[11px] font-bold text-[#a1a1aa] mb-1">Default Base Price (₱)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={data.price}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setData((prev) => ({
                                                ...prev,
                                                price: val,
                                                price_bulihan: val,
                                                price_dasmarinas: val,
                                            }));
                                        }}
                                        placeholder="180.00"
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-mono focus:border-[#f59e0b] focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-[#a1a1aa] mb-1">Default Total Stock</label>
                                    <input
                                        type="number"
                                        required
                                        value={data.stock_quantity}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const num = parseInt(val, 10);
                                            setData((prev) => ({
                                                ...prev,
                                                stock_quantity: val,
                                                stock_bulihan: !isNaN(num) ? Math.round(num * 0.6).toString() : '',
                                                stock_dasmarinas: !isNaN(num) ? Math.round(num * 0.4).toString() : '',
                                            }));
                                        }}
                                        placeholder="50"
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-mono focus:border-[#f59e0b] focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Bulihan Branch Price & Stock */}
                            <div className="p-3.5 rounded-2xl bg-[#141416] border border-amber-500/30 space-y-2">
                                <span className="text-xs font-black text-[#fbbf24] uppercase tracking-wider block">Bulihan Branch Details</span>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-[#a1a1aa] mb-1">Bulihan Price (₱)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.price_bulihan}
                                            onChange={(e) => setData('price_bulihan', e.target.value)}
                                            placeholder="180.00"
                                            className="w-full px-3 py-1.5 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-[#a1a1aa] mb-1">Bulihan Stock</label>
                                        <input
                                            type="number"
                                            value={data.stock_bulihan}
                                            onChange={(e) => setData('stock_bulihan', e.target.value)}
                                            placeholder="30"
                                            className="w-full px-3 py-1.5 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Dasmarinas Branch Price & Stock */}
                            <div className="p-3.5 rounded-2xl bg-[#141416] border border-blue-500/30 space-y-2">
                                <span className="text-xs font-black text-blue-400 uppercase tracking-wider block">Dasmariñas Branch Details</span>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-[#a1a1aa] mb-1">Dasmariñas Price (₱)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.price_dasmarinas}
                                            onChange={(e) => setData('price_dasmarinas', e.target.value)}
                                            placeholder="195.00"
                                            className="w-full px-3 py-1.5 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-[#a1a1aa] mb-1">Dasmariñas Stock</label>
                                        <input
                                            type="number"
                                            value={data.stock_dasmarinas}
                                            onChange={(e) => setData('stock_dasmarinas', e.target.value)}
                                            placeholder="20"
                                            className="w-full px-3 py-1.5 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs font-bold text-[#a1a1aa]">Product Image</label>
                                    <span className="text-[10px] text-[#f59e0b] font-mono">WebP, PNG, JPG (Max 10 MB)</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    {imagePreview && (
                                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#3f3f46] bg-[#141416] shrink-0 shadow-md">
                                            <img 
                                                src={resolveImageUrl(imagePreview)} 
                                                alt="Preview" 
                                                className="w-full h-full object-cover" 
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = defaultImg;
                                                }}
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/webp,image/png,image/jpeg,image/jpg,image/gif,image/svg+xml,image/*"
                                        onChange={handleImageChange}
                                        className="text-xs text-[#a1a1aa] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#27272a] file:text-white hover:file:bg-[#3f3f46] cursor-pointer"
                                    />
                                </div>
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
                                    className="flex-1 py-3 rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] font-black text-xs uppercase tracking-wider shadow-lg disabled:opacity-50 cursor-pointer"
                                >
                                    {processing ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* DELETE PRODUCT CONFIRMATION MODAL */}
            {deletingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-[#1f1f23] border border-[#333338] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 transform transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                                <Trash2 className="w-6 h-6 text-rose-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black font-domine text-white">Delete Product Confirmation</h3>
                                <p className="text-xs text-[#a1a1aa] mt-0.5">Remove item from menu & inventory</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#141416] border border-[#27272a] space-y-2">
                            <p className="text-xs text-[#f4f4f5] leading-relaxed">
                                Are you sure you want to permanently delete <strong className="text-[#fbbf24] font-semibold">{deletingProduct.name}</strong>?
                            </p>
                            <p className="text-[11px] text-[#71717a]">
                                This will remove the dish from customer ordering and inventory stock across all branches.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setDeletingProduct(null)}
                                className="px-5 py-2.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleConfirmDelete}
                                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        <span>Confirm Delete</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
