import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
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
    Printer,
    Upload,
    ArrowRight,
    Calendar,
    BarChart3,
    PieChart,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    MapPin
} from 'lucide-react';

interface ProductItem {
    id: number;
    name: string;
    category: 'Sizzling Rice Meals' | 'Authentic Filipino Cuisine' | 'Barkada Platters' | 'Drinks & Extra Rice';
    description: string;
    price: number;
    stock: number;
    priceBulihan?: number;
    stockBulihan?: number;
    priceDasmarinas?: number;
    stockDasmarinas?: number;
    isActive: boolean;
    image: string;
}

interface OrderItem {
    id: string;
    order_number?: string;
    type: 'Dine-In' | 'Pick-Up' | 'Delivery';
    location: string;
    branch: 'Bulihan' | 'Dasma';
    customer: string;
    phone: string;
    amount: number;
    payment: string;
    status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
    time: string;
    itemsCount: number;
    date: string; // YYYY-MM-DD
}

interface BannerItem {
    id?: number;
    slot: number; // 1, 2, 3, or 4
    title: string;
    subtitle: string;
    tag: string;
    branch?: 'All' | 'Bulihan' | 'Dasma';
    image: string;
    ctaText?: string;
    isActive: boolean;
}

interface VoucherItem {
    id: number;
    code: string;
    discount_type?: 'fixed' | 'percentage';
    discountPercent?: number;
    value?: number;
    minSpend: number;
    is_one_time_use?: boolean;
    is_limited_time?: boolean;
    starts_at?: string;
    expires_at?: string;
    usedCount: number;
    branch?: 'All' | 'Bulihan' | 'Dasma' | 'all' | string;
    isActive: boolean;
}

interface EmployeeItem {
    id: number;
    name: string;
    email: string;
    role: 'Admin' | 'Kitchen Staff' | 'Cashier' | 'Staff' | 'Customer' | string;
    branch?: 'All' | 'Bulihan' | 'Dasma';
    status: 'Active' | 'Inactive';
    createdAt: string;
}

interface AuditLogItem {
    id: number;
    timestamp: string; // YYYY-MM-DD HH:MM:SS
    user: string;
    role: string;
    action: string;
    branch?: 'Bulihan' | 'Dasma';
    module: 'Authentication' | 'Order Queue / Sales' | 'Products & Stock' | 'Vouchers' | 'Promo Banners' | 'Employees' | 'Tables & QR';
}

interface AdminDashboardProps {
    initialOrders?: any[];
    initialProducts?: any[];
    initialAuditLogs?: any[];
    initialEmployees?: any[];
    initialVouchers?: any[];
    initialBanners?: any[];
}

