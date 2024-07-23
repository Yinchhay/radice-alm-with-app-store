/**
 * When run `npm run build` Next js check for Linting and checking validity of types.
 * it requires us to write zod schema in separate file like this.
 */

import { z } from "zod";

export const createUserFormSchema = z.object({
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
            message: "Email address is invalid",
        }),
    password: z
        .string()
        .trim()
        .min(8, {
            message: "Password must be at least 8 characters long",
        })
        .max(255, {
            message: "Password must be less than 255 characters",
        }),
});

export const deleteUserFormSchema = z.object({
    userId: z.string().trim().min(1, {
        message: "Error User ID",
    }),
});
