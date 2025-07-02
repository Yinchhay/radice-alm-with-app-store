import { z } from "zod";

// ============================================================================
// AUTHENTICATION SCHEMAS
// ============================================================================

/**
 * Tester registration schema
 */
export const testerRegistrationSchema = z.object({
    firstName: z
        .string()
        .min(1, "First name is required")
        .max(50, "First name must be 50 characters or less")
        .trim(),
    lastName: z
        .string()
        .min(1, "Last name is required")
        .max(50, "Last name must be 50 characters or less")
        .trim(),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address")
        .max(255, "Email must be 255 characters or less")
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(255, "Password must be 255 characters or less")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one lowercase letter, one uppercase letter, and one number"
        ),
    confirmPassword: z.string(),
    phoneNumber: z
        .string()
        .max(30, "Phone number must be 30 characters or less")
        .optional()
        .or(z.literal("")),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

/**
 * Tester login schema
 */
export const testerLoginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address")
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(1, "Password is required"),
});

/**
 * Tester password reset request schema
 */
export const testerPasswordResetRequestSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address")
        .toLowerCase()
        .trim(),
});

/**
 * Tester password reset schema
 */
export const testerPasswordResetSchema = z.object({
    token: z.string().min(1, "Reset token is required"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(255, "Password must be 255 characters or less")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one lowercase letter, one uppercase letter, and one number"
        ),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

/**
 * Tester password change schema (for logged-in users)
 */
export const testerPasswordChangeSchema = z.object({
    currentPassword: z
        .string()
        .min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(255, "Password must be 255 characters or less")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one lowercase letter, one uppercase letter, and one number"
        ),
    confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
});

// ============================================================================
// PROFILE MANAGEMENT SCHEMAS
// ============================================================================

/**
 * Tester profile update schema
 */
export const testerProfileUpdateSchema = z.object({
    firstName: z
        .string()
        .min(1, "First name is required")
        .max(50, "First name must be 50 characters or less")
        .trim(),
    lastName: z
        .string()
        .min(1, "Last name is required")
        .max(50, "Last name must be 50 characters or less")
        .trim(),
    phoneNumber: z
        .string()
        .max(30, "Phone number must be 30 characters or less")
        .optional()
        .or(z.literal(""))
        .transform(val => val === "" ? null : val),
    profileUrl: z
        .string()
        .url("Please enter a valid URL")
        .max(255, "Profile URL must be 255 characters or less")
        .optional()
        .or(z.literal(""))
        .transform(val => val === "" ? null : val),
    description: z
        .string()
        .max(500, "Description must be 500 characters or less")
        .optional()
        .or(z.literal(""))
        .transform(val => val === "" ? null : val),
});

/**
 * Tester email update schema
 */
export const testerEmailUpdateSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address")
        .max(255, "Email must be 255 characters or less")
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(1, "Password is required to change email"),
});

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Tester search schema
 */
export const testerSearchSchema = z.object({
    search: z.string().optional().default(""),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type TesterRegistrationInput = z.infer<typeof testerRegistrationSchema>;
export type TesterLoginInput = z.infer<typeof testerLoginSchema>;
export type TesterPasswordResetRequestInput = z.infer<typeof testerPasswordResetRequestSchema>;
export type TesterPasswordResetInput = z.infer<typeof testerPasswordResetSchema>;
export type TesterPasswordChangeInput = z.infer<typeof testerPasswordChangeSchema>;
export type TesterProfileUpdateInput = z.infer<typeof testerProfileUpdateSchema>;
export type TesterEmailUpdateInput = z.infer<typeof testerEmailUpdateSchema>;
export type TesterSearchInput = z.infer<typeof testerSearchSchema>;