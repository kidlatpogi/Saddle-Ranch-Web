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
    Filter
} from 'lucide-react';

interface ProductItem {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock_quantity: number;
    is_active: boolean;
    image_path?: string;
}

interface ProductsProps {
    products: ProductItem[];
}

export default function AdminProducts({ products = [] }: ProductsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Out of Stock'>('All');
    
    // Add/Edit Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        price: '',
        stock_quantity: '50',
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
            stock_quantity: product.stock_quantity.toString(),
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
        router.delete(`/admin/products/${id}`);
    };

    const filteredProducts = products.filter(p => {
        if (statusFilter === 'Active' && !p.is_active) return false;
        if (statusFilter === 'Out of Stock' && p.stock_quantity > 0) return false;
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
                        <div className="flex items-center gap-2">
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
                                        <img src={p.image_path} alt={p.name} className="w-full h-full object-cover" />
                                        <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                                            p.is_active ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
                                        }`}>
                                            {p.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="font-domine font-bold text-white text-base">{p.name}</h3>
                                        {p.description && <p className="text-xs text-[#a1a1aa] line-clamp-2 mt-1">{p.description}</p>}
                                    </div>
                                </div>

                                <div className="space-y-3 pt-3 border-t border-[#333338]">
                                    <div className="flex items-center justify-between text-xs font-mono">
                                        <span className="text-[#fbbf24] font-black text-base">₱ {Number(p.price).toFixed(2)}</span>
                                        <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                                            p.stock_quantity === 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-[#141416] text-[#a1a1aa]'
                                        }`}>
                                            Stock: {p.stock_quantity}
                                        </span>
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
                                                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white'
                                                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950'
                                            }`}
                                        >
                                            {p.is_active ? 'Deactivate' : 'Activate'}
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
                    <div className="w-full max-w-lg rounded-3xl bg-[#18181b] border border-[#3f3f46] p-6 shadow-2xl space-y-5">
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

                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Description</label>
                                <textarea
                                    rows={2}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Product description and ingredients..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white focus:border-[#f59e0b] focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Price (₱)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="180.00"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white font-mono focus:border-[#f59e0b] focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Stock Quantity</label>
                                    <input
                                        type="number"
                                        required
                                        value={data.stock_quantity}
                                        onChange={(e) => setData('stock_quantity', e.target.value)}
                                        placeholder="50"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white font-mono focus:border-[#f59e0b] focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Product Image</label>
                                <div className="flex items-center gap-4">
                                    {imagePreview && (
                                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#3f3f46] bg-[#141416]">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="text-xs text-[#a1a1aa] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#27272a] file:text-white hover:file:bg-[#3f3f46]"
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
                                    {processing ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
