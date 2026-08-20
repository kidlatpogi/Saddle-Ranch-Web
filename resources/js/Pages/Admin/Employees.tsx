import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
    Users, 
    Plus, 
    X, 
    ArrowLeft, 
    Key,
    Shield,
    UserCheck,
    Lock,
    Trash2,
    RefreshCw
} from 'lucide-react';

interface EmployeeUser {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface EmployeesProps {
    employees: EmployeeUser[];
}

export default function AdminEmployees({ employees = [] }: EmployeesProps) {
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<EmployeeUser | null>(null);
    const [deletingEmployee, setDeletingEmployee] = useState<EmployeeUser | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        email: '',
        role: 'employee',
        password: '',
    });

    const openAddModal = () => {
        setEditingEmployee(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (emp: EmployeeUser) => {
        setEditingEmployee(emp);
        setData({
            name: emp.name,
            email: emp.email,
            role: emp.role,
            password: '',
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingEmployee) {
            post(`/admin/employees/${editingEmployee.id}`, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        } else {
            post('/admin/employees', {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    return (
        <>
            <Head title="Admin Staff Accounts | Saddle Ranch" />

            <div className="min-h-screen bg-[#141416] text-[#f4f4f5] font-sans flex flex-col">
                <header className="h-20 bg-[#1f1f23] border-b border-[#333338] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#b45309] flex items-center justify-center shadow-md shadow-[#f59e0b]/20">
                            <Users className="w-6 h-6 text-[#3f2000]" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black font-domine text-white tracking-tight">Employee Account & Staff Roles</h1>
                            <p className="text-xs text-[#a1a1aa]">Cashiers, Kitchen KDS Staff, and User Roles</p>
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
                            <span>Create Staff Account</span>
                        </button>
                    </div>
                </header>

                <main className="max-w-[1600px] w-full mx-auto p-6 space-y-6 flex-1">
                    <div className="p-6 rounded-3xl bg-[#202024] border border-[#333338] shadow-xl overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                            <thead>
                                <tr className="border-b border-[#333338] text-[#a1a1aa] uppercase tracking-wider">
                                    <th className="pb-3">Employee Name</th>
                                    <th className="pb-3">Email Address</th>
                                    <th className="pb-3">Role</th>
                                    <th className="pb-3">Account Created</th>
                                    <th className="pb-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#333338]">
                                {employees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-[#27272a]/50">
                                        <td className="py-4 font-bold text-white font-sans text-sm">{emp.name}</td>
                                        <td className="py-4 text-zinc-300 font-mono">{emp.email}</td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                                                emp.role === 'kitchen' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                emp.role === 'cashier' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            }`}>
                                                {emp.role}
                                            </span>
                                        </td>
                                        <td className="py-4 text-[#a1a1aa]">{new Date(emp.created_at).toLocaleDateString()}</td>
                                        <td className="py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(emp)}
                                                    className="px-3 py-1.5 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-white font-bold text-xs flex items-center gap-1.5"
                                                    title="Edit / Reset Password"
                                                >
                                                    <Key className="w-3.5 h-3.5" />
                                                    <span>Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => setDeletingEmployee(emp)}
                                                    className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20"
                                                    title="Delete Account"
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
                </main>
            </div>

            {/* ADD / EDIT MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <div className="w-full max-w-md rounded-3xl bg-[#18181b] border border-[#3f3f46] p-6 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-[#3f3f46]">
                            <h3 className="font-domine font-black text-white text-lg">
                                {editingEmployee ? 'Edit Staff Account' : 'Create Staff Account'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-[#a1a1aa] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Maria Santos"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white focus:border-[#f59e0b] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="cashier@saddleranch.com"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white font-mono focus:border-[#f59e0b] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">Assigned Role</label>
                                <select
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white focus:border-[#f59e0b] focus:outline-none"
                                >
                                    <option value="employee">Cashier / Staff (Employee Terminal)</option>
                                    <option value="kitchen">Kitchen Crew (KDS Screen)</option>
                                    <option value="cashier">Dedicated Cashier (POS)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#a1a1aa] mb-1">
                                    {editingEmployee ? 'New Password (Leave blank to keep existing)' : 'Account Password'}
                                </label>
                                <input
                                    type="password"
                                    required={!editingEmployee}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#141416] border border-[#3f3f46] text-xs text-white font-mono focus:border-[#f59e0b] focus:outline-none"
                                />
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
                                    {processing ? 'Saving...' : 'Save Staff Account'}
                                </button>
                            </div>
                        </form>
                    </div>
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
                                <p className="text-xs text-[#a1a1aa] mt-0.5">Remove staff access</p>
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
                                disabled={isDeleting}
                                onClick={() => setDeletingEmployee(null)}
                                className="px-5 py-2.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => {
                                    if (!deletingEmployee) return;
                                    setIsDeleting(true);
                                    router.delete(`/admin/employees/${deletingEmployee.id}`, {
                                        onSuccess: () => {
                                            setDeletingEmployee(null);
                                            setIsDeleting(false);
                                        },
                                        onError: () => setIsDeleting(false),
                                        onFinish: () => setIsDeleting(false),
                                    });
                                }}
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
