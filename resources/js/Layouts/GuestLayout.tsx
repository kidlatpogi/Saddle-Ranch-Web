import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#121213] text-[#f0e0d1] px-4 py-8 selection:bg-[#e65100] selection:text-white">
            <div className="flex flex-col items-center mb-6">
                <Link href="/" className="group flex flex-col items-center gap-3 transition-transform hover:scale-105">
                    <ApplicationLogo className="h-28 w-auto max-w-[200px] object-contain drop-shadow-[0_4px_25px_rgba(230,81,0,0.4)]" />
                    <span className="font-serif text-[#f59e0b] text-sm tracking-[0.2em] uppercase font-bold text-center">
                        Saddle Ranch Roadhouse
                    </span>
                </Link>
            </div>

            <div className="w-full sm:max-w-md overflow-hidden rounded-2xl bg-[#1c1a17] border border-[#3e3427] px-8 py-8 shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
                {children}
            </div>

            <p className="mt-8 text-center text-xs text-[#a89f91]">
                &copy; {new Date().getFullYear()} Saddle Ranch Roadhouse. All rights reserved.
            </p>
        </div>
    );
}
