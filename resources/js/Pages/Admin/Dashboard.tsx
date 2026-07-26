import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    ListOrdered, 
    Utensils, 
    QrCode, 
    Image as ImageIcon, 
    Ticket, 
    Users, 
    FileText, 
    TrendingUp, 
    Flame, 
    LogOut, 
    ArrowUpRight, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    Search,
    Plus,
    Edit2,
    Trash2,
    Check,
    X,
    Eye,
    Download,
    Copy,
    RefreshCw,
    Filter,
    ShieldCheck,
    Printer
} from 'lucide-react';

interface ProductItem {
    id: number;
    name: string;
    category: string;
    description: string;
    price: number;
    stock: number;
    isActive: boolean;
    image: string;
}

interface OrderItem {
    id: string;
    type: 'Dine-In' | 'Pick-Up' | 'Delivery';
    location: string;
    customer: string;
    phone: string;
    amount: number;
    payment: string;
    status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
    time: string;
    itemsCount: number;
}

interface BannerItem {
    slot: number; // 1, 2, 3, or 4
    title: string;
    subtitle: string;
    tag: string;
    image: string;
    ctaText?: string;
    isActive: boolean;
}

interface VoucherItem {
    id: number;
    code: string;
    discountPercent: number;
    minSpend: number;
    usedCount: number;
    isActive: boolean;
}

interface EmployeeItem {
    id: number;
    name: string;
    email: string;
    role: 'Admin' | 'Kitchen Staff' | 'Cashier';
    status: 'Active' | 'Inactive';
}

interface AuditLogItem {
    id: number;
    timestamp: string;
    user: string;
    role: string;
    action: string;
    module: string;
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');

