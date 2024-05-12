import { z } from "zod";

export const createProjectFormSchema = z.object({
    name: z
        .string()
        .min(1, {
            message: "Project name is required",
        })
        .max(50, {
            message: "Project name must be less than or equal to 50 characters",
        }),
    userId: z.string().min(1, {
        message: "User id is required",
    }),
});

export const getAssociatedProjectFormSchema = z.object({
    userId: z.string().min(1, {
        message: "User id is required",
    }),
});