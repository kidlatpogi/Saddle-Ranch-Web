import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    QrCode, 
    Printer, 
    ArrowLeft, 
    Flame, 
    Download, 
    Check, 
    MapPin 
} from 'lucide-react';

interface TableQr {
    table_number: string;
    label: string;
    qr_url: string;
}

interface QrGeneratorProps {
    tables: TableQr[];
}

export default function AdminQrGenerator({ tables = [] }: QrGeneratorProps) {
    const [selectedTable, setSelectedTable] = useState<TableQr>(tables[0] || {
        table_number: '05',
        label: 'Table 05',
        qr_url: 'http://localhost:8000/dine-in?table=05',
    });

    const generateQrSvg = (text: string) => {
        // High visibility inline QR placeholder graphic representation
        const encoded = encodeURIComponent(text);
        return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encoded}&color=000000&bgcolor=ffffff`;
    };

    return (
        <>
            <Head title="Table QR Code Generator | Saddle Ranch" />

            <div className="min-h-screen bg-[#141416] text-[#f4f4f5] font-sans flex flex-col">
                <header className="h-20 bg-[#1f1f23] border-b border-[#333338] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md no-print">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#b45309] flex items-center justify-center shadow-md shadow-[#f59e0b]/20">
                            <QrCode className="w-6 h-6 text-[#3f2000]" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black font-domine text-white tracking-tight">Table Tent QR Code Generator</h1>
                            <p className="text-xs text-[#a1a1aa]">Printable In-House Table QR Cards for Tables 01 to 25</p>
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
                            onClick={() => window.print()}
                            className="px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#3f2000] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer active:scale-95"
                        >
                            <Printer className="w-4 h-4" />
                            <span>Print Table Tent Card</span>
                        </button>
                    </div>
                </header>

                <main className="max-w-[1600px] w-full mx-auto p-6 space-y-6 flex-1 flex flex-col lg:flex-row gap-6">
                    {/* Left: Selection Grid */}
                    <div className="w-full lg:w-1/2 p-6 rounded-3xl bg-[#202024] border border-[#333338] shadow-xl space-y-4 no-print">
                        <h3 className="font-domine font-black text-white text-base">Select Table or Counter</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {tables.map((t) => (
                                <button
                                    key={t.table_number}
                                    onClick={() => setSelectedTable(t)}
                                    className={`p-3 rounded-2xl border text-xs font-mono font-bold transition-all text-center cursor-pointer ${
                                        selectedTable.table_number === t.table_number
                                            ? 'bg-[#f59e0b] text-[#3f2000] border-[#fbbf24] font-black shadow-lg scale-105'
                                            : 'bg-[#18181b] border-[#3f3f46] text-white hover:border-[#f59e0b]'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Printable Saddle Ranch Branded Table Tent Display Card */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                        <div id="printable-qr-card" className="w-full max-w-sm rounded-3xl bg-white text-zinc-950 p-8 shadow-2xl space-y-6 text-center border-4 border-[#f59e0b] relative">
                            <div className="space-y-1">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#b45309] flex items-center justify-center mx-auto shadow-md">
                                    <Flame className="w-7 h-7 text-[#3f2000]" />
                                </div>
                                <h2 className="font-domine font-black text-xl text-zinc-900 tracking-tight uppercase pt-2">Saddle Ranch</h2>
                                <p className="text-[11px] font-bold text-amber-700 tracking-widest uppercase">SIZZLING HOUSE • TABLE ORDERING</p>
                            </div>

                            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-dashed border-amber-300 inline-block shadow-inner">
                                <img
                                    src={generateQrSvg(selectedTable.qr_url)}
                                    alt={`QR Code ${selectedTable.label}`}
                                    className="w-48 h-48 mx-auto"
                                />
                            </div>

                            <div className="space-y-1">
                                <span className="px-4 py-1.5 rounded-full bg-zinc-900 text-[#fbbf24] font-mono font-black text-sm uppercase tracking-wider inline-block">
                                    {selectedTable.label}
                                </span>
                                <p className="text-xs text-zinc-600 font-bold pt-2">
                                    SCAN QR CODE WITH PHONE CAMERA TO VIEW MENU & ORDER INSTANTLY
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