    // Sample initial dataset states
    const [products, setProducts] = useState<ProductItem[]>([
        { id: 1, name: 'Sizzling Pork Sisig', category: 'Authentic Filipino', description: 'Crispy pork belly with local spices and egg.', price: 180, stock: 50, isActive: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t' },
        { id: 2, name: 'Sizzling Pork T-Bone Steak', category: 'Barkada Platters', description: 'Tender T-Bone steak with signature gravy.', price: 280, stock: 30, isActive: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASVSO6N3lzIbdlCDT85viSxOZiQKjWADlA5k7ymludjTdSCB7tqV0bZvXRba3-L4gemLyqy9PxmqnYMBnSsxb5yfI_XM-qajS5ZEnS1Am8OBu5uN8_smBFlDdy4xR0UNE8jDFJP8vNSRQcqqDSG4p-oDij5kCvWALcyBZVeuA1QdnqC9a6I5s9l2ba3Zjfe0xSPjMr0jLCAB1z-oJS5xBL9meeUeFsmiMgjQ96VoXotgHsy3Jl3d9NQIv1liJsKeu_sJec2rrkNziY' },
        { id: 3, name: 'Sizzling Bulalo Steak', category: 'Authentic Filipino', description: 'Rich beef shank with simmering bone marrow gravy.', price: 450, stock: 15, isActive: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCatSLXJ-mynm_AwjLXsdG9xKbMwziehShgiNtyXaX2NZEeZFhSXaTmHMgLuACAitSC3WZ0g_9lSTavvnqO4eKFlaC0pnnA9OngEMtRicl0vfSF2_t4WqzxTKxW-H-X0i_tppiClzEOZ-fAuu1ezCbRVOcdVdwZHokttY1ATDIO4BuA185dwrm0QDuPpYjQ7qD9ybH5bl0WPn1wHJ3S5pB6JuCOoocWTfZ95cB0Lfqx1KbjbUwqGJxkhwxmqypEJta64yq1PajT3oWC' },
        { id: 4, name: 'Sizzling Chicken Inasal', category: 'Rice Meals', description: 'Chargrilled Bacolod-style chicken with garlic rice.', price: 220, stock: 40, isActive: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6QEUONokTX7mi1M1Wrie14cxeoNfVq5HyIS1sLOLWKbzZyh6OfegCBaNeH6E7uS37ugVc6jjmILNzIrmvE0tpXkOBCDP29HO1WZL69MsOd6lpwp4oX6ezfDjuAsLMCu57vBpiHDupWu3yDATuk2k_HgpQMi23Y7mifgQKqPJhc0GqDXCCk1tPooIkFyBCXPiESBHm8HKF8cp1ctvD0RZ39YNVxKG_2cPaPyfryUGBbaoIHhqqhq5R9BflPtI6jMfzsP3W6QStlttx' },
        { id: 5, name: 'Signature Red Iced Tea (1L)', category: 'Drinks & Extra Rice', description: 'Chilled house-brewed red iced tea pitcher.', price: 95, stock: 100, isActive: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl' },
    ]);

    const [orders, setOrders] = useState<OrderItem[]>([
        { id: 'SR-1049', type: 'Dine-In', location: 'Table 05', customer: 'Juan Dela Cruz', phone: '09171234567', amount: 640, payment: 'GCash', status: 'preparing', time: '10 mins ago', itemsCount: 3 },
        { id: 'SR-1048', type: 'Pick-Up', location: 'Counter', customer: 'Marco Reyes', phone: '09189876543', amount: 460, payment: 'Cash (Pick-Up)', status: 'ready', time: '25 mins ago', itemsCount: 2 },
        { id: 'SR-1047', type: 'Delivery', location: 'Bulihan Area (Anahaw II)', customer: 'Elena Cruz', phone: '09223334444', amount: 890, payment: 'Cash on Delivery', status: 'pending', time: '30 mins ago', itemsCount: 4 },
        { id: 'SR-[#1046]', type: 'Dine-In', location: 'Table 02', customer: 'Seated Guest', phone: '09175556666', amount: 360, payment: 'GCash', status: 'completed', time: '1 hour ago', itemsCount: 2 },
    ]);

    // 4 PROMO BANNER SLOTS matching customer landing page layout 1:1
    const [banners, setBanners] = useState<Record<number, BannerItem>>({
        1: {
            slot: 1,
            title: 'Sisig Saturdays Deal',
            subtitle: 'Enjoy 20% off our legendary 24-hour marinated Pork Sisig served on a smoking hot skillet with raw egg and calamansi.',
            tag: 'WEEKEND SPECIAL • 20% OFF',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t',
            isActive: true
        },
        2: {
            slot: 2,
            title: 'Cowboy Ribeye Special',
            subtitle: 'Bone-In, seared on smoking cast iron.',
            tag: 'NEW ARRIVAL',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASVSO6N3lzIbdlCDT85viSxOZiQKjWADlA5k7ymludjTdSCB7tqV0bZvXRba3-L4gemLyqy9PxmqnYMBnSsxb5yfI_XM-qajS5ZEnS1Am8OBu5uN8_smBFlDdy4xR0UNE8jDFJP8vNSRQcqqDSG4p-oDij5kCvWALcyBZVeuA1QdnqC9a6I5s9l2ba3Zjfe0xSPjMr0jLCAB1z-oJS5xBL9meeUeFsmiMgjQ96VoXotgHsy3Jl3d9NQIv1liJsKeu_sJec2rrkNziY',
            isActive: true
        },
        3: {
            slot: 3,
            title: 'Free Unli-Rice & Soup',
            subtitle: 'Free unlimited garlic rice & hot bulalo soup refill on all sizzling meals.',
            tag: 'UNLIMITED REFILLS',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCatSLXJ-mynm_AwjLXsdG9xKbMwziehShgiNtyXaX2NZEeZFhSXaTmHMgLuACAitSC3WZ0g_9lSTavvnqO4eKFlaC0pnnA9OngEMtRicl0vfSF2_t4WqzxTKxW-H-X0i_tppiClzEOZ-fAuu1ezCbRVOcdVdwZHokttY1ATDIO4BuA185dwrm0QDuPpYjQ7qD9ybH5bl0WPn1wHJ3S5pB6JuCOoocWTfZ95cB0Lfqx1KbjbUwqGJxkhwxmqypEJta64yq1PajT3oWC',
            isActive: true
        },
        4: {
            slot: 4,
            title: 'Pulutan Happy Hour Specials',
            subtitle: "Gather 'round the roadhouse hearth with ice-cold beverages and piping hot sizzling pulutan platters.",
            tag: 'HAPPY HOUR • 4PM - 7PM DAILY',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6QEUONokTX7mi1M1Wrie14cxeoNfVq5HyIS1sLOLWKbzZyh6OfegCBaNeH6E7uS37ugVc6jjmILNzIrmvE0tpXkOBCDP29HO1WZL69MsOd6lpwp4oX6ezfDjuAsLMCu57vBpiHDupWu3yDATuk2k_HgpQMi23Y7mifgQKqPJhc0GqDXCCk1tPooIkFyBCXPiESBHm8HKF8cp1ctvD0RZ39YNVxKG_2cPaPyfryUGBbaoIHhqqhq5R9BflPtI6jMfzsP3W6QStlttx',
            ctaText: 'ORDER PULUTAN NOW →',
            isActive: true
        }
    });

    const [vouchers, setVouchers] = useState<VoucherItem[]>([
        { id: 1, code: 'SADDLE10', discountPercent: 10, minSpend: 300, usedCount: 42, isActive: true },
        { id: 2, code: 'BULIHANFREE', discountPercent: 15, minSpend: 500, usedCount: 89, isActive: true },
        { id: 3, code: 'WELCOME2026', discountPercent: 20, minSpend: 800, usedCount: 15, isActive: false }
    ]);

    const [employees, setEmployees] = useState<EmployeeItem[]>([
        { id: 1, name: 'Saddle Ranch Admin', email: 'admin@saddleranch.ph', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Cashier Employee', email: 'cashier@saddleranch.ph', role: 'Cashier', status: 'Active' },
        { id: 3, name: 'Kitchen Head Chef', email: 'kitchen@saddleranch.ph', role: 'Kitchen Staff', status: 'Active' }
    ]);

    const [tables, setTables] = useState<string[]>(['01', '02', '03', '04', '05', '06', '07', '08']);
    const [selectedPrintTable, setSelectedPrintTable] = useState<string | null>(null);

    const [auditLogs] = useState<AuditLogItem[]>([
        { id: 1, timestamp: '2026-07-26 18:45:10', user: 'admin@saddleranch.ph', role: 'Admin', action: 'Updated product price for Sizzling Pork Sisig to ₱180.00', module: 'Products' },
        { id: 2, timestamp: '2026-07-26 18:30:22', user: 'cashier@saddleranch.ph', role: 'Cashier', action: 'Marked Order #SR-1048 as Ready', module: 'Order Queue' },
        { id: 3, timestamp: '2026-07-26 17:15:00', user: 'admin@saddleranch.ph', role: 'Admin', action: 'Created new discount voucher SADDLE10 (10% OFF)', module: 'Vouchers' },
        { id: 4, timestamp: '2026-07-26 16:00:44', user: 'admin@saddleranch.ph', role: 'Admin', action: 'Logged in to Admin Portal', module: 'Authentication' },
    ]);

    // Product Add & Edit Modals State
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [newProductName, setNewProductName] = useState('');
    const [newProductCategory, setNewProductCategory] = useState('Authentic Filipino');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [newProductStock, setNewProductStock] = useState('50');
    const [newProductImage, setNewProductImage] = useState('');

    const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

    // Slot-based Banner Modal State
    const [targetBannerSlot, setTargetBannerSlot] = useState<number | null>(null);
    const [newBannerTitle, setNewBannerTitle] = useState('');
    const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
    const [newBannerTag, setNewBannerTag] = useState('');
    const [newBannerImage, setNewBannerImage] = useState('');
    const [newBannerCta, setNewBannerCta] = useState('');

    // Voucher Modal State
    const [showAddVoucherModal, setShowAddVoucherModal] = useState(false);
    const [newVoucherCode, setNewVoucherCode] = useState('');
    const [newVoucherDiscount, setNewVoucherDiscount] = useState('10');

    // Employee Modal State
    const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
    const [newEmpName, setNewEmpName] = useState('');
    const [newEmpEmail, setNewEmpEmail] = useState('');
    const [newEmpRole, setNewEmpRole] = useState<'Cashier' | 'Kitchen Staff'>('Cashier');

    const [copiedTable, setCopiedTable] = useState<string | null>(null);

    // Helpers
    const updateOrderStatus = (orderId: string, newStatus: OrderItem['status']) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };

    const toggleProductStatus = (id: number) => {
        setProducts(products.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
    };

    const updateProductStock = (id: number, delta: number) => {
        setProducts(products.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
    };

    const deleteProduct = (id: number) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const handleCreateProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProductName.trim()) return;

        const defaultImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t';

        const newProd: ProductItem = {
            id: Date.now(),
            name: newProductName,
            category: newProductCategory,
            description: 'Delicious roadhouse sizzling meal prepared fresh upon order.',
            price: parseFloat(newProductPrice) || 180,
            stock: parseInt(newProductStock) || 50,
            isActive: true,
            image: newProductImage.trim() ? newProductImage : defaultImg
        };
        setProducts([newProd, ...products]);
        setNewProductName('');
        setNewProductImage('');
        setShowAddProductModal(false);
    };

    const handleSaveEditProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
        setEditingProduct(null);
    };

    const handleGenerateNewTableQR = () => {
        const nextNum = (tables.length + 1).toString().padStart(2, '0');
        setTables([...tables, nextNum]);
    };

    const handleDeleteTableQR = (tableNum: string) => {
        setTables(tables.filter(t => t !== tableNum));
    };

    const openSlotBannerModal = (slotNum: number) => {
        setTargetBannerSlot(slotNum);
        const existing = banners[slotNum];
        if (existing) {
            setNewBannerTitle(existing.title);
            setNewBannerSubtitle(existing.subtitle);
            setNewBannerTag(existing.tag);
            setNewBannerImage(existing.image);
            setNewBannerCta(existing.ctaText || '');
        } else {
            setNewBannerTitle('');
            setNewBannerSubtitle('');
            setNewBannerTag(slotNum === 1 ? 'WEEKEND SPECIAL • 20% OFF' : slotNum === 2 ? 'NEW ARRIVAL' : slotNum === 3 ? 'UNLIMITED REFILLS' : 'HAPPY HOUR');
            setNewBannerImage('');
            setNewBannerCta('');
        }
    };

    const handleSaveSlotBanner = (e: React.FormEvent) => {
        e.preventDefault();
        if (targetBannerSlot === null || !newBannerTitle.trim()) return;

        const defaultBannerImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuASVSO6N3lzIbdlCDT85viSxOZiQKjWADlA5k7ymludjTdSCB7tqV0bZvXRba3-L4gemLyqy9PxmqnYMBnSsxb5yfI_XM-qajS5ZEnS1Am8OBu5uN8_smBFlDdy4xR0UNE8jDFJP8vNSRQcqqDSG4p-oDij5kCvWALcyBZVeuA1QdnqC9a6I5s9l2ba3Zjfe0xSPjMr0jLCAB1z-oJS5xBL9meeUeFsmiMgjQ96VoXotgHsy3Jl3d9NQIv1liJsKeu_sJec2rrkNziY';

        setBanners({
            ...banners,
            [targetBannerSlot]: {
                slot: targetBannerSlot,
                title: newBannerTitle,
                subtitle: newBannerSubtitle,
                tag: newBannerTag,
                image: newBannerImage.trim() ? newBannerImage : defaultBannerImg,
                ctaText: newBannerCta,
                isActive: true
            }
        });

        setTargetBannerSlot(null);
    };

    const handleCreateVoucher = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newVoucherCode.trim()) return;

        const newVouch: VoucherItem = {
            id: Date.now(),
            code: newVoucherCode.toUpperCase(),
            discountPercent: parseInt(newVoucherDiscount) || 10,
            minSpend: 300,
            usedCount: 0,
            isActive: true
        };
        setVouchers([newVouch, ...vouchers]);
        setNewVoucherCode('');
        setShowAddVoucherModal(false);
    };

    const handleCreateEmployee = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmpEmail.trim()) return;

        const newEmp: EmployeeItem = {
            id: Date.now(),
            name: newEmpName || 'Staff Member',
            email: newEmpEmail,
            role: newEmpRole,
            status: 'Active'
        };
        setEmployees([...employees, newEmp]);
        setNewEmpName('');
        setNewEmpEmail('');
        setShowAddEmployeeModal(false);
    };

