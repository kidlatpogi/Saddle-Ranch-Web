import React, { useState } from 'react';
import { Star, Flame, Sparkles, CheckCircle2, X, MessageSquare, Utensils, ThumbsUp, Heart } from 'lucide-react';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderNumber?: string;
    orderId?: number;
    initialCustomerName?: string;
    initialCustomerPhone?: string;
    branch?: string;
    onRatingSubmitted?: (ratingData: any) => void;
}

export default function RatingModal({
    isOpen,
    onClose,
    orderNumber,
    orderId,
    initialCustomerName = '',
    initialCustomerPhone = '',
    branch = 'Bulihan',
    onRatingSubmitted,
}: RatingModalProps) {
    const [overall, setOverall] = useState<number>(5);
    const [foodQuality, setFoodQuality] = useState<number>(5);
    const [service, setService] = useState<number>(5);
    const [speed, setSpeed] = useState<number>(5);
    const [packaging, setPackaging] = useState<number>(5);

    const [customerName, setCustomerName] = useState(initialCustomerName || '');
    const [favoriteDish, setFavoriteDish] = useState('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedSuccess, setSubmittedSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');

        try {
            const res = await fetch('/api/v1/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    order_id: orderId || null,
                    order_number: orderNumber || null,
                    customer_name: customerName.trim() || 'Valued Customer',
                    customer_phone: initialCustomerPhone || null,
                    branch: branch || 'Bulihan',
                    overall_rating: overall,
                    food_quality_rating: foodQuality,
                    customer_service_rating: service,
                    delivery_speed_rating: speed,
                    packaging_rating: packaging,
                    comment: comment.trim() || null,
                    favorite_dish: favoriteDish.trim() || null,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setSubmittedSuccess(true);
                if (onRatingSubmitted) {
                    onRatingSubmitted(data.data);
                }
                setTimeout(() => {
                    setSubmittedSuccess(false);
                    onClose();
                }, 2500);
            } else {
                setErrorMsg(data.message || 'Failed to submit rating. Please try again.');
            }
        } catch (err: any) {
            setErrorMsg('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderInteractiveStars = (value: number, onChange: (val: number) => void, label: string) => {
        return (
            <div className="flex items-center justify-between py-1.5 border-b border-[#262627] last:border-none">
                <span className="text-xs font-semibold text-[#d8c3ad]">{label}</span>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => onChange(star)}
                            className="p-1 hover:scale-125 transition-transform cursor-pointer group focus:outline-none"
                            title={`${star} Star${star > 1 ? 's' : ''}`}
                        >
                            <Star
                                className={`w-5 h-5 transition-colors ${
                                    star <= value
                                        ? 'text-[#fbbf24] fill-[#fbbf24] drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                                        : 'text-[#534434] hover:text-[#fbbf24]/50'
                                }`}
                            />
                        </button>
                    ))}
                    <span className="text-xs font-mono font-black text-[#ffc174] w-6 text-right ml-1">
                        {value}.0
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[110000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-3xl bg-[#1A1A1B] border border-[#ffc174]/40 p-6 shadow-2xl text-[#f0e0d1] max-h-[92vh] overflow-y-auto font-sans relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="absolute top-5 right-5 p-1.5 text-[#d8c3ad] hover:text-white hover:bg-[#31281f] rounded-lg transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                {submittedSuccess ? (
                    <div className="py-10 text-center space-y-4 animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <Heart className="w-8 h-8 fill-emerald-400 text-emerald-400 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="font-domine text-2xl font-black text-[#ffc174]">
                                Thank You for Your Feedback!
                            </h3>
                            <p className="text-xs text-[#d8c3ad] mt-1 max-w-xs mx-auto">
                                Your review helps our roadhouse team keep sizzling and serving the best Filipino meals in Cavite!
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#261e15] border border-[#534434] text-xs font-mono text-[#fbbf24]">
                            <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" /> 5.0★ Experience Recorded
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Header */}
                        <div className="flex items-center gap-3 border-b border-[#3D3126] pb-3.5 pr-8">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#b45309] flex items-center justify-center text-[#3f2000] shadow-md shadow-[#f59e0b]/20 shrink-0">
                                <Flame className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-domine text-lg font-bold text-[#ffc174]">
                                    Rate Your Sizzling Experience
                                </h3>
                                <p className="text-xs text-[#d8c3ad]">
                                    {orderNumber ? `Order #${orderNumber} • ${branch} Branch` : `${branch} Branch • Saddle Ranch`}
                                </p>
                            </div>
                        </div>

                        {errorMsg && (
                            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
                                {errorMsg}
                            </div>
                        )}

                        {/* Star Categories Breakdown */}
                        <div className="p-4 rounded-2xl bg-[#121213] border border-[#3D3126] space-y-1 shadow-inner">
                            <div className="text-[11px] font-bold text-[#f59e0b] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 fill-[#f59e0b]" /> Star Ratings (1 - 5)
                            </div>
                            {renderInteractiveStars(overall, setOverall, 'Overall Experience')}
                            {renderInteractiveStars(foodQuality, setFoodQuality, 'Food Quality & Taste')}
                            {renderInteractiveStars(service, setService, 'Customer Service & Staff')}
                            {renderInteractiveStars(speed, setSpeed, 'Delivery / Serving Speed')}
                            {renderInteractiveStars(packaging, setPackaging, 'Packaging & Order Accuracy')}
                        </div>

                        {/* Customer Details & Favorite Dish */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-bold text-[#d8c3ad] mb-1">Your Name / Alias</label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="e.g. Karlo M."
                                    className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-[#d8c3ad] mb-1">Favorite Dish Ordered</label>
                                <input
                                    type="text"
                                    value={favoriteDish}
                                    onChange={(e) => setFavoriteDish(e.target.value)}
                                    placeholder="e.g. Sizzling Sisig w/ Egg"
                                    className="w-full px-3 py-2 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Comment Box */}
                        <div>
                            <label className="block text-[11px] font-bold text-[#d8c3ad] mb-1 flex items-center gap-1">
                                <MessageSquare className="w-3 h-3 text-[#f59e0b]" /> Share Your Thoughts / Feedback (Optional)
                            </label>
                            <textarea
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="What did you love about your meal? Any suggestions for our kitchen or crew?"
                                className="w-full p-3 rounded-xl bg-[#121213] border border-[#534434] text-xs text-white placeholder-[#8c7a6b] focus:border-[#f59e0b] focus:outline-none resize-none leading-relaxed"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3.5 rounded-xl bg-[#f59e0b] hover:bg-[#ffc174] disabled:opacity-50 text-[#472a00] font-black text-xs uppercase tracking-wider shadow-xl shadow-[#f59e0b]/20 transition-all btn-bevel cursor-pointer flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <span>Submitting Review...</span>
                                ) : (
                                    <>
                                        <ThumbsUp className="w-4 h-4" />
                                        <span>Submit Roadhouse Rating</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