export default function AdminDashboard({ initialOrders, initialProducts, initialAuditLogs, initialEmployees, initialVouchers, initialBanners }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Order Queue Status Filter
    const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

    const defaultImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t';
    const defaultBannerImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuASVSO6N3lzIbdlCDT85viSxOZiQKjWADlA5k7ymludjTdSCB7tqV0bZvXRba3-L4gemLyqy9PxmqnYMBnSsxb5yfI_XM-qajS5ZEnS1Am8OBu5uN8_smBFlDdy4xR0UNE8jDFJP8vNSRQcqqDSG4p-oDij5kCvWALcyBZVeuA1QdnqC9a6I5s9l2ba3Zjfe0xSPjMr0jLCAB1z-oJS5xBL9meeUeFsmiMgjQ96VoXotgHsy3Jl3d9NQIv1liJsKeu_sJec2rrkNziY';

    const formatEmployees = (rawEmps: any[]): EmployeeItem[] => {
        if (!rawEmps || rawEmps.length === 0) {
            return [
                { id: 1, name: 'Saddle Ranch Admin', email: 'admin@saddleranch.ph', role: 'Admin', branch: 'All', status: 'Active', createdAt: '2026-01-15' },
                { id: 2, name: 'Bulihan Branch Cashier', email: 'cashier.bulihan@saddleranch.ph', role: 'Cashier', branch: 'Bulihan', status: 'Active', createdAt: '2026-03-10' },
                { id: 3, name: 'Bulihan Kitchen Head Chef', email: 'kitchen.bulihan@saddleranch.ph', role: 'Kitchen Staff', branch: 'Bulihan', status: 'Active', createdAt: '2026-05-20' },
                { id: 4, name: 'Dasmariñas Branch Cashier', email: 'cashier.dasmarinas@saddleranch.ph', role: 'Cashier', branch: 'Dasma', status: 'Active', createdAt: '2026-06-01' },
                { id: 5, name: 'Dasmariñas Kitchen Head Chef', email: 'kitchen.dasmarinas@saddleranch.ph', role: 'Kitchen Staff', branch: 'Dasma', status: 'Active', createdAt: '2026-06-05' }
            ];
        }
        return rawEmps.map((e: any) => ({
            id: e.id,
            name: e.name || e.email,
            email: e.email,
            role: e.role === 'admin' ? 'Admin' : (e.role === 'kitchen' ? 'Kitchen Staff' : (e.role === 'cashier' ? 'Cashier' : (e.role === 'employee' ? 'Staff' : 'Customer'))),
            branch: e.branch ? (e.branch.toLowerCase().includes('dasma') ? 'Dasma' : (e.branch.toLowerCase().includes('all') ? 'All' : 'Bulihan')) : 'Bulihan',
            status: 'Active',
            createdAt: e.created_at ? e.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        }));
    };

    const [employees, setEmployees] = useState<EmployeeItem[]>(formatEmployees(initialEmployees || []));

    React.useEffect(() => {
        if (initialEmployees && initialEmployees.length > 0) {
            setEmployees(formatEmployees(initialEmployees));
        }
    }, [initialEmployees]);

    const formatProducts = (rawProds: any[]): ProductItem[] => {
        if (!rawProds || rawProds.length === 0) return [];
        return rawProds.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category || 'Sizzling Rice Meals',
            description: p.description || 'Delicious roadhouse sizzling meal.',
            price: Number(p.price || 0),
            stock: Number(p.stock_quantity ?? 50),
            priceBulihan: Number(p.price_bulihan ?? p.price ?? 0),
            stockBulihan: Number(p.stock_bulihan ?? p.stock_quantity ?? 50),
            priceDasmarinas: Number(p.price_dasmarinas ?? p.price ?? 0),
            stockDasmarinas: Number(p.stock_dasmarinas ?? p.stock_quantity ?? 50),
            isActive: Boolean(p.is_active),
            image: p.image_path || defaultImg,
        }));
    };

    // Menu Products Dataset with Branch-Specific Stock & Prices (Bulihan vs Dasmariñas)
    const [products, setProducts] = useState<ProductItem[]>(formatProducts(initialProducts || []));

    React.useEffect(() => {
        if (initialProducts && initialProducts.length > 0) {
            setProducts(formatProducts(initialProducts));
        }
    }, [initialProducts]);

    const formatOrders = (rawOrders: any[]): OrderItem[] => {
        if (!rawOrders) return [];
        return rawOrders.map((o: any) => ({
            id: o.order_number || o.id?.toString(),
            order_number: o.order_number || o.id?.toString(),
            type: o.order_type === 'dine_in' ? 'Dine-In' : o.order_type === 'pickup' ? 'Pick-Up' : 'Delivery',
            location: o.table_number ? `Table ${o.table_number}` : (o.delivery_address || 'Counter'),
            branch: o.branch ? (o.branch.toLowerCase().includes('dasma') ? 'Dasma' : 'Bulihan') : 'Bulihan',
            customer: o.customer_name || 'Guest',
            phone: o.customer_phone || '',
            amount: Number(o.total_amount || o.amount || 0),
            payment: o.payment_method || 'Cash',
            status: o.status || 'pending',
            time: o.created_at ? new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
            itemsCount: o.order_items ? o.order_items.length : (o.itemsCount || 1),
            date: o.created_at ? o.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        }));
    };

    const [orders, setOrders] = useState<OrderItem[]>(formatOrders(initialOrders || []));

    const fetchLatestOrders = async () => {
        try {
            const res = await fetch('/api/v1/admin/orders');
            if (res.ok) {
                const json = await res.json();
                if (json.data) {
                    setOrders(formatOrders(json.data));
                }
                if (json.products && json.products.length > 0) {
                    setProducts(formatProducts(json.products));
                }
            }
        } catch (e) {
            // Ignore polling errors
        }
    };

    React.useEffect(() => {
        fetchLatestOrders();
        const interval = setInterval(fetchLatestOrders, 2000);
        return () => clearInterval(interval);
    }, []);

    const formatBanners = (rawBanners: any[]): Record<number, BannerItem> => {
        const fallback: Record<number, BannerItem> = {
            1: {
                id: 1,
                slot: 1,
                title: 'Sisig Saturdays Deal',
                subtitle: 'Enjoy 20% off our legendary 24-hour marinated Pork Sisig served on a smoking hot skillet with raw egg and calamansi.',
                tag: 'WEEKEND SPECIAL • 20% OFF',
                branch: 'All',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6QEUONokTX7mi1M1Wrie14cxeoNfVq5HyIS1sLOLWKbzZyh6OfegCBaNeH6E7uS37ugVc6jjmILNzIrmvE0tpXkOBCDP29HO1WZL69MsOd6lpwp4oX6ezfDjuAsLMCu57vBpiHDupWu3yDATuk2k_HgpQMi23Y7mifgQKqPJhc0GqDXCCk1tPooIkFyBCXPiESBHm8HKF8cp1ctvD0RZ39YNVxKG_2cPaPyfryUGBbaoIHhqqhq5R9BflPtI6jMfzsP3W6QStlttx',
                isActive: true
            },
            2: {
                id: 2,
                slot: 2,
                title: 'Cowboy Ribeye Special',
                subtitle: 'Bone-in, seared on smoking cast iron.',
                tag: 'NEW ARRIVAL',
                branch: 'Bulihan',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASVSO6N3lzIbdlCDT85viSxOZiQKjWADlA5k7ymludjTdSCB7tqV0bZvXRba3-L4gemLyqy9PxmqnYMBnSsxb5yfI_XM-qajS5ZEnS1Am8OBu5uN8_smBFlDdy4xR0UNE8jDFJP8vNSRQcqqDSG4p-oDij5kCvWALcyBZVeuA1QdnqC9a6I5s9l2ba3Zjfe0xSPjMr0jLCAB1z-oJS5xBL9meeUeFsmiMgjQ96VoXotgHsy3Jl3d9NQIv1liJsKeu_sJec2rrkNziY',
                isActive: true
            },
            3: {
                id: 3,
                slot: 3,
                title: 'Unlimited Rice & Soup',
                subtitle: 'Unli rice & soup at selected products for both branches — exclusive offer for only ₱79 at Dasmariñas Branch!',
                tag: 'DASMARIÑAS BRANCH • ₱79 UNLI RICE & SOUP',
                branch: 'Dasma',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCatSLXJ-mynm_AwjLXsdG9xKbMwziehShgiNtyXaX2NZEeZFhSXaTmHMgLuACAitSC3WZ0g_9lSTavvnqO4eKFlaC0pnnA9OngEMtRicl0vfSF2_t4WqzxTKxW-H-X0i_tppiClzEOZ-fAuu1ezCbRVOcdVdwZHokttY1ATDIO4BuA185dwrm0QDuPpYjQ7qD9ybH5bl0WPn1wHJ3S5pB6JuCOoocWTfZ95cB0Lfqx1KbjbUwqGJxkhwxmqypEJta64yq1PajT3oWC',
                isActive: true
            },
            4: {
                id: 4,
                slot: 4,
                title: 'Pulutan Happy Hour Specials',
                subtitle: "Gather 'round the roadhouse hearth with ice-cold beverages and piping hot sizzling pulutan platters.",
                tag: 'HAPPY HOUR • 4PM - 7PM DAILY',
                branch: 'All',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl',
                ctaText: 'ORDER PULUTAN NOW →',
                isActive: true
            }
        };

        if (!rawBanners || rawBanners.length === 0) return fallback;

        const result: Record<number, BannerItem> = { ...fallback };
        rawBanners.forEach((b: any, index: number) => {
            const slot = b.display_order || (index + 1);
            if (slot >= 1 && slot <= 4) {
                result[slot] = {
                    id: b.id,
                    slot: slot,
                    title: b.title,
                    subtitle: b.subtitle || fallback[slot]?.subtitle || '',
                    tag: b.tag || fallback[slot]?.tag || 'SPECIAL DEAL',
                    branch: b.branch === 'bulihan' ? 'Bulihan' : (b.branch === 'dasmarinas' ? 'Dasma' : 'All'),
                    image: b.image_path || defaultBannerImg,
                    ctaText: b.cta_text || fallback[slot]?.ctaText || 'VIEW PROMO',
                    isActive: Boolean(b.is_active),
                };
            }
        });
        return result;
    };

    // 4 PROMO BANNER SLOTS
    const [banners, setBanners] = useState<Record<number, BannerItem>>(formatBanners(initialBanners || []));

    React.useEffect(() => {
        if (initialBanners && initialBanners.length > 0) {
            setBanners(formatBanners(initialBanners));
        }
    }, [initialBanners]);

    const formatVouchers = (raw: any[]): VoucherItem[] => {
        if (!raw || raw.length === 0) {
            return [
                { id: 1, code: 'SADDLE10', discount_type: 'percentage', value: 10, discountPercent: 10, minSpend: 300, is_one_time_use: true, is_limited_time: false, usedCount: 42, isActive: true },
                { id: 2, code: 'BULIHANFREE', discount_type: 'percentage', value: 15, discountPercent: 15, minSpend: 500, is_one_time_use: false, is_limited_time: true, usedCount: 89, isActive: true },
            ];
        }
        return raw.map((v: any) => ({
            id: v.id,
            code: v.code,
            discount_type: v.discount_type || 'percentage',
            value: Number(v.value),
            discountPercent: v.discount_type === 'percentage' ? Number(v.value) : 0,
            minSpend: Number(v.min_spend || 0),
            is_one_time_use: Boolean(v.is_one_time_use),
            is_limited_time: Boolean(v.is_limited_time),
            starts_at: v.starts_at ? v.starts_at.split('T')[0] : undefined,
            expires_at: v.expires_at ? v.expires_at.split('T')[0] : undefined,
            usedCount: v.times_used || 0,
            branch: v.branch ? (v.branch.toLowerCase().includes('dasma') ? 'Dasma' : (v.branch.toLowerCase().includes('all') ? 'All' : 'Bulihan')) : 'All',
            isActive: true,
        }));
    };

    const [vouchers, setVouchers] = useState<VoucherItem[]>(formatVouchers(initialVouchers || []));

    React.useEffect(() => {
        if (initialVouchers && initialVouchers.length > 0) {
            setVouchers(formatVouchers(initialVouchers));
        }
    }, [initialVouchers]);

    const [tables, setTables] = useState<string[]>(['01', '02', '03', '04', '05', '06', '07', '08']);
    const [selectedPrintTable, setSelectedPrintTable] = useState<string | null>(null);

    // Order Void & Delete Modals State
    const [voidingOrder, setVoidingOrder] = useState<any | null>(null);
    const [voidPassword, setVoidPassword] = useState('');
    const [voidReason, setVoidReason] = useState('');
    const [isVoiding, setIsVoiding] = useState(false);
    const [voidError, setVoidError] = useState('');

    const [deletingOrder, setDeletingOrder] = useState<any | null>(null);
    const [isDeletingOrder, setIsDeletingOrder] = useState(false);

    // Expanded Audit Logs Dataset
    const formatAuditLogs = (rawLogs: any[]): AuditLogItem[] => {
        if (!rawLogs || rawLogs.length === 0) return [];
        return rawLogs.map((log: any) => ({
            id: log.id,
            timestamp: log.created_at ? new Date(log.created_at).toISOString().replace('T', ' ').substring(0, 19) : '',
            user: log.user ? log.user.email : 'System',
            role: log.user ? (log.user.role === 'admin' ? 'Admin' : 'Staff') : 'System',
            action: log.action || '',
            module: 'Order Queue / Sales',
        }));
    };

    const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(formatAuditLogs(initialAuditLogs || []));

    React.useEffect(() => {
        if (initialAuditLogs && initialAuditLogs.length > 0) {
            setAuditLogs(formatAuditLogs(initialAuditLogs));
        }
    }, [initialAuditLogs]);

    // Add Product Modal & Form State
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [newProductName, setNewProductName] = useState('');
    const [newProductCategory, setNewProductCategory] = useState<ProductItem['category']>('Sizzling Rice Meals');
    const [newProductDescription, setNewProductDescription] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [newProductPriceBulihan, setNewProductPriceBulihan] = useState('');
    const [newProductPriceDasmarinas, setNewProductPriceDasmarinas] = useState('');
    const [newProductStock, setNewProductStock] = useState('50');
    const [newProductStockBulihan, setNewProductStockBulihan] = useState('30');
    const [newProductStockDasmarinas, setNewProductStockDasmarinas] = useState('20');
    const [newProductImageFile, setNewProductImageFile] = useState<File | null>(null);
    const [newProductImagePreview, setNewProductImagePreview] = useState<string | null>(null);

    // Edit Product State
    const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
    const [editProductName, setEditProductName] = useState('');
    const [editProductCategory, setEditProductCategory] = useState<ProductItem['category']>('Sizzling Rice Meals');
    const [editProductDescription, setEditProductDescription] = useState('');
    const [editProductPrice, setEditProductPrice] = useState('');
    const [editProductPriceBulihan, setEditProductPriceBulihan] = useState('');
    const [editProductPriceDasmarinas, setEditProductPriceDasmarinas] = useState('');
    const [editProductStock, setEditProductStock] = useState('50');
    const [editProductStockBulihan, setEditProductStockBulihan] = useState('30');
    const [editProductStockDasmarinas, setEditProductStockDasmarinas] = useState('20');
    const [editProductImageFile, setEditProductImageFile] = useState<File | null>(null);
    const [editProductImagePreview, setEditProductImagePreview] = useState<string | null>(null);

    // Form Loading and Errors
    const [isSavingProduct, setIsSavingProduct] = useState(false);
    const [productFormErrors, setProductFormErrors] = useState<Record<string, string>>({});

    const [deletingProduct, setDeletingProduct] = useState<ProductItem | null>(null);
    const [isDeletingProduct, setIsDeletingProduct] = useState(false);

    const openEditProductModal = (p: ProductItem) => {
        setEditingProduct(p);
        setEditProductName(p.name);
        setEditProductCategory(p.category);
        setEditProductDescription(p.description || '');
        setEditProductPrice((p.price || 0).toString());
        setEditProductPriceBulihan((p.priceBulihan ?? p.price ?? 0).toString());
        setEditProductPriceDasmarinas((p.priceDasmarinas ?? p.price ?? 0).toString());
        setEditProductStock((p.stock || 0).toString());
        setEditProductStockBulihan((p.stockBulihan ?? Math.floor((p.stock || 0) * 0.6)).toString());
        setEditProductStockDasmarinas((p.stockDasmarinas ?? Math.floor((p.stock || 0) * 0.4)).toString());
        setEditProductImageFile(null);
        setEditProductImagePreview(p.image || null);
        setProductFormErrors({});
    };

    // Products Category & Branch Sort Filter & 10-Item Pagination
    const [productCategoryFilter, setProductCategoryFilter] = useState<string>('All');
    const [productBranchFilter, setProductBranchFilter] = useState<string>('Bulihan');
    const [productPage, setProductPage] = useState<number>(1);

    // Slot-based Banner Modal State with Real-Time Preview
    const [targetBannerSlot, setTargetBannerSlot] = useState<number | null>(null);
    const [newBannerTitle, setNewBannerTitle] = useState('');
    const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
    const [newBannerTag, setNewBannerTag] = useState('');
    const [newBannerImage, setNewBannerImage] = useState('');
    const [newBannerCta, setNewBannerCta] = useState('');
    const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
    const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
    const [isSavingBanner, setIsSavingBanner] = useState(false);
    const [bannerErrors, setBannerErrors] = useState<Record<string, string>>({});

    // Voucher Modal State with Real-Time Preview
    const [showAddVoucherModal, setShowAddVoucherModal] = useState(false);
    const [newVoucherCode, setNewVoucherCode] = useState('');
    const [newVoucherDiscountType, setNewVoucherDiscountType] = useState<'fixed' | 'percentage'>('percentage');
    const [newVoucherValue, setNewVoucherValue] = useState('10');
    const [newVoucherMinSpend, setNewVoucherMinSpend] = useState('300');
    const [newVoucherIsOneTime, setNewVoucherIsOneTime] = useState(true);
    const [newVoucherIsLimitedTime, setNewVoucherIsLimitedTime] = useState(false);
    const [newVoucherStartsAt, setNewVoucherStartsAt] = useState('');
    const [newVoucherExpiresAt, setNewVoucherExpiresAt] = useState('');
    const [isSavingVoucher, setIsSavingVoucher] = useState(false);
    const [voucherErrors, setVoucherErrors] = useState<Record<string, string>>({});
    const [deletingVoucher, setDeletingVoucher] = useState<VoucherItem | null>(null);
    const [isDeletingVoucher, setIsDeletingVoucher] = useState(false);

    // Employee CRUD Modals State
    const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
    const [newEmpName, setNewEmpName] = useState('');
    const [newEmpEmail, setNewEmpEmail] = useState('');
    const [newEmpPassword, setNewEmpPassword] = useState('password123');
    const [newEmpRole, setNewEmpRole] = useState<'Admin' | 'Kitchen Staff' | 'Cashier'>('Cashier');
    const [newEmpBranch, setNewEmpBranch] = useState<'Bulihan' | 'Dasma'>('Bulihan');
    const [isSavingEmployee, setIsSavingEmployee] = useState(false);
    const [employeeErrors, setEmployeeErrors] = useState<Record<string, string>>({});
    const [editingEmployee, setEditingEmployee] = useState<EmployeeItem | null>(null);
    const [deletingEmployee, setDeletingEmployee] = useState<EmployeeItem | null>(null);
    const [isDeletingEmployee, setIsDeletingEmployee] = useState(false);
    const [userRoleFilter, setUserRoleFilter] = useState<string>('All');

    // Audit Logs Filters & Pagination
    const [auditModuleFilter, setAuditModuleFilter] = useState<string>('All');
    const [auditSortOrder, setAuditSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [auditStartDate, setAuditStartDate] = useState<string>('');
    const [auditEndDate, setAuditEndDate] = useState<string>('');
    const [auditPage, setAuditPage] = useState<number>(1);

    // Sales & Revenue Filters
    const [salesBranchFilter, setSalesBranchFilter] = useState<string>('Bulihan');
    const [salesDateRange, setSalesDateRange] = useState<'all' | 'today' | '7days' | 'month'>('all');
    const [salesStartDate, setSalesStartDate] = useState<string>('');
    const [salesEndDate, setSalesEndDate] = useState<string>('');
    const [salesSortOrder, setSalesSortOrder] = useState<'newest' | 'oldest'>('newest');

    const [copiedTable, setCopiedTable] = useState<string | null>(null);

    // Helper: File Upload Blob Converter
    const handleFileUpload = (file: File, callback: (blobUrl: string) => void) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                callback(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    // Helpers
    const updateOrderStatus = async (orderId: string | number, newStatus: OrderItem['status']) => {
        try {
            await fetch(`/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ status: newStatus }),
            });
        } catch (e) {
            console.error('Failed to update status on server:', e);
        }
        setOrders(orders.map(o => (o.id === orderId || o.order_number === orderId) ? { ...o, status: newStatus } : o));
    };

    const toggleProductStatus = (id: number) => {
        router.post(`/admin/products/${id}/toggle`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setProducts((prev) => prev.map((p) => p.id === id ? { ...p, isActive: !p.isActive } : p));
            }
        });
    };

    const updateProductStock = (id: number, delta: number) => {
        const prod = products.find(p => p.id === id);
        if (!prod) return;

        let nextStockBulihan = prod.stockBulihan ?? Math.floor(prod.stock * 0.6);
        let nextStockDasma = prod.stockDasmarinas ?? Math.floor(prod.stock * 0.4);

        if (productBranchFilter === 'Bulihan') {
            nextStockBulihan = Math.max(0, nextStockBulihan + delta);
        } else {
            nextStockDasma = Math.max(0, nextStockDasma + delta);
        }
        const nextTotalStock = nextStockBulihan + nextStockDasma;

        setProducts(products.map(p => {
            if (p.id !== id) return p;
            return {
                ...p,
                stock: nextTotalStock,
                stockBulihan: nextStockBulihan,
                stockDasmarinas: nextStockDasma,
            };
        }));

        router.post(`/admin/products/${id}`, {
            name: prod.name,
            description: prod.description,
            price: prod.price,
            price_bulihan: prod.priceBulihan ?? prod.price,
            price_dasmarinas: prod.priceDasmarinas ?? prod.price,
            stock_quantity: nextTotalStock,
            stock_bulihan: nextStockBulihan,
            stock_dasmarinas: nextStockDasma,
            is_active: prod.isActive,
        }, {
            preserveScroll: true,
        });
    };

    const deleteProduct = (p: ProductItem) => {
        setDeletingProduct(p);
    };

    const handleConfirmDeleteProduct = () => {
        if (!deletingProduct) return;
        setIsDeletingProduct(true);
        router.delete(`/admin/products/${deletingProduct.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
                setDeletingProduct(null);
                setIsDeletingProduct(false);
            },
            onError: (err) => {
                console.error('Failed to delete product:', err);
                setIsDeletingProduct(false);
            },
            onFinish: () => {
                setIsDeletingProduct(false);
            }
        });
    };

    const deleteVoucher = (v: VoucherItem) => {
        setDeletingVoucher(v);
    };

    const handleConfirmDeleteVoucher = () => {
        if (!deletingVoucher) return;
        setIsDeletingVoucher(true);
        router.delete(`/admin/vouchers/${deletingVoucher.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setVouchers((prev) => prev.filter((v) => v.id !== deletingVoucher.id));
                setDeletingVoucher(null);
                setIsDeletingVoucher(false);
            },
            onError: (err) => {
                console.error('Failed to delete voucher:', err);
                setIsDeletingVoucher(false);
            },
            onFinish: () => {
                setIsDeletingVoucher(false);
            }
        });
    };

    const deleteEmployee = (e: EmployeeItem) => {
        setDeletingEmployee(e);
    };

    const handleConfirmDeleteEmployee = () => {
        if (!deletingEmployee) return;
        setIsDeletingEmployee(true);
        router.delete(`/admin/employees/${deletingEmployee.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEmployees((prev) => prev.filter((emp) => emp.id !== deletingEmployee.id));
                setDeletingEmployee(null);
                setIsDeletingEmployee(false);
            },
            onError: (err) => {
                console.error('Failed to delete employee:', err);
                setIsDeletingEmployee(false);
            },
            onFinish: () => {
                setIsDeletingEmployee(false);
            }
        });
    };

    const handleCreateProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProductName.trim()) return;

        setIsSavingProduct(true);
        setProductFormErrors({});

        const formData = new FormData();
        formData.append('name', newProductName.trim());
        formData.append('description', newProductDescription.trim() || 'Delicious roadhouse sizzling meal prepared fresh upon order.');
        formData.append('price', newProductPrice || '180');
        formData.append('price_bulihan', newProductPriceBulihan || newProductPrice || '180');
        formData.append('price_dasmarinas', newProductPriceDasmarinas || newProductPrice || '195');
        formData.append('stock_quantity', newProductStock || '50');
        formData.append('stock_bulihan', newProductStockBulihan || '30');
        formData.append('stock_dasmarinas', newProductStockDasmarinas || '20');
        formData.append('is_active', '1');

        if (newProductImageFile) {
            formData.append('image', newProductImageFile);
        }

        router.post('/admin/products', formData, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setShowAddProductModal(false);
                setNewProductName('');
                setNewProductDescription('');
                setNewProductPrice('');
                setNewProductPriceBulihan('');
                setNewProductPriceDasmarinas('');
                setNewProductStock('50');
                setNewProductStockBulihan('30');
                setNewProductStockDasmarinas('20');
                setNewProductImageFile(null);
                setNewProductImagePreview(null);
                setProductFormErrors({});
                setIsSavingProduct(false);
            },
            onError: (errs) => {
                setProductFormErrors(errs);
                setIsSavingProduct(false);
            },
            onFinish: () => {
                setIsSavingProduct(false);
            },
        });
    };

    const handleSaveEditProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        setIsSavingProduct(true);
        setProductFormErrors({});

        const formData = new FormData();
        formData.append('name', editProductName.trim() || editingProduct.name);
        formData.append('description', editProductDescription.trim() || 'Delicious roadhouse sizzling meal prepared fresh upon order.');
        formData.append('price', editProductPrice || (editingProduct.price || 0).toString());
        formData.append('price_bulihan', editProductPriceBulihan || editProductPrice || (editingProduct.priceBulihan ?? editingProduct.price ?? 0).toString());
        formData.append('price_dasmarinas', editProductPriceDasmarinas || editProductPrice || (editingProduct.priceDasmarinas ?? editingProduct.price ?? 0).toString());
        formData.append('stock_quantity', editProductStock || (editingProduct.stock || 0).toString());
        formData.append('stock_bulihan', editProductStockBulihan || (editingProduct.stockBulihan ?? Math.floor((editingProduct.stock || 0) * 0.6)).toString());
        formData.append('stock_dasmarinas', editProductStockDasmarinas || (editingProduct.stockDasmarinas ?? Math.floor((editingProduct.stock || 0) * 0.4)).toString());
        formData.append('is_active', editingProduct.isActive ? '1' : '0');

        if (editProductImageFile) {
            formData.append('image', editProductImageFile);
        }

        router.post(`/admin/products/${editingProduct.id}`, formData, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setEditingProduct(null);
                setEditProductImageFile(null);
                setEditProductImagePreview(null);
                setProductFormErrors({});
                setIsSavingProduct(false);
            },
            onError: (errs) => {
                setProductFormErrors(errs);
                setIsSavingProduct(false);
            },
            onFinish: () => {
                setIsSavingProduct(false);
            },
        });
    };

    const handleSaveEditEmployee = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEmployee) return;

        setIsSavingEmployee(true);
        setEmployeeErrors({});

        const mappedRole = editingEmployee.role === 'Kitchen Staff' ? 'kitchen' : (editingEmployee.role === 'Cashier' ? 'cashier' : (editingEmployee.role === 'Admin' ? 'admin' : 'employee'));

        router.post(`/admin/employees/${editingEmployee.id}`, {
            name: editingEmployee.name,
            email: editingEmployee.email,
            role: mappedRole,
            branch: editingEmployee.branch === 'Dasma' ? 'dasmarinas' : 'bulihan',
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingEmployee(null);
                setIsSavingEmployee(false);
            },
            onError: (errs) => {
                setEmployeeErrors(errs);
                setIsSavingEmployee(false);
            },
            onFinish: () => {
                setIsSavingEmployee(false);
            }
        });
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
        setBannerErrors({});
        setBannerImageFile(null);
        const existing = banners[slotNum];
        if (existing) {
            setNewBannerTitle(existing.title);
            setNewBannerSubtitle(existing.subtitle);
            setNewBannerTag(existing.tag);
            setNewBannerImage(existing.image);
            setBannerImagePreview(existing.image);
            setNewBannerCta(existing.ctaText || '');
        } else {
            setNewBannerTitle('');
            setNewBannerSubtitle('');
            setNewBannerTag(slotNum === 1 ? 'WEEKEND SPECIAL • 20% OFF' : slotNum === 2 ? 'NEW ARRIVAL' : slotNum === 3 ? 'UNLIMITED REFILLS' : 'HAPPY HOUR');
            setNewBannerImage('');
            setBannerImagePreview(null);
            setNewBannerCta('');
        }
    };

    const handleSaveSlotBanner = (e: React.FormEvent) => {
        e.preventDefault();
        if (targetBannerSlot === null || !newBannerTitle.trim()) return;

        setIsSavingBanner(true);
        setBannerErrors({});

        const formData = new FormData();
        formData.append('title', newBannerTitle.trim());
        formData.append('display_order', targetBannerSlot.toString());
        formData.append('branch', productBranchFilter === 'Bulihan' ? 'bulihan' : (productBranchFilter === 'Dasma' ? 'dasmarinas' : 'all'));
        formData.append('is_active', '1');
        if (bannerImageFile) {
            formData.append('image', bannerImageFile);
        }

        const existing = banners[targetBannerSlot];
        const endpoint = (existing && existing.id) ? `/admin/banners/${existing.id}` : '/admin/banners';

        router.post(endpoint, formData, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setTargetBannerSlot(null);
                setBannerImageFile(null);
                setBannerImagePreview(null);
                setIsSavingBanner(false);
            },
            onError: (errs) => {
                setBannerErrors(errs);
                setIsSavingBanner(false);
            },
            onFinish: () => {
                setIsSavingBanner(false);
            }
        });
    };

    const handleConfirmVoid = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!voidingOrder || !voidPassword.trim() || !voidReason.trim()) return;

        setIsVoiding(true);
        setVoidError('');

        try {
            const response = await fetch(`/orders/${voidingOrder.id}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    password: voidPassword,
                    reason: voidReason,
                }),
            });

            const json = await response.json();
            if (response.ok) {
                setOrders(prev => prev.map(o => o.id === voidingOrder.id ? { ...o, status: 'cancelled' } : o));
                
                const newLog: AuditLogItem = {
                    id: Date.now(),
                    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                    user: 'Admin Staff',
                    role: 'Admin',
                    action: `Voided Order #${voidingOrder.orderNumber || voidingOrder.id} | Reason: ${voidReason}`,
                    module: 'Order Queue / Sales',
                };
                setAuditLogs(prev => [newLog, ...prev]);

                setVoidingOrder(null);
                setVoidPassword('');
                setVoidReason('');
            } else {
                setVoidError(json.message || 'Verification failed.');
            }
        } catch (err: any) {
            setVoidError('Failed to void order. Please check credentials.');
        } finally {
            setIsVoiding(false);
        }
    };

    const handleConfirmDeleteOrder = async () => {
        if (!deletingOrder) return;
        setIsDeletingOrder(true);
        try {
            router.delete(`/admin/orders/${deletingOrder.id}`, {
                onSuccess: () => {
                    setOrders(prev => prev.filter(o => o.id !== deletingOrder.id));

                    const newLog: AuditLogItem = {
                        id: Date.now(),
                        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                        user: 'Admin Staff',
                        role: 'Admin',
                        action: `Permanently Deleted Order #${deletingOrder.orderNumber || deletingOrder.id}`,
                        module: 'Order Queue / Sales',
                    };
                    setAuditLogs(prev => [newLog, ...prev]);

                    setDeletingOrder(null);
                },
                onFinish: () => setIsDeletingOrder(false),
            });
        } catch (err) {
            setIsDeletingOrder(false);
        }
    };

    const handleCreateVoucher = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newVoucherCode.trim()) return;

        setIsSavingVoucher(true);
        setVoucherErrors({});

        router.post('/admin/vouchers', {
            code: newVoucherCode.toUpperCase().trim(),
            discount_type: newVoucherDiscountType,
            value: newVoucherValue,
            min_spend: newVoucherMinSpend,
            is_one_time_use: newVoucherIsOneTime,
            is_limited_time: newVoucherIsLimitedTime,
            starts_at: newVoucherStartsAt || null,
            expires_at: newVoucherExpiresAt || null,
            branch: productBranchFilter === 'Bulihan' ? 'bulihan' : (productBranchFilter === 'Dasma' ? 'dasmarinas' : 'all'),
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowAddVoucherModal(false);
                setNewVoucherCode('');
                setNewVoucherValue('10');
                setNewVoucherMinSpend('300');
                setNewVoucherIsOneTime(true);
                setNewVoucherIsLimitedTime(false);
                setNewVoucherStartsAt('');
                setNewVoucherExpiresAt('');
                setIsSavingVoucher(false);
            },
            onError: (errs) => {
                setVoucherErrors(errs);
                setIsSavingVoucher(false);
            },
            onFinish: () => {
                setIsSavingVoucher(false);
            }
        });
    };

    const handleCreateEmployee = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmpEmail.trim() || !newEmpName.trim()) return;

        setIsSavingEmployee(true);
        setEmployeeErrors({});

        const mappedRole = newEmpRole === 'Kitchen Staff' ? 'kitchen' : (newEmpRole === 'Cashier' ? 'cashier' : (newEmpRole === 'Admin' ? 'admin' : 'employee'));

        router.post('/admin/employees', {
            name: newEmpName.trim(),
            email: newEmpEmail.trim(),
            role: mappedRole,
            branch: newEmpBranch === 'Dasma' ? 'dasmarinas' : 'bulihan',
            password: newEmpPassword || 'password123',
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowAddEmployeeModal(false);
                setNewEmpName('');
                setNewEmpEmail('');
                setNewEmpPassword('password123');
                setIsSavingEmployee(false);
            },
            onError: (errs) => {
                setEmployeeErrors(errs);
                setIsSavingEmployee(false);
            },
            onFinish: () => {
                setIsSavingEmployee(false);
            }
        });
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

    // Filtered Orders by Status & Search
    const filteredOrders = orders.filter(o => {
        if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) return false;
        if (searchQuery && !o.id.toLowerCase().includes(searchQuery.toLowerCase()) && !o.customer.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    // Filtered Products by Category, Branch & Search
    const filteredProducts = products.filter(p => {
        if (productCategoryFilter !== 'All' && p.category !== productCategoryFilter) return false;
        if (productBranchFilter === 'Bulihan' && (p.stockBulihan !== undefined && p.stockBulihan <= 0)) return false;
        if (productBranchFilter === 'Dasma' && (p.stockDasmarinas !== undefined && p.stockDasmarinas <= 0)) return false;
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const totalProductItems = filteredProducts.length;
    const totalProductPages = Math.max(1, Math.ceil(totalProductItems / 10));
    const paginatedProducts = filteredProducts.slice((productPage - 1) * 10, productPage * 10);

    // Filtered & Sorted Audit Logs
    const filteredAuditLogs = auditLogs
        .filter(log => {
            if (auditModuleFilter !== 'All' && log.module !== auditModuleFilter) return false;
            
            const logDate = log.timestamp.split(' ')[0];
            if (auditStartDate && logDate < auditStartDate) return false;
            if (auditEndDate && logDate > auditEndDate) return false;
            
            return true;
        })
        .sort((a, b) => {
            if (auditSortOrder === 'newest') {
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            } else {
                return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            }
        });

    const totalAuditItems = filteredAuditLogs.length;
    const totalAuditPages = Math.max(1, Math.ceil(totalAuditItems / 10));
    const paginatedAuditLogs = filteredAuditLogs.slice((auditPage - 1) * 10, auditPage * 10);

    // Filtered Sales Orders
    const todayStr = React.useMemo(() => new Date().toISOString().split('T')[0], []);

    const filteredSalesOrders = orders.filter(o => {
        if (salesBranchFilter !== 'All' && o.branch !== salesBranchFilter) return false;
        if (salesDateRange === 'today' && o.date !== todayStr) return false;
        if (salesDateRange === '7days') {
            const d7 = new Date();
            d7.setDate(d7.getDate() - 7);
            const d7Str = d7.toISOString().split('T')[0];
            if (o.date < d7Str) return false;
        }
        if (salesStartDate && o.date < salesStartDate) return false;
        if (salesEndDate && o.date > salesEndDate) return false;
        return true;
    }).sort((a, b) => {
        if (salesSortOrder === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const totalRevenue = filteredSalesOrders.filter(o => o.status === 'completed' || o.status === 'ready' || o.status === 'preparing').reduce((acc, o) => acc + o.amount, 0);

    const dailyRevenueBars = React.useMemo(() => {
        const days = [];
        let maxVal = 1;

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

            const dayOrders = orders.filter(o => {
                if (o.status !== 'completed') return false;
                if (salesBranchFilter !== 'All' && o.branch !== salesBranchFilter) return false;
                return o.date === dateStr;
            });

            const total = dayOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
            if (total > maxVal) {
                maxVal = total;
            }
            days.push({ day: dayLabel, date: dateStr, amount: total });
        }

        return days.map(d => ({
            ...d,
            height: d.amount > 0 ? `${Math.max(15, Math.round((d.amount / maxVal) * 100))}%` : '8%'
        }));
    }, [orders, salesBranchFilter]);

    const sidebarLinks = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'orders', label: 'Order Queue', icon: <ListOrdered className="w-4 h-4" />, badge: orders.filter(o => o.status === 'pending' || o.status === 'preparing').length.toString() },
        { id: 'products', label: 'Products & Stocks', icon: <Utensils className="w-4 h-4" /> },
        { id: 'tables', label: 'Table & QR Generator', icon: <QrCode className="w-4 h-4" /> },
        { id: 'banners', label: 'Promo Banners', icon: <ImageIcon className="w-4 h-4" /> },
        { id: 'vouchers', label: 'Vouchers', icon: <Ticket className="w-4 h-4" /> },
        { id: 'employees', label: 'User Accounts', icon: <Users className="w-4 h-4" /> },
        { id: 'audit', label: 'Audit Logs', icon: <FileText className="w-4 h-4" /> },
        { id: 'sales', label: 'Sales & Revenue', icon: <TrendingUp className="w-4 h-4" /> },
    ];

    return (
        <>
            <Head title="Admin Dashboard | Saddle Ranch" />

            {/* EYE-CARE ERGONOMIC SOFT CHARCOAL & WARM AMBER DARK THEME */}
            <div className="min-h-screen bg-[#141416] text-[#f4f4f5] flex font-sans selection:bg-[#f59e0b] selection:text-[#3f2000]">
                
                {/* Sidebar Navigation (Fixed Railway Navigation) */}
                <aside className="w-64 bg-[#1f1f23] border-r border-[#333338] flex flex-col flex-shrink-0 hidden md:flex shadow-xl h-screen sticky top-0">
                    <div className="h-20 px-6 flex items-center gap-3 border-b border-[#333338]">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#b45309] flex items-center justify-center shadow-md shadow-[#f59e0b]/20">
                            <Flame className="w-5 h-5 text-[#3f2000]" />
                        </div>
                        <div>
                            <span className="font-black text-base tracking-tight font-domine text-[#fbbf24] block">SADDLE RANCH</span>
                            <span className="text-[10px] tracking-widest uppercase text-[#f59e0b] font-bold block">Admin Portal</span>
                        </div>
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto space-y-1">
                        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#a1a1aa]">Core Management</div>
                        {sidebarLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => setActiveTab(link.id)}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                    activeTab === link.id
                                        ? 'bg-[#f59e0b]/15 border-l-4 border-[#f59e0b] text-[#fbbf24] shadow-sm'
                                        : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={activeTab === link.id ? 'text-[#f59e0b]' : 'text-[#71717a]'}>
                                        {link.icon}
                                    </span>
                                    <span>{link.label}</span>
                                </div>
                                {link.badge && parseInt(link.badge) > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#fbbf24] text-[10px] font-black border border-[#f59e0b]/30">
                                        {link.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 border-t border-[#333338]">
                        <div className="p-3 rounded-xl bg-[#141416] border border-[#333338] flex items-center justify-between">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                                <div className="w-8 h-8 rounded-full bg-[#27272a] border border-[#3f3f46] flex items-center justify-center text-xs font-black text-[#fbbf24]">
                                    SA
                                </div>
                                <div className="truncate">
                                    <span className="block text-xs font-bold text-white truncate">Saddle Ranch Admin</span>
                                    <span className="block text-[10px] text-[#a1a1aa]">admin@saddleranch.ph</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowLogoutModal(true)}
                                title="Log Out"
                                className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-rose-400 hover:bg-[#27272a] transition-colors cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main View Area */}
                <main className="flex-1 flex flex-col min-w-0">
                    
                    {/* Header */}
                    <header className="h-20 bg-[#1f1f23]/95 border-b border-[#333338] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-black font-domine text-[#fbbf24] tracking-tight capitalize">
                                {sidebarLinks.find(l => l.id === activeTab)?.label ?? 'Dashboard'}
                            </h2>

                            {/* Global Branch View Selector (Removed on Promo Banners Tab) */}
                            {activeTab !== 'banners' && (
                                <div className="flex items-center gap-2 bg-[#141416] border border-[#3f3f46] px-3.5 py-1.5 rounded-xl text-xs shadow-inner">
                                    <MapPin className="w-4 h-4 text-[#f59e0b]" />
                                    <span className="text-[#a1a1aa] font-bold hidden md:inline">Branch View:</span>
                                    <select
                                        value={productBranchFilter}
                                        onChange={(e) => {
                                            setProductBranchFilter(e.target.value);
                                            setSalesBranchFilter(e.target.value);
                                            setProductPage(1);
                                        }}
                                        className="bg-transparent text-[#fbbf24] font-black focus:outline-none cursor-pointer"
                                    >
                                        <option value="Bulihan" className="bg-[#18181b] text-white">Bulihan Branch</option>
                                        <option value="Dasma" className="bg-[#18181b] text-white">Dasmariñas Branch</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative hidden sm:block">
                                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a]" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search orders, items, staff..."
                                    className="w-64 pl-9 pr-4 py-1.5 bg-[#141416] border border-[#333338] rounded-xl text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#f59e0b]"
                                />
                            </div>

                        </div>
                    </header>

                    {/* Dynamic View Body */}
                    <div className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto">

                        {/* TAB 1: MAIN DASHBOARD OVERVIEW */}
                        {activeTab === 'dashboard' && (
                            <div className="space-y-8">
                                {/* BRANCH VIEW TOOLBAR */}
                                <div className="p-4 rounded-3xl bg-[#202024] border border-[#333338] shadow-lg flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 bg-[#18181b] border border-[#3f3f46] px-3.5 py-2 rounded-xl text-xs">
                                        <MapPin className="w-4 h-4 text-[#f59e0b]" />
                                        <span className="text-[#a1a1aa] font-bold">Branch View:</span>
                                        <select
                                            value={productBranchFilter}
                                            onChange={(e) => {
                                                setProductBranchFilter(e.target.value);
                                                setSalesBranchFilter(e.target.value);
                                            }}
                                            className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                                        >
                                            <option value="Bulihan" className="bg-[#18181b]">Bulihan Branch</option>
                                            <option value="Dasma" className="bg-[#18181b]">Dasmariñas Branch</option>
                                        </select>
                                    </div>
                                    <div className="text-xs text-[#a1a1aa]">
                                        Active Branch Context: <strong className="text-[#fbbf24] font-bold">{productBranchFilter === 'Bulihan' ? 'Bulihan Store' : 'Dasmariñas Store'}</strong>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                    <div className="p-5 rounded-2xl bg-[#202024] border border-[#333338] shadow-lg space-y-2">
                                        <div className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">{productBranchFilter === 'Bulihan' ? 'Bulihan' : 'Dasmariñas'} Sizzling Revenue</div>
                                        <div className="text-2xl sm:text-3xl font-mono font-black text-[#fbbf24]">
                                            ₱ {orders.filter(o => o.branch === productBranchFilter).reduce((sum, o) => sum + o.amount, 0).toFixed(2)}
                                        </div>
                                        <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">+18.4% vs yesterday</div>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-[#202024] border border-[#333338] shadow-lg space-y-2">
                                        <div className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">{productBranchFilter === 'Bulihan' ? 'Bulihan' : 'Dasmariñas'} Active Orders</div>
                                        <div className="text-2xl sm:text-3xl font-mono font-black text-white">
                                            {orders.filter(o => o.branch === productBranchFilter).length} Orders
                                        </div>
                                        <div className="text-[11px] text-amber-400 font-bold">
                                            {orders.filter(o => o.branch === productBranchFilter && o.status === 'pending').length} Pending Kitchen
                                        </div>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-[#202024] border border-[#333338] shadow-lg space-y-2">
                                        <div className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">{productBranchFilter === 'Bulihan' ? 'Bulihan' : 'Dasmariñas'} Menu Items</div>
                                        <div className="text-2xl sm:text-3xl font-mono font-black text-white">{products.length} Items</div>
                                        <div className="text-[11px] text-emerald-400 font-bold">{products.filter(p => p.isActive).length} Available Today</div>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-[#202024] border border-[#333338] shadow-lg space-y-2">
                                        <div className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">{productBranchFilter === 'Bulihan' ? 'Bulihan' : 'Dasmariñas'} Promo Vouchers</div>
                                        <div className="text-2xl sm:text-3xl font-mono font-black text-white">
                                            {vouchers.filter(v => !v.branch || v.branch === 'All' || v.branch === productBranchFilter).length} Codes
                                        </div>
                                        <div className="text-[11px] text-emerald-400 font-bold">Active Promos Available</div>
                                    </div>
                                </div>

                                {/* Order Queue Quick Table */}
                                <div className="rounded-3xl bg-[#202024] border border-[#333338] shadow-xl p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-base font-bold text-white font-domine">Recent Sizzling Orders ({productBranchFilter === 'Bulihan' ? 'Bulihan' : 'Dasmariñas'})</h3>
                                            <p className="text-xs text-[#a1a1aa]">Real-time orders queue for selected branch</p>
                                        </div>
                                        <button
                                            onClick={() => setActiveTab('orders')}
                                            className="px-3.5 py-1.5 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#fbbf24] text-xs font-bold hover:bg-[#3f3f46] flex items-center gap-1 btn-bevel"
                                        >
                                            <span>Full Queue View</span>
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-[#18181b] text-[#a1a1aa] uppercase font-bold border-b border-[#333338]">
                                                <tr>
                                                    <th className="py-3 px-4">Order #</th>
                                                    <th className="py-3 px-4">Mode / Location</th>
                                                    <th className="py-3 px-4">Customer</th>
                                                    <th className="py-3 px-4">Amount</th>
                                                    <th className="py-3 px-4">Payment</th>
                                                    <th className="py-3 px-4">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#333338] text-zinc-200">
                                                {orders.filter(o => o.branch === productBranchFilter).map((o) => (
                                                    <tr key={o.id} className="hover:bg-[#27272a]/50 transition-colors">
                                                        <td className="py-3.5 px-4 font-mono font-bold text-white">{o.id}</td>
                                                        <td className="py-3.5 px-4 font-semibold text-[#fbbf24]">{o.type} ({o.location}) - <span className="text-amber-400 font-mono font-bold">{o.branch} Branch</span></td>
                                                        <td className="py-3.5 px-4 text-[#a1a1aa]">{o.customer}</td>
                                                        <td className="py-3.5 px-4 font-mono font-bold text-amber-400">₱{o.amount.toFixed(2)}</td>
                                                        <td className="py-3.5 px-4 text-xs font-medium text-zinc-300">{o.payment}</td>
                                                        <td className="py-3.5 px-4">
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                                                o.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                                o.status === 'ready' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                                                o.status === 'preparing' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                                'bg-orange-500/20 text-orange-400 border border-orange-500/30'
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

                        {/* TAB 2: ORDER QUEUE MANAGEMENT WITH BRANCH & STATUS SORT */}
                        {activeTab === 'orders' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white font-domine">Full Orders Queue Management</h3>
                                        <p className="text-xs text-[#a1a1aa]">Advance kitchen states and filter orders for Bulihan vs Dasmariñas</p>
                                    </div>

                                    {/* BRANCH & STATUS SORT FILTER TOOLBAR */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-2 bg-[#202024] border border-[#333338] px-3.5 py-2 rounded-xl text-xs shadow-md">
                                            <MapPin className="w-4 h-4 text-[#f59e0b]" />
                                            <span className="text-[#a1a1aa] font-bold">Branch View:</span>
                                            <select
                                                value={productBranchFilter}
                                                onChange={(e) => setProductBranchFilter(e.target.value)}
                                                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                                            >
                                                <option value="Bulihan" className="bg-[#18181b]">Bulihan Branch</option>
                                                <option value="Dasma" className="bg-[#18181b]">Dasmariñas Branch</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-2 bg-[#202024] border border-[#333338] px-3.5 py-2 rounded-xl text-xs shadow-md">
                                            <Filter className="w-4 h-4 text-[#f59e0b]" />
                                            <span className="text-[#a1a1aa] font-bold">Status Sort:</span>
                                            <select
                                                value={orderStatusFilter}
                                                onChange={(e) => setOrderStatusFilter(e.target.value)}
                                                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                                            >
                                                <option value="All" className="bg-[#18181b]">All Statuses</option>
                                                <option value="pending" className="bg-[#18181b]">Pending Kitchen</option>
                                                <option value="preparing" className="bg-[#18181b]">Preparing</option>
                                                <option value="ready" className="bg-[#18181b]">Ready for Serve/Pick-Up</option>
                                                <option value="completed" className="bg-[#18181b]">Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl bg-[#202024] border border-[#333338] shadow-xl p-6 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-[#18181b] text-[#a1a1aa] uppercase font-bold border-b border-[#333338]">
                                                <tr>
                                                    <th className="py-3.5 px-4">Order #</th>
                                                    <th className="py-3.5 px-4">Customer Details</th>
                                                    <th className="py-3.5 px-4">Branch & Mode</th>
                                                    <th className="py-3.5 px-4">Amount & Payment</th>
                                                    <th className="py-3.5 px-4">Status</th>
                                                    <th className="py-3.5 px-4">Kitchen Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#333338] text-zinc-200">
                                                {filteredOrders.length > 0 ? (
                                                    filteredOrders.map((o) => (
                                                        <tr key={o.id} className="hover:bg-[#27272a]/50 transition-colors">
                                                            <td className="py-4 px-4 font-mono font-bold text-white text-sm">{o.id}</td>
                                                            <td className="py-4 px-4">
                                                                <div className="font-bold text-white">{o.customer}</div>
                                                                <div className="text-[10px] text-[#a1a1aa]">{o.phone}</div>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <span className="font-bold text-[#fbbf24]">{o.type}</span>
                                                                <div className="text-[10px] text-[#a1a1aa] font-mono">{o.branch} Branch ({o.location})</div>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <div className="font-mono font-bold text-amber-400 text-sm">₱{o.amount.toFixed(2)}</div>
                                                                <div className="text-[10px] text-zinc-400">{o.payment}</div>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                                                    o.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                                    o.status === 'ready' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                                                    o.status === 'preparing' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                                    o.status === 'cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                                                    'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                                                }`}>
                                                                    {o.status === 'cancelled' ? 'VOIDED' : o.status}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    {o.status === 'pending' && (
                                                                        <button
                                                                            onClick={() => updateOrderStatus(o.id, 'preparing')}
                                                                            className="px-3 py-1.5 rounded-xl bg-amber-500 text-[#3f2000] font-black text-[11px] hover:bg-[#fbbf24] transition-all btn-bevel"
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
                                                                            className="px-3 py-1.5 rounded-xl bg-emerald-500 text-zinc-950 font-black text-[11px] hover:bg-emerald-400 transition-all btn-bevel"
                                                                        >
                                                                            Complete Order
                                                                        </button>
                                                                    )}
                                                                    {o.status !== 'cancelled' && (
                                                                        <button
                                                                            onClick={() => setVoidingOrder(o)}
                                                                            className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-zinc-950 text-[11px] font-bold transition-all"
                                                                            title="Void Order"
                                                                        >
                                                                            Void
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() => setDeletingOrder(o)}
                                                                        className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all"
                                                                        title="Delete Order Permanently"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={6} className="py-8 text-center text-[#a1a1aa]">
                                                            No orders found with status "{orderStatusFilter}".
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: PRODUCTS & STOCKS MANAGEMENT */}
                        {activeTab === 'products' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white font-domine">Products & Stock Inventory</h3>
                                        <p className="text-xs text-[#a1a1aa]">Manage sizzling menu items, prices, uploaded images, and stock counts</p>
                                    </div>
                                    <button
                                        onClick={() => setShowAddProductModal(true)}
                                        className="px-4 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 btn-bevel shadow-md"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add New Dish</span>
                                    </button>
                                </div>

                                {/* CATEGORY & BRANCH FILTER TOOLBAR */}
                                <div className="p-4 rounded-3xl bg-[#202024] border border-[#333338] shadow-lg flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-2 bg-[#18181b] border border-[#3f3f46] px-3.5 py-2 rounded-xl text-xs">
                                            <Filter className="w-4 h-4 text-[#f59e0b]" />
                                            <span className="text-[#a1a1aa] font-bold">Category:</span>
                                            <select
                                                value={productCategoryFilter}
                                                onChange={(e) => {
                                                    setProductCategoryFilter(e.target.value);
                                                    setProductPage(1);
                                                }}
                                                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                                            >
                                                <option value="All" className="bg-[#18181b]">All Categories</option>
                                                <option value="Sizzling Rice Meals" className="bg-[#18181b]">Sizzling Rice Meals</option>
                                                <option value="Authentic Filipino Cuisine" className="bg-[#18181b]">Authentic Filipino Cuisine</option>
                                                <option value="Barkada Platters" className="bg-[#18181b]">Barkada Platters</option>
                                                <option value="Drinks & Extra Rice" className="bg-[#18181b]">Drinks & Extra Rice</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-2 bg-[#18181b] border border-[#3f3f46] px-3.5 py-2 rounded-xl text-xs">
                                            <MapPin className="w-4 h-4 text-[#f59e0b]" />
                                            <span className="text-[#a1a1aa] font-bold">Branch View:</span>
                                            <select
                                                value={productBranchFilter}
                                                onChange={(e) => {
                                                    setProductBranchFilter(e.target.value);
                                                    setProductPage(1);
                                                }}
                                                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                                            >
                                                <option value="Bulihan" className="bg-[#18181b]">Bulihan Branch</option>
                                                <option value="Dasma" className="bg-[#18181b]">Dasmariñas Branch</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="text-xs text-[#a1a1aa]">
                                        Total Items: <strong className="text-[#fbbf24] font-mono">{totalProductItems}</strong> dishes
                                    </div>
                                </div>

                                {/* PRODUCTS GRID WITH BRANCH-SPECIFIC PRICES & STOCKS */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {paginatedProducts.map((p) => {
                                        const currentPrice = productBranchFilter === 'Bulihan' ? (p.priceBulihan ?? p.price) : (p.priceDasmarinas ?? p.price);
                                        const currentStock = productBranchFilter === 'Bulihan' ? (p.stockBulihan ?? Math.floor(p.stock * 0.6)) : (p.stockDasmarinas ?? Math.floor(p.stock * 0.4));
                                        
                                        return (
                                            <div key={p.id} className="p-5 rounded-3xl bg-[#202024] border border-[#333338] shadow-lg space-y-4 flex flex-col justify-between">
                                                <div className="space-y-3">
                                                    <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-[#3f3f46] bg-[#18181b]">
                                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                                        
                                                        {/* Dynamic Branch Tag & Price Badge */}
                                                        <div className="absolute top-2 right-2 flex items-center gap-1.5">
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                                                                productBranchFilter === 'Bulihan' 
                                                                    ? 'bg-amber-500/90 text-zinc-950 border-amber-400' 
                                                                    : 'bg-blue-600/90 text-white border-blue-400'
                                                            }`}>
                                                                {productBranchFilter === 'Bulihan' ? 'Bulihan' : 'Dasmariñas'}
                                                            </span>
                                                            <span className="px-2.5 py-1 rounded-full bg-[#18181b]/90 text-[#fbbf24] font-mono font-black text-xs border border-[#f59e0b]/30">
                                                                ₱ {currentPrice.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <span className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider block">{p.category}</span>
                                                        <h4 className="text-base font-bold text-white font-domine leading-snug">{p.name}</h4>
                                                    </div>
                                                </div>

                                                <div className="pt-3 border-t border-[#333338] space-y-3">
                                                    {/* Branch Specific Price & Stock Comparison */}
                                                    <div className="space-y-1.5 text-xs font-mono">
                                                        <div className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                                                            productBranchFilter === 'Bulihan'
                                                                ? 'bg-amber-500/10 border-amber-500/50 shadow-inner'
                                                                : 'bg-[#18181b] border-[#333338] opacity-60'
                                                        }`}>
                                                            <span className="text-[#a1a1aa] text-[10px] font-bold uppercase">Bulihan:</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[#fbbf24] font-black">₱ {(p.priceBulihan ?? p.price).toFixed(2)}</span>
                                                                <span className="px-1.5 py-0.5 rounded bg-[#27272a] text-white text-[10px]">Stk: {p.stockBulihan ?? Math.floor(p.stock * 0.6)}</span>
                                                            </div>
                                                        </div>

                                                        <div className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                                                            productBranchFilter === 'Dasma'
                                                                ? 'bg-blue-500/10 border-blue-500/50 shadow-inner'
                                                                : 'bg-[#18181b] border-[#333338] opacity-60'
                                                        }`}>
                                                            <span className="text-[#a1a1aa] text-[10px] font-bold uppercase">Dasmariñas:</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[#fbbf24] font-black">₱ {(p.priceDasmarinas ?? p.price).toFixed(2)}</span>
                                                                <span className="px-1.5 py-0.5 rounded bg-[#27272a] text-white text-[10px]">Stk: {p.stockDasmarinas ?? Math.floor(p.stock * 0.4)}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[#a1a1aa] font-bold text-[11px]">
                                                                {productBranchFilter === 'Bulihan' ? 'Bulihan Stock:' : 'Dasma Stock:'}
                                                            </span>
                                                            <div className="flex items-center gap-1 border border-[#3f3f46] rounded-lg p-0.5 bg-[#18181b]">
                                                                <button onClick={() => updateProductStock(p.id, -5)} className="p-1 text-[#a1a1aa] hover:text-white font-bold">-</button>
                                                                <span className="font-mono font-bold px-1.5 text-white">{currentStock}</span>
                                                                <button onClick={() => updateProductStock(p.id, 5)} className="p-1 text-[#a1a1aa] hover:text-white font-bold">+</button>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => toggleProductStatus(p.id)}
                                                            className={`whitespace-nowrap inline-flex items-center min-w-max px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                                                p.isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                                            }`}
                                                        >
                                                            {p.isActive ? 'Active' : 'Disabled'}
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => openEditProductModal(p)}
                                                            className="flex-1 py-2 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#fbbf24] hover:bg-[#3f3f46] text-xs font-bold flex items-center justify-center gap-1.5 btn-bevel transition-all cursor-pointer"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5 text-[#f59e0b]" />
                                                            <span>Edit Dish</span>
                                                        </button>
                                                        <button
                                                            onClick={() => deleteProduct(p)}
                                                            className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                                                            title="Delete Product"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* 10-ITEM PRODUCTS PAGINATION CONTROLS */}
                                <div className="p-4 rounded-3xl bg-[#202024] border border-[#333338] shadow-lg flex items-center justify-between text-xs">
                                    <div className="text-[#a1a1aa]">
                                        Showing <strong className="text-white font-mono">{totalProductItems > 0 ? (productPage - 1) * 10 + 1 : 0}</strong> to{' '}
                                        <strong className="text-white font-mono">{Math.min(productPage * 10, totalProductItems)}</strong> of{' '}
                                        <strong className="text-[#fbbf24] font-mono">{totalProductItems}</strong> dishes
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            disabled={productPage === 1}
                                            onClick={() => setProductPage(productPage - 1)}
                                            className="px-3.5 py-1.5 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-bold"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            <span>Prev</span>
                                        </button>

                                        <span className="font-mono text-xs font-bold text-[#fbbf24] px-2">
                                            Page {productPage} of {totalProductPages}
                                        </span>

                                        <button
                                            disabled={productPage >= totalProductPages}
                                            onClick={() => setProductPage(productPage + 1)}
                                            className="px-3.5 py-1.5 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-bold"
                                        >
                                            <span>Next</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: TABLE AND QR GENERATOR WITH BRANCH SORT */}
                        {activeTab === 'tables' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white font-domine">Table QR Code Generator</h3>
                                        <p className="text-xs text-[#a1a1aa]">Generate, test, print, and delete scannable table QR badges for Bulihan and Dasmariñas</p>
                                    </div>
                                    <button
                                        onClick={handleGenerateNewTableQR}
                                        className="px-4 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 btn-bevel shadow-md"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Generate New Table QR</span>
                                    </button>
                                </div>

                                {/* BRANCH SORT FILTER TOOLBAR */}
                                <div className="p-4 rounded-3xl bg-[#202024] border border-[#333338] shadow-lg flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 bg-[#18181b] border border-[#3f3f46] px-3.5 py-2 rounded-xl text-xs">
                                        <MapPin className="w-4 h-4 text-[#f59e0b]" />
                                        <span className="text-[#a1a1aa] font-bold">Branch View:</span>
                                        <select
                                            value={productBranchFilter}
                                            onChange={(e) => setProductBranchFilter(e.target.value)}
                                            className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                                        >
                                            <option value="Bulihan" className="bg-[#18181b]">Bulihan Branch</option>
                                            <option value="Dasma" className="bg-[#18181b]">Dasmariñas Branch</option>
                                        </select>
                                    </div>
                                    <div className="text-xs text-[#a1a1aa]">
                                        Tables for <strong className="text-[#fbbf24] font-bold">{productBranchFilter === 'Bulihan' ? 'Bulihan Store' : 'Dasmariñas Store'}</strong>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {tables.map((tableNum) => {
                                        const branchPrefix = productBranchFilter === 'Bulihan' ? 'B' : 'D';
                                        const tableCode = `${branchPrefix}-${tableNum}`;
                                        const realQrUrl = getRealQrCodeUrl(tableCode);
                                        return (
                                            <div key={tableNum} className="p-5 rounded-3xl bg-[#202024] border border-[#333338] shadow-lg text-center space-y-4 relative group">
                                                
                                                {/* Delete Table Button */}
                                                <button
                                                    onClick={() => handleDeleteTableQR(tableNum)}
                                                    className="absolute top-3 right-3 p-1.5 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors border border-rose-500/20"
                                                    title="Delete Table QR"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>

                                                <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-block border ${
                                                    productBranchFilter === 'Bulihan' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                                }`}>
                                                    {productBranchFilter === 'Bulihan' ? 'Bulihan' : 'Dasmariñas'}
                                                </div>

                                                <div className="w-14 h-14 rounded-2xl bg-[#f59e0b] text-[#3f2000] font-black text-sm mx-auto flex items-center justify-center font-domine shadow-md">
                                                    #{tableCode}
                                                </div>

                                                {/* Real Scannable Barcode Image */}
                                                <div className="w-32 h-32 mx-auto p-2 bg-white rounded-2xl shadow-inner flex items-center justify-center border-2 border-[#3f3f46]">
                                                    <img src={realQrUrl} alt={`Table ${tableCode} QR`} className="w-full h-full object-contain" />
                                                </div>

                                                <div className="space-y-2">
                                                    <button
                                                        onClick={() => setSelectedPrintTable(tableCode)}
                                                        className="w-full py-2 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/30 text-[#fbbf24] font-bold text-xs hover:bg-[#f59e0b] hover:text-[#3f2000] flex items-center justify-center gap-1.5 btn-bevel transition-all"
                                                    >
                                                        <Printer className="w-3.5 h-3.5" />
                                                        <span>View & Print QR</span>
                                                    </button>

                                                    <button
                                                        onClick={() => copyTableLink(tableCode)}
                                                        className="w-full py-1.5 rounded-xl bg-[#18181b] border border-[#3f3f46] text-[#a1a1aa] hover:text-white font-semibold text-[11px] flex items-center justify-center gap-1.5"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                        <span>{copiedTable === tableCode ? 'Copied Link!' : 'Copy Link'}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* TAB 5: PROMO BANNERS (CLEAN PROMOTIONS & DEALS WITH FIXED EDIT SLOT BUTTONS) */}
                        {activeTab === 'banners' && (
                            <div className="space-y-6">
                                <div>
                                    <span className="font-mono text-xs text-[#f59e0b] bg-[#27272a] px-3 py-1 rounded border border-[#3f3f46] uppercase tracking-widest font-bold inline-block mb-2">
                                        Exclusive Roadhouse Specials
                                    </span>
                                    <h3 className="font-domine text-2xl sm:text-4xl text-[#fbbf24] font-bold tracking-tight">
                                        Promotions & Deals
                                    </h3>
                                    <p className="text-xs text-[#a1a1aa] mt-1">Manage active landing page promo banners. Click any slot button to update title, tags, and local image file.</p>
                                </div>

                                {/* Asymmetric Bento Grid matching Landing.tsx 1:1 */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                    
                                    {/* Slot 1: Large Featured Hero Banner */}
                                    <div className="md:col-span-2 md:row-span-2 relative min-h-[380px] lg:min-h-[420px] rounded-2xl overflow-hidden group bg-[#202024] border border-[#333338] shadow-xl flex flex-col justify-between p-6 md:p-8">
                                        
                                        {/* Floating Prominent Edit Button */}
                                        <div className="flex justify-between items-start z-20">
                                            <span className="font-mono text-xs text-[#f59e0b] bg-[#18181b]/90 px-3 py-1 rounded border border-[#3f3f46] font-bold uppercase shadow">
                                                {banners[1]?.tag || 'WEEKEND SPECIAL'}
                                            </span>

                                            <button
                                                onClick={() => openSlotBannerModal(1)}
                                                className="px-3.5 py-1.5 rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 btn-bevel shadow-lg transition-all"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                                <span>Edit Slot #1</span>
                                            </button>
                                        </div>

                                        {banners[1] && (
                                            <>
                                                <div className="absolute inset-0 vignette-overlay">
                                                    <img
                                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105"
                                                        alt={banners[1].title}
                                                        src={banners[1].image}
                                                    />
                                                </div>
                                                <div className="relative z-10 w-full bg-gradient-to-t from-[#141416] via-[#141416]/85 to-transparent pt-8">
                                                    <h3 className="font-domine text-2xl sm:text-4xl font-bold text-[#fbbf24] mb-2 drop-shadow-md">
                                                        {banners[1].title}
                                                    </h3>
                                                    <p className="font-sans text-xs sm:text-sm md:text-base text-[#a1a1aa] max-w-lg leading-relaxed">
                                                        {banners[1].subtitle}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Slot 2: Square Card - Top Right */}
                                    <div className="relative min-h-[190px] lg:min-h-[200px] rounded-2xl overflow-hidden group bg-[#202024] border border-[#333338] shadow-lg flex flex-col justify-between p-5">
                                        <div className="flex justify-between items-start z-20">
                                            <span className="font-mono text-[10px] text-[#f59e0b] bg-[#18181b]/90 px-2 py-0.5 rounded border border-[#3f3f46] font-bold uppercase">
                                                {banners[2]?.tag || 'NEW ARRIVAL'}
                                            </span>

                                            <button
                                                onClick={() => openSlotBannerModal(2)}
                                                className="px-2.5 py-1 rounded-lg bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md transition-all"
                                            >
                                                <Edit2 className="w-3 h-3" /> Edit Slot #2
                                            </button>
                                        </div>

                                        {banners[2] && (
                                            <>
                                                <div className="absolute inset-0 vignette-overlay">
                                                    <img
                                                        className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-all duration-500 group-hover:scale-105"
                                                        alt={banners[2].title}
                                                        src={banners[2].image}
                                                    />
                                                </div>
                                                <div className="relative z-10 w-full bg-gradient-to-t from-[#141416] via-[#141416]/80 to-transparent pt-4">
                                                    <h3 className="font-domine text-base font-bold text-[#fbbf24]">{banners[2].title}</h3>
                                                    <p className="font-sans text-xs text-[#a1a1aa] mt-0.5 line-clamp-1">{banners[2].subtitle}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Slot 3: Square Card - Middle Right */}
                                    <div className="relative min-h-[190px] lg:min-h-[200px] rounded-2xl overflow-hidden group bg-[#202024] border border-[#333338] shadow-lg flex flex-col justify-between p-5">
                                        <div className="flex justify-between items-start z-20">
                                            <span className="font-mono text-[10px] text-emerald-400 bg-[#18181b]/90 px-2 py-0.5 rounded border border-[#3f3f46] font-bold uppercase">
                                                {banners[3]?.tag || 'REFILLS'}
                                            </span>

                                            <button
                                                onClick={() => openSlotBannerModal(3)}
                                                className="px-2.5 py-1 rounded-lg bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md transition-all"
                                            >
                                                <Edit2 className="w-3 h-3" /> Edit Slot #3
                                            </button>
                                        </div>

                                        {banners[3] && (
                                            <>
                                                <div className="absolute inset-0 vignette-overlay">
                                                    <img
                                                        className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-all duration-500 group-hover:scale-105"
                                                        alt={banners[3].title}
                                                        src={banners[3].image}
                                                    />
                                                </div>
                                                <div className="relative z-10 w-full bg-gradient-to-t from-[#141416] via-[#141416]/80 to-transparent pt-4">
                                                    <h3 className="font-domine text-base font-bold text-[#f4f4f5]">{banners[3].title}</h3>
                                                    <p className="font-sans text-xs text-[#a1a1aa] mt-0.5 line-clamp-1">{banners[3].subtitle}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Slot 4: Wide Accent Horizontal Banner */}
                                    <div className="md:col-span-3 relative min-h-[180px] rounded-2xl overflow-hidden group bg-[#202024] border border-[#333338] shadow-lg flex items-center p-6 md:p-8">
                                        {banners[4] && (
                                            <>
                                                <div className="w-full md:w-2/3 z-10 space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-mono text-xs text-[#f59e0b] bg-[#18181b] px-3 py-1 rounded border border-[#3f3f46] inline-block font-bold uppercase">
                                                            {banners[4].tag}
                                                        </span>

                                                        <button
                                                            onClick={() => openSlotBannerModal(4)}
                                                            className="px-3 py-1 rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] text-xs font-black uppercase flex items-center gap-1.5 btn-bevel shadow-md transition-all"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" /> Edit Slot #4
                                                        </button>
                                                    </div>

                                                    <h3 className="font-domine text-2xl font-bold text-[#fbbf24]">{banners[4].title}</h3>
                                                    <p className="font-sans text-xs sm:text-sm text-[#a1a1aa] max-w-xl">
                                                        {banners[4].subtitle}
                                                    </p>
                                                    <div className="text-[#f59e0b] font-mono text-xs font-bold flex items-center pt-1">
                                                        {banners[4].ctaText || 'ORDER PULUTAN NOW →'} <ArrowRight className="w-4 h-4 ml-1.5" />
                                                    </div>
                                                </div>

                                                <div className="hidden md:block w-1/3 h-full vignette-overlay absolute right-0 top-0 bottom-0">
                                                    <img
                                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-500"
                                                        alt={banners[4].title}
                                                        src={banners[4].image}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* TAB 6: DISCOUNT VOUCHERS WITH BRANCH SORT */}
                        {activeTab === 'vouchers' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white font-domine">Discount Vouchers & Ticket Coupons</h3>
                                        <p className="text-xs text-[#a1a1aa]">Create and issue physical ticket style promo codes for Bulihan and Dasmariñas</p>
                                    </div>
                                    <button
                                        onClick={() => setShowAddVoucherModal(true)}
                                        className="px-4 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 btn-bevel shadow-md"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Create New Ticket</span>
                                    </button>
                                </div>

                                {/* BRANCH SORT FILTER TOOLBAR */}
                                <div className="p-4 rounded-3xl bg-[#202024] border border-[#333338] shadow-lg flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 bg-[#18181b] border border-[#3f3f46] px-3.5 py-2 rounded-xl text-xs">
                                        <MapPin className="w-4 h-4 text-[#f59e0b]" />
                                        <span className="text-[#a1a1aa] font-bold">Branch View:</span>
                                        <select
                                            value={productBranchFilter}
                                            onChange={(e) => setProductBranchFilter(e.target.value)}
                                            className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                                        >
                                            <option value="Bulihan" className="bg-[#18181b]">Bulihan Branch</option>
                                            <option value="Dasma" className="bg-[#18181b]">Dasmariñas Branch</option>
                                        </select>
                                    </div>
                                    <div className="text-xs text-[#a1a1aa]">
                                        Showing Promos for <strong className="text-[#fbbf24] font-bold">{productBranchFilter === 'Bulihan' ? 'Bulihan Store' : 'Dasmariñas Store'}</strong>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {vouchers.filter(v => !v.branch || v.branch === 'All' || v.branch === productBranchFilter).map((v) => (
                                        <div key={v.id} className="relative rounded-3xl bg-[#202024] border border-[#333338] shadow-xl overflow-hidden flex flex-col justify-between group">
                                            
                                            {/* Top & Bottom Ticket Cutout Punch Notches */}
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#141416] border border-[#333338] z-20" />
                                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#141416] border border-[#333338] z-20" />

                                            {/* Ticket Body Layout with Vertical Tear Line */}
                                            <div className="p-6 flex items-stretch gap-4 relative z-10">
                                                <div className="flex-1 space-y-2 pr-4 border-r-2 border-dashed border-[#3f3f46]">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#f59e0b]">
                                                        <Ticket className="w-4 h-4 text-[#f59e0b]" />
                                                        <span className="uppercase tracking-widest font-mono text-[10px]">ROADHOUSE COUPON</span>
                                                    </div>

                                                    <div className="font-domine text-3xl font-black text-[#fbbf24] tracking-tight">
                                                        {v.discount_type === 'percentage'
                                                            ? `${v.discountPercent ?? v.value}% OFF`
                                                            : `₱${(v.value ?? 0).toFixed(2)} OFF`}
                                                    </div>

                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="inline-block px-3 py-1 rounded-xl bg-[#18181b] border border-[#3f3f46] font-mono font-black text-white text-sm tracking-wider">
                                                            {v.code}
                                                        </span>
                                                        {v.is_one_time_use && (
                                                            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold uppercase">
                                                                1-Time Use
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="text-[11px] text-[#a1a1aa] space-y-0.5">
                                                        <div>Min order: <strong className="text-amber-400 font-mono font-bold">₱{v.minSpend.toFixed(2)}</strong></div>
                                                        {(v.starts_at || v.expires_at) && (
                                                            <div className="text-[10px] text-[#71717a] font-mono">
                                                                {v.starts_at && <span>Active: {v.starts_at} </span>}
                                                                {v.expires_at && <span>Until: {v.expires_at}</span>}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="w-24 flex flex-col justify-between items-end text-right pl-2">
                                                    <button
                                                        onClick={() => deleteVoucher(v)}
                                                        className="p-1.5 rounded-full text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                                        title="Delete Voucher"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>

                                                    <div className="space-y-1">
                                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider block border ${
                                                            v.branch === 'Bulihan' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                                            v.branch === 'Dasma' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                                            'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                                        }`}>
                                                            {v.branch ?? 'All'}
                                                        </span>
                                                        <div className="text-[10px] text-[#71717a] font-mono font-bold">
                                                            {v.usedCount} Redeemed
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB 7: USER ACCOUNTS (ADMIN, EMPLOYEES & CUSTOMERS) */}
                        {activeTab === 'employees' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white font-domine">Staff & Customer User Accounts</h3>
                                        <p className="text-xs text-[#a1a1aa]">Manage Admin, Staff (Cashier/Kitchen), and Customer accounts across all branches</p>
                                    </div>
                                    <button
                                        onClick={() => setShowAddEmployeeModal(true)}
                                        className="px-4 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 btn-bevel shadow-md"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Staff Account</span>
                                    </button>
                                </div>

                                {/* BRANCH & ROLE SORT FILTER TOOLBAR */}
                                <div className="p-4 rounded-3xl bg-[#202024] border border-[#333338] shadow-lg flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-2 bg-[#18181b] border border-[#3f3f46] px-3.5 py-2 rounded-xl text-xs">
                                            <Users className="w-4 h-4 text-[#f59e0b]" />
                                            <span className="text-[#a1a1aa] font-bold">Account Role:</span>
                                            <select
                                                value={userRoleFilter}
                                                onChange={(e) => setUserRoleFilter(e.target.value)}
                                                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                                            >
                                                <option value="All" className="bg-[#18181b]">All Accounts</option>
                                                <option value="Admin" className="bg-[#18181b]">Admin Accounts</option>
                                                <option value="Staff" className="bg-[#18181b]">Staff / Employees</option>
                                                <option value="Customer" className="bg-[#18181b]">Customer Accounts</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-2 bg-[#18181b] border border-[#3f3f46] px-3.5 py-2 rounded-xl text-xs">
                                            <MapPin className="w-4 h-4 text-[#f59e0b]" />
                                            <span className="text-[#a1a1aa] font-bold">Branch View:</span>
                                            <select
                                                value={productBranchFilter}
                                                onChange={(e) => setProductBranchFilter(e.target.value)}
                                                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                                            >
                                                <option value="All" className="bg-[#18181b]">All Branches</option>
                                                <option value="Bulihan" className="bg-[#18181b]">Bulihan Branch</option>
                                                <option value="Dasma" className="bg-[#18181b]">Dasmariñas Branch</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="text-xs text-[#a1a1aa]">
                                        Showing <strong className="text-[#fbbf24] font-bold">{userRoleFilter}</strong> Accounts ({productBranchFilter === 'All' ? 'All Branches' : `${productBranchFilter} Store`})
                                    </div>
                                </div>

                                <div className="rounded-3xl bg-[#202024] border border-[#333338] shadow-xl p-6 overflow-hidden">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-[#18181b] text-[#a1a1aa] uppercase font-bold border-b border-[#333338]">
                                            <tr>
                                                <th className="py-3.5 px-4">Name</th>
                                                <th className="py-3.5 px-4">Email</th>
                                                <th className="py-3.5 px-4">Branch</th>
                                                <th className="py-3.5 px-4">Role</th>
                                                <th className="py-3.5 px-4">Status</th>
                                                <th className="py-3.5 px-4">Created Date</th>
                                                <th className="py-3.5 px-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#333338] text-zinc-200">
                                            {employees
                                                .filter(e => {
                                                    if (productBranchFilter !== 'All' && e.branch && e.branch !== productBranchFilter) return false;
                                                    if (userRoleFilter === 'Admin' && e.role !== 'Admin') return false;
                                                    if (userRoleFilter === 'Staff' && !['Cashier', 'Kitchen Staff', 'Staff', 'Employee'].includes(e.role)) return false;
                                                    if (userRoleFilter === 'Customer' && e.role !== 'Customer') return false;
                                                    return true;
                                                })
                                                .map((e) => (
                                                    <tr key={e.id} className="hover:bg-[#27272a]/50 transition-colors">
                                                        <td className="py-4 px-4 font-bold text-white text-sm">{e.name}</td>
                                                        <td className="py-4 px-4 font-mono text-[#a1a1aa]">{e.email}</td>
                                                        <td className="py-4 px-4">
                                                            <span className={`whitespace-nowrap inline-flex items-center min-w-max px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                                                e.branch === 'Bulihan' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                                            }`}>
                                                                {(e.branch ?? productBranchFilter) === 'Bulihan' ? 'Bulihan Branch' : 'Dasmariñas Branch'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                                                                e.role === 'Admin' ? 'bg-amber-500/20 text-[#fbbf24] border-amber-500/40' :
                                                                e.role === 'Customer' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                                                                'bg-sky-500/20 text-sky-400 border-sky-500/40'
                                                            }`}>
                                                                {e.role}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className={`whitespace-nowrap inline-flex items-center min-w-max px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                                                e.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                                            }`}>
                                                                {e.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 font-mono text-[#71717a]">{e.createdAt}</td>
                                                        <td className="py-4 px-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={() => setEditingEmployee(e)}
                                                                    className="p-1.5 rounded-xl bg-[#27272a] text-[#fbbf24] hover:bg-[#3f3f46] border border-[#3f3f46]"
                                                                    title="Edit User Account"
                                                                >
                                                                    <Edit2 className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteEmployee(e)}
                                                                    className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20"
                                                                    title="Delete User Account"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TAB 8: AUDIT LOGS WITH BRANCH SORT */}
                        {activeTab === 'audit' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white font-domine">System Audit Logs</h3>
                                    <p className="text-xs text-[#a1a1aa]">Complete traceability log across Bulihan and Dasmariñas store actions</p>
                                </div>

                                <div className="p-4 rounded-3xl bg-[#202024] border border-[#333338] shadow-lg flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-2 bg-[#18181b] border border-[#3f3f46] px-3.5 py-2 rounded-xl text-xs">
                                            <MapPin className="w-4 h-4 text-[#f59e0b]" />
                                            <span className="text-[#a1a1aa] font-bold">Branch View:</span>
                                            <select
                                                value={productBranchFilter}
                                                onChange={(e) => setProductBranchFilter(e.target.value)}
                                                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                                            >
                                                <option value="Bulihan" className="bg-[#18181b]">Bulihan Branch</option>
                                                <option value="Dasma" className="bg-[#18181b]">Dasmariñas Branch</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-2 bg-[#18181b] border border-[#3f3f46] px-3.5 py-2 rounded-xl text-xs">
                                            <Filter className="w-4 h-4 text-[#f59e0b]" />
                                            <span className="text-[#a1a1aa] font-bold">Module:</span>
                                            <select
                                                value={auditModuleFilter}
                                                onChange={(e) => {
                                                    setAuditModuleFilter(e.target.value);
                                                    setAuditPage(1);
                                                }}
                                                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                                            >
                                                <option value="All" className="bg-[#18181b]">All Modules</option>
                                                <option value="Authentication" className="bg-[#18181b]">Authentication</option>
                                                <option value="Order Queue / Sales" className="bg-[#18181b]">Order Queue / Sales</option>
                                                <option value="Products & Stock" className="bg-[#18181b]">Products & Stock</option>
                                                <option value="Vouchers" className="bg-[#18181b]">Vouchers</option>
                                                <option value="Promo Banners" className="bg-[#18181b]">Promo Banners</option>
                                                <option value="Employees" className="bg-[#18181b]">Employees</option>
                                                <option value="Tables & QR" className="bg-[#18181b]">Tables & QR</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-2 bg-[#18181b] border border-[#3f3f46] px-3.5 py-2 rounded-xl text-xs">
                                            <Calendar className="w-4 h-4 text-[#f59e0b]" />
                                            <span className="text-[#a1a1aa] font-bold">Start:</span>
                                            <input
                                                type="date"
                                                value={auditStartDate}
                                                onChange={(e) => {
                                                    setAuditStartDate(e.target.value);
                                                    setAuditPage(1);
                                                }}
                                                className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2 bg-[#18181b] border border-[#3f3f46] px-3.5 py-2 rounded-xl text-xs">
                                            <Calendar className="w-4 h-4 text-[#f59e0b]" />
                                            <span className="text-[#a1a1aa] font-bold">End:</span>
                                            <input
                                                type="date"
                                                value={auditEndDate}
                                                onChange={(e) => {
                                                    setAuditEndDate(e.target.value);
                                                    setAuditPage(1);
                                                }}
                                                className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setAuditSortOrder(auditSortOrder === 'newest' ? 'oldest' : 'newest')}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/30 text-[#fbbf24] text-xs font-bold hover:bg-[#f59e0b] hover:text-[#3f2000] transition-all btn-bevel shadow-sm"
                                    >
                                        <ArrowUpDown className="w-4 h-4" />
                                        <span>Sort: {auditSortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
                                    </button>
                                </div>

                                <div className="rounded-3xl bg-[#202024] border border-[#333338] shadow-xl p-6 overflow-hidden space-y-4">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-[#18181b] text-[#a1a1aa] uppercase font-bold border-b border-[#333338]">
                                                <tr>
                                                    <th className="py-3.5 px-4">Timestamp</th>
                                                    <th className="py-3.5 px-4">User</th>
                                                    <th className="py-3.5 px-4">Module</th>
                                                    <th className="py-3.5 px-4">Action Detail</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#333338] text-zinc-200">
                                                {paginatedAuditLogs.map((log) => (
                                                    <tr key={log.id} className="hover:bg-[#27272a]/50 transition-colors">
                                                        <td className="py-3.5 px-4 font-mono text-[11px] text-[#fbbf24] font-bold">{log.timestamp}</td>
                                                        <td className="py-3.5 px-4 font-semibold text-white">{log.user} ({log.role})</td>
                                                        <td className="py-3.5 px-4">
                                                            {(() => {
                                                                const act = (log.action || '').toLowerCase();
                                                                let tagType = 'CREATE';
                                                                let tagStyle = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';

                                                                if (act.includes('delete') || act.includes('void') || act.includes('cancel') || act.includes('remove')) {
                                                                    tagType = 'DELETE';
                                                                    tagStyle = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
                                                                } else if (act.includes('update') || act.includes('edit') || act.includes('toggle') || act.includes('change') || act.includes('status')) {
                                                                    tagType = 'EDIT';
                                                                    tagStyle = 'bg-sky-500/20 text-sky-400 border-sky-500/40';
                                                                }

                                                                return (
                                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1.5 w-fit ${tagStyle}`}>
                                                                        <span className="font-mono tracking-wider">[{tagType}]</span>
                                                                        <span>{log.module}</span>
                                                                    </span>
                                                                );
                                                            })()}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-[#a1a1aa] font-mono">{log.action}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="pt-4 border-t border-[#333338] flex items-center justify-between text-xs">
                                        <div className="text-[#a1a1aa]">
                                            Showing <strong className="text-white font-mono">{totalAuditItems > 0 ? (auditPage - 1) * 10 + 1 : 0}</strong> to{' '}
                                            <strong className="text-white font-mono">{Math.min(auditPage * 10, totalAuditItems)}</strong> of{' '}
                                            <strong className="text-[#fbbf24] font-mono">{totalAuditItems}</strong> logs
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                disabled={auditPage === 1}
                                                onClick={() => setAuditPage(auditPage - 1)}
                                                className="px-3 py-1.5 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-bold"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                <span>Prev</span>
                                            </button>

                                            <span className="font-mono text-xs font-bold text-[#fbbf24] px-2">
                                                Page {auditPage} of {totalAuditPages}
                                            </span>

                                            <button
                                                disabled={auditPage >= totalAuditPages}
                                                onClick={() => setAuditPage(auditPage + 1)}
                                                className="px-3 py-1.5 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-bold"
                                            >
                                                <span>Next</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 9: SALES & REVENUE REPORT */}
                        {activeTab === 'sales' && (
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-bold text-white font-domine">Sales & Revenue Analytics</h3>
                                    <p className="text-xs text-[#a1a1aa]">Gross figures, branch breakdowns (Bulihan / Dasma), date range filters & high-resolution trend graph</p>
                                </div>

                                <div className="p-4 rounded-3xl bg-[#202024] border border-[#333338] shadow-lg flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-2 bg-[#18181b] border border-[#3f3f46] px-3.5 py-2 rounded-xl text-xs">
                                            <MapPin className="w-4 h-4 text-[#f59e0b]" />
                                            <span className="text-[#a1a1aa] font-bold">Branch Sort:</span>
                                            <select
                                                value={salesBranchFilter}
                                                onChange={(e) => setSalesBranchFilter(e.target.value)}
                                                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                                            >
                                                <option value="Bulihan" className="bg-[#18181b]">Bulihan Branch</option>
                                                <option value="Dasma" className="bg-[#18181b]">Dasmariñas Branch</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-2 bg-[#18181b] border border-[#3f3f46] px-3.5 py-2 rounded-xl text-xs">
                                            <Calendar className="w-4 h-4 text-[#f59e0b]" />
                                            <span className="text-[#a1a1aa] font-bold">Period:</span>
                                            <select
                                                value={salesDateRange}
                                                onChange={(e) => setSalesDateRange(e.target.value as any)}
                                                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                                            >
                                                <option value="all" className="bg-[#18181b]">All Time</option>
                                                <option value="today" className="bg-[#18181b]">Today (2026-07-26)</option>
                                                <option value="7days" className="bg-[#18181b]">Last 7 Days</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSalesSortOrder(salesSortOrder === 'newest' ? 'oldest' : 'newest')}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/30 text-[#fbbf24] text-xs font-bold hover:bg-[#f59e0b] hover:text-[#3f2000] transition-all btn-bevel shadow-sm"
                                    >
                                        <ArrowUpDown className="w-4 h-4" />
                                        <span>Sort: {salesSortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 rounded-3xl bg-[#202024] border border-[#333338] space-y-2 shadow-lg">
                                        <span className="text-xs font-bold text-[#a1a1aa] uppercase">Gross Revenue</span>
                                        <div className="text-3xl font-mono font-black text-[#fbbf24]">₱ {totalRevenue.toFixed(2)}</div>
                                        <p className="text-[11px] text-emerald-400 font-bold">100% verified sales</p>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-[#202024] border border-[#333338] space-y-2 shadow-lg">
                                        <span className="text-xs font-bold text-[#a1a1aa] uppercase">Average Order Value</span>
                                        <div className="text-3xl font-mono font-black text-white">₱ {(totalRevenue / Math.max(1, filteredSalesOrders.length)).toFixed(2)}</div>
                                        <p className="text-[11px] text-[#a1a1aa]">Across all fulfillment channels</p>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-[#202024] border border-[#333338] space-y-2 shadow-lg">
                                        <span className="text-xs font-bold text-[#a1a1aa] uppercase">Completed Orders</span>
                                        <div className="text-3xl font-mono font-black text-white">{filteredSalesOrders.length} Orders</div>
                                        <p className="text-[11px] text-emerald-400 font-bold">0% Cancellation rate</p>
                                    </div>
                                </div>

                                <div className="p-6 sm:p-8 rounded-3xl bg-[#202024] border border-[#333338] shadow-xl space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b]">
                                                <BarChart3 className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-domine font-bold text-white text-lg sm:text-xl">Daily Revenue Trend Graph (₱)</h4>
                                                <p className="text-xs text-[#a1a1aa]">Full-Width 1-Row Overview ({salesBranchFilter === 'All' ? 'Bulihan & Dasma Branches' : `${salesBranchFilter} Branch`})</p>
                                                <span className="text-xs font-mono font-bold text-[#fbbf24] bg-[#18181b] px-3.5 py-1.5 rounded-xl border border-[#3f3f46]">
                                                    Live Real-Time Sales Analytics
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-72 sm:h-80 flex items-end justify-between gap-4 sm:gap-6 pt-10 px-4 border-b border-[#333338] relative bg-[#18181b]/50 rounded-2xl p-4">
                                        {dailyRevenueBars.map((bar, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2.5 h-full justify-end group cursor-pointer relative z-10">
                                                <span className="text-xs font-mono font-black text-[#fbbf24] opacity-80 group-hover:opacity-100 transition-all bg-[#18181b] px-2 py-0.5 rounded border border-[#3f3f46]">
                                                    ₱{(bar.amount).toLocaleString()}
                                                </span>
                                                <div
                                                    style={{ height: bar.height }}
                                                    className="w-full max-w-[56px] rounded-t-2xl bg-gradient-to-t from-[#b45309] via-[#f59e0b] to-[#fbbf24] group-hover:brightness-125 transition-all shadow-lg shadow-[#f59e0b]/10 border-t border-[#fbbf24]"
                                                />
                                                <span className="text-[11px] font-bold text-[#a1a1aa] group-hover:text-white transition-colors">{bar.day}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </main>
            </div>

            {/* ADD PRODUCT MODAL */}
            {showAddProductModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
                    <div className="w-full max-w-xl rounded-3xl bg-[#18181b] border border-[#3f3f46] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-[#3f3f46]">
                            <div>
                                <h3 className="font-domine font-black text-white text-lg">Add New Sizzling Dish</h3>
                                <p className="text-xs text-[#a1a1aa]">Create a new menu item with branch pricing & stock</p>
                            </div>
                            <button onClick={() => setShowAddProductModal(false)} className="text-[#a1a1aa] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateProduct} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Product / Dish Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newProductName}
                                    onChange={(e) => setNewProductName(e.target.value)}
                                    placeholder="e.g. Sizzling Pork Sisig"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white focus:border-[#f59e0b] focus:outline-none"
                                />
                                {productFormErrors.name && (
                                    <p className="text-xs text-rose-400 mt-1">{productFormErrors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Category</label>
                                <select
                                    value={newProductCategory}
                                    onChange={(e) => setNewProductCategory(e.target.value as any)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white focus:border-[#f59e0b] focus:outline-none"
                                >
                                    <option value="Sizzling Rice Meals">Sizzling Rice Meals</option>
                                    <option value="Authentic Filipino Cuisine">Authentic Filipino Cuisine</option>
                                    <option value="Barkada Platters">Barkada Platters</option>
                                    <option value="Drinks & Extra Rice">Drinks & Extra Rice</option>
                                </select>
                            </div>

                            {/* Default Base Price & Stock */}
                            <div className="grid grid-cols-2 gap-4 p-3 rounded-2xl bg-[#141416] border border-[#333338]">
                                <div>
                                    <label className="block text-[11px] font-bold text-[#a1a1aa] mb-1">Default Base Price (₱) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={newProductPrice}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setNewProductPrice(val);
                                            if (!newProductPriceBulihan) setNewProductPriceBulihan(val);
                                            if (!newProductPriceDasmarinas) setNewProductPriceDasmarinas(val);
                                        }}
                                        placeholder="180.00"
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-mono focus:border-[#f59e0b] focus:outline-none"
                                    />
                                    {productFormErrors.price && (
                                        <p className="text-xs text-rose-400 mt-1">{productFormErrors.price}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-[#a1a1aa] mb-1">Default Total Stock *</label>
                                    <input
                                        type="number"
                                        required
                                        value={newProductStock}
                                        onChange={(e) => setNewProductStock(e.target.value)}
                                        placeholder="50"
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-mono focus:border-[#f59e0b] focus:outline-none"
                                    />
                                    {productFormErrors.stock_quantity && (
                                        <p className="text-xs text-rose-400 mt-1">{productFormErrors.stock_quantity}</p>
                                    )}
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
                                            value={newProductPriceBulihan}
                                            onChange={(e) => setNewProductPriceBulihan(e.target.value)}
                                            placeholder="180.00"
                                            className="w-full px-3 py-1.5 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-[#a1a1aa] mb-1">Bulihan Stock</label>
                                        <input
                                            type="number"
                                            value={newProductStockBulihan}
                                            onChange={(e) => setNewProductStockBulihan(e.target.value)}
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
                                            value={newProductPriceDasmarinas}
                                            onChange={(e) => setNewProductPriceDasmarinas(e.target.value)}
                                            placeholder="195.00"
                                            className="w-full px-3 py-1.5 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-[#a1a1aa] mb-1">Dasmariñas Stock</label>
                                        <input
                                            type="number"
                                            value={newProductStockDasmarinas}
                                            onChange={(e) => setNewProductStockDasmarinas(e.target.value)}
                                            placeholder="20"
                                            className="w-full px-3 py-1.5 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Dish Image Upload */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs font-bold text-[#a1a1aa]">Dish Image</label>
                                    <span className="text-[10px] text-[#f59e0b] font-mono">WebP, PNG, JPG (Max 10 MB)</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    {newProductImagePreview && (
                                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#3f3f46] bg-[#141416] shrink-0 shadow-md">
                                            <img src={newProductImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/webp,image/png,image/jpeg,image/jpg,image/gif,image/svg+xml,image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setNewProductImageFile(file);
                                                setNewProductImagePreview(URL.createObjectURL(file));
                                            }
                                        }}
                                        className="text-xs text-[#a1a1aa] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#27272a] file:text-white hover:file:bg-[#3f3f46] cursor-pointer"
                                    />
                                </div>
                                {productFormErrors.image && (
                                    <p className="text-xs text-rose-400 mt-1.5 font-medium">{productFormErrors.image}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="button"
                                    disabled={isSavingProduct}
                                    onClick={() => setShowAddProductModal(false)}
                                    className="flex-1 py-3 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-white font-bold text-xs cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingProduct}
                                    className="flex-1 py-3 rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] font-black text-xs uppercase tracking-wider shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                                >
                                    {isSavingProduct ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <span>Save Dish</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT PRODUCT MODAL */}
            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
                    <div className="w-full max-w-xl rounded-3xl bg-[#18181b] border border-[#3f3f46] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-[#3f3f46]">
                            <div>
                                <h3 className="font-domine font-black text-white text-lg">Edit Product Details</h3>
                                <p className="text-xs text-[#a1a1aa]">Modify dish pricing, stock, and photography</p>
                            </div>
                            <button onClick={() => setEditingProduct(null)} className="text-[#a1a1aa] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEditProduct} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={editProductName}
                                    onChange={(e) => setEditProductName(e.target.value)}
                                    placeholder="e.g. Sizzling Pork Sisig"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white focus:border-[#f59e0b] focus:outline-none"
                                />
                                {productFormErrors.name && (
                                    <p className="text-xs text-rose-400 mt-1">{productFormErrors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Category</label>
                                <select
                                    value={editProductCategory}
                                    onChange={(e) => setEditProductCategory(e.target.value as any)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white focus:border-[#f59e0b] focus:outline-none"
                                >
                                    <option value="Sizzling Rice Meals">Sizzling Rice Meals</option>
                                    <option value="Authentic Filipino Cuisine">Authentic Filipino Cuisine</option>
                                    <option value="Barkada Platters">Barkada Platters</option>
                                    <option value="Drinks & Extra Rice">Drinks & Extra Rice</option>
                                </select>
                            </div>

                            {/* Default Base Price & Stock */}
                            <div className="grid grid-cols-2 gap-4 p-3 rounded-2xl bg-[#141416] border border-[#333338]">
                                <div>
                                    <label className="block text-[11px] font-bold text-[#a1a1aa] mb-1">Default Base Price (₱) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={editProductPrice}
                                        onChange={(e) => setEditProductPrice(e.target.value)}
                                        placeholder="180.00"
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-mono focus:border-[#f59e0b] focus:outline-none"
                                    />
                                    {productFormErrors.price && (
                                        <p className="text-xs text-rose-400 mt-1">{productFormErrors.price}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-[#a1a1aa] mb-1">Default Total Stock *</label>
                                    <input
                                        type="number"
                                        required
                                        value={editProductStock}
                                        onChange={(e) => setEditProductStock(e.target.value)}
                                        placeholder="50"
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-mono focus:border-[#f59e0b] focus:outline-none"
                                    />
                                    {productFormErrors.stock_quantity && (
                                        <p className="text-xs text-rose-400 mt-1">{productFormErrors.stock_quantity}</p>
                                    )}
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
                                            value={editProductPriceBulihan}
                                            onChange={(e) => setEditProductPriceBulihan(e.target.value)}
                                            placeholder="180.00"
                                            className="w-full px-3 py-1.5 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-[#a1a1aa] mb-1">Bulihan Stock</label>
                                        <input
                                            type="number"
                                            value={editProductStockBulihan}
                                            onChange={(e) => setEditProductStockBulihan(e.target.value)}
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
                                            value={editProductPriceDasmarinas}
                                            onChange={(e) => setEditProductPriceDasmarinas(e.target.value)}
                                            placeholder="195.00"
                                            className="w-full px-3 py-1.5 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-[#a1a1aa] mb-1">Dasmariñas Stock</label>
                                        <input
                                            type="number"
                                            value={editProductStockDasmarinas}
                                            onChange={(e) => setEditProductStockDasmarinas(e.target.value)}
                                            placeholder="20"
                                            className="w-full px-3 py-1.5 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Product Image */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs font-bold text-[#a1a1aa]">Product Image</label>
                                    <span className="text-[10px] text-[#f59e0b] font-mono">WebP, PNG, JPG (Max 10 MB)</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    {editProductImagePreview && (
                                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#3f3f46] bg-[#141416] shrink-0 shadow-md">
                                            <img src={editProductImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/webp,image/png,image/jpeg,image/jpg,image/gif,image/svg+xml,image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setEditProductImageFile(file);
                                                setEditProductImagePreview(URL.createObjectURL(file));
                                            }
                                        }}
                                        className="text-xs text-[#a1a1aa] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#27272a] file:text-white hover:file:bg-[#3f3f46] cursor-pointer"
                                    />
                                </div>
                                {productFormErrors.image && (
                                    <p className="text-xs text-rose-400 mt-1.5 font-medium">{productFormErrors.image}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="button"
                                    disabled={isSavingProduct}
                                    onClick={() => setEditingProduct(null)}
                                    className="flex-1 py-3 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-white font-bold text-xs cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingProduct}
                                    className="flex-1 py-3 rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] font-black text-xs uppercase tracking-wider shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                                >
                                    {isSavingProduct ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <span>Save Changes</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* PRINT & VIEW TABLE QR MODAL */}
            {selectedPrintTable && (
                <div id="printable-qr-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <div className="w-full max-w-sm rounded-3xl bg-[#141416] text-[#f4f4f5] border-2 border-[#f59e0b] p-6 shadow-2xl text-center space-y-4 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center pb-2 border-b border-[#333338]">
                            <span className="font-domine font-black text-[#fbbf24] text-sm">SADDLE RANCH ROADHOUSE</span>
                            <button onClick={() => setSelectedPrintTable(null)} className="text-[#a1a1aa] hover:text-white no-print">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div>
                            <div className="text-[11px] font-bold text-[#f59e0b] uppercase tracking-widest">In-House Table QR Badge</div>
                            <h3 className="text-3xl font-black font-domine text-[#fbbf24] mt-0.5">TABLE #{selectedPrintTable}</h3>
                        </div>

                        <div className="w-52 h-52 mx-auto p-3 bg-white border-4 border-[#f59e0b] rounded-2xl shadow-xl flex items-center justify-center">
                            <img src={getRealQrCodeUrl(selectedPrintTable)} alt={`Table ${selectedPrintTable} QR`} className="w-full h-full object-contain" />
                        </div>

                        <div className="p-3 rounded-2xl bg-[#202024] border border-[#333338] text-xs text-[#a1a1aa] leading-snug">
                            Scan with camera to order directly from Table #{selectedPrintTable}
                        </div>

                        <div className="pt-2 flex gap-2 no-print">
                            <button
                                onClick={() => window.print()}
                                className="w-full py-3.5 rounded-2xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl btn-bevel"
                            >
                                <Printer className="w-4 h-4" />
                                <span>Print Roadhouse Badge</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ASSIGN / EDIT BANNER MODAL (FIXED PREVIEW & FILE INPUT) */}
            {targetBannerSlot !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
                    <form onSubmit={handleSaveSlotBanner} className="w-full max-w-xl rounded-3xl bg-[#202024] border border-[#3f3f46] p-6 shadow-2xl space-y-4 my-8">
                        <div className="flex items-center justify-between pb-2 border-b border-[#333338]">
                            <h3 className="text-lg font-bold text-white font-domine">
                                Edit Promo Banner (Slot #{targetBannerSlot})
                            </h3>
                            <button type="button" onClick={() => setTargetBannerSlot(null)} className="text-[#a1a1aa] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* FIXED REAL-TIME PREVIEW CARD */}
                        <div className="space-y-1.5">
                            <div className="text-[10px] font-mono font-bold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5 text-[#f59e0b]" /> Live Real-Time Customer Landing Page Preview:
                            </div>

                            <div className="relative min-h-[160px] rounded-2xl overflow-hidden bg-[#18181b] border border-[#f59e0b]/40 shadow-lg flex flex-col justify-end p-4">
                                <div className="absolute inset-0 vignette-overlay">
                                    {(bannerImagePreview || newBannerImage) ? (
                                        <img className="w-full h-full object-cover opacity-60" alt="Preview" src={bannerImagePreview || newBannerImage} />
                                    ) : (
                                        <div className="w-full h-full bg-[#27272a] flex items-center justify-center text-[#71717a] text-xs font-bold">
                                            No Image File Uploaded
                                        </div>
                                    )}
                                </div>
                                <div className="relative z-10 w-full bg-gradient-to-t from-[#141416] via-[#141416]/80 to-transparent p-2">
                                    <span className="font-mono text-[9px] text-[#f59e0b] bg-[#27272a] px-2 py-0.5 rounded border border-[#3f3f46] mb-1 inline-block font-bold uppercase">
                                        {newBannerTag || 'PROMO TAG'}
                                    </span>
                                    <h4 className="font-domine text-lg font-bold text-[#fbbf24] truncate">
                                        {newBannerTitle || 'Promotion Title'}
                                    </h4>
                                    <p className="font-sans text-xs text-[#a1a1aa] line-clamp-1">
                                        {newBannerSubtitle || 'Promotion Subtitle details...'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* INPUT FIELDS */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Banner Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={newBannerTitle}
                                    onChange={(e) => setNewBannerTitle(e.target.value)}
                                    placeholder="e.g. Sisig Saturdays Deal"
                                    className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white"
                                />
                                {bannerErrors.title && <p className="text-[11px] text-rose-400 mt-1">{bannerErrors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Subtitle / Deal Description</label>
                                <input
                                    type="text"
                                    value={newBannerSubtitle}
                                    onChange={(e) => setNewBannerSubtitle(e.target.value)}
                                    placeholder="e.g. Enjoy 20% off our legendary Pork Sisig..."
                                    className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Promo Tag (e.g. WEEKEND SPECIAL • 20% OFF)</label>
                                <input
                                    type="text"
                                    value={newBannerTag}
                                    onChange={(e) => setNewBannerTag(e.target.value)}
                                    placeholder="WEEKEND SPECIAL • 20% OFF"
                                    className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white uppercase"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Upload Banner Image File (WebP, PNG, JPG up to 10MB)</label>
                                <label className="w-full flex items-center justify-center gap-2.5 p-3 rounded-xl bg-[#18181b] border-2 border-dashed border-[#f59e0b]/50 text-xs font-bold text-[#fbbf24] hover:bg-[#27272a] hover:border-[#f59e0b] cursor-pointer transition-all">
                                    <Upload className="w-4 h-4 text-[#f59e0b]" />
                                    <span>{bannerImagePreview || newBannerImage ? 'Image Loaded! Click to replace' : 'Upload Banner Image File (WebP, PNG, JPG)'}</span>
                                    <input
                                        type="file"
                                        accept="image/webp,image/png,image/jpeg,image/jpg,image/gif,image/svg+xml,image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setBannerImageFile(file);
                                                setBannerImagePreview(URL.createObjectURL(file));
                                            }
                                        }}
                                        className="hidden"
                                    />
                                </label>
                                {bannerErrors.image && <p className="text-[11px] text-rose-400 mt-1">{bannerErrors.image}</p>}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={() => setTargetBannerSlot(null)} className="w-1/2 py-2.5 rounded-xl bg-[#27272a] text-[#a1a1aa] text-xs font-bold">Cancel</button>
                            <button type="submit" disabled={isSavingBanner} className="w-1/2 py-2.5 rounded-xl bg-[#f59e0b] text-[#3f2000] text-xs font-black uppercase btn-bevel disabled:opacity-50 flex items-center justify-center gap-2">
                                {isSavingBanner ? (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <span>Save Slot #{targetBannerSlot}</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ADD VOUCHER MODAL */}
            {showAddVoucherModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
                    <form onSubmit={handleCreateVoucher} className="w-full max-w-md rounded-3xl bg-[#202024] border border-[#3f3f46] p-6 shadow-2xl space-y-4 my-8">
                        <div className="flex items-center justify-between pb-2 border-b border-[#333338]">
                            <h3 className="text-lg font-bold text-white font-domine">Create Promo Ticket Voucher</h3>
                            <button type="button" onClick={() => setShowAddVoucherModal(false)} className="text-[#a1a1aa] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-1.5">
                            <div className="text-[10px] font-mono font-bold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5 text-[#f59e0b]" /> Live Physical Ticket Real-Time Preview:
                            </div>

                            <div className="relative rounded-2xl bg-[#18181b] border border-[#3f3f46] p-4 flex items-center gap-3">
                                <div className="flex-1 space-y-1 border-r border-dashed border-[#3f3f46] pr-3">
                                    <div className="text-[9px] font-mono font-bold text-[#f59e0b]">ROADHOUSE COUPON</div>
                                    <div className="font-domine text-2xl font-black text-[#fbbf24]">
                                        {newVoucherDiscountType === 'percentage' ? `${newVoucherValue || '10'}% OFF` : `₱${newVoucherValue || '50'} OFF`}
                                    </div>
                                    <div className="font-mono text-xs font-bold text-white bg-[#27272a] px-2 py-0.5 rounded inline-block">
                                        {newVoucherCode.toUpperCase() || 'PROMO10'}
                                    </div>
                                </div>
                                <div className="text-right text-[10px] text-[#71717a] font-mono space-y-1">
                                    <div>Min ₱{newVoucherMinSpend || '300'}</div>
                                    {newVoucherIsOneTime && (
                                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[8px] font-bold uppercase block">
                                            1-Time Use
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Voucher Code *</label>
                                <input
                                    type="text"
                                    required
                                    value={newVoucherCode}
                                    onChange={(e) => setNewVoucherCode(e.target.value)}
                                    placeholder="e.g. SUMMER15"
                                    className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white uppercase font-mono"
                                />
                                {voucherErrors.code && <p className="text-[11px] text-rose-400 mt-1">{voucherErrors.code}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Discount Type *</label>
                                    <select
                                        value={newVoucherDiscountType}
                                        onChange={(e) => setNewVoucherDiscountType(e.target.value as any)}
                                        className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₱)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Discount Value *</label>
                                    <input
                                        type="number"
                                        required
                                        value={newVoucherValue}
                                        onChange={(e) => setNewVoucherValue(e.target.value)}
                                        placeholder={newVoucherDiscountType === 'percentage' ? '15' : '50'}
                                        className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-mono"
                                    />
                                    {voucherErrors.value && <p className="text-[11px] text-rose-400 mt-1">{voucherErrors.value}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Min Order Spend (₱) *</label>
                                <input
                                    type="number"
                                    required
                                    value={newVoucherMinSpend}
                                    onChange={(e) => setNewVoucherMinSpend(e.target.value)}
                                    placeholder="300"
                                    className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-mono"
                                />
                            </div>

                            {/* VOUCHER SETTINGS: 1 TIME USE & LIMITED TIME ONLY */}
                            <div className="p-3.5 rounded-2xl bg-[#18181b] border border-[#333338] space-y-3">
                                <div className="text-xs font-bold text-[#fbbf24] uppercase tracking-wider">Voucher Rules & Restrictions</div>
                                
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label htmlFor="one-time-toggle" className="text-xs font-bold text-white cursor-pointer">1 Time Use Only</label>
                                        <p className="text-[10px] text-[#a1a1aa]">Limits voucher redemption to 1-time per customer</p>
                                    </div>
                                    <input
                                        id="one-time-toggle"
                                        type="checkbox"
                                        checked={newVoucherIsOneTime}
                                        onChange={(e) => setNewVoucherIsOneTime(e.target.checked)}
                                        className="w-4 h-4 accent-[#f59e0b] rounded cursor-pointer"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-[#27272a]">
                                    <div>
                                        <label htmlFor="limited-time-toggle" className="text-xs font-bold text-white cursor-pointer">Limited Time Only</label>
                                        <p className="text-[10px] text-[#a1a1aa]">Set activation and expiration date window</p>
                                    </div>
                                    <input
                                        id="limited-time-toggle"
                                        type="checkbox"
                                        checked={newVoucherIsLimitedTime}
                                        onChange={(e) => setNewVoucherIsLimitedTime(e.target.checked)}
                                        className="w-4 h-4 accent-[#f59e0b] rounded cursor-pointer"
                                    />
                                </div>

                                {newVoucherIsLimitedTime && (
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <div>
                                            <label className="block text-[11px] font-bold text-[#a1a1aa] mb-1">Date Activated</label>
                                            <input
                                                type="date"
                                                value={newVoucherStartsAt}
                                                onChange={(e) => setNewVoucherStartsAt(e.target.value)}
                                                className="w-full px-2.5 py-1.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-[#a1a1aa] mb-1">Date Ended</label>
                                            <input
                                                type="date"
                                                value={newVoucherExpiresAt}
                                                onChange={(e) => setNewVoucherExpiresAt(e.target.value)}
                                                className="w-full px-2.5 py-1.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white font-mono"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={() => setShowAddVoucherModal(false)} className="w-1/2 py-2.5 rounded-xl bg-[#27272a] text-[#a1a1aa] text-xs font-bold">Cancel</button>
                            <button type="submit" disabled={isSavingVoucher} className="w-1/2 py-2.5 rounded-xl bg-[#f59e0b] text-[#3f2000] text-xs font-black uppercase btn-bevel disabled:opacity-50 flex items-center justify-center gap-2">
                                {isSavingVoucher ? (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <span>Create Ticket</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* DELETE VOUCHER CONFIRMATION MODAL */}
            {deletingVoucher && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-[#1f1f23] border border-[#333338] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 transform transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                                <Trash2 className="w-6 h-6 text-rose-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black font-domine text-white">Delete Voucher Confirmation</h3>
                                <p className="text-xs text-[#a1a1aa] mt-0.5">Remove promo discount voucher coupon</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#141416] border border-[#27272a] space-y-2">
                            <p className="text-xs text-[#f4f4f5] leading-relaxed">
                                Are you sure you want to permanently delete coupon <strong className="text-[#fbbf24] font-mono font-bold">{deletingVoucher.code}</strong>?
                            </p>
                            <p className="text-[11px] text-[#71717a]">
                                This promo ticket will immediately become invalid for all customer orders across all stores.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                disabled={isDeletingVoucher}
                                onClick={() => setDeletingVoucher(null)}
                                className="px-5 py-2.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeletingVoucher}
                                onClick={handleConfirmDeleteVoucher}
                                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
                            >
                                {isDeletingVoucher ? (
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

            {/* VOID ORDER MODAL */}
            {voidingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <form onSubmit={handleConfirmVoid} className="w-full max-w-md rounded-3xl bg-[#202024] border border-amber-500/50 p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-[#333338]">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-amber-400" />
                                <h3 className="text-lg font-bold text-white font-domine">Void Order #{voidingOrder.id}</h3>
                            </div>
                            <button type="button" onClick={() => setVoidingOrder(null)} className="text-[#a1a1aa] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-xs text-[#a1a1aa]">
                            Voiding an order cancels it, restores stock levels, and records a security audit log. Please enter authorization password and reason.
                        </p>

                        {voidError && (
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                                {voidError}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Authorization Password *</label>
                            <input
                                type="password"
                                required
                                value={voidPassword}
                                onChange={(e) => setVoidPassword(e.target.value)}
                                placeholder="Enter admin/employee password"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white focus:border-amber-400 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Void Reason *</label>
                            <input
                                type="text"
                                required
                                value={voidReason}
                                onChange={(e) => setVoidReason(e.target.value)}
                                placeholder="e.g. Customer cancelled order / Wrong item entered"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white focus:border-amber-400 focus:outline-none"
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={() => setVoidingOrder(null)} className="w-1/2 py-2.5 rounded-xl bg-[#27272a] text-[#a1a1aa] text-xs font-bold">Cancel</button>
                            <button type="submit" disabled={isVoiding} className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#3f2000] text-xs font-black uppercase btn-bevel disabled:opacity-50">
                                {isVoiding ? 'Verifying...' : 'Confirm Void'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* DELETE ORDER PERMANENTLY MODAL */}
            {deletingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <div className="w-full max-w-sm rounded-3xl bg-[#202024] border border-rose-500/50 p-6 shadow-2xl space-y-4 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                            <Trash2 className="w-6 h-6" />
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white font-domine">Delete Order #{deletingOrder.id}?</h3>
                            <p className="text-xs text-[#a1a1aa] mt-1">
                                Are you sure you want to permanently delete this order from the database? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={() => setDeletingOrder(null)} className="w-1/2 py-2.5 rounded-xl bg-[#27272a] text-[#a1a1aa] text-xs font-bold">Cancel</button>
                            <button type="button" onClick={handleConfirmDeleteOrder} disabled={isDeletingOrder} className="w-1/2 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black uppercase btn-bevel disabled:opacity-50">
                                {isDeletingOrder ? 'Deleting...' : 'Delete Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD EMPLOYEE MODAL */}
            {showAddEmployeeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <form onSubmit={handleCreateEmployee} className="w-full max-w-sm rounded-3xl bg-[#202024] border border-[#3f3f46] p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-[#333338]">
                            <h3 className="text-lg font-bold text-white font-domine">Add Staff Account</h3>
                            <button type="button" onClick={() => setShowAddEmployeeModal(false)} className="text-[#a1a1aa] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Full Name *</label>
                            <input
                                type="text"
                                required
                                value={newEmpName}
                                onChange={(e) => setNewEmpName(e.target.value)}
                                placeholder="Staff Name"
                                className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white"
                            />
                            {employeeErrors.name && <p className="text-[11px] text-rose-400 mt-1">{employeeErrors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Email Address *</label>
                            <input
                                type="email"
                                required
                                value={newEmpEmail}
                                onChange={(e) => setNewEmpEmail(e.target.value)}
                                placeholder="staff@saddleranch.ph"
                                className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white"
                            />
                            {employeeErrors.email && <p className="text-[11px] text-rose-400 mt-1">{employeeErrors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Initial Password *</label>
                            <input
                                type="password"
                                required
                                value={newEmpPassword}
                                onChange={(e) => setNewEmpPassword(e.target.value)}
                                placeholder="Password (min 6 characters)"
                                className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white"
                            />
                            {employeeErrors.password && <p className="text-[11px] text-rose-400 mt-1">{employeeErrors.password}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Account Role *</label>
                                <select
                                    value={newEmpRole}
                                    onChange={(e) => setNewEmpRole(e.target.value as any)}
                                    className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white"
                                >
                                    <option value="Cashier">Cashier</option>
                                    <option value="Kitchen Staff">Kitchen Staff</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Branch Assignment *</label>
                                <select
                                    value={newEmpBranch}
                                    onChange={(e) => setNewEmpBranch(e.target.value as any)}
                                    className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-bold"
                                >
                                    <option value="Bulihan">Bulihan Branch</option>
                                    <option value="Dasma">Dasmariñas Branch</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={() => setShowAddEmployeeModal(false)} className="w-1/2 py-2.5 rounded-xl bg-[#27272a] text-[#a1a1aa] text-xs font-bold">Cancel</button>
                            <button type="submit" disabled={isSavingEmployee} className="w-1/2 py-2.5 rounded-xl bg-[#f59e0b] text-[#3f2000] text-xs font-black uppercase btn-bevel disabled:opacity-50 flex items-center justify-center gap-2">
                                {isSavingEmployee ? (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <span>Create Account</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* EDIT EMPLOYEE MODAL */}
            {editingEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <form onSubmit={handleSaveEditEmployee} className="w-full max-w-sm rounded-3xl bg-[#202024] border border-[#3f3f46] p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-[#333338]">
                            <h3 className="text-lg font-bold text-white font-domine">Edit Staff Account</h3>
                            <button type="button" onClick={() => setEditingEmployee(null)} className="text-[#a1a1aa] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={editingEmployee.name}
                                onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white"
                            />
                            {employeeErrors.name && <p className="text-[11px] text-rose-400 mt-1">{employeeErrors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={editingEmployee.email}
                                onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white"
                            />
                            {employeeErrors.email && <p className="text-[11px] text-rose-400 mt-1">{employeeErrors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Branch Assignment</label>
                            <select
                                value={editingEmployee.branch || 'Bulihan'}
                                onChange={(e) => setEditingEmployee({ ...editingEmployee, branch: e.target.value as any })}
                                className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white font-bold"
                            >
                                <option value="Bulihan">Bulihan Branch</option>
                                <option value="Dasma">Dasmariñas Branch</option>
                                <option value="All">All Branches</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Role</label>
                                <select
                                    value={editingEmployee.role}
                                    onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value as any })}
                                    className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white"
                                >
                                    <option value="Cashier">Cashier</option>
                                    <option value="Kitchen Staff">Kitchen Staff</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Status</label>
                                <select
                                    value={editingEmployee.status}
                                    onChange={(e) => setEditingEmployee({ ...editingEmployee, status: e.target.value as any })}
                                    className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs text-white"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={() => setEditingEmployee(null)} className="w-1/2 py-2.5 rounded-xl bg-[#27272a] text-[#a1a1aa] text-xs font-bold">Cancel</button>
                            <button type="submit" disabled={isSavingEmployee} className="w-1/2 py-2.5 rounded-xl bg-[#f59e0b] text-[#3f2000] text-xs font-black uppercase btn-bevel disabled:opacity-50 flex items-center justify-center gap-2">
                                {isSavingEmployee ? (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <span>Save Staff</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* DELETE EMPLOYEE CONFIRMATION MODAL */}
            {deletingEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-[#1f1f23] border border-[#333338] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 transform transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                                <Trash2 className="w-6 h-6 text-rose-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black font-domine text-white">Delete User Account</h3>
                                <p className="text-xs text-[#a1a1aa] mt-0.5">Remove staff account</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#141416] border border-[#27272a] space-y-2">
                            <p className="text-xs text-[#f4f4f5] leading-relaxed">
                                Are you sure you want to delete staff account <strong className="text-[#fbbf24] font-bold">{deletingEmployee.name}</strong> ({deletingEmployee.email})?
                            </p>
                            <p className="text-[11px] text-[#71717a]">
                                This user will immediately lose access to the cashier/kitchen dashboard and admin portal.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                disabled={isDeletingEmployee}
                                onClick={() => setDeletingEmployee(null)}
                                className="px-5 py-2.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeletingEmployee}
                                onClick={handleConfirmDeleteEmployee}
                                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
                            >
                                {isDeletingEmployee ? (
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

            {/* Delete Product Confirmation Modal */}
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
                                disabled={isDeletingProduct}
                                onClick={() => setDeletingProduct(null)}
                                className="px-5 py-2.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeletingProduct}
                                onClick={handleConfirmDeleteProduct}
                                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
                            >
                                {isDeletingProduct ? (
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

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-[#1f1f23] border border-[#333338] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 transform transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                                <LogOut className="w-6 h-6 text-rose-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black font-domine text-white">Log Out Confirmation</h3>
                                <p className="text-xs text-[#a1a1aa] mt-1">Are you sure you want to log out?</p>
                            </div>
                        </div>

                        <p className="text-xs text-[#71717a] leading-relaxed bg-[#141416] p-3.5 rounded-xl border border-[#27272a]">
                            You will need to sign back in with your administrator credentials to manage products, staff, and view analytics.
                        </p>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowLogoutModal(false)}
                                className="px-5 py-2.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white text-xs font-bold transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => router.post('/logout')}
                                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Log Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
