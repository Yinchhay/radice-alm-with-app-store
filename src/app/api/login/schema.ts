import { z } from "zod";

// TODO: in user story, password must contain at least 1 upper case.
// Write schema in server component then import to server action.
// if write in client nextjs will throw error
// 'safeParse()' doesn't work in server component'
export const loginCredentialSchema = z.object({
    email: z
        .string({
            required_error: "Email is required",
        })
        .trim()
        .min(1, {
            message: "Email is required",
        })
        .email({
            message: "Invalid email address",
        }),
    password: z
        .string({ required_error: "Password is required" })
        .trim()
        .min(8, {
            message: "Password must be at least 8 characters long",
        })
        .max(32, {
            message: "Password must be at most 32 characters long",
        }),
    captchaToken: z.string().trim().min(1, {
        message: "Please complete the captcha",
    }),
});
