import React, { useState } from 'react';
import { Star, MessageSquareQuote, Flame, Utensils, Heart, Sparkles, Plus, ThumbsUp } from 'lucide-react';
import RatingModal from '@/Components/RatingModal';

export interface ReviewItem {
    id?: number;
    customer_name?: string;
    branch?: string;
    overall_rating: number;
    comment?: string;
    favorite_dish?: string;
    created_at?: string;
}

interface ReviewsMarqueeProps {
    initialReviews?: ReviewItem[];
}

export default function ReviewsMarquee({ initialReviews = [] }: ReviewsMarqueeProps) {
    const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews || []);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

    const handleNewRating = (newRating: ReviewItem) => {
        setReviews((prev) => [newRating, ...prev]);
    };

    // Calculate rating statistics
    const count = reviews.length;
    const avgRating = count > 0 
        ? (reviews.reduce((acc, r) => acc + (r.overall_rating || 5), 0) / count).toFixed(1)
        : '5.0';

    // Duplicate the list for infinite marquee animation
    const marqueeList = count > 0 ? (count < 6 ? [...reviews, ...reviews, ...reviews, ...reviews] : [...reviews, ...reviews]) : [];

    return (
        <>
            <style>{`
                @keyframes marquee-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: flex;
                    width: max-content;
                    animation: marquee-scroll 45s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <section className="py-10 sm:py-16 overflow-hidden relative border-t border-[#3D3126]/60 bg-[#121213] text-[#f0e0d1] font-sans">
                {/* Background Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-gradient-to-r from-amber-600/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="w-[92%] sm:w-[88%] md:w-[80%] max-w-[1440px] mx-auto mb-8 sm:mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <h2 className="font-domine text-2xl sm:text-4xl md:text-5xl text-[#ffc174] font-bold tracking-tight">
                                What People Say
                            </h2>
                            <p className="font-sans text-xs sm:text-base text-[#d8c3ad] leading-relaxed">
                                Real stories and sizzling feedback from our Cavite foodies & roadhouse regulars.
                            </p>
                        </div>

                        {/* Summary Badge & Leave Review CTA - Matching Exact Equal Height & Width */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                            {/* Counter Card */}
                            <div className="h-14 w-full sm:w-60 px-4 rounded-2xl bg-[#1A1A1B] border border-[#534434] flex items-center justify-between shadow-lg">
                                <div className="text-left">
                                    <div className="flex items-center gap-1 text-[#fbbf24]">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-3.5 h-3.5 fill-[#fbbf24]" />
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-[#a1a1aa] font-medium block mt-0.5">
                                        {count} Verified Review{count !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                <div className="h-7 w-[1px] bg-[#3f3f46]" />
                                <div className="font-domine text-lg font-black text-white font-mono flex items-baseline gap-1">
                                    {avgRating} <span className="text-[10px] text-[#f59e0b]">/ 5.0</span>
                                </div>
                            </div>

                            {/* Leave a Review Button */}
                            <button
                                onClick={() => setIsRatingModalOpen(true)}
                                className="h-14 w-full sm:w-60 px-4 rounded-2xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#472a00] font-black text-xs sm:text-sm uppercase tracking-wider transition-all btn-bevel shadow-lg cursor-pointer flex items-center justify-center gap-2 shrink-0"
                            >
                                <Plus className="w-4 h-4 stroke-[3]" />
                                <span>Leave a Review</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Content */}
                {count === 0 ? (
                    <div className="w-[92%] sm:w-[88%] md:w-[80%] max-w-xl mx-auto p-8 sm:p-10 rounded-3xl bg-[#1A1A1B] border border-dashed border-[#534434] text-center space-y-3.5 shadow-xl">
                        <div className="w-12 h-12 rounded-full bg-[#261e15] border border-[#534434] text-[#fbbf24] mx-auto flex items-center justify-center">
                            <Star className="w-6 h-6 fill-[#fbbf24]" />
                        </div>
                        <div>
                            <h3 className="font-domine text-lg font-bold text-white">No Customer Reviews Yet</h3>
                            <p className="text-xs text-[#d8c3ad] mt-1 max-w-sm mx-auto leading-relaxed">
                                Be the first guest to share your sizzling dining experience with us!
                            </p>
                        </div>
                        <div className="pt-1">
                            <button
                                onClick={() => setIsRatingModalOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#472a00] font-black text-xs uppercase tracking-wider transition-all btn-bevel shadow cursor-pointer"
                            >
                                <Plus className="w-4 h-4 stroke-[3]" />
                                <span>Leave the First Review</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Infinity Scrolling Marquee Track */}
                        <div className="relative w-full overflow-hidden mb-4">
                            {/* Left & Right Shadow Vignettes */}
                            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#121213] to-transparent z-10 pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#121213] to-transparent z-10 pointer-events-none" />

                            <div className="animate-marquee gap-4 sm:gap-5 py-2">
                                {marqueeList.map((review, idx) => (
                                    <div
                                        key={`${review.id || idx}-${idx}`}
                                        className="w-[280px] sm:w-[380px] rounded-3xl bg-[#1A1A1B] border border-[#333338] p-4 sm:p-6 flex flex-col justify-between space-y-4 hover:border-[#f59e0b]/50 transition-all duration-300 shadow-xl hover-heat group shrink-0"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(review.overall_rating || 5)].map((_, i) => (
                                                        <Star key={i} className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-[#fbbf24] text-[#fbbf24]" />
                                                    ))}
                                                </div>
                                                <span className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider border ${
                                                    (review.branch || '').toLowerCase().includes('dasma')
                                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                                }`}>
                                                    {review.branch || 'Bulihan'} Branch
                                                </span>
                                            </div>

                                            <p className="font-sans text-xs sm:text-sm text-[#f0e0d1] leading-relaxed line-clamp-3 italic">
                                                "{review.comment || 'Amazing sizzling dishes and great customer service!'}"
                                            </p>
                                        </div>

                                        <div className="pt-3 border-t border-[#333338] flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#27272a] border border-[#3f3f46] text-[#fbbf24] font-bold text-xs flex items-center justify-center font-domine">
                                                    {(review.customer_name || 'C').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-xs text-white leading-tight">
                                                        {review.customer_name || 'Saddle Ranch Diner'}
                                                    </h4>
                                                    <span className="text-[10px] text-[#a1a1aa]">Verified Diner</span>
                                                </div>
                                            </div>

                                            {review.favorite_dish && (
                                                <div className="text-[9px] sm:text-[10px] font-mono font-bold text-[#f59e0b] bg-[#261e15] border border-[#534434] px-2 py-0.5 rounded truncate max-w-[120px] sm:max-w-[140px]" title={review.favorite_dish}>
                                                    {review.favorite_dish}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-center pt-2">
                            <span className="text-[10px] sm:text-[11px] text-[#71717a] font-mono">
                                Hover cards to pause scrolling • Verified customer feedback from Bulihan & Dasmariñas branches
                            </span>
                        </div>
                    </>
                )}
            </section>

            {/* Rating Submission Modal */}
            <RatingModal
                isOpen={isRatingModalOpen}
                onClose={() => setIsRatingModalOpen(false)}
                onRatingSubmitted={handleNewRating}
            />
        </>
    );
}
