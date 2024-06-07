import { z } from "zod";

export const forgotPasswordSchema = z.object({
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
});

export const verifyForgotPasswordCodeSchema = z.object({
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
    code: z
        .string()
        .trim()
        .min(8, {
            message: "Verification code must be 8 characters",
        })
        .max(8, {
            message: "Verification code must be 8 characters",
        }),
    newPassword: z
        .string()
        .trim()
        .min(8, {
            message: "Password must be at least 8 characters",
        })
        .max(255, {
            message: "Password must be less than 255 characters",
        }),
});
