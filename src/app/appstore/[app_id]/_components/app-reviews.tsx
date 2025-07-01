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

// MOCK DATA for demo UX/UI
const MOCK_REVIEWS: Feedback[] = [
    {
        id: 1,
        testerId: "t1",
        appId: 1,
        title: "Before I started using this tool, I was disabled. Now, I can walk.",
        review: "Before I started using this tool, I was disabled. Now, I can walk.",
        starRating: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tester: { firstName: "Sothea", lastName: "Seng" },
    },
    {
        id: 2,
        testerId: "t2",
        appId: 1,
        title: "Before I used this tool, my brain was a mess of forgotten thoughts and misplaced ideas. I could never find anything! Now? Everything's organized. I can actually remember what I had for breakfast and my houseplants seem happier. It's like a tiny, digital organizer for your brain. Love it!",
        review: "Before I used this tool, my brain was a mess of forgotten thoughts and misplaced ideas. I could never find anything! Now? Everything's organized. I can actually remember what I had for breakfast and my houseplants seem happier. It's like a tiny, digital organizer for your brain. Love it!",
        starRating: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tester: { firstName: "Yinchhay", lastName: "Im" },
    },
];

export default function AppReviews({
    appId,
    appName,
    reviews: initialReviews,
}: AppReviewsProps) {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviews, setReviews] = useState<Feedback[]>(
        initialReviews ?? MOCK_REVIEWS,
    );

    const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.starRating, 0) /
            reviews.length
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
            console.log("Submitting review:", {
                appId,
                rating,
                title: reviewTitle,
                review: reviewText,
            });

            setRating(0);
            setReviewTitle("");
            setReviewText("");
            setShowReviewForm(false);
            
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
    const getInitials = (first: string, last: string) =>
        `${first[0] || ""}${last[0] || ""}`.toUpperCase();

    return (
        <div className="mb-8">
            <div className="text-xl font-semibold mb-6 flex items-center">
                <span>Ratings and Reviews</span>
                <button className="ml-2">
                    <img src={"/ui/arrow-right-black.svg"} alt="arrow" className="w-4 h-4 inline-block" />
                </button>
            </div>
{/* 
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold leading-none">
                        {averageRating.toFixed(1)}
                    </div>
                    <div className="flex gap-1">
                        {renderStars(averageRating, false, 25)}
                    </div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                    {reviews.length} review
                    {reviews.length !== 1 ? "s" : ""}
                </div>
            </div> */}

            <div className="">
                {reviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No reviews yet. Be the first to review {appName}!
                    </div>
                ) : (
                    <div className="">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="mb-6"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500">
                                        {getInitials(
                                            review.tester.firstName,
                                            review.tester.lastName,
                                        )}
                                    </div>
                                    <div className="font-semibold">
                                        {review.tester.firstName}{" "}
                                        {review.tester.lastName}
                                    </div>
                                </div>
                                <div className="flex items-center mb-2">
                                    {renderStars(review.starRating)}
                                </div>
                                <div className="text-gray-700 text-sm mb-1">
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
                    <div className="mt-4">
                        <div className="flex gap-2">
                            {renderStars(rating, true, 25)}
                        </div>
                        <div className="mt-4">
                            <label className="mt-4 text-xs text-gray-500">
                                Title
                            </label>
                            <input 
                                type="text" 
                                value={reviewTitle}
                                onChange ={(e) => setReviewTitle(e.target.value)}
                                className="rounded-lg w-full px-3 py-2 bg-white border border-gray-200 mt-1 placeholder:text-sm placeholder:text-gray-400"
                                placeholder="Optional"
                                maxLength={100}
                            />
                        </div>
                        <div className="mt-4">
                            <label className="mt-4 text-xs text-gray-500">
                                Review
                            </label>
                            <input 
                                type="text" 
                                value={reviewText}
                                onChange ={(e) => setReviewText(e.target.value)}
                                className="rounded-lg w-full px-3 py-2 bg-white border border-gray-200 mt-1 placeholder:text-sm placeholder:text-gray-400"
                                placeholder="Optional"
                                maxLength={100}
                            />
                        </div>
                        <div className="mt-5 flex justify-end">
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
