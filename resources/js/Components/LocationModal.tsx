import React, { useState } from 'react';
import { MapPin, Navigation, CheckCircle2, X, Compass, Building2, Store } from 'lucide-react';

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectBranch?: (branch: 'Bulihan' | 'Dasma', locationName: string, distanceKm?: string) => void;
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function LocationModal({ isOpen, onClose, onSelectBranch }: LocationModalProps) {
    const [loadingGps, setLoadingGps] = useState(false);
    const [gpsError, setGpsError] = useState<string | null>(null);

    const [selectedBranch, setSelectedBranch] = useState<'Bulihan' | 'Dasma'>(() => {
        return (localStorage.getItem('saddle_ranch_branch') as any) || 'Bulihan';
    });

    if (!isOpen) return null;

    // Saddle Ranch Coordinates
    const BULIHAN_COORDS = { lat: 14.2384, lng: 120.9752 };
    const DASMA_COORDS = { lat: 14.3291, lng: 120.9365 };

    const handleUseGps = () => {
        if (!navigator.geolocation) {
            setGpsError('Geolocation is not supported by your browser.');
            return;
        }

        setLoadingGps(true);
        setGpsError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                const distBulihan = calculateDistance(userLat, userLng, BULIHAN_COORDS.lat, BULIHAN_COORDS.lng);
                const distDasma = calculateDistance(userLat, userLng, DASMA_COORDS.lat, DASMA_COORDS.lng);

                let closest: 'Bulihan' | 'Dasma' = 'Bulihan';
                let distance = distBulihan;

                if (distDasma < distBulihan) {
                    closest = 'Dasma';
                    distance = distDasma;
                }

                const distStr = `${distance.toFixed(1)} km away`;
                const locStr = closest === 'Bulihan' ? 'Bulihan, Silang, Cavite' : 'Dasmariñas City, Cavite';

                saveAndApply(closest, locStr, distStr);
                setLoadingGps(false);
            },
            (error) => {
                setLoadingGps(false);
                setGpsError('Could not retrieve GPS location. Please choose a branch below.');
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    };

    const saveAndApply = (branch: 'Bulihan' | 'Dasma', locName: string, dist: string) => {
        setSelectedBranch(branch);

        localStorage.setItem('saddle_ranch_branch', branch);
        localStorage.setItem('saddle_ranch_location_name', locName);
        localStorage.setItem('saddle_ranch_distance', dist);

        window.dispatchEvent(new CustomEvent('saddle_ranch_location_updated', {
            detail: { branch, locationName: locName, distance: dist }
        }));

        if (onSelectBranch) {
            onSelectBranch(branch, locName, dist);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl bg-[#1c150e] border-2 border-[#f59e0b]/50 shadow-2xl text-[#f0e0d1] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-[#261e15] to-[#19120a] border-b border-[#534434] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#f59e0b] text-[#472a00] flex items-center justify-center font-bold shadow-md shadow-[#f59e0b]/20">
                            <Store className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-domine font-bold text-lg text-[#ffc174]">Select Roadhouse Branch</h3>
                            <p className="text-xs text-[#d8c3ad]">Choose your preferred ordering branch</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-[#d8c3ad] hover:text-white hover:bg-[#31281f] transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Auto GPS Detection Button */}
                    <button
                        onClick={handleUseGps}
                        disabled={loadingGps}
                        className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:brightness-110 text-[#472a00] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg shadow-[#f59e0b]/30 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                        <Compass className={`w-5 h-5 ${loadingGps ? 'animate-spin' : ''}`} />
                        <span>{loadingGps ? 'Finding Closest Branch...' : 'Detect Closest Branch (Use GPS)'}</span>
                    </button>

                    {gpsError && (
                        <p className="text-xs text-rose-400 text-center font-bold bg-rose-950/40 p-2.5 rounded-xl border border-rose-800">
                            {gpsError}
                        </p>
                    )}

                    <div className="flex items-center gap-3">
                        <div className="h-px bg-[#31281f] flex-1" />
                        <span className="text-xs text-[#8c7a6b] font-bold uppercase tracking-widest">Select Branch</span>
                        <div className="h-px bg-[#31281f] flex-1" />
                    </div>

                    {/* The 2 Main Branches Cards */}
                    <div className="grid grid-cols-1 gap-3.5">
                        {/* Bulihan Branch */}
                        <button
                            onClick={() => saveAndApply('Bulihan', 'block 26 lot 17, Anahaw St, Silang, Cavite', 'Silang Area')}
                            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer group ${
                                selectedBranch === 'Bulihan'
                                    ? 'bg-[#2b2014] border-[#f59e0b] shadow-md shadow-[#f59e0b]/10'
                                    : 'bg-[#261e15] border-[#534434] hover:border-[#f59e0b]/60'
                            }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold ${
                                    selectedBranch === 'Bulihan'
                                        ? 'bg-[#f59e0b] text-[#472a00]'
                                        : 'bg-[#31281f] text-[#f59e0b] group-hover:bg-[#f59e0b] group-hover:text-[#472a00]'
                                } transition-colors`}>
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-base text-white group-hover:text-[#ffc174] flex items-center gap-2">
                                        <span>Bulihan Branch</span>
                                        {selectedBranch === 'Bulihan' && (
                                            <span className="text-[10px] bg-[#f59e0b]/20 text-[#f59e0b] px-2 py-0.5 rounded-full font-black border border-[#f59e0b]/30">Active</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-[#d8c3ad] flex items-center gap-1 mt-0.5">
                                        <MapPin className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
                                        <span>block 26 lot 17, Anahaw St, Silang, Cavite</span>
                                    </p>
                                </div>
                            </div>
                            <CheckCircle2 className={`w-5 h-5 ${selectedBranch === 'Bulihan' ? 'text-[#f59e0b]' : 'text-transparent'}`} />
                        </button>

                        {/* Dasmariñas Branch */}
                        <button
                            onClick={() => saveAndApply('Dasma', "8X23+Q75, Governor's Dr, San Agustin I, Dasmariñas, 4114 Cavite", 'Dasmariñas Area')}
                            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer group ${
                                selectedBranch === 'Dasma'
                                    ? 'bg-[#2b2014] border-[#f59e0b] shadow-md shadow-[#f59e0b]/10'
                                    : 'bg-[#261e15] border-[#534434] hover:border-[#f59e0b]/60'
                            }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold ${
                                    selectedBranch === 'Dasma'
                                        ? 'bg-[#f59e0b] text-[#472a00]'
                                        : 'bg-[#31281f] text-[#f59e0b] group-hover:bg-[#f59e0b] group-hover:text-[#472a00]'
                                } transition-colors`}>
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-base text-white group-hover:text-[#ffc174] flex items-center gap-2">
                                        <span>Dasmariñas Branch</span>
                                        {selectedBranch === 'Dasma' && (
                                            <span className="text-[10px] bg-[#f59e0b]/20 text-[#f59e0b] px-2 py-0.5 rounded-full font-black border border-[#f59e0b]/30">Active</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-[#d8c3ad] flex items-center gap-1 mt-0.5">
                                        <MapPin className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
                                        <span>8X23+Q75, Governor's Dr, San Agustin I, Dasmariñas, 4114 Cavite</span>
                                    </p>
                                </div>
                            </div>
                            <CheckCircle2 className={`w-5 h-5 ${selectedBranch === 'Dasma' ? 'text-[#f59e0b]' : 'text-transparent'}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
