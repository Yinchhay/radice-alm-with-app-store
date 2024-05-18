import { z } from "zod";

export const createPartnerFormSchema = z.object({
    firstName: z
        .string()
        .min(1, {
            message: "First name is required",
        })
        .max(50, {
            message: "First name is must be less than 50 characters",
        }),
    lastName: z
        .string()
        .min(1, {
            message: "Last name is required",
        })
        .max(50, {
            message: "Last name is must be less than 50 characters",
        }),
    email: z
        .string()
        .min(1, {
            message: "Email is required",
        })
        .max(255, {
            message: "Email is must be less than 255 characters",
        })
        .email({
            message: "Invalid email address",
        }),
    password: z
        .string()
        .min(1, {
            message: "Password is required",
        })
        .max(255, {
            message: "Password is must be less than 255 characters",
        }),
});

export const deletePartnerFormSchema = z.object({
    partnerId: z.string().min(1, {
        message: "Partner id is required",
    }),
});
