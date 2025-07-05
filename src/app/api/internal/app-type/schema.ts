import { z } from "zod";


export const createAppTypeFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, {
            message: "App type name is required",
        })
        .max(50, {
            message:
                "App type name must be less than or equal to 50 characters",
        }),
    description: z.string().trim().max(255, {
        message: "Description must be less than or equal to 255 characters",
    }),
    isActive: z.boolean().optional().default(true),
});

export const editAppTypeFormSchema = z.object({
    name: z
        .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        })
        .trim()
        .min(1, { message: "Name must be at least 1 character long" })
        .max(100, { message: "Name must be less than or equal to 100 characters" }),
    
    description: z
        .string({
            required_error: "Description is required",
            invalid_type_error: "Description must be a string",
        })
        .trim()
        .max(500, { message: "Description must be less than or equal to 500 characters" })
        .optional(),
    
    isActive: z.boolean().optional()
});