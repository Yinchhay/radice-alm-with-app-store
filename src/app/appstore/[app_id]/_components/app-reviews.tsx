"use client";
import { useState, useEffect } from "react";
import AppActionButton from "./app-action-button";
import { IconStar, IconStarFilled } from "@tabler/icons-react";

export type Feedback = {
    id: number;
    testerId: string;
    appId: number;
    title: string;
    review: string;
    starRating: number;
    createdAt: string;
    updatedAt: string;
    tester: {
        firstName: string;
        lastName: string;
    };
};

type AppReviewsProps = {
    appId: number;
    appName: string;
    reviews?: Feedback[];
};


export default function AppReviews({
    appId,
    appName,
}: AppReviewsProps) {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviews, setReviews] = useState<Feedback[]>([]);
    const [averageRating, setAverageRating] = useState(0);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/public/app/${appId}/feedback`);
            if (!response.ok) throw new Error(`Failed to fetch reviews`);
            const data = await response.json();
            setReviews(data.data.feedbacks || []);
            setAverageRating(data.data.averageRating || 0);
        } catch (error) {
            console.error(error);
            setReviews([]);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [appId]);

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
            const res = await fetch(`/api/public/app/${appId}/feedback/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: reviewTitle,
                    review: reviewText,
                    starRating: rating.toString(),
                }),
            });
            if (!res.ok) throw new Error("Failed to submit review");
            setShowReviewForm(false);
            setRating(0);
            setReviewTitle("");
            setReviewText("");
            await fetchReviews();
            alert("Review submitted successfully!");
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (
        ratingValue: number,
        interactive = false,
        size = 20,
    ) => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            const isFilled = interactive
                ? hoverRating >= starValue || rating >= starValue
                : ratingValue >= starValue;

            return (
                <span
                    key={index}
                    className={`inline-block cursor-pointer transition-colors duration-200 ${
                        interactive ? "hover:scale-110" : ""
                    }`}
                    onClick={
                        interactive
                            ? () => handleStarClick(starValue)
                            : undefined
                    }
                    onMouseEnter={
                        interactive
                            ? () => handleStarHover(starValue)
                            : undefined
                    }
                    onMouseLeave={interactive ? handleStarLeave : undefined}
                >
                    {isFilled ? (
                        <IconStarFilled
                            size={size}
                            className="text-yellow-400"
                        />
                    ) : (
                        <IconStar size={size} className="text-gray-300" />
                    )}
                </span>
            );
        });
    };

    // Avatar helper
    const getInitials = (first?: string, last?: string) =>
        `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();

    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
                <span className="flex items-baseline">
                    <span className="text-xl font-semibold leading-none">Ratings and Reviews</span>
                    {reviews.length > 0 && (
                        <span className="text-base font-normal text-gray-500 leading-none ml-2">({reviews.length} ratings)</span>
                    )}
                </span>
                <button className="w-4 h-4 inline-block align-middle relative top-[2px]">
                    <img
                        src={"/ui/arrow-right-black.svg"}
                        alt="arrow"
                    />
                </button>
            </div>
            <div className="">
                {reviews.length === 0 ? (
                    <div className="text-center mb-3 py-8 text-gray-500">
                        No reviews yet. Be the first to review {appName}!
                    </div>
                ) : (
                    <div className="">
                        {reviews.slice(0, 3).map((review, idx, arr) => (
                            <div
                                key={review.id}
                                className={`mb-6${idx < arr.length - 1 ? ' border-b border-gray-100 pb-3' : ''}`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500">
                                        {getInitials(review.tester?.firstName, review.tester?.lastName) || "A"}
                                    </div>
                                    <div className="font-semibold">
                                        {review.tester
                                            ? `${review.tester.firstName} ${review.tester.lastName}`
                                            : "Anonymous"}
                                    </div>
                                </div>
                                <div className="flex items-center mb-3">
                                    {renderStars(review.starRating)}
                                </div>
                                <div className="text-gray-700 text-sm mb-2">
                                    {review.review}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="mb-6">
                <button 
                    type="button"
                    className="text-xl font-semibold mb-2 flex items-center"
                    onClick={() => setShowReviewForm((prev) => !prev)}
                >
                    Write a Review
                    <span className={`ml-2 transition-transformation duration-200 ${showReviewForm? '':'rotate-180'}`}>
                        <img src={"/ui/arrow2.svg"} alt="arrow" className="w-4 h-4 mb-2 inline-block"/>
                    </span>
                </button> 
                {showReviewForm && (
                    <div className="mt-6 p-5">
                        <div className="flex gap-2 mb-4">
                            {renderStars(rating, true, 28)}
                        </div>
                        <div className="mb-5">
                            <label className="block text-xs text-gray-500 mb-2">
                                Title
                            </label>
                            <input 
                                type="text" 
                                value={reviewTitle}
                                onChange ={(e) => setReviewTitle(e.target.value)}
                                className="rounded-lg w-full px-3 py-2 bg-white border border-gray-200 placeholder:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                placeholder="Title of your review"
                                maxLength={100}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-xs text-gray-500 mb-2">
                                Review
                            </label>
                            <input 
                                type="text" 
                                value={reviewText}
                                onChange ={(e) => setReviewText(e.target.value)}
                                className="rounded-lg w-full px-3 py-2 bg-white border border-gray-200 placeholder:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                placeholder="Share your thoughts about the app"
                                maxLength={100}
                            />
                        </div>
                        <div className="flex justify-end mt-2">
                            <AppActionButton
                                onClick={handleSubmitReview}
                                disabled={isSubmitting || rating === 0}
                                className="text-sm !px-6"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Review"}
                            </AppActionButton>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
