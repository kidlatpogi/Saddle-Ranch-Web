import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, CheckCircle2, X, Compass, ChevronRight, Building2 } from 'lucide-react';

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
    const [customLocation, setCustomLocation] = useState('');

    const [selectedBranch, setSelectedBranch] = useState<'Bulihan' | 'Dasma'>(() => {
        return (localStorage.getItem('saddle_ranch_branch') as any) || 'Bulihan';
    });
    const [locationName, setLocationName] = useState<string>(() => {
        return localStorage.getItem('saddle_ranch_location_name') || 'Bulihan, Silang, Cavite';
    });
    const [distanceText, setDistanceText] = useState<string>(() => {
        return localStorage.getItem('saddle_ranch_distance') || '1.2 km away';
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
                const locStr = `Current GPS Location (${closest === 'Bulihan' ? 'Silang / Bulihan' : 'Dasmariñas City'})`;

                saveAndApply(closest, locStr, distStr);
                setLoadingGps(false);
            },
            (error) => {
                setLoadingGps(false);
                setGpsError('Could not retrieve your location. Please choose a preset below.');
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    };

    const saveAndApply = (branch: 'Bulihan' | 'Dasma', locName: string, dist: string) => {
        setSelectedBranch(branch);
        setLocationName(locName);
        setDistanceText(dist);

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

    const presets = [
        { name: 'Bulihan & Silang Area', branch: 'Bulihan' as const, distance: '1.2 km away' },
        { name: 'Dasmariñas City Center', branch: 'Dasma' as const, distance: '2.5 km away' },
        { name: 'Salawag & Paliparan', branch: 'Dasma' as const, distance: '3.8 km away' },
        { name: 'San Agustin & DBB', branch: 'Dasma' as const, distance: '3.1 km away' },
        { name: 'General Trias & Carmona Border', branch: 'Bulihan' as const, distance: '4.6 km away' },
    ];

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-3xl bg-[#1c150e] border-2 border-[#f59e0b]/50 shadow-2xl text-[#f0e0d1] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-[#261e15] to-[#19120a] border-b border-[#534434] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#f59e0b] text-[#472a00] flex items-center justify-center font-bold shadow-md shadow-[#f59e0b]/20">
                            <Navigation className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-domine font-bold text-lg text-[#ffc174]">Find Closest Roadhouse Branch</h3>
                            <p className="text-xs text-[#d8c3ad]">Select your location for fast delivery & pickup</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-[#d8c3ad] hover:text-white hover:bg-[#31281f] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                    {/* Auto GPS Detection Button */}
                    <button
                        onClick={handleUseGps}
                        disabled={loadingGps}
                        className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:brightness-110 text-[#472a00] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg shadow-[#f59e0b]/30 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                        <Compass className={`w-5 h-5 ${loadingGps ? 'animate-spin' : ''}`} />
                        <span>{loadingGps ? 'Detecting GPS Coordinates...' : 'Detect Closest Branch (Use GPS)'}</span>
                    </button>

                    {gpsError && (
                        <p className="text-xs text-rose-400 text-center font-bold bg-rose-950/40 p-2.5 rounded-xl border border-rose-800">
                            {gpsError}
                        </p>
                    )}

                    <div className="flex items-center gap-3">
                        <div className="h-px bg-[#31281f] flex-1" />
                        <span className="text-xs text-[#8c7a6b] font-bold uppercase tracking-widest">or select your area</span>
                        <div className="h-px bg-[#31281f] flex-1" />
                    </div>

                    {/* Presets List */}
                    <div className="space-y-2.5">
                        {presets.map((p, idx) => (
                            <button
                                key={idx}
                                onClick={() => saveAndApply(p.branch, p.name, p.distance)}
                                className="w-full p-3.5 rounded-2xl bg-[#261e15] border border-[#534434] hover:border-[#f59e0b] text-left flex items-center justify-between group transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-[#31281f] flex items-center justify-center text-[#f59e0b] group-hover:bg-[#f59e0b] group-hover:text-[#472a00] transition-colors">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-white group-hover:text-[#ffc174] transition-colors">{p.name}</div>
                                        <div className="text-xs text-[#d8c3ad]">
                                            Assigned Branch: <span className="font-bold text-[#f59e0b]">{p.branch === 'Bulihan' ? 'Bulihan Branch' : 'Dasmariñas Branch'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono font-bold text-[#8c7a6b] group-hover:text-[#ffc174]">{p.distance}</span>
                                    <ChevronRight className="w-4 h-4 text-[#8c7a6b] group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Manual Location Input */}
                    <div className="space-y-2 pt-2 border-t border-[#31281f]">
                        <label className="text-xs font-bold text-[#d8c3ad]">Enter Custom Street / Landmark:</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customLocation}
                                onChange={(e) => setCustomLocation(e.target.value)}
                                placeholder="e.g. Molino-Paliparan Road, Silang"
                                className="flex-1 px-4 py-2.5 rounded-xl bg-[#261e15] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                            />
                            <button
                                onClick={() => {
                                    if (!customLocation.trim()) return;
                                    const lower = customLocation.toLowerCase();
                                    const branch = lower.includes('dasma') || lower.includes('paliparan') || lower.includes('salawag') ? 'Dasma' : 'Bulihan';
                                    saveAndApply(branch, customLocation.trim(), 'Closest Branch');
                                }}
                                className="px-4 py-2.5 rounded-xl bg-[#31281f] hover:bg-[#f59e0b] text-white hover:text-[#472a00] font-bold text-xs transition-colors cursor-pointer"
                            >
                                Set
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
