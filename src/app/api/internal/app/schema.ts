import { z } from "zod";

// Helper function to handle optional strings (including empty strings)
const optionalString = (maxLength?: number) => {
    let schema = z.string().trim();
    
    if (maxLength) {
        schema = schema.max(maxLength, {
            message: `Must be less than or equal to ${maxLength} characters`,
        });
    }
    
    return schema
        .optional()
        .transform((val) => {
            // Convert empty strings to null for database
            return val === "" || val === undefined ? null : val;
        });
};

// Helper function for optional URL strings
const optionalUrlString = (maxLength: number = 500) => {
    return z
        .string()
        .trim()
        .optional()
        .transform((val) => {
            // Convert empty strings to null
            return val === "" || val === undefined ? null : val;
        })
        .refine(
            (val) => val === null || z.string().url().safeParse(val).success,
            {
                message: "Invalid URL format",
            }
        )
        .refine(
            (val) => val === null || val.length <= maxLength,
            {
                message: `URL must be less than or equal to ${maxLength} characters`,
            }
        );
};

export const editAppFormSchema = z.object({
    subtitle: optionalString(255),
    
    type: z
        .number({
            invalid_type_error: "App type must be a number",
        })
        .optional(),
    
    aboutDesc: optionalString(1000),
    
    content: optionalString(),
    
    webUrl: optionalUrlString(500),
    
    appFile: optionalString(500),
    
    status: z
        .enum(["pending", "approved", "rejected", "draft"])
        .optional(),
    
    cardImage: optionalString(500),
    
    bannerImage: optionalString(500),
    
    featuredPriority: z
        .number({
            invalid_type_error: "Featured priority must be a number",
        })
        .optional(),
    
    updateType: z.enum(["major", "minor", "patch"]).optional(),
});