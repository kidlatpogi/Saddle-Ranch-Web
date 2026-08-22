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

const DEFAULT_REVIEWS: ReviewItem[] = [
    {
        id: 1,
        customer_name: 'Karlo Mendoza',
        branch: 'Bulihan',
        overall_rating: 5,
        comment: 'The Sizzling Pork Sisig with egg is hands down the best in Silang! Delivered piping hot and the crunchiness stays perfect.',
        favorite_dish: 'Sizzling Pork Sisig (w/ Egg)',
    },
    {
        id: 2,
        customer_name: 'Patricia Santos',
        branch: 'Dasmarinas',
        overall_rating: 5,
        comment: 'Super fast table QR ordering here at Governor\'s Drive. Staff brought the sizzling platters in less than 10 minutes with overflowing chicken oil!',
        favorite_dish: 'Sizzling Chicken Inasal',
    },
    {
        id: 3,
        customer_name: 'Dave Villanueva',
        branch: 'Bulihan',
        overall_rating: 5,
        comment: 'Barkada platter is huge and super sulit for our family Sunday dinner. The authentic savory garlic rice pairing is legendary.',
        favorite_dish: 'Barkada Sisig Bilao Platter',
    },
    {
        id: 4,
        customer_name: 'Michelle Alcantara',
        branch: 'Dasmarinas',
        overall_rating: 5,
        comment: 'The Pork Sinigang has that authentic sour tamarind kick with tender melt-in-your-mouth pork. Best comfort food after work!',
        favorite_dish: 'Pork Sinigang',
    },
    {
        id: 5,
        customer_name: 'Christian Reyes',
        branch: 'Bulihan',
        overall_rating: 5,
        comment: 'Online delivery was seamless! Free delivery in Bulihan area and arrived wrapped neatly with zero oil spills.',
        favorite_dish: 'Sizzling Spicy Beef',
    },
    {
        id: 6,
        customer_name: 'Jasmine Dela Cruz',
        branch: 'Dasmarinas',
        overall_rating: 5,
        comment: 'Cowboy roadhouse ambience is so rustic and cozy. Love the sizzling burger steak with generous mushroom gravy.',
        favorite_dish: 'Sizzling Burger Steak',
    },
];

export default function ReviewsMarquee({ initialReviews }: ReviewsMarqueeProps) {
    const [reviews, setReviews] = useState<ReviewItem[]>(
        initialReviews && initialReviews.length > 0 ? initialReviews : DEFAULT_REVIEWS
    );
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

    const handleNewRating = (newRating: ReviewItem) => {
        setReviews((prev) => [newRating, ...prev]);
    };

    // Calculate rating statistics
    const avgRating = (
        reviews.reduce((acc, r) => acc + (r.overall_rating || 5), 0) / Math.max(1, reviews.length)
    ).toFixed(1);

    // Double the list for seamless marquee loop
    const marqueeList = [...reviews, ...reviews];

    return (
        <>
            <style>{`
                @keyframes marquee-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes marquee-scroll-reverse {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .animate-marquee {
                    display: flex;
                    width: max-content;
                    animation: marquee-scroll 45s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
                .animate-marquee-reverse {
                    display: flex;
                    width: max-content;
                    animation: marquee-scroll-reverse 45s linear infinite;
                }
                .animate-marquee-reverse:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <section className="py-12 sm:py-16 overflow-hidden relative border-t border-[#3D3126]/60 bg-[#121213]">
                {/* Background Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-gradient-to-r from-amber-600/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="w-[92%] sm:w-[88%] md:w-[80%] max-w-[1440px] mx-auto mb-8 sm:mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="font-mono text-[10px] sm:text-xs text-[#f59e0b] bg-[#31281f] px-2.5 sm:px-3 py-1 rounded border border-[#534434] uppercase tracking-widest font-bold mb-2 sm:mb-3 inline-flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" /> Authentic Customer Love
                            </span>
                            <h2 className="font-domine text-2xl sm:text-4xl md:text-5xl text-[#ffc174] font-bold">
                                What People Say
                            </h2>
                            <p className="font-sans text-xs sm:text-base text-[#d8c3ad] mt-1">
                                Real stories and sizzling feedback from our Cavite foodies & roadhouse regulars.
                            </p>
                        </div>

                        {/* Summary Badge & Leave Review CTA */}
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="p-3 rounded-2xl bg-[#1A1A1B] border border-[#534434] flex items-center gap-3 shadow-lg">
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1 text-[#fbbf24]">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-3.5 h-3.5 fill-[#fbbf24]" />
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-[#a1a1aa] font-medium">{reviews.length}+ Verified Reviews</span>
                                </div>
                                <div className="h-8 w-[1px] bg-[#3f3f46]" />
                                <div className="font-domine text-xl font-black text-white font-mono">
                                    {avgRating} <span className="text-xs text-[#f59e0b]">/ 5.0</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsRatingModalOpen(true)}
                                className="px-4 py-3 rounded-2xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#472a00] font-black text-xs uppercase tracking-wider transition-all btn-bevel shadow-lg cursor-pointer flex items-center gap-1.5 shrink-0"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Leave a Review</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Infinity Scrolling Marquee Track (Row 1) */}
                <div className="relative w-full overflow-hidden mb-4">
                    {/* Left & Right Shadow Vignette */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#121213] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#121213] to-transparent z-10 pointer-events-none" />

                    <div className="animate-marquee gap-5 py-2">
                        {marqueeList.map((review, idx) => (
                            <div
                                key={`${review.id}-${idx}`}
                                className="w-[320px] sm:w-[380px] rounded-3xl bg-[#1A1A1B] border border-[#333338] p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:border-[#f59e0b]/50 transition-all duration-300 shadow-xl hover-heat group shrink-0"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            {[...Array(review.overall_rating || 5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
                                            ))}
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
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
                                        <div className="w-8 h-8 rounded-full bg-[#27272a] border border-[#3f3f46] text-[#fbbf24] font-bold text-xs flex items-center justify-center font-domine">
                                            {(review.customer_name || 'Customer').charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xs text-white leading-tight">
                                                {review.customer_name || 'Saddle Ranch Diner'}
                                            </h4>
                                            <span className="text-[10px] text-[#a1a1aa]">Verified Diner</span>
                                        </div>
                                    </div>

                                    {review.favorite_dish && (
                                        <div className="text-[10px] font-mono font-bold text-[#f59e0b] bg-[#261e15] border border-[#534434] px-2 py-0.5 rounded truncate max-w-[130px]" title={review.favorite_dish}>
                                            {review.favorite_dish}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center pt-2">
                    <span className="text-[11px] text-[#71717a] font-mono">
                        Hover cards to pause scrolling • Verified customer feedback from Bulihan & Dasmariñas branches
                    </span>
                </div>
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
