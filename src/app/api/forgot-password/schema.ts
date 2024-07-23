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
            message: "Email address is invalid",
        }),
    captchaToken: z.string().trim().min(1, {
        message: "Please complete the captcha",
    }),
});

export const verifyForgotPasswordCodeSchema = z
    .object({
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
                message: "Email address is invalid",
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
        newConfirmPassword: z
            .string()
            .trim()
            .min(8, {
                message:
                    "Confirm new password must be at least 8 characters long",
            })
            .max(255, {
                message:
                    "Confirm new password must be less than 255 characters",
            }),
        captchaToken: z.string().trim().min(1, {
            message: "Please complete the captcha",
        }),
    })
    .refine((value) => value.newPassword === value.newConfirmPassword, {
        message: "New password and confirm new password does not match",
        path: ["newConfirmPassword"],
    });
