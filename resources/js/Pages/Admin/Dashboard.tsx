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
    Printer,
    Upload,
    ArrowRight,
    Calendar,
    BarChart3,
    PieChart,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight
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
    date: string; // YYYY-MM-DD
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
    createdAt: string;
}

interface AuditLogItem {
    id: number;
    timestamp: string; // YYYY-MM-DD HH:MM:SS
    user: string;
    role: string;
    action: string;
    module: 'Authentication' | 'Order Queue / Sales' | 'Products & Stock' | 'Vouchers' | 'Promo Banners' | 'Employees' | 'Tables & QR';
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
        { id: 'SR-1049', type: 'Dine-In', location: 'Table 05', customer: 'Juan Dela Cruz', phone: '09171234567', amount: 640, payment: 'GCash', status: 'preparing', time: '10 mins ago', itemsCount: 3, date: '2026-07-26' },
        { id: 'SR-1048', type: 'Pick-Up', location: 'Counter', customer: 'Marco Reyes', phone: '09189876543', amount: 460, payment: 'Cash (Pick-Up)', status: 'ready', time: '25 mins ago', itemsCount: 2, date: '2026-07-26' },
        { id: 'SR-1047', type: 'Delivery', location: 'Bulihan Area (Anahaw II)', customer: 'Elena Cruz', phone: '09223334444', amount: 890, payment: 'Cash on Delivery', status: 'pending', time: '30 mins ago', itemsCount: 4, date: '2026-07-25' },
        { id: 'SR-1046', type: 'Dine-In', location: 'Table 02', customer: 'Seated Guest', phone: '09175556666', amount: 360, payment: 'GCash', status: 'completed', time: '1 hour ago', itemsCount: 2, date: '2026-07-24' },
    ]);

    // 4 PROMO BANNER SLOTS matching customer landing page layout 1:1
    const [banners, setBanners] = useState<Record<number, BannerItem>>({
        1: {
            slot: 1,
            title: 'Sisig Saturdays Deal',
            subtitle: 'Enjoy 20% off our legendary 24-hour marinated Pork Sisig served on a smoking hot skillet with raw egg and calamansi.',
            tag: 'WEEKEND SPECIAL • 20% OFF',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6QEUONokTX7mi1M1Wrie14cxeoNfVq5HyIS1sLOLWKbzZyh6OfegCBaNeH6E7uS37ugVc6jjmILNzIrmvE0tpXkOBCDP29HO1WZL69MsOd6lpwp4oX6ezfDjuAsLMCu57vBpiHDupWu3yDATuk2k_HgpQMi23Y7mifgQKqPJhc0GqDXCCk1tPooIkFyBCXPiESBHm8HKF8cp1ctvD0RZ39YNVxKG_2cPaPyfryUGBbaoIHhqqhq5R9BflPtI6jMfzsP3W6QStlttx',
            isActive: true
        },
        2: {
            slot: 2,
            title: 'Cowboy Ribeye Special',
            subtitle: 'Bone-in, seared on smoking cast iron.',
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
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl',
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
        { id: 1, name: 'Saddle Ranch Admin', email: 'admin@saddleranch.ph', role: 'Admin', status: 'Active', createdAt: '2026-01-15' },
        { id: 2, name: 'Cashier Employee', email: 'cashier@saddleranch.ph', role: 'Cashier', status: 'Active', createdAt: '2026-03-10' },
        { id: 3, name: 'Kitchen Head Chef', email: 'kitchen@saddleranch.ph', role: 'Kitchen Staff', status: 'Active', createdAt: '2026-05-20' }
    ]);

    const [tables, setTables] = useState<string[]>(['01', '02', '03', '04', '05', '06', '07', '08']);
    const [selectedPrintTable, setSelectedPrintTable] = useState<string | null>(null);

    // Expanded Audit Logs Dataset (20+ items spanning dates for 10-item pagination testing)
    const [auditLogs] = useState<AuditLogItem[]>([
        { id: 1, timestamp: '2026-07-26 18:45:10', user: 'admin@saddleranch.ph', role: 'Admin', action: 'Updated product price for Sizzling Pork Sisig to ₱180.00', module: 'Products & Stock' },
        { id: 2, timestamp: '2026-07-26 18:30:22', user: 'cashier@saddleranch.ph', role: 'Cashier', action: 'Marked Order #SR-1048 as Ready (₱460.00)', module: 'Order Queue / Sales' },
        { id: 3, timestamp: '2026-07-26 17:15:00', user: 'admin@saddleranch.ph', role: 'Admin', action: 'Created new discount voucher SADDLE10 (10% OFF)', module: 'Vouchers' },
        { id: 4, timestamp: '2026-07-26 16:00:44', user: 'admin@saddleranch.ph', role: 'Admin', action: 'Logged in to Admin Portal', module: 'Authentication' },
        { id: 5, timestamp: '2026-07-25 14:10:05', user: 'cashier@saddleranch.ph', role: 'Cashier', action: 'Checked out customer order #SR-1047 (Delivery)', module: 'Order Queue / Sales' },
        { id: 6, timestamp: '2026-07-25 10:00:00', user: 'admin@saddleranch.ph', role: 'Admin', action: 'Generated Table #08 QR Code Badge', module: 'Tables & QR' },
        { id: 7, timestamp: '2026-07-24 19:22:11', user: 'admin@saddleranch.ph', role: 'Admin', action: 'Updated Promo Banner Slot #1 (Sisig Saturdays)', module: 'Promo Banners' },
        { id: 8, timestamp: '2026-07-24 11:05:40', user: 'admin@saddleranch.ph', role: 'Admin', action: 'Added new Kitchen Staff account (kitchen@saddleranch.ph)', module: 'Employees' },
        { id: 9, timestamp: '2026-07-23 15:30:00', user: 'admin@saddleranch.ph', role: 'Admin', action: 'Updated stock quantity for Sizzling Bulalo Steak to 15', module: 'Products & Stock' },
        { id: 10, timestamp: '2026-07-23 12:00:15', user: 'cashier@saddleranch.ph', role: 'Cashier', action: 'Logged in to Cashier KDS terminal', module: 'Authentication' },
        { id: 11, timestamp: '2026-07-22 18:00:00', user: 'admin@saddleranch.ph', role: 'Admin', action: 'Created new discount voucher BULIHANFREE (15% OFF)', module: 'Vouchers' },
        { id: 12, timestamp: '2026-07-22 09:45:22', user: 'admin@saddleranch.ph', role: 'Admin', action: 'Generated Table #07 QR Code Badge', module: 'Tables & QR' },
        { id: 13, timestamp: '2026-07-21 16:15:10', user: 'admin@saddleranch.ph', role: 'Admin', action: 'Updated Promo Banner Slot #4 (Pulutan Happy Hour)', module: 'Promo Banners' },
        { id: 14, timestamp: '2026-07-21 13:20:44', user: 'cashier@saddleranch.ph', role: 'Cashier', action: 'Completed Dine-In order #SR-1042 (₱1,250.00)', module: 'Order Queue / Sales' },
        { id: 15, timestamp: '2026-07-20 11:10:00', user: 'admin@saddleranch.ph', role: 'Admin', action: 'Updated staff role for Cashier Employee', module: 'Employees' },
        { id: 16, timestamp: '2026-07-19 14:05:33', user: 'admin@saddleranch.ph', role: 'Admin', action: 'Added product Sizzling Chicken Inasal Platter', module: 'Products & Stock' },
        { id: 17, timestamp: '2026-07-18 10:00:00', user: 'admin@saddleranch.ph', role: 'Admin', action: 'Logged in to Admin Portal', module: 'Authentication' },
        { id: 18, timestamp: '2026-07-17 15:40:12', user: 'cashier@saddleranch.ph', role: 'Cashier', action: 'Prepared Pick-Up order #SR-1035', module: 'Order Queue / Sales' },
        { id: 19, timestamp: '2026-07-16 09:12:00', user: 'admin@saddleranch.ph', role: 'Admin', action: 'Created new discount voucher WELCOME2026', module: 'Vouchers' },
        { id: 20, timestamp: '2026-07-15 17:30:00', user: 'admin@saddleranch.ph', role: 'Admin', action: 'System database backup executed', module: 'Authentication' },
    ]);

    // Product Add & Edit Modals State
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [newProductName, setNewProductName] = useState('');
    const [newProductCategory, setNewProductCategory] = useState('Authentic Filipino');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [newProductStock, setNewProductStock] = useState('50');
    const [newProductImage, setNewProductImage] = useState('');

    const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

    // Slot-based Banner Modal State with Real-Time Preview
    const [targetBannerSlot, setTargetBannerSlot] = useState<number | null>(null);
    const [newBannerTitle, setNewBannerTitle] = useState('');
    const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
    const [newBannerTag, setNewBannerTag] = useState('');
    const [newBannerImage, setNewBannerImage] = useState('');
    const [newBannerCta, setNewBannerCta] = useState('');

    // Voucher Modal State with Real-Time Preview
    const [showAddVoucherModal, setShowAddVoucherModal] = useState(false);
    const [newVoucherCode, setNewVoucherCode] = useState('');
    const [newVoucherDiscount, setNewVoucherDiscount] = useState('10');
    const [newVoucherMinSpend, setNewVoucherMinSpend] = useState('300');

    // Employee CRUD Modals State
    const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
    const [newEmpName, setNewEmpName] = useState('');
    const [newEmpEmail, setNewEmpEmail] = useState('');
    const [newEmpRole, setNewEmpRole] = useState<'Admin' | 'Kitchen Staff' | 'Cashier'>('Cashier');

    const [editingEmployee, setEditingEmployee] = useState<EmployeeItem | null>(null);

    // Audit Logs Filters, Start/End Dates & 10-Item Pagination
    const [auditModuleFilter, setAuditModuleFilter] = useState<string>('All');
    const [auditSortOrder, setAuditSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [auditStartDate, setAuditStartDate] = useState<string>('');
    const [auditEndDate, setAuditEndDate] = useState<string>('');
    const [auditPage, setAuditPage] = useState<number>(1);

    // Sales & Revenue Date Range Filter
    const [salesDateRange, setSalesDateRange] = useState<'all' | 'today' | '7days' | 'month'>('all');

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

    const deleteVoucher = (id: number) => {
        setVouchers(vouchers.filter(v => v.id !== id));
    };

    const deleteEmployee = (id: number) => {
        setEmployees(employees.filter(e => e.id !== id));
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

    const handleSaveEditEmployee = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEmployee) return;

        setEmployees(employees.map(emp => emp.id === editingEmployee.id ? editingEmployee : emp));
        setEditingEmployee(null);
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
            minSpend: parseFloat(newVoucherMinSpend) || 300,
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
            status: 'Active',
            createdAt: new Date().toISOString().split('T')[0]
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

    // Filtered & Sorted Audit Logs with Start / End Date Filtering
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

    // Audit Logs 10-Item Pagination
    const totalAuditItems = filteredAuditLogs.length;
    const totalAuditPages = Math.max(1, Math.ceil(totalAuditItems / 10));
    const paginatedAuditLogs = filteredAuditLogs.slice((auditPage - 1) * 10, auditPage * 10);

    // Filtered Sales Orders by Date Range
    const filteredSalesOrders = orders.filter(o => {
        if (salesDateRange === 'today') return o.date === '2026-07-26';
        if (salesDateRange === '7days') return o.date >= '2026-07-20';
        return true;
    });

    const totalRevenue = filteredSalesOrders.filter(o => o.status === 'completed' || o.status === 'ready' || o.status === 'preparing').reduce((acc, o) => acc + o.amount, 0);

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
                                        <p className="text-xs text-[#d8c3ad]">Manage sizzling menu items, prices, uploaded images, and stock counts</p>
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

                        {/* TAB 5: PROMO BANNERS (EXACT 1:1 BENTO GRID LAYOUT WITH CUSTOMER LANDING PAGE) */}
                        {activeTab === 'banners' && (
                            <div className="space-y-6">
                                <div>
                                    <span className="font-mono text-xs text-[#f59e0b] bg-[#31281f] px-3 py-1 rounded border border-[#534434] uppercase tracking-widest font-bold inline-block mb-2">
                                        Exclusive Roadhouse Specials
                                    </span>
                                    <h3 className="font-domine text-2xl sm:text-4xl text-[#ffc174] font-bold tracking-tight">
                                        Promotions & Deals (Customer View Live Preview)
                                    </h3>
                                    <p className="text-xs text-[#d8c3ad] mt-1">Exact 1:1 layout display. Click any slot to upload local image blobs and edit promotion text in real time.</p>
                                </div>

                                {/* Asymmetric Bento Grid matching Landing.tsx 1:1 */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                    
                                    {/* Slot 1: Large Featured Hero Banner */}
                                    <div className="md:col-span-2 md:row-span-2 relative min-h-[380px] lg:min-h-[420px] rounded-2xl overflow-hidden raised-layer group hover-heat bg-[#1A1A1B] border border-[#534434]/60 shadow-2xl flex flex-col justify-end">
                                        {banners[1] ? (
                                            <>
                                                <div className="absolute inset-0 vignette-overlay">
                                                    <img
                                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105"
                                                        alt={banners[1].title}
                                                        src={banners[1].image}
                                                    />
                                                </div>
                                                <div className="relative z-10 p-6 md:p-8 w-full bg-gradient-to-t from-[#1A1A1B] via-[#1A1A1B]/90 to-transparent">
                                                    <span className="font-mono text-xs text-[#f59e0b] bg-[#31281f] px-3 py-1 rounded border border-[#534434] mb-3 inline-block font-bold shadow uppercase">
                                                        {banners[1].tag}
                                                    </span>
                                                    <h3 className="font-domine text-2xl sm:text-4xl font-bold text-[#ffc174] mb-2 drop-shadow-md">
                                                        {banners[1].title}
                                                    </h3>
                                                    <p className="font-sans text-xs sm:text-sm md:text-base text-[#d8c3ad] max-w-lg leading-relaxed">
                                                        {banners[1].subtitle}
                                                    </p>
                                                    
                                                    <button
                                                        onClick={() => openSlotBannerModal(1)}
                                                        className="mt-4 px-4 py-2 rounded-xl bg-[#f59e0b] text-[#472a00] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 btn-bevel shadow-xl"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                        <span>Edit Slot #1 (Main Hero)</span>
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => openSlotBannerModal(1)}
                                                className="w-full h-full min-h-[380px] border-2 border-dashed border-[#f59e0b]/50 bg-[#1A1A1B]/40 hover:bg-[#1A1A1B] transition-all flex flex-col items-center justify-center p-6 text-center space-y-3"
                                            >
                                                <div className="w-16 h-16 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#ffc174] flex items-center justify-center">
                                                    <Plus className="w-8 h-8 text-[#f59e0b]" />
                                                </div>
                                                <div>
                                                    <div className="font-domine font-bold text-white text-lg">Assign Slot #1 (Main Hero Box)</div>
                                                    <p className="text-xs text-[#8c7a6b]">Large Box (Top Left)</p>
                                                </div>
                                            </button>
                                        )}
                                    </div>

                                    {/* Slot 2: Square Card - Top Right */}
                                    <div className="relative min-h-[190px] lg:min-h-[200px] rounded-2xl overflow-hidden raised-layer group hover-heat bg-[#1A1A1B] border border-[#534434]/60 shadow-xl flex flex-col justify-end">
                                        {banners[2] ? (
                                            <>
                                                <div className="absolute inset-0 vignette-overlay">
                                                    <img
                                                        className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-all duration-500 group-hover:scale-105"
                                                        alt={banners[2].title}
                                                        src={banners[2].image}
                                                    />
                                                </div>
                                                <div className="relative z-10 p-5 w-full bg-gradient-to-t from-[#1A1A1B] via-[#1A1A1B]/80 to-transparent">
                                                    <span className="font-mono text-[10px] text-[#f59e0b] bg-[#31281f] px-2 py-0.5 rounded border border-[#534434] mb-1.5 inline-block font-bold uppercase">
                                                        {banners[2].tag}
                                                    </span>
                                                    <h3 className="font-domine text-base font-bold text-[#ffc174]">{banners[2].title}</h3>
                                                    <p className="font-sans text-xs text-[#d8c3ad] mt-0.5 line-clamp-1">{banners[2].subtitle}</p>

                                                    <button
                                                        onClick={() => openSlotBannerModal(2)}
                                                        className="mt-2 text-[10px] font-bold text-[#f59e0b] hover:text-[#ffc174] uppercase flex items-center gap-1"
                                                    >
                                                        <Edit2 className="w-3 h-3" /> Edit Slot #2
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => openSlotBannerModal(2)}
                                                className="w-full h-full min-h-[190px] border-2 border-dashed border-[#f59e0b]/50 bg-[#1A1A1B]/40 hover:bg-[#1A1A1B] transition-all flex flex-col items-center justify-center p-4 text-center space-y-1.5"
                                            >
                                                <Plus className="w-6 h-6 text-[#f59e0b]" />
                                                <div className="font-bold text-white text-xs">Assign Slot #2 (Top Right Box)</div>
                                            </button>
                                        )}
                                    </div>

                                    {/* Slot 3: Square Card - Middle Right */}
                                    <div className="relative min-h-[190px] lg:min-h-[200px] rounded-2xl overflow-hidden raised-layer group hover-heat bg-[#1A1A1B] border border-[#534434]/60 shadow-xl flex flex-col justify-end">
                                        {banners[3] ? (
                                            <>
                                                <div className="absolute inset-0 vignette-overlay">
                                                    <img
                                                        className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-all duration-500 group-hover:scale-105"
                                                        alt={banners[3].title}
                                                        src={banners[3].image}
                                                    />
                                                </div>
                                                <div className="relative z-10 p-5 w-full bg-gradient-to-t from-[#1A1A1B] via-[#1A1A1B]/80 to-transparent">
                                                    <span className="font-mono text-[10px] text-emerald-400 bg-[#31281f] px-2 py-0.5 rounded border border-[#534434] mb-1.5 inline-block font-bold uppercase">
                                                        {banners[3].tag}
                                                    </span>
                                                    <h3 className="font-domine text-base font-bold text-[#f0e0d1]">{banners[3].title}</h3>
                                                    <p className="font-sans text-xs text-[#d8c3ad] mt-0.5 line-clamp-1">{banners[3].subtitle}</p>

                                                    <button
                                                        onClick={() => openSlotBannerModal(3)}
                                                        className="mt-2 text-[10px] font-bold text-[#f59e0b] hover:text-[#ffc174] uppercase flex items-center gap-1"
                                                    >
                                                        <Edit2 className="w-3 h-3" /> Edit Slot #3
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => openSlotBannerModal(3)}
                                                className="w-full h-full min-h-[190px] border-2 border-dashed border-[#f59e0b]/50 bg-[#1A1A1B]/40 hover:bg-[#1A1A1B] transition-all flex flex-col items-center justify-center p-4 text-center space-y-1.5"
                                            >
                                                <Plus className="w-6 h-6 text-[#f59e0b]" />
                                                <div className="font-bold text-white text-xs">Assign Slot #3 (Middle Right Box)</div>
                                            </button>
                                        )}
                                    </div>

                                    {/* Slot 4: Wide Accent Horizontal Banner */}
                                    <div className="md:col-span-3 relative min-h-[180px] rounded-2xl overflow-hidden raised-layer group hover-heat bg-[#221a12] border border-[#534434]/60 shadow-xl flex items-center">
                                        {banners[4] ? (
                                            <>
                                                <div className="w-full md:w-2/3 p-6 md:p-8 z-10 space-y-2">
                                                    <span className="font-mono text-xs text-[#f59e0b] bg-[#31281f] px-3 py-1 rounded border border-[#534434] inline-block font-bold uppercase">
                                                        {banners[4].tag}
                                                    </span>
                                                    <h3 className="font-domine text-2xl font-bold text-[#ffc174]">{banners[4].title}</h3>
                                                    <p className="font-sans text-xs sm:text-sm text-[#d8c3ad] max-w-xl">
                                                        {banners[4].subtitle}
                                                    </p>
                                                    <div className="text-[#f59e0b] font-mono text-xs font-bold flex items-center pt-1">
                                                        {banners[4].ctaText || 'ORDER PULUTAN NOW →'} <ArrowRight className="w-4 h-4 ml-1.5" />
                                                    </div>

                                                    <button
                                                        onClick={() => openSlotBannerModal(4)}
                                                        className="mt-3 px-3 py-1.5 rounded-xl bg-[#f59e0b] text-[#472a00] text-xs font-black uppercase flex items-center gap-1.5 btn-bevel"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" /> Edit Slot #4
                                                    </button>
                                                </div>

                                                <div className="hidden md:block w-1/3 h-full vignette-overlay relative">
                                                    <img
                                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-500"
                                                        alt={banners[4].title}
                                                        src={banners[4].image}
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => openSlotBannerModal(4)}
                                                className="w-full h-full min-h-[180px] border-2 border-dashed border-[#f59e0b]/50 bg-[#1A1A1B]/40 hover:bg-[#1A1A1B] transition-all flex flex-col items-center justify-center p-6 text-center space-y-2"
                                            >
                                                <Plus className="w-8 h-8 text-[#f59e0b]" />
                                                <div className="font-domine font-bold text-white text-base">Assign Slot #4 (Bottom Wide Banner)</div>
                                            </button>
                                        )}
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* TAB 6: DISCOUNT VOUCHERS (PHYSICAL TICKET COUPONS WITH REALTIME PREVIEW MODAL) */}
                        {activeTab === 'vouchers' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white font-domine">Discount Vouchers & Ticket Coupons</h3>
                                        <p className="text-xs text-[#d8c3ad]">Create and issue physical ticket style promo codes for customer checkout</p>
                                    </div>
                                    <button
                                        onClick={() => setShowAddVoucherModal(true)}
                                        className="px-4 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#472a00] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 btn-bevel shadow-lg"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Create New Ticket</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {vouchers.map((v) => (
                                        <div key={v.id} className="relative rounded-3xl bg-[#1A1A1B] border border-[#534434]/80 shadow-2xl overflow-hidden flex flex-col justify-between group">
                                            
                                            {/* Top & Bottom Ticket Cutout Punch Notches */}
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#121213] border border-[#534434]/80 z-20" />
                                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#121213] border border-[#534434]/80 z-20" />

                                            {/* Ticket Body Layout with Vertical Tear Line */}
                                            <div className="p-6 flex items-stretch gap-4 relative z-10">
                                                
                                                {/* Left Section: Gold Foil Discount */}
                                                <div className="flex-1 space-y-2 pr-4 border-r-2 border-dashed border-[#534434]/60">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#f59e0b]">
                                                        <Ticket className="w-4 h-4 text-[#f59e0b]" />
                                                        <span className="uppercase tracking-widest font-mono text-[10px]">ROADHOUSE COUPON</span>
                                                    </div>

                                                    <div className="font-domine text-3xl font-black text-[#ffc174] tracking-tight">
                                                        {v.discountPercent}% OFF
                                                    </div>

                                                    <div className="inline-block px-3 py-1 rounded-xl bg-[#261e15] border border-[#534434] font-mono font-black text-white text-sm tracking-wider">
                                                        {v.code}
                                                    </div>

                                                    <div className="text-[11px] text-[#d8c3ad]">
                                                        Min order: <strong className="text-amber-400 font-mono font-bold">₱{v.minSpend.toFixed(2)}</strong>
                                                    </div>
                                                </div>

                                                {/* Right Section: Redemption Counter & Status */}
                                                <div className="w-24 flex flex-col justify-between items-end text-right pl-2">
                                                    <button
                                                        onClick={() => deleteVoucher(v.id)}
                                                        className="p-1.5 rounded-full text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                                        title="Delete Voucher"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>

                                                    <div className="space-y-1">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider block ${
                                                            v.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-stone-800 text-stone-400'
                                                        }`}>
                                                            {v.isActive ? 'Active' : 'Expired'}
                                                        </span>
                                                        <div className="text-[10px] text-[#8c7a6b] font-mono font-bold">
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

                        {/* TAB 7: EMPLOYEES (FULL CRUD IMPLEMENTATION) */}
                        {activeTab === 'employees' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white font-domine">Staff & Employee Accounts (Full CRUD)</h3>
                                        <p className="text-xs text-[#d8c3ad]">Add, edit, deactivate, or delete Cashier and Kitchen staff permissions</p>
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
                                                <th className="py-3.5 px-4">Created Date</th>
                                                <th className="py-3.5 px-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#534434]/30 text-stone-200">
                                            {employees.map((e) => (
                                                <tr key={e.id} className="hover:bg-[#261e15]/40 transition-colors">
                                                    <td className="py-4 px-4 font-bold text-white text-sm">{e.name}</td>
                                                    <td className="py-4 px-4 font-mono text-[#d8c3ad]">{e.email}</td>
                                                    <td className="py-4 px-4">
                                                        <span className="px-2.5 py-1 rounded-full bg-[#f59e0b]/20 text-[#ffc174] text-[10px] font-black uppercase border border-[#f59e0b]/30">
                                                            {e.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                                                            e.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                                        }`}>
                                                            {e.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 font-mono text-[#8c7a6b]">{e.createdAt}</td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => setEditingEmployee(e)}
                                                                className="p-1.5 rounded-xl bg-[#261e15] text-[#ffc174] hover:bg-[#31281f] border border-[#534434]"
                                                                title="Edit Employee"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteEmployee(e.id)}
                                                                className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20"
                                                                title="Delete Employee"
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

                        {/* TAB 8: AUDIT LOGS WITH RE-DESIGNED SORT, START/END DATE RANGE & 10-ITEM PAGINATION */}
                        {activeTab === 'audit' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white font-domine">System Audit Logs</h3>
                                    <p className="text-xs text-[#d8c3ad]">Complete traceability log across Products, Auth, Sales, Vouchers, Banners, Staff & QR</p>
                                </div>

                                {/* REDESIGNED FILTER & DATE RANGE SORT TOOLBAR */}
                                <div className="p-4 rounded-3xl bg-[#1A1A1B] border border-[#534434]/60 shadow-xl flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        
                                        {/* Module Filter */}
                                        <div className="flex items-center gap-2 bg-[#121213] border border-[#534434] px-3.5 py-2 rounded-xl text-xs">
                                            <Filter className="w-4 h-4 text-[#f59e0b]" />
                                            <span className="text-[#8c7a6b] font-bold">Module:</span>
                                            <select
                                                value={auditModuleFilter}
                                                onChange={(e) => {
                                                    setAuditModuleFilter(e.target.value);
                                                    setAuditPage(1);
                                                }}
                                                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                                            >
                                                <option value="All" className="bg-[#121213]">All Modules</option>
                                                <option value="Authentication" className="bg-[#121213]">Authentication</option>
                                                <option value="Order Queue / Sales" className="bg-[#121213]">Order Queue / Sales</option>
                                                <option value="Products & Stock" className="bg-[#121213]">Products & Stock</option>
                                                <option value="Vouchers" className="bg-[#121213]">Vouchers</option>
                                                <option value="Promo Banners" className="bg-[#121213]">Promo Banners</option>
                                                <option value="Employees" className="bg-[#121213]">Employees</option>
                                                <option value="Tables & QR" className="bg-[#121213]">Tables & QR</option>
                                            </select>
                                        </div>

                                        {/* Start Date Picker */}
                                        <div className="flex items-center gap-2 bg-[#121213] border border-[#534434] px-3.5 py-2 rounded-xl text-xs">
                                            <Calendar className="w-4 h-4 text-[#f59e0b]" />
                                            <span className="text-[#8c7a6b] font-bold">Start:</span>
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

                                        {/* End Date Picker */}
                                        <div className="flex items-center gap-2 bg-[#121213] border border-[#534434] px-3.5 py-2 rounded-xl text-xs">
                                            <Calendar className="w-4 h-4 text-[#f59e0b]" />
                                            <span className="text-[#8c7a6b] font-bold">End:</span>
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

                                        {(auditStartDate || auditEndDate || auditModuleFilter !== 'All') && (
                                            <button
                                                onClick={() => {
                                                    setAuditStartDate('');
                                                    setAuditEndDate('');
                                                    setAuditModuleFilter('All');
                                                    setAuditPage(1);
                                                }}
                                                className="text-xs text-[#f59e0b] hover:text-[#ffc174] font-bold underline"
                                            >
                                                Clear Filters
                                            </button>
                                        )}
                                    </div>

                                    {/* Sort Order Toggle Button */}
                                    <button
                                        onClick={() => setAuditSortOrder(auditSortOrder === 'newest' ? 'oldest' : 'newest')}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#ffc174] text-xs font-bold hover:bg-[#f59e0b] hover:text-[#472a00] transition-all btn-bevel shadow"
                                    >
                                        <ArrowUpDown className="w-4 h-4" />
                                        <span>Sort: {auditSortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
                                    </button>
                                </div>

                                {/* AUDIT LOGS TABLE */}
                                <div className="rounded-3xl bg-[#1A1A1B] border border-[#534434]/60 shadow-2xl p-6 overflow-hidden space-y-4">
                                    <div className="overflow-x-auto">
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
                                                {paginatedAuditLogs.length > 0 ? (
                                                    paginatedAuditLogs.map((log) => (
                                                        <tr key={log.id} className="hover:bg-[#261e15]/40 transition-colors">
                                                            <td className="py-3.5 px-4 font-mono text-[11px] text-[#ffc174] font-bold">{log.timestamp}</td>
                                                            <td className="py-3.5 px-4 font-semibold text-white">{log.user} ({log.role})</td>
                                                            <td className="py-3.5 px-4">
                                                                <span className="px-2.5 py-1 rounded-full bg-[#f59e0b]/20 text-[#ffc174] text-[10px] font-black uppercase border border-[#f59e0b]/30">
                                                                    {log.module}
                                                                </span>
                                                            </td>
                                                            <td className="py-3.5 px-4 text-[#d8c3ad] font-mono">{log.action}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={4} className="py-8 text-center text-[#8c7a6b]">
                                                            No audit log entries match the selected date range or module filter.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* 10-ITEM PAGINATION CONTROLS */}
                                    <div className="pt-4 border-t border-[#534434]/40 flex items-center justify-between text-xs">
                                        <div className="text-[#8c7a6b]">
                                            Showing <strong className="text-white font-mono">{totalAuditItems > 0 ? (auditPage - 1) * 10 + 1 : 0}</strong> to{' '}
                                            <strong className="text-white font-mono">{Math.min(auditPage * 10, totalAuditItems)}</strong> of{' '}
                                            <strong className="text-[#ffc174] font-mono">{totalAuditItems}</strong> logs
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                disabled={auditPage === 1}
                                                onClick={() => setAuditPage(auditPage - 1)}
                                                className="px-3 py-1.5 rounded-xl bg-[#261e15] border border-[#534434] text-[#d8c3ad] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-bold"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                <span>Prev</span>
                                            </button>

                                            <span className="font-mono text-xs font-bold text-[#ffc174] px-2">
                                                Page {auditPage} of {totalAuditPages}
                                            </span>

                                            <button
                                                disabled={auditPage >= totalAuditPages}
                                                onClick={() => setAuditPage(auditPage + 1)}
                                                className="px-3 py-1.5 rounded-xl bg-[#261e15] border border-[#534434] text-[#d8c3ad] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-bold"
                                            >
                                                <span>Next</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 9: SALES & REVENUE REPORT WITH DATE SORTING & REVENUE VISUAL CHARTS */}
                        {activeTab === 'sales' && (
                            <div className="space-y-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white font-domine">Sales & Revenue Analytics</h3>
                                        <p className="text-xs text-[#d8c3ad]">Gross figures, date range breakdowns, and sales trend graphs</p>
                                    </div>

                                    {/* DATE FILTER SORTING */}
                                    <div className="flex items-center gap-2 bg-[#1A1A1B] border border-[#534434]/60 px-3.5 py-2 rounded-xl text-xs">
                                        <Calendar className="w-4 h-4 text-[#f59e0b]" />
                                        <span className="text-[#8c7a6b] font-bold">Period:</span>
                                        <select
                                            value={salesDateRange}
                                            onChange={(e) => setSalesDateRange(e.target.value as any)}
                                            className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                                        >
                                            <option value="all" className="bg-[#121213]">All Time</option>
                                            <option value="today" className="bg-[#121213]">Today (2026-07-26)</option>
                                            <option value="7days" className="bg-[#121213]">Last 7 Days</option>
                                        </select>
                                    </div>
                                </div>

                                {/* KPI Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 rounded-3xl bg-[#1A1A1B] border border-[#534434]/60 space-y-2 shadow-xl">
                                        <span className="text-xs font-bold text-[#8c7a6b] uppercase">Gross Revenue (Period)</span>
                                        <div className="text-3xl font-mono font-black text-[#ffc174]">₱ {totalRevenue.toFixed(2)}</div>
                                        <p className="text-[11px] text-emerald-400 font-bold">100% verified sales</p>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-[#1A1A1B] border border-[#534434]/60 space-y-2 shadow-xl">
                                        <span className="text-xs font-bold text-[#8c7a6b] uppercase">Average Order Value</span>
                                        <div className="text-3xl font-mono font-black text-white">₱ {(totalRevenue / Math.max(1, filteredSalesOrders.length)).toFixed(2)}</div>
                                        <p className="text-[11px] text-[#d8c3ad]">Across all 3 fulfillment channels</p>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-[#1A1A1B] border border-[#534434]/60 space-y-2 shadow-xl">
                                        <span className="text-xs font-bold text-[#8c7a6b] uppercase">Completed Orders</span>
                                        <div className="text-3xl font-mono font-black text-white">{filteredSalesOrders.length} Orders</div>
                                        <p className="text-[11px] text-emerald-400 font-bold">0% Cancellation rate</p>
                                    </div>
                                </div>

                                {/* VISUAL REVENUE GRAPH CHARTS */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    
                                    {/* Chart 1: Daily Sales Trend Bar Chart */}
                                    <div className="p-6 rounded-3xl bg-[#1A1A1B] border border-[#534434]/60 shadow-2xl space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <BarChart3 className="w-5 h-5 text-[#f59e0b]" />
                                                <h4 className="font-domine font-bold text-white text-base">Daily Revenue Trend Graph (₱)</h4>
                                            </div>
                                            <span className="text-[10px] font-mono font-bold text-[#8c7a6b] bg-[#121213] px-2.5 py-1 rounded border border-[#534434]">July 2026</span>
                                        </div>

                                        <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-[#534434]/40 relative">
                                            {[
                                                { day: 'Mon', amount: 18400, height: '55%' },
                                                { day: 'Tue', amount: 22100, height: '70%' },
                                                { day: 'Wed', amount: 19800, height: '62%' },
                                                { day: 'Thu', amount: 25600, height: '82%' },
                                                { day: 'Fri', amount: 31200, height: '95%' },
                                                { day: 'Sat', amount: 28450, height: '90%' },
                                                { day: 'Sun', amount: 24000, height: '75%' },
                                            ].map((bar, i) => (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                                                    <span className="text-[9px] font-mono font-bold text-[#ffc174] opacity-0 group-hover:opacity-100 transition-opacity">
                                                        ₱{(bar.amount/1000).toFixed(1)}k
                                                    </span>
                                                    <div
                                                        style={{ height: bar.height }}
                                                        className="w-full rounded-t-xl bg-gradient-to-t from-[#b45309] to-[#f59e0b] group-hover:brightness-125 transition-all shadow-lg"
                                                    />
                                                    <span className="text-[10px] font-bold text-[#8c7a6b] uppercase">{bar.day}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Chart 2: Fulfillment Channel Sales Breakdown Bar Progress */}
                                    <div className="p-6 rounded-3xl bg-[#1A1A1B] border border-[#534434]/60 shadow-2xl space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <PieChart className="w-5 h-5 text-[#f59e0b]" />
                                                <h4 className="font-domine font-bold text-white text-base">Channel Revenue Share</h4>
                                            </div>
                                            <span className="text-[10px] font-mono font-bold text-[#8c7a6b] bg-[#121213] px-2.5 py-1 rounded border border-[#534434]">Distribution</span>
                                        </div>

                                        <div className="space-y-4 pt-2">
                                            <div>
                                                <div className="flex justify-between text-xs font-bold mb-1">
                                                    <span className="text-white">Dine-In Table Orders</span>
                                                    <span className="text-[#ffc174] font-mono">₱ 14,820.00 (52%)</span>
                                                </div>
                                                <div className="w-full h-3 rounded-full bg-[#121213] border border-[#534434] overflow-hidden p-0.5">
                                                    <div className="h-full rounded-full bg-[#f59e0b] w-[52%]" />
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between text-xs font-bold mb-1">
                                                    <span className="text-white">Bulihan Area Free Delivery</span>
                                                    <span className="text-[#ffc174] font-mono">₱ 8,940.00 (31%)</span>
                                                </div>
                                                <div className="w-full h-3 rounded-full bg-[#121213] border border-[#534434] overflow-hidden p-0.5">
                                                    <div className="h-full rounded-full bg-emerald-500 w-[31%]" />
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between text-xs font-bold mb-1">
                                                    <span className="text-white">Counter Pick-Up</span>
                                                    <span className="text-[#ffc174] font-mono">₱ 4,690.00 (17%)</span>
                                                </div>
                                                <div className="w-full h-3 rounded-full bg-[#121213] border border-[#534434] overflow-hidden p-0.5">
                                                    <div className="h-full rounded-full bg-blue-500 w-[17%]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}

                    </div>
                </main>
            </div>

            {/* ADD PRODUCT MODAL (WITH BLOB IMAGE FILE UPLOADER) */}
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
                            <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Upload Dish Image (Local File) *</label>
                            <label className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#121213] border border-dashed border-[#f59e0b]/60 text-xs font-bold text-[#ffc174] hover:bg-[#261e15] cursor-pointer">
                                <Upload className="w-4 h-4 text-[#f59e0b]" />
                                <span>{newProductImage ? 'Image Loaded! Click to replace' : 'Upload Image File'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload(file, setNewProductImage);
                                    }}
                                    className="hidden"
                                />
                            </label>

                            {newProductImage && (
                                <img src={newProductImage} alt="Uploaded dish preview" className="w-24 h-24 object-cover rounded-xl mt-2 border border-[#534434]" />
                            )}
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

            {/* EDIT PRODUCT MODAL (WITH BLOB IMAGE FILE UPLOADER) */}
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
                            <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Replace Image File (Upload Blob)</label>
                            <label className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#121213] border border-dashed border-[#f59e0b]/60 text-xs font-bold text-[#ffc174] hover:bg-[#261e15] cursor-pointer">
                                <Upload className="w-4 h-4 text-[#f59e0b]" />
                                <span>Upload New Image File</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload(file, (blobUrl) => setEditingProduct({ ...editingProduct, image: blobUrl }));
                                    }}
                                    className="hidden"
                                />
                            </label>

                            {editingProduct.image && (
                                <img src={editingProduct.image} alt="Dish preview" className="w-24 h-24 object-cover rounded-xl mt-2 border border-[#534434]" />
                            )}
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

            {/* ASSIGN / EDIT BANNER MODAL WITH REAL-TIME PREVIEW & IMAGE FILE BLOB UPLOADER */}
            {targetBannerSlot !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
                    <form onSubmit={handleSaveSlotBanner} className="w-full max-w-xl rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-6 shadow-2xl space-y-4 my-8">
                        <div className="flex items-center justify-between pb-2 border-b border-[#534434]/40">
                            <h3 className="text-lg font-bold text-white font-domine">
                                Edit Promo Banner (Slot #{targetBannerSlot})
                            </h3>
                            <button type="button" onClick={() => setTargetBannerSlot(null)} className="text-[#8c7a6b] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* REAL-TIME PREVIEW BOX */}
                        <div className="space-y-1.5">
                            <div className="text-[10px] font-mono font-bold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5 text-[#f59e0b]" /> Live Real-Time Customer Landing Page Preview:
                            </div>

                            <div className="relative min-h-[160px] rounded-2xl overflow-hidden raised-layer bg-[#1A1A1B] border border-[#f59e0b]/50 shadow-xl flex flex-col justify-end p-4">
                                <div className="absolute inset-0 vignette-overlay">
                                    {newBannerImage ? (
                                        <img className="w-full h-full object-cover opacity-60" alt="Preview" src={newBannerImage} />
                                    ) : (
                                        <div className="w-full h-full bg-[#261e15] flex items-center justify-center text-[#8c7a6b] text-xs">
                                            No Image File Uploaded
                                        </div>
                                    )}
                                </div>
                                <div className="relative z-10 w-full bg-gradient-to-t from-[#1A1A1B] via-[#1A1A1B]/80 to-transparent p-2">
                                    <span className="font-mono text-[9px] text-[#f59e0b] bg-[#31281f] px-2 py-0.5 rounded border border-[#534434] mb-1 inline-block font-bold uppercase">
                                        {newBannerTag || 'PROMO TAG'}
                                    </span>
                                    <h4 className="font-domine text-lg font-bold text-[#ffc174] truncate">
                                        {newBannerTitle || 'Promotion Title'}
                                    </h4>
                                    <p className="font-sans text-xs text-[#d8c3ad] line-clamp-1">
                                        {newBannerSubtitle || 'Promotion Subtitle details...'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* INPUT FIELDS */}
                        <div className="space-y-3">
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
                                <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Upload Banner Image File (Blob File Upload) *</label>
                                <label className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#121213] border border-dashed border-[#f59e0b]/60 text-xs font-bold text-[#ffc174] hover:bg-[#261e15] cursor-pointer">
                                    <Upload className="w-4 h-4 text-[#f59e0b]" />
                                    <span>{newBannerImage ? 'Image Loaded! Click to replace' : 'Upload Banner File'}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileUpload(file, setNewBannerImage);
                                        }}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={() => setTargetBannerSlot(null)} className="w-1/2 py-2.5 rounded-xl bg-[#261e15] text-[#d8c3ad] text-xs font-bold">Cancel</button>
                            <button type="submit" className="w-1/2 py-2.5 rounded-xl bg-[#f59e0b] text-[#472a00] text-xs font-black uppercase btn-bevel">Save Slot #{targetBannerSlot}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* ADD VOUCHER MODAL WITH REAL-TIME TICKET PREVIEW */}
            {showAddVoucherModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <form onSubmit={handleCreateVoucher} className="w-full max-w-md rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-[#534434]/40">
                            <h3 className="text-lg font-bold text-white font-domine">Create Promo Ticket Voucher</h3>
                            <button type="button" onClick={() => setShowAddVoucherModal(false)} className="text-[#8c7a6b] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* REALTIME TICKET PREVIEW */}
                        <div className="space-y-1.5">
                            <div className="text-[10px] font-mono font-bold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5 text-[#f59e0b]" /> Live Physical Ticket Real-Time Preview:
                            </div>

                            <div className="relative rounded-2xl bg-[#121213] border border-[#534434] p-4 flex items-center gap-3">
                                <div className="flex-1 space-y-1 border-r border-dashed border-[#534434] pr-3">
                                    <div className="text-[9px] font-mono font-bold text-[#f59e0b]">ROADHOUSE COUPON</div>
                                    <div className="font-domine text-2xl font-black text-[#ffc174]">{newVoucherDiscount || '10'}% OFF</div>
                                    <div className="font-mono text-xs font-bold text-white bg-[#261e15] px-2 py-0.5 rounded inline-block">
                                        {newVoucherCode.toUpperCase() || 'PROMO10'}
                                    </div>
                                </div>
                                <div className="text-right text-[10px] text-[#8c7a6b] font-mono space-y-1">
                                    <div>Min ₱{newVoucherMinSpend || '300'}</div>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[8px] font-bold uppercase inline-block">
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
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

                            <div className="grid grid-cols-2 gap-3">
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
                                <div>
                                    <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Min Order (₱) *</label>
                                    <input
                                        type="number"
                                        required
                                        value={newVoucherMinSpend}
                                        onChange={(e) => setNewVoucherMinSpend(e.target.value)}
                                        placeholder="300"
                                        className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={() => setShowAddVoucherModal(false)} className="w-1/2 py-2.5 rounded-xl bg-[#261e15] text-[#d8c3ad] text-xs font-bold">Cancel</button>
                            <button type="submit" className="w-1/2 py-2.5 rounded-xl bg-[#f59e0b] text-[#472a00] text-xs font-black uppercase btn-bevel">Create Ticket</button>
                        </div>
                    </form>
                </div>
            )}

            {/* ADD EMPLOYEE MODAL */}
            {showAddEmployeeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <form onSubmit={handleCreateEmployee} className="w-full max-w-sm rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-[#534434]/40">
                            <h3 className="text-lg font-bold text-white font-domine">Add Staff Account</h3>
                            <button type="button" onClick={() => setShowAddEmployeeModal(false)} className="text-[#8c7a6b] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

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

                        <div>
                            <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Account Role *</label>
                            <select
                                value={newEmpRole}
                                onChange={(e) => setNewEmpRole(e.target.value as any)}
                                className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white"
                            >
                                <option value="Cashier">Cashier</option>
                                <option value="Kitchen Staff">Kitchen Staff</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={() => setShowAddEmployeeModal(false)} className="w-1/2 py-2.5 rounded-xl bg-[#261e15] text-[#d8c3ad] text-xs font-bold">Cancel</button>
                            <button type="submit" className="w-1/2 py-2.5 rounded-xl bg-[#f59e0b] text-[#472a00] text-xs font-black uppercase btn-bevel">Create Account</button>
                        </div>
                    </form>
                </div>
            )}

            {/* EDIT EMPLOYEE MODAL */}
            {editingEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <form onSubmit={handleSaveEditEmployee} className="w-full max-w-sm rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-[#534434]/40">
                            <h3 className="text-lg font-bold text-white font-domine">Edit Staff Account</h3>
                            <button type="button" onClick={() => setEditingEmployee(null)} className="text-[#8c7a6b] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={editingEmployee.name}
                                onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={editingEmployee.email}
                                onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Role</label>
                                <select
                                    value={editingEmployee.role}
                                    onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value as any })}
                                    className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white"
                                >
                                    <option value="Cashier">Cashier</option>
                                    <option value="Kitchen Staff">Kitchen Staff</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#d8c3ad] mb-1">Status</label>
                                <select
                                    value={editingEmployee.status}
                                    onChange={(e) => setEditingEmployee({ ...editingEmployee, status: e.target.value as any })}
                                    className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={() => setEditingEmployee(null)} className="w-1/2 py-2.5 rounded-xl bg-[#261e15] text-[#d8c3ad] text-xs font-bold">Cancel</button>
                            <button type="submit" className="w-1/2 py-2.5 rounded-xl bg-[#f59e0b] text-[#472a00] text-xs font-black uppercase btn-bevel">Save Staff</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
