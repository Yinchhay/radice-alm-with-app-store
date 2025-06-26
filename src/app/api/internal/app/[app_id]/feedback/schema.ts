import App from "next/app";
import { z } from "zod";

export const createFeedbackFormSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, {
            message: "Feedback title is required",
        })
        .max(50, {
            message:
                "Feedback title must be less than or equal to 50 characters",
        }),
    review: z
        .string()
        .trim()
        .min(1, {
            message: "Review is required",
        })
        .max(300, {
            message: "Review must be less than or equal to 300 characters",
        }),
    star_rating: z.enum(["1", "2", "3", "4", "5"], {
        errorMap: () => ({ message: "Rating must be between 1 and 5" }),
    }),
    userId: z.string().trim().min(1, {
        message: "User id is required",
    }),
    appId: z.number().int().min(1, {
        message: "App id is required",
    }),
});

export const getAssociatedFeedbackFormSchema = z.object({
    userId: z.string().trim().min(1, {
        message: "User id is required",
    }),
});

export const deleteFeedbackSchema = z.object({
    feedbackId: z
        .number({
            required_error: "Feedback id is required",
        })
        .positive({
            message: "Feedback id must be positive",
        }),
});