    const copyTableLink = (tableNum: string) => {
        const url = `${window.location.origin}/dine-in?table=${tableNum}`;
        navigator.clipboard.writeText(url);
        setCopiedTable(tableNum);
        setTimeout(() => setCopiedTable(null), 2000);
    };

    const getRealQrCodeUrl = (tableNum: string) => {
        const domain = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000';
        const targetUrl = `${domain}/dine-in?table=${tableNum}`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(targetUrl)}`;
    };

    const sidebarLinks = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'orders', label: 'Order Queue', icon: <ListOrdered className="w-4 h-4" />, badge: orders.filter(o => o.status === 'pending' || o.status === 'preparing').length.toString() },
        { id: 'products', label: 'Products & Stocks', icon: <Utensils className="w-4 h-4" /> },
        { id: 'tables', label: 'Table & QR Generator', icon: <QrCode className="w-4 h-4" /> },
        { id: 'banners', label: 'Promo Banners', icon: <ImageIcon className="w-4 h-4" /> },
        { id: 'vouchers', label: 'Vouchers', icon: <Ticket className="w-4 h-4" /> },
        { id: 'employees', label: 'Employees', icon: <Users className="w-4 h-4" /> },
        { id: 'audit', label: 'Audit Logs', icon: <FileText className="w-4 h-4" /> },
        { id: 'sales', label: 'Sales & Revenue', icon: <TrendingUp className="w-4 h-4" /> },
    ];

    const totalRevenue = orders.filter(o => o.status === 'completed' || o.status === 'ready' || o.status === 'preparing').reduce((acc, o) => acc + o.amount, 0);

    return (
        <>
            <Head title="Admin Dashboard | Saddle Ranch" />

            <div className="min-h-screen bg-[#121213] text-[#f0e0d1] flex font-sans selection:bg-[#f59e0b] selection:text-[#472a00]">
                
                {/* Sidebar Navigation */}
                <aside className="w-64 bg-[#1A1A1B] border-r border-[#534434]/40 flex flex-col flex-shrink-0 hidden md:flex shadow-2xl">
                    <div className="h-20 px-6 flex items-center gap-3 border-b border-[#534434]/40">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#b45309] flex items-center justify-center shadow-lg shadow-[#f59e0b]/20">
                            <Flame className="w-5 h-5 text-[#472a00]" />
                        </div>
                        <div>
                            <span className="font-black text-base tracking-tight font-domine text-[#ffc174] block">SADDLE RANCH</span>
                            <span className="text-[10px] tracking-widest uppercase text-[#f59e0b] font-bold block">Admin Portal</span>
                        </div>
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto space-y-1">
                        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#8c7a6b]">Core Management</div>
                        {sidebarLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => setActiveTab(link.id)}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                    activeTab === link.id
                                        ? 'bg-[#f59e0b]/20 border-l-4 border-[#f59e0b] text-[#ffc174] shadow-sm'
                                        : 'text-[#d8c3ad] hover:text-white hover:bg-[#261e15]'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={activeTab === link.id ? 'text-[#f59e0b]' : 'text-[#8c7a6b]'}>
                                        {link.icon}
                                    </span>
                                    <span>{link.label}</span>
                                </div>
                                {link.badge && parseInt(link.badge) > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#ffc174] text-[10px] font-black border border-[#f59e0b]/40">
                                        {link.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 border-t border-[#534434]/40">
                        <div className="p-3 rounded-xl bg-[#121213] border border-[#534434]/40 flex items-center justify-between">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                                <div className="w-8 h-8 rounded-full bg-[#261e15] border border-[#534434] flex items-center justify-center text-xs font-black text-[#ffc174]">
                                    SA
                                </div>
                                <div className="truncate">
                                    <span className="block text-xs font-bold text-white truncate">Saddle Ranch Admin</span>
                                    <span className="block text-[10px] text-[#8c7a6b]">admin@saddleranch.ph</span>
                                </div>
                            </div>
                            <Link href="/logout" method="post" as="button" className="p-1.5 rounded-lg text-[#d8c3ad] hover:text-rose-400 hover:bg-[#261e15] transition-colors">
                                <LogOut className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Main View Area */}
                <main className="flex-1 flex flex-col min-w-0">
                    
                    {/* Header */}
                    <header className="h-20 bg-[#1A1A1B]/95 border-b border-[#534434]/40 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-black font-domine text-[#ffc174] tracking-tight capitalize">
                                {sidebarLinks.find(l => l.id === activeTab)?.label ?? 'Dashboard'}
                            </h2>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-wide uppercase flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                Active Server & TiDB Sync
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative hidden sm:block">
                                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7a6b]" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search orders, items, staff..."
                                    className="w-64 pl-9 pr-4 py-1.5 bg-[#121213] border border-[#534434]/60 rounded-xl text-xs text-white placeholder-[#8c7a6b] focus:outline-none focus:border-[#f59e0b]"
                                />
                            </div>

                            <Link
                                href="/employee/kitchen"
                                className="px-3.5 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#472a00] font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 btn-bevel"
                            >
                                <Utensils className="w-3.5 h-3.5" />
                                <span>Kitchen KDS</span>
                            </Link>
                        </div>
                    </header>

                    {/* Dynamic View Body */}
                    <div className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto">

                        {/* TAB 1: MAIN DASHBOARD OVERVIEW */}
                        {activeTab === 'dashboard' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                    <div className="p-5 rounded-2xl bg-[#1A1A1B] border border-[#534434]/60 shadow-xl space-y-2">
                                        <div className="text-xs font-bold uppercase tracking-wider text-[#8c7a6b]">Total Sizzling Revenue</div>
                                        <div className="text-2xl sm:text-3xl font-mono font-black text-[#ffc174]">₱ {totalRevenue.toFixed(2)}</div>
                                        <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">+18.4% vs yesterday</div>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-[#1A1A1B] border border-[#534434]/60 shadow-xl space-y-2">
                                        <div className="text-xs font-bold uppercase tracking-wider text-[#8c7a6b]">Active Orders Queue</div>
                                        <div className="text-2xl sm:text-3xl font-mono font-black text-white">{orders.length} Orders</div>
                                        <div className="text-[11px] text-amber-400 font-bold">{orders.filter(o => o.status === 'pending').length} Pending Kitchen</div>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-[#1A1A1B] border border-[#534434]/60 shadow-xl space-y-2">
                                        <div className="text-xs font-bold uppercase tracking-wider text-[#8c7a6b]">Active Menu Items</div>
                                        <div className="text-2xl sm:text-3xl font-mono font-black text-white">{products.length} Items</div>
                                        <div className="text-[11px] text-emerald-400 font-bold">{products.filter(p => p.isActive).length} Available Today</div>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-[#1A1A1B] border border-[#534434]/60 shadow-xl space-y-2">
                                        <div className="text-xs font-bold uppercase tracking-wider text-[#8c7a6b]">Promo Vouchers</div>
                                        <div className="text-2xl sm:text-3xl font-mono font-black text-white">{vouchers.length} Codes</div>
                                        <div className="text-[11px] text-emerald-400 font-bold">{vouchers.filter(v => v.isActive).length} Active Promos</div>
                                    </div>
                                </div>

                                {/* Order Queue Quick Table */}
                                <div className="rounded-3xl bg-[#1A1A1B] border border-[#534434]/60 shadow-2xl p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-base font-bold text-white font-domine">Recent Sizzling Orders</h3>
                                            <p className="text-xs text-[#d8c3ad]">Real-time orders queue status</p>
                                        </div>
                                        <button
                                            onClick={() => setActiveTab('orders')}
                                            className="px-3.5 py-1.5 rounded-xl bg-[#261e15] border border-[#534434] text-[#ffc174] text-xs font-bold hover:bg-[#31281f] flex items-center gap-1 btn-bevel"
                                        >
                                            <span>Full Queue View</span>
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-[#121213] text-[#8c7a6b] uppercase font-bold border-b border-[#534434]/40">
                                                <tr>
                                                    <th className="py-3 px-4">Order #</th>
                                                    <th className="py-3 px-4">Mode / Location</th>
                                                    <th className="py-3 px-4">Customer</th>
                                                    <th className="py-3 px-4">Amount</th>
                                                    <th className="py-3 px-4">Payment</th>
                                                    <th className="py-3 px-4">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#534434]/30 text-stone-200">
                                                {orders.map((o) => (
                                                    <tr key={o.id} className="hover:bg-[#261e15]/40 transition-colors">
                                                        <td className="py-3.5 px-4 font-mono font-bold text-white">{o.id}</td>
                                                        <td className="py-3.5 px-4 font-semibold text-[#ffc174]">{o.type} ({o.location})</td>
                                                        <td className="py-3.5 px-4 text-[#d8c3ad]">{o.customer}</td>
                                                        <td className="py-3.5 px-4 font-mono font-bold text-amber-400">₱{o.amount.toFixed(2)}</td>
                                                        <td className="py-3.5 px-4 text-xs font-medium text-stone-300">{o.payment}</td>
                                                        <td className="py-3.5 px-4">
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                                                o.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                                                                o.status === 'ready' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                                                                o.status === 'preparing' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                                                                'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                                                            }`}>
                                                                {o.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: ORDER QUEUE MANAGEMENT */}
                        {activeTab === 'orders' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white font-domine">Full Orders Queue Management</h3>
                                        <p className="text-xs text-[#d8c3ad]">Advance kitchen states and view customer order specifications</p>
                                    </div>
                                </div>

                                <div className="rounded-3xl bg-[#1A1A1B] border border-[#534434]/60 shadow-2xl p-6 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-[#121213] text-[#8c7a6b] uppercase font-bold border-b border-[#534434]/40">
                                                <tr>
                                                    <th className="py-3.5 px-4">Order #</th>
                                                    <th className="py-3.5 px-4">Customer Details</th>
                                                    <th className="py-3.5 px-4">Fulfillment Mode</th>
                                                    <th className="py-3.5 px-4">Amount & Payment</th>
                                                    <th className="py-3.5 px-4">Status</th>
                                                    <th className="py-3.5 px-4">Kitchen Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#534434]/30 text-stone-200">
                                                {orders.map((o) => (
                                                    <tr key={o.id} className="hover:bg-[#261e15]/40 transition-colors">
                                                        <td className="py-4 px-4 font-mono font-bold text-white text-sm">{o.id}</td>
                                                        <td className="py-4 px-4">
                                                            <div className="font-bold text-white">{o.customer}</div>
                                                            <div className="text-[10px] text-[#d8c3ad]">{o.phone}</div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className="font-bold text-[#ffc174]">{o.type}</span>
                                                            <div className="text-[10px] text-[#8c7a6b]">{o.location}</div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="font-mono font-bold text-amber-400 text-sm">₱{o.amount.toFixed(2)}</div>
                                                            <div className="text-[10px] text-stone-400">{o.payment}</div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                                                o.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                                                                o.status === 'ready' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                                                                o.status === 'preparing' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                                                                'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                                                            }`}>
                                                                {o.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center gap-2">
                                                                {o.status === 'pending' && (
                                                                    <button
                                                                        onClick={() => updateOrderStatus(o.id, 'preparing')}
                                                                        className="px-3 py-1.5 rounded-xl bg-amber-500 text-[#472a00] font-black text-[11px] hover:bg-[#ffc174] transition-all btn-bevel"
                                                                    >
                                                                        Prepare Order
                                                                    </button>
                                                                )}
                                                                {o.status === 'preparing' && (
                                                                    <button
                                                                        onClick={() => updateOrderStatus(o.id, 'ready')}
                                                                        className="px-3 py-1.5 rounded-xl bg-blue-500 text-white font-black text-[11px] hover:bg-blue-400 transition-all btn-bevel"
                                                                    >
                                                                        Mark Ready
                                                                    </button>
                                                                )}
                                                                {o.status === 'ready' && (
                                                                    <button
                                                                        onClick={() => updateOrderStatus(o.id, 'completed')}
                                                                        className="px-3 py-1.5 rounded-xl bg-emerald-500 text-stone-950 font-black text-[11px] hover:bg-emerald-400 transition-all btn-bevel"
                                                                    >
                                                                        Complete Order
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: PRODUCTS & STOCKS MANAGEMENT */}
                        {activeTab === 'products' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white font-domine">Products & Stock Inventory</h3>
                                        <p className="text-xs text-[#d8c3ad]">Manage sizzling menu items, prices, image URLs, and stock counts</p>
                                    </div>
                                    <button
                                        onClick={() => setShowAddProductModal(true)}
                                        className="px-4 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#472a00] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 btn-bevel shadow-lg"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add New Dish</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((p) => (
                                        <div key={p.id} className="p-5 rounded-3xl bg-[#1A1A1B] border border-[#534434]/50 shadow-xl space-y-4 flex flex-col justify-between">
                                            <div className="space-y-3">
                                                <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-[#534434]/40 bg-[#121213]">
                                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                                    <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-[#121213]/90 text-[#ffc174] font-mono font-black text-xs border border-[#f59e0b]/40">
                                                        ₱ {p.price.toFixed(2)}
                                                    </span>
                                                </div>

                                                <div>
                                                    <span className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider block">{p.category}</span>
                                                    <h4 className="text-base font-bold text-white font-domine leading-snug">{p.name}</h4>
                                                    <p className="text-xs text-[#d8c3ad] mt-1 line-clamp-2">{p.description}</p>
                                                </div>
                                            </div>

                                            <div className="pt-3 border-t border-[#534434]/30 space-y-3">
                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[#8c7a6b]">Stock Count:</span>
                                                        <div className="flex items-center gap-1 border border-[#534434] rounded-lg p-0.5 bg-[#121213]">
                                                            <button onClick={() => updateProductStock(p.id, -5)} className="p-1 text-[#d8c3ad] hover:text-white">-</button>
                                                            <span className="font-mono font-bold px-1.5 text-white">{p.stock}</span>
                                                            <button onClick={() => updateProductStock(p.id, 5)} className="p-1 text-[#d8c3ad] hover:text-white">+</button>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => toggleProductStatus(p.id)}
                                                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                                                            p.isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                                        }`}
                                                    >
                                                        {p.isActive ? 'Active' : 'Disabled'}
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setEditingProduct(p)}
                                                        className="flex-1 py-2 rounded-xl bg-[#261e15] border border-[#534434] text-[#ffc174] hover:bg-[#31281f] text-xs font-bold flex items-center justify-center gap-1.5 btn-bevel transition-all"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5 text-[#f59e0b]" />
                                                        <span>Edit Dish</span>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProduct(p.id)}
                                                        className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB 4: TABLE AND QR GENERATOR WITH REAL WORKING SCANNABLE QR & DELETE TABLE BUTTON */}
                        {activeTab === 'tables' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white font-domine">Table QR Code Generator</h3>
                                        <p className="text-xs text-[#d8c3ad]">Generate, test, print, and delete scannable table QR badges</p>
                                    </div>
                                    <button
                                        onClick={handleGenerateNewTableQR}
                                        className="px-4 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#472a00] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 btn-bevel shadow-lg"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Generate New Table QR</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {tables.map((tableNum) => {
                                        const realQrUrl = getRealQrCodeUrl(tableNum);
                                        return (
                                            <div key={tableNum} className="p-5 rounded-3xl bg-[#1A1A1B] border border-[#534434]/60 shadow-xl text-center space-y-4 relative group">
                                                
                                                {/* Delete Table Button */}
                                                <button
                                                    onClick={() => handleDeleteTableQR(tableNum)}
                                                    className="absolute top-3 right-3 p-1.5 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors border border-rose-500/20"
                                                    title="Delete Table QR"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>

                                                <div className="w-12 h-12 rounded-full bg-[#f59e0b] text-[#472a00] font-black text-sm mx-auto flex items-center justify-center font-domine shadow-lg">
                                                    #{tableNum}
                                                </div>

                                                {/* Real Scannable Barcode Image */}
                                                <div className="w-32 h-32 mx-auto p-2 bg-white rounded-2xl shadow-inner flex items-center justify-center border-2 border-[#534434]/40">
                                                    <img src={realQrUrl} alt={`Table ${tableNum} QR`} className="w-full h-full object-contain" />
                                                </div>

                                                <div className="space-y-2">
                                                    <button
                                                        onClick={() => setSelectedPrintTable(tableNum)}
                                                        className="w-full py-2 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#ffc174] font-bold text-xs hover:bg-[#f59e0b] hover:text-[#472a00] flex items-center justify-center gap-1.5 btn-bevel transition-all"
                                                    >
                                                        <Printer className="w-3.5 h-3.5" />
                                                        <span>View & Print QR</span>
                                                    </button>

                                                    <button
                                                        onClick={() => copyTableLink(tableNum)}
                                                        className="w-full py-1.5 rounded-xl bg-[#121213] border border-[#534434] text-[#d8c3ad] hover:text-white font-semibold text-[11px] flex items-center justify-center gap-1.5"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                        <span>{copiedTable === tableNum ? 'Copied Link!' : 'Copy Link'}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* TAB 5: PROMO BANNERS (EXACT 4-BOX LAYOUT MATCHING LANDING PAGE PICTURE 1:1) */}
                        {activeTab === 'banners' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white font-domine">Promotions & Deals Manager</h3>
                                    <p className="text-xs text-[#d8c3ad]">Configure the 4 specific promotion box positions on customer landing page</p>
                                </div>

                                {/* 4-SLOT GRID LAYOUT (MATCHING LANDING PAGE PICTURE 1:1) */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                        
                                        {/* SLOT 1 (Top Left Large Box) */}
                                        <div className="md:col-span-7 h-80 rounded-3xl relative overflow-hidden shadow-2xl group border border-[#534434]/60">
                                            {banners[1] ? (
                                                <div className="w-full h-full relative p-6 flex flex-col justify-end">
                                                    <img src={banners[1].image} alt={banners[1].title} className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-700" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#121213] via-[#121213]/60 to-transparent" />
                                                    
                                                    <div className="relative z-10 space-y-2">
                                                        <span className="px-3 py-1 rounded-md bg-[#f59e0b] text-[#472a00] text-[10px] font-black uppercase tracking-wider">
                                                            {banners[1].tag}
                                                        </span>
                                                        <h4 className="font-domine text-2xl font-bold text-[#ffc174]">{banners[1].title}</h4>
                                                        <p className="text-xs text-[#d8c3ad] leading-relaxed max-w-md line-clamp-2">{banners[1].subtitle}</p>
                                                    </div>

                                                    <button
                                                        onClick={() => openSlotBannerModal(1)}
                                                        className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-[#121213]/90 border border-[#f59e0b] text-[#ffc174] text-xs font-bold flex items-center gap-1.5 btn-bevel"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5 text-[#f59e0b]" />
                                                        <span>Edit Slot #1</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => openSlotBannerModal(1)}
                                                    className="w-full h-full border-2 border-dashed border-[#f59e0b]/50 bg-[#1A1A1B]/40 hover:bg-[#1A1A1B] transition-all flex flex-col items-center justify-center p-6 text-center space-y-3"
                                                >
                                                    <div className="w-14 h-14 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#ffc174] flex items-center justify-center">
                                                        <Plus className="w-8 h-8 text-[#f59e0b]" />
                                                    </div>
                                                    <div>
                                                        <div className="font-domine font-bold text-white text-base">Assign Promo to Slot #1</div>
                                                        <p className="text-xs text-[#8c7a6b]">Main Featured Box (Top Left)</p>
                                                    </div>
                                                </button>
                                            )}
                                        </div>

                                        {/* RIGHT COLUMN (SLOTS 2 & 3) */}
                                        <div className="md:col-span-5 flex flex-col gap-5">
                                            
                                            {/* SLOT 2 (Top Right Upper Box) */}
                                            <div className="h-36 rounded-3xl relative overflow-hidden shadow-2xl group border border-[#534434]/60">
                                                {banners[2] ? (
                                                    <div className="w-full h-full relative p-4 flex flex-col justify-end">
                                                        <img src={banners[2].image} alt={banners[2].title} className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-700" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-[#121213] via-[#121213]/60 to-transparent" />
                                                        
                                                        <div className="relative z-10 space-y-1">
                                                            <span className="px-2.5 py-0.5 rounded bg-[#f59e0b] text-[#472a00] text-[9px] font-black uppercase tracking-wider">
                                                                {banners[2].tag}
                                                            </span>
                                                            <h5 className="font-domine font-bold text-sm text-[#ffc174]">{banners[2].title}</h5>
                                                            <p className="text-[11px] text-[#d8c3ad] line-clamp-1">{banners[2].subtitle}</p>
                                                        </div>

                                                        <button
                                                            onClick={() => openSlotBannerModal(2)}
                                                            className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-xl bg-[#121213]/90 border border-[#f59e0b] text-[#ffc174] text-[10px] font-bold flex items-center gap-1 btn-bevel"
                                                        >
                                                            <Edit2 className="w-3 h-3 text-[#f59e0b]" />
                                                            <span>Edit Slot #2</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => openSlotBannerModal(2)}
                                                        className="w-full h-full border-2 border-dashed border-[#f59e0b]/50 bg-[#1A1A1B]/40 hover:bg-[#1A1A1B] transition-all flex flex-col items-center justify-center p-4 text-center space-y-1.5"
                                                    >
                                                        <Plus className="w-6 h-6 text-[#f59e0b]" />
                                                        <div className="font-bold text-white text-xs">Assign Slot #2 (Top Right)</div>
                                                    </button>
                                                )}
                                            </div>

                                            {/* SLOT 3 (Top Right Lower Box) */}
                                            <div className="h-36 rounded-3xl relative overflow-hidden shadow-2xl group border border-[#534434]/60">
                                                {banners[3] ? (
                                                    <div className="w-full h-full relative p-4 flex flex-col justify-end">
                                                        <img src={banners[3].image} alt={banners[3].title} className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-700" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-[#121213] via-[#121213]/60 to-transparent" />
                                                        
                                                        <div className="relative z-10 space-y-1">
                                                            <span className="px-2.5 py-0.5 rounded bg-[#f59e0b] text-[#472a00] text-[9px] font-black uppercase tracking-wider">
                                                                {banners[3].tag}
                                                            </span>
                                                            <h5 className="font-domine font-bold text-sm text-[#ffc174]">{banners[3].title}</h5>
                                                            <p className="text-[11px] text-[#d8c3ad] line-clamp-1">{banners[3].subtitle}</p>
                                                        </div>

                                                        <button
                                                            onClick={() => openSlotBannerModal(3)}
                                                            className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-xl bg-[#121213]/90 border border-[#f59e0b] text-[#ffc174] text-[10px] font-bold flex items-center gap-1 btn-bevel"
                                                        >
                                                            <Edit2 className="w-3 h-3 text-[#f59e0b]" />
                                                            <span>Edit Slot #3</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => openSlotBannerModal(3)}
                                                        className="w-full h-full border-2 border-dashed border-[#f59e0b]/50 bg-[#1A1A1B]/40 hover:bg-[#1A1A1B] transition-all flex flex-col items-center justify-center p-4 text-center space-y-1.5"
                                                    >
                                                        <Plus className="w-6 h-6 text-[#f59e0b]" />
                                                        <div className="font-bold text-white text-xs">Assign Slot #3 (Middle Right)</div>
                                                    </button>
                                                )}
                                            </div>

                                        </div>
                                    </div>

                                    {/* SLOT 4 (Bottom Full-Width Banner Box) */}
                                    <div className="h-44 rounded-3xl relative overflow-hidden shadow-2xl group border border-[#534434]/60">
                                        {banners[4] ? (
                                            <div className="w-full h-full relative p-6 flex flex-col justify-end">
                                                <img src={banners[4].image} alt={banners[4].title} className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-r from-[#121213] via-[#121213]/80 to-transparent" />
                                                
                                                <div className="relative z-10 space-y-2 max-w-xl">
                                                    <span className="px-3 py-1 rounded-md bg-[#f59e0b] text-[#472a00] text-[10px] font-black uppercase tracking-wider">
                                                        {banners[4].tag}
                                                    </span>
                                                    <h4 className="font-domine text-xl font-bold text-[#ffc174]">{banners[4].title}</h4>
                                                    <p className="text-xs text-[#d8c3ad] leading-relaxed line-clamp-2">{banners[4].subtitle}</p>
                                                    {banners[4].ctaText && (
                                                        <div className="text-xs font-black text-[#f59e0b] uppercase tracking-wider pt-1">{banners[4].ctaText}</div>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => openSlotBannerModal(4)}
                                                    className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-[#121213]/90 border border-[#f59e0b] text-[#ffc174] text-xs font-bold flex items-center gap-1.5 btn-bevel"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5 text-[#f59e0b]" />
                                                    <span>Edit Slot #4</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => openSlotBannerModal(4)}
                                                className="w-full h-full border-2 border-dashed border-[#f59e0b]/50 bg-[#1A1A1B]/40 hover:bg-[#1A1A1B] transition-all flex flex-col items-center justify-center p-6 text-center space-y-3"
                                            >
                                                <Plus className="w-8 h-8 text-[#f59e0b]" />
                                                <div>
                                                    <div className="font-domine font-bold text-white text-base">Assign Slot #4</div>
                                                    <p className="text-xs text-[#8c7a6b]">Bottom Full-Width Horizontal Banner</p>
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 6: VOUCHERS */}
                        {activeTab === 'vouchers' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white font-domine">Discount Vouchers</h3>
                                        <p className="text-xs text-[#d8c3ad]">Create promo discount codes for customer checkout</p>
                                    </div>
                                    <button
                                        onClick={() => setShowAddVoucherModal(true)}
                                        className="px-4 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#472a00] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 btn-bevel shadow-lg"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Create Voucher</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {vouchers.map((v) => (
                                        <div key={v.id} className="p-5 rounded-3xl bg-[#1A1A1B] border border-[#534434]/60 shadow-xl space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono font-black text-lg text-[#ffc174] tracking-widest">{v.code}</span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                                    v.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-stone-800 text-stone-400'
                                                }`}>
                                                    {v.isActive ? 'Active' : 'Expired'}
                                                </span>
                                            </div>

                                            <div className="text-xs text-[#d8c3ad] space-y-1">
                                                <div>Discount: <strong className="text-white">{v.discountPercent}% OFF</strong></div>
                                                <div>Min. Order Amount: <strong className="text-amber-400">₱{v.minSpend.toFixed(2)}</strong></div>
                                                <div>Times Redeemed: <strong className="text-white">{v.usedCount} times</strong></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB 7: EMPLOYEES */}
                        {activeTab === 'employees' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white font-domine">Staff & Employee Accounts</h3>
                                        <p className="text-xs text-[#d8c3ad]">Manage Cashier and Kitchen KDS access permissions</p>
                                    </div>
                                    <button
                                        onClick={() => setShowAddEmployeeModal(true)}
                                        className="px-4 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#472a00] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 btn-bevel shadow-lg"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Staff Account</span>
                                    </button>
                                </div>

                                <div className="rounded-3xl bg-[#1A1A1B] border border-[#534434]/60 shadow-2xl p-6 overflow-hidden">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-[#121213] text-[#8c7a6b] uppercase font-bold border-b border-[#534434]/40">
                                            <tr>
                                                <th className="py-3.5 px-4">Name</th>
                                                <th className="py-3.5 px-4">Email</th>
                                                <th className="py-3.5 px-4">Role</th>
                                                <th className="py-3.5 px-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#534434]/30 text-stone-200">
                                            {employees.map((e) => (
                                                <tr key={e.id} className="hover:bg-[#261e15]/40 transition-colors">
                                                    <td className="py-4 px-4 font-bold text-white">{e.name}</td>
                                                    <td className="py-4 px-4 font-mono text-[#d8c3ad]">{e.email}</td>
                                                    <td className="py-4 px-4">
                                                        <span className="px-2.5 py-1 rounded-full bg-[#f59e0b]/20 text-[#ffc174] text-[10px] font-black uppercase border border-[#f59e0b]/30">
                                                            {e.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase border border-emerald-500/30">
                                                            {e.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TAB 8: AUDIT LOGS */}
                        {activeTab === 'audit' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white font-domine">System Audit Logs</h3>
                                    <p className="text-xs text-[#d8c3ad]">Traceability log of all administrative and staff activities</p>
                                </div>

                                <div className="rounded-3xl bg-[#1A1A1B] border border-[#534434]/60 shadow-2xl p-6 overflow-hidden">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-[#121213] text-[#8c7a6b] uppercase font-bold border-b border-[#534434]/40">
                                            <tr>
                                                <th className="py-3.5 px-4">Timestamp</th>
                                                <th className="py-3.5 px-4">User</th>
                                                <th className="py-3.5 px-4">Module</th>
                                                <th className="py-3.5 px-4">Action Detail</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#534434]/30 text-stone-200">
                                            {auditLogs.map((log) => (
                                                <tr key={log.id} className="hover:bg-[#261e15]/40 transition-colors">
                                                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#8c7a6b]">{log.timestamp}</td>
                                                    <td className="py-3.5 px-4 font-semibold text-white">{log.user}</td>
                                                    <td className="py-3.5 px-4 font-bold text-[#ffc174]">{log.module}</td>
                                                    <td className="py-3.5 px-4 text-[#d8c3ad] font-mono">{log.action}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TAB 9: SALES & REVENUE */}
                        {activeTab === 'sales' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white font-domine">Sales & Revenue Report</h3>
                                    <p className="text-xs text-[#d8c3ad]">Gross sales figures, order type distribution, and top performers</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 rounded-3xl bg-[#1A1A1B] border border-[#534434]/60 space-y-2">
                                        <span className="text-xs font-bold text-[#8c7a6b] uppercase">Gross Revenue (Total)</span>
                                        <div className="text-3xl font-mono font-black text-[#ffc174]">₱ {totalRevenue.toFixed(2)}</div>
                                        <p className="text-[11px] text-emerald-400 font-bold">100% verified sales</p>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-[#1A1A1B] border border-[#534434]/60 space-y-2">
                                        <span className="text-xs font-bold text-[#8c7a6b] uppercase">Average Order Value</span>
                                        <div className="text-3xl font-mono font-black text-white">₱ {(totalRevenue / Math.max(1, orders.length)).toFixed(2)}</div>
                                        <p className="text-[11px] text-[#d8c3ad]">Across all 3 fulfillment channels</p>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-[#1A1A1B] border border-[#534434]/60 space-y-2">
                                        <span className="text-xs font-bold text-[#8c7a6b] uppercase">Completed Orders</span>
                                        <div className="text-3xl font-mono font-black text-white">{orders.length} Orders</div>
                                        <p className="text-[11px] text-emerald-400 font-bold">0% Cancellation rate</p>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </main>
            </div>

            {/* ADD PRODUCT MODAL (WITH IMAGE URL FIELD) */}
            {showAddProductModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <form onSubmit={handleCreateProduct} className="w-full max-w-md rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-[#534434]/40">
                            <h3 className="text-lg font-bold text-white font-domine">Add New Sizzling Dish</h3>
                            <button type="button" onClick={() => setShowAddProductModal(false)} className="text-[#8c7a6b] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Dish Name *</label>
                            <input
                                type="text"
                                required
                                value={newProductName}
                                onChange={(e) => setNewProductName(e.target.value)}
                                placeholder="e.g. Sizzling Ribeye Steak"
                                className="w-full px-3.5 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Dish Image URL *</label>
                            <input
                                type="text"
                                value={newProductImage}
                                onChange={(e) => setNewProductImage(e.target.value)}
                                placeholder="https://example.com/dish.jpg"
                                className="w-full px-3.5 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Price (₱) *</label>
                                <input
                                    type="number"
                                    required
                                    value={newProductPrice}
                                    onChange={(e) => setNewProductPrice(e.target.value)}
                                    placeholder="250.00"
                                    className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Stock Count *</label>
                                <input
                                    type="number"
                                    required
                                    value={newProductStock}
                                    onChange={(e) => setNewProductStock(e.target.value)}
                                    placeholder="50"
                                    className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={() => setShowAddProductModal(false)} className="w-1/2 py-2.5 rounded-xl bg-[#261e15] text-[#d8c3ad] text-xs font-bold">Cancel</button>
                            <button type="submit" className="w-1/2 py-2.5 rounded-xl bg-[#f59e0b] text-[#472a00] text-xs font-black uppercase btn-bevel">Add Dish</button>
                        </div>
                    </form>
                </div>
            )}

            {/* EDIT PRODUCT MODAL */}
            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <form onSubmit={handleSaveEditProduct} className="w-full max-w-md rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-[#534434]/40">
                            <h3 className="text-lg font-bold text-white font-domine">Edit Product Details</h3>
                            <button type="button" onClick={() => setEditingProduct(null)} className="text-[#8c7a6b] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Dish Name</label>
                            <input
                                type="text"
                                required
                                value={editingProduct.name}
                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                className="w-full px-3.5 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Image URL</label>
                            <input
                                type="text"
                                required
                                value={editingProduct.image}
                                onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                                className="w-full px-3.5 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Price (₱)</label>
                                <input
                                    type="number"
                                    required
                                    value={editingProduct.price}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Stock Count</label>
                                <input
                                    type="number"
                                    required
                                    value={editingProduct.stock}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={() => setEditingProduct(null)} className="w-1/2 py-2.5 rounded-xl bg-[#261e15] text-[#d8c3ad] text-xs font-bold">Cancel</button>
                            <button type="submit" className="w-1/2 py-2.5 rounded-xl bg-[#f59e0b] text-[#472a00] text-xs font-black uppercase btn-bevel">Save Changes</button>
                        </div>
                    </form>
                </div>
            )}

            {/* PRINT & VIEW TABLE QR MODAL (PRESERVED ROADHOUSE DARK THEME PRINT BADGE) */}
            {selectedPrintTable && (
                <div id="printable-qr-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <div className="w-full max-w-sm rounded-3xl bg-[#121213] text-[#f0e0d1] border-2 border-[#f59e0b] p-6 shadow-2xl text-center space-y-4 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center pb-2 border-b border-[#534434]/60">
                            <span className="font-domine font-black text-[#ffc174] text-sm">SADDLE RANCH ROADHOUSE</span>
                            <button onClick={() => setSelectedPrintTable(null)} className="text-[#8c7a6b] hover:text-white no-print">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div>
                            <div className="text-[11px] font-bold text-[#f59e0b] uppercase tracking-widest">In-House Table QR Badge</div>
                            <h3 className="text-3xl font-black font-domine text-[#ffc174] mt-0.5">TABLE #{selectedPrintTable}</h3>
                        </div>

                        {/* High-Resolution Working Scannable QR Barcode */}
                        <div className="w-52 h-52 mx-auto p-3 bg-white border-4 border-[#f59e0b] rounded-2xl shadow-xl flex items-center justify-center">
                            <img src={getRealQrCodeUrl(selectedPrintTable)} alt={`Table ${selectedPrintTable} QR`} className="w-full h-full object-contain" />
                        </div>

                        <div className="p-3 rounded-2xl bg-[#1A1A1B] border border-[#534434]/40 text-xs text-[#d8c3ad] leading-snug">
                            Scan with camera to order directly from Table #{selectedPrintTable}
                            <div className="font-mono text-[10px] text-[#8c7a6b] mt-1 truncate">
                                {typeof window !== 'undefined' ? `${window.location.origin}/dine-in?table=${selectedPrintTable}` : ''}
                            </div>
                        </div>

                        <div className="pt-2 flex gap-2 no-print">
                            <button
                                onClick={() => window.print()}
                                className="w-full py-3.5 rounded-2xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#472a00] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl btn-bevel"
                            >
                                <Printer className="w-4 h-4" />
                                <span>Print Roadhouse Badge</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ASSIGN / EDIT BANNER FOR SLOT MODAL */}
            {targetBannerSlot !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <form onSubmit={handleSaveSlotBanner} className="w-full max-w-md rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-[#534434]/40">
                            <h3 className="text-lg font-bold text-white font-domine">
                                Assign Promo to Slot #{targetBannerSlot}
                            </h3>
                            <button type="button" onClick={() => setTargetBannerSlot(null)} className="text-[#8c7a6b] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Banner Title *</label>
                            <input
                                type="text"
                                required
                                value={newBannerTitle}
                                onChange={(e) => setNewBannerTitle(e.target.value)}
                                placeholder="e.g. Sisig Saturdays Deal"
                                className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Subtitle / Deal Description</label>
                            <input
                                type="text"
                                value={newBannerSubtitle}
                                onChange={(e) => setNewBannerSubtitle(e.target.value)}
                                placeholder="e.g. Enjoy 20% off our legendary Pork Sisig..."
                                className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Promo Tag (e.g. WEEKEND SPECIAL • 20% OFF)</label>
                            <input
                                type="text"
                                value={newBannerTag}
                                onChange={(e) => setNewBannerTag(e.target.value)}
                                placeholder="WEEKEND SPECIAL • 20% OFF"
                                className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white uppercase"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Banner Image URL *</label>
                            <input
                                type="text"
                                value={newBannerImage}
                                onChange={(e) => setNewBannerImage(e.target.value)}
                                placeholder="https://example.com/banner.jpg"
                                className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white"
                            />
                        </div>

                        {targetBannerSlot === 4 && (
                            <div>
                                <label className="block text-xs font-bold text-[#d8c3ad] mb-1">CTA Action Text (Optional)</label>
                                <input
                                    type="text"
                                    value={newBannerCta}
                                    onChange={(e) => setNewBannerCta(e.target.value)}
                                    placeholder="e.g. ORDER PULUTAN NOW →"
                                    className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white"
                                />
                            </div>
                        )}

                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={() => setTargetBannerSlot(null)} className="w-1/2 py-2.5 rounded-xl bg-[#261e15] text-[#d8c3ad] text-xs font-bold">Cancel</button>
                            <button type="submit" className="w-1/2 py-2.5 rounded-xl bg-[#f59e0b] text-[#472a00] text-xs font-black uppercase btn-bevel">Save Slot #{targetBannerSlot}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* ADD VOUCHER MODAL */}
            {showAddVoucherModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <form onSubmit={handleCreateVoucher} className="w-full max-w-sm rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-6 shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-white font-domine">Create Promo Voucher</h3>
                        <div>
                            <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Voucher Code *</label>
                            <input
                                type="text"
                                required
                                value={newVoucherCode}
                                onChange={(e) => setNewVoucherCode(e.target.value)}
                                placeholder="e.g. SUMMER15"
                                className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white uppercase"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Discount (% Off) *</label>
                            <input
                                type="number"
                                required
                                value={newVoucherDiscount}
                                onChange={(e) => setNewVoucherDiscount(e.target.value)}
                                placeholder="15"
                                className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white"
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={() => setShowAddVoucherModal(false)} className="w-1/2 py-2.5 rounded-xl bg-[#261e15] text-[#d8c3ad] text-xs font-bold">Cancel</button>
                            <button type="submit" className="w-1/2 py-2.5 rounded-xl bg-[#f59e0b] text-[#472a00] text-xs font-black uppercase btn-bevel">Create</button>
                        </div>
                    </form>
                </div>
            )}

            {/* ADD EMPLOYEE MODAL */}
            {showAddEmployeeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <form onSubmit={handleCreateEmployee} className="w-full max-w-sm rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-6 shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-white font-domine">Add Staff Account</h3>
                        <div>
                            <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Full Name *</label>
                            <input
                                type="text"
                                required
                                value={newEmpName}
                                onChange={(e) => setNewEmpName(e.target.value)}
                                placeholder="Staff Name"
                                className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Email Address *</label>
                            <input
                                type="email"
                                required
                                value={newEmpEmail}
                                onChange={(e) => setNewEmpEmail(e.target.value)}
                                placeholder="staff@saddleranch.ph"
                                className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white"
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={() => setShowAddEmployeeModal(false)} className="w-1/2 py-2.5 rounded-xl bg-[#261e15] text-[#d8c3ad] text-xs font-bold">Cancel</button>
                            <button type="submit" className="w-1/2 py-2.5 rounded-xl bg-[#f59e0b] text-[#472a00] text-xs font-black uppercase btn-bevel">Create Account</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
