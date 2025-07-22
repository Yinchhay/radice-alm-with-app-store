"use client";
import { useState, useEffect } from "react";
import AppActionButton from "./app-action-button";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { useTesterAuth } from "@/app/contexts/TesterAuthContext";
import Popup from "@/components/Popup";
import { format } from 'date-fns';

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
    maxReviews?: number;
    showHeader?: boolean;
    showForm?: boolean;
    onLoginRequired?: () => void;
    onReviewSubmitted?: () => void;
};

export default function AppReviews({
    appId,
    appName,
    reviews: propReviews,
    maxReviews = 3,
    showHeader = true,
    showForm = true,
    onLoginRequired,
    onReviewSubmitted,
}: AppReviewsProps) {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const { isAuthenticated } = useTesterAuth();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviews, setReviews] = useState<Feedback[]>(propReviews || []);
    const [averageRating, setAverageRating] = useState(0);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/public/app/${appId}/feedback`);
            if (!response.ok) throw new Error(`Failed to fetch reviews`);
            const data = await response.json();
            const fetchedReviews = data.data.feedbacks || [];
            
            const sortedReviews = fetchedReviews.slice().sort((a: Feedback, b: Feedback) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA;
            });
            
            setReviews(sortedReviews);
            setAverageRating(data.data.averageRating || 0);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    useEffect(() => {
        if (propReviews) {
            const sortedPropReviews = propReviews.slice().sort((a: Feedback, b: Feedback) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA;
            });
            setReviews(sortedPropReviews);
            return;
        }
        fetchReviews();
    }, [appId, propReviews]);
    
    useEffect(() => {
        if (reviews.length > 0) {
            const avg = reviews.reduce((sum, r) => sum + Number(r.starRating || 0), 0) / reviews.length;
            setAverageRating(avg);
        } else {
            setAverageRating(0);
        }
    }, [reviews]);

    const handleStarClick = (starValue: number) => {
        if (!isAuthenticated) {
            onLoginRequired?.();
            return;
        }
        setRating(starValue);
    };

    const handleStarHover = (starValue: number) => {
        if (!isAuthenticated) return;
        setHoverRating(starValue);
    };

    const handleStarLeave = () => {
        if (!isAuthenticated) return;
        setHoverRating(0);
    };

    const handleSubmitReview = async () => {
        if (!isAuthenticated) {
            onLoginRequired?.();
            return;
        }
        if (rating === 0) {
            alert("Please select a rating");
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetch(
                `/api/public/app/${appId}/feedback/create`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: reviewTitle,
                        review: reviewText,
                        starRating: rating.toString(),
                    }),
                },
            );
            if (!res.ok) {
                alert("Failed to submit review.");
            } else {
                setShowSuccessPopup(true);
                setReviewTitle("");
                setReviewText("");
                setRating(0);
                setShowReviewForm(false);
                onReviewSubmitted?.();
            }
        } catch (error) {
            console.error("Error submitting review:", error);
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
        <div>
            {showHeader && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl font-semibold leading-none">Ratings and Reviews</span>
                        {reviews.length > 0 && (
                            <span className="text-base font-normal text-gray-500 leading-none ml-2">
                                ({reviews.length >= 5 ? "5+" : reviews.length} ratings)
                            </span>
                        )}
                        <a
                            href={`/appstore/${appId}/app-all-reviews-page`}
                            className="w-4 h-4 inline-block align-middle relative top-[2px]"
                        >
                            <img src={"/ui/arrow-right-black.svg"} alt="arrow" />
                        </a>
                    </div>
                    {reviews.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-yellow-500">{averageRating.toFixed(1)}</span>
                            <span style={{ pointerEvents: 'none', cursor: 'default' }}>{renderStars(Math.round(averageRating))}</span>
                        </div>
                    )}
                </div>
            )}
            <div className="mb-10">
                {reviews.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        No reviews yet. Be the first to review {appName}!
                    </div>
                ) : (
                    <div>
                        {reviews
                            .slice(0, maxReviews)
                            .map((review, idx, arr) => (
                                <div
                                    key={review.id}
                                    className={`mb-6${idx < Math.min(arr.length, maxReviews) - 1 ? " border-b border-gray-100 pb-3" : ""}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500">
                                                {getInitials(
                                                    review.tester?.firstName,
                                                    review.tester?.lastName,
                                                ) || "A"}
                                            </div>
                                            <div className="font-semibold">
                                                {review.tester
                                                    ? `${review.tester.firstName} ${review.tester.lastName}`
                                                    : "Anonymous"}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {format(new Date(review.createdAt), 'dd MMM yyyy, h:mma')}
                                        </div>
                                    </div>
                                    <div className="flex items-center mb-3 pointer-events-none">
                                        {renderStars(review.starRating)}
                                    </div>
                                    <div className="font-medium text-gray-900 mb-1">
                                        {review.title}
                                    </div>
                                    <div className="text-gray-700 text-sm mb-2">
                                        {review.review}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
            {showForm && (
                <div className="">
                    <button
                        type="button"
                        className="text-xl font-semibold flex items-center"
                        onClick={() => {
                            if (!isAuthenticated) {
                                onLoginRequired?.();
                                return;
                            }
                            setShowReviewForm((prev) => !prev);
                        }}>
                        Write a Review
                        <span
                            className={`ml-2 transition-transformation duration-200 ${showReviewForm ? "" : "rotate-180"}`}>
                            <img
                                src={"/ui/arrow2.svg"}
                                alt="arrow"
                                className="w-4 h-4 mb-2 inline-block"
                            />
                        </span>
                    </button>
                    {showReviewForm && (
                        <div className="mt-8 p-5">
                            <div className="flex gap-2 mb-5">
                                {renderStars(rating, true, 28)}
                            </div>
                            <div className="mb-5">
                                <label className="block text-xs text-gray-500 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={reviewTitle}
                                    onChange={(e) =>
                                        setReviewTitle(e.target.value)
                                    }
                                    onClick={() => {
                                        if (!isAuthenticated) {
                                            onLoginRequired?.();
                                        }
                                    }}
                                    className="rounded-lg w-full px-3 py-2 bg-white border border-gray-200 placeholder:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    placeholder={isAuthenticated ? "Title of your review" : "Please log in to write a review"}
                                    maxLength={100}
                                />
                            </div>
                            <div className="mb-5">
                                <label className="block text-xs text-gray-500 mb-2">
                                    Review
                                </label>
                                <input
                                    type="text"
                                    value={reviewText}
                                    onChange={(e) =>
                                        setReviewText(e.target.value)
                                    }
                                    onClick={() => {
                                        if (!isAuthenticated) {
                                            onLoginRequired?.();
                                        }
                                    }}
                                    className="rounded-lg w-full px-3 py-2 bg-white border border-gray-200 placeholder:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    placeholder={isAuthenticated ? "Share your thoughts about the app" : "Please log in to write a review"}
                                    maxLength={100}
                                />
                            </div>
                            <div className="flex justify-end mt-2">
                                <AppActionButton
                                    onClick={handleSubmitReview}
                                    disabled={isSubmitting || rating === 0}
                                    className="text-sm !px-6"
                                >
                                    {isSubmitting
                                        ? "Submitting..."
                                        : "Submit Review"}
                                </AppActionButton>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <Popup
                isOpen={showSuccessPopup}
                onClose={() => {
                    setShowSuccessPopup(false);
                    window.location.reload();
                }}
                title="Review Submitted"
            >
                <div className="text-center">
                    <p className="mb-6 text-gray-600">
                        Thank you for your feedback! Your review has been submitted successfully.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => {
                                setShowSuccessPopup(false);
                                window.location.reload();
                            }}
                            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Popup>
        </div>
    );
}
