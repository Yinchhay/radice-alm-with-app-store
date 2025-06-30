"use client";
import { useState } from "react";
import { IconStar, IconStarFilled } from "@tabler/icons-react";

type Review = {
    id: number;
    title?: string;
    review: string;
    starRating: number;
    tester: {
        firstName: string;
        lastName: string;
    };
    createdAt: string;
};

type AppReviewsProps = {
    appId: number;
    appName: string;
    reviews?: Review[];
};

export default function AppReviews({
    appId,
    appName,
    reviews = [],
}: AppReviewsProps) {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.starRating, 0) / reviews.length 
        : 0;

    const handleStarClick = (starValue: number) => {
        setRating(starValue);
    };

    const handleStarHover = (starValue: number) => {
        setHoverRating(starValue);
    };

    const handleStarLeave = () => {
        setHoverRating(0);
    };

    const handleSubmitReview = async () => {
        if (rating === 0) {
            alert("Please select a rating");
            return;
        }

        setIsSubmitting(true);
        try {
            // TODO: Implement actual review submission API call
            console.log("Submitting review:", {
                appId,
                rating,
                title: reviewTitle,
                review: reviewText,
            });

            // Reset form
            setRating(0);
            setReviewTitle("");
            setReviewText("");
            setShowReviewForm(false);
            
            // TODO: Refresh reviews list
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (ratingValue: number, interactive = false, size = 20) => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            const isFilled = interactive 
                ? (hoverRating >= starValue || rating >= starValue)
                : ratingValue >= starValue;

            return (
                <span
                    key={index}
                    className={`inline-block cursor-pointer transition-colors duration-200 ${
                        interactive ? "hover:scale-110" : ""
                    }`}
                    onClick={interactive ? () => handleStarClick(starValue) : undefined}
                    onMouseEnter={interactive ? () => handleStarHover(starValue) : undefined}
                    onMouseLeave={interactive ? handleStarLeave : undefined}
                >
                    {isFilled ? (
                        <IconStarFilled 
                            size={size} 
                            className="text-yellow-400" 
                        />
                    ) : (
                        <IconStar 
                            size={size} 
                            className="text-gray-300" 
                        />
                    )}
                </span>
            );
        });
    };

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Ratings and Reviews</h2>
                <span className="text-gray-400">&gt;</span>
            </div>

            {/* Average Rating Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
                        <div className="flex justify-center mt-1">
                            {renderStars(averageRating)}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                            {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="text-sm text-gray-600">
                            Based on {reviews.length} user review{reviews.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Form Toggle */}
            <div className="mb-6">
                <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="text-xl font-semibold mb-2 cursor-pointer select-none flex items-center justify-between w-full text-left"
                >
                    Write a Review
                    <span className="text-gray-400 ml-2">
                        {showReviewForm ? "▲" : "▼"}
                    </span>
                </button>
                
                {showReviewForm && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rating *
                            </label>
                            <div className="flex gap-1">
                                {renderStars(rating, true, 24)}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                                {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''} selected` : 'Click to rate'}
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title (Optional)
                            </label>
                            <input
                                type="text"
                                value={reviewTitle}
                                onChange={(e) => setReviewTitle(e.target.value)}
                                className="border rounded px-3 py-2 w-full"
                                placeholder="Give your review a title"
                                maxLength={100}
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Review (Optional)
                            </label>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="border rounded px-3 py-2 w-full h-24 resize-none"
                                placeholder="Share your experience with this app"
                                maxLength={500}
                            />
                            <div className="text-xs text-gray-500 mt-1 text-right">
                                {reviewText.length}/500
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={handleSubmitReview}
                                disabled={isSubmitting || rating === 0}
                                className="bg-black text-white px-6 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Review"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowReviewForm(false);
                                    setRating(0);
                                    setReviewTitle("");
                                    setReviewText("");
                                }}
                                className="border border-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No reviews yet. Be the first to review {appName}!
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <div className="flex items-start justify-between mb-2">
                                <div className="font-semibold">
                                    {review.tester.firstName} {review.tester.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="flex items-center mb-2">
                                {renderStars(review.starRating)}
                            </div>
                            {review.title && (
                                <div className="font-medium mb-1">{review.title}</div>
                            )}
                            <div className="text-gray-700 text-sm">{review.review}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
} 