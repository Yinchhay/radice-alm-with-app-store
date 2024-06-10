import { ACCEPTED_CV_TYPES, CV_MAX_FILE_SIZE } from "@/lib/file";
import { z } from "zod";

export const cvValidation = z
    .any()
    .refine(
        (file) => file?.size <= CV_MAX_FILE_SIZE,
        `Max image size is ${CV_MAX_FILE_SIZE}MB.`,
    )
    .refine(
        (file) => ACCEPTED_CV_TYPES.includes(file?.type),
        "Only .pdf and .doc formats are allowed.",
    );

export const cvFileSchema = z.object({
    cv: cvValidation,
});

export const createApplicationFormSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, {
            message: "First name is required",
        })
        .max(50, {
            message: "First name is must be less than 50 characters",
        }),
    lastName: z
        .string()
        .trim()
        .min(1, {
            message: "Last name is required",
        })
        .max(50, {
            message: "Last name is must be less than 50 characters",
        }),
    email: z
        .string()
        .trim()
        .min(1, {
            message: "Email is required",
        })
        .max(255, {
            message: "Email must be less than 255 characters",
        })
        .email({
            message: "Invalid email address",
        }),
    reason: z
        .string()
        .trim()
        .min(1, {
            message: "Reason is required",
        })
        .max(5000, {
            message: "Reason is must be less than 5000 characters",
        }),
    cv: z.string().trim().max(2083, {
        message: "Cv is too long, max 2083 characters",
    }),
    captchaToken: z.string().trim().min(1, {
        message: "Please complete the captcha",
    }),
});
