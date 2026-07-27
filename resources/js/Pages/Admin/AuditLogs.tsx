import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    ShieldCheck, 
    ArrowLeft, 
    Clock, 
    User, 
    Eye, 
    X, 
    Lock,
    Search
} from 'lucide-react';

interface AuditLogRecord {
    id: number;
    user_id?: number;
    action: string;
    ip_address?: string;
    payload?: any;
    created_at: string;
    user?: {
        name: string;
        email: string;
        role: string;
    };
}

interface AuditLogsProps {
    logs: {
        data: AuditLogRecord[];
        current_page: number;
        last_page: number;
    };
}

export default function AdminAuditLogs({ logs }: AuditLogsProps) {
    const [selectedPayload, setSelectedPayload] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const logList = logs?.data || [];

    const filteredLogs = logList.filter(log => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            log.action.toLowerCase().includes(q) ||
            (log.user?.name || '').toLowerCase().includes(q) ||
            (log.ip_address || '').toLowerCase().includes(q)
        );
    });

    return (
        <>
            <Head title="Security Audit Logs | Saddle Ranch" />

            <div className="min-h-screen bg-[#141416] text-[#f4f4f5] font-sans flex flex-col">
                <header className="h-20 bg-[#1f1f23] border-b border-[#333338] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#b45309] flex items-center justify-center shadow-md shadow-[#f59e0b]/20">
                            <ShieldCheck className="w-6 h-6 text-[#3f2000]" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black font-domine text-white tracking-tight">Security & System Audit Feed</h1>
                            <p className="text-xs text-[#a1a1aa]">Immutable Trail of System Changes, Price Updates & Voids</p>
                        </div>
                    </div>

                    <Link
                        href="/admin/dashboard"
                        className="px-4 py-2 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-white flex items-center gap-1.5 text-xs font-bold transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Return to Dashboard</span>
                    </Link>
                </header>

                <main className="max-w-[1600px] w-full mx-auto p-6 space-y-6 flex-1">
                    <div className="p-3 rounded-2xl bg-[#202024] border border-[#333338] flex items-center justify-between shadow-lg">
                        <div className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">
                            Showing <strong className="text-white">{filteredLogs.length}</strong> Audit Events
                        </div>

                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search audit logs..."
                                className="w-64 pl-10 pr-4 py-2 bg-[#18181b] border border-[#3f3f46] rounded-xl text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#f59e0b]"
                            />
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-[#202024] border border-[#333338] shadow-xl overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                            <thead>
                                <tr className="border-b border-[#333338] text-[#a1a1aa] uppercase tracking-wider">
                                    <th className="pb-3">Timestamp</th>
                                    <th className="pb-3">User & Role</th>
                                    <th className="pb-3">Action Recorded</th>
                                    <th className="pb-3">IP Address</th>
                                    <th className="pb-3 text-right">Payload</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#333338]">
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-[#27272a]/50">
                                        <td className="py-4 text-[#a1a1aa] font-mono whitespace-nowrap">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="py-4">
                                            <div className="font-bold text-white font-sans">{log.user?.name || 'System Auto'}</div>
                                            <div className="text-[10px] text-[#fbbf24] font-mono uppercase">{log.user?.role || 'System'}</div>
                                        </td>
                                        <td className="py-4 font-bold text-zinc-100 max-w-md">{log.action}</td>
                                        <td className="py-4 text-[#71717a]">{log.ip_address || '127.0.0.1'}</td>
                                        <td className="py-4 text-right">
                                            {log.payload && (
                                                <button
                                                    onClick={() => setSelectedPayload(log.payload)}
                                                    className="px-3 py-1.5 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#fbbf24] hover:bg-[#3f3f46] text-xs font-bold flex items-center gap-1.5 ml-auto"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>View JSON</span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* PAYLOAD MODAL */}
            {selectedPayload && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <div className="w-full max-w-lg rounded-3xl bg-[#18181b] border border-[#3f3f46] p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#3f3f46]">
                            <h3 className="font-domine font-black text-white text-base">Audit Event Payload Data</h3>
                            <button onClick={() => setSelectedPayload(null)} className="text-[#a1a1aa] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <pre className="p-4 rounded-2xl bg-[#141416] border border-[#3f3f46] text-xs font-mono text-emerald-400 overflow-x-auto max-h-96">
                            {JSON.stringify(selectedPayload, null, 2)}
                        </pre>

                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => setSelectedPayload(null)}
                                className="px-5 py-2.5 rounded-xl bg-[#27272a] border border-[#3f3f46] text-white font-bold text-xs"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
