/**
 * When run `npm run build` Next js check for Linting and checking validity of types.
 * it requires us to write zod schema in separate file like this.
 */

import { z } from "zod";

export const createUserFormSchema = z.object({
    firstName: z.string().trim().min(1, {
        message: "First name is required",
    }),
    lastName: z.string().trim().min(1, {
        message: "Last name is required",
    }),
    email: z.string().trim().min(1, {
        message: "Email is required",
    }),
    password: z.string().trim().min(1, {
        message: "Error generating password",
    }),
});

export const deleteUserFormSchema = z.object({
    userId: z.string().trim().min(1, {
        message: "Error User ID",
    }),
});