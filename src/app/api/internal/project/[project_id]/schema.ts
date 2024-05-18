import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/file";
import { z } from "zod";

export const getOneAssociatedProjectSchema = z.object({
    userId: z.string().min(1, {
        message: "User id is required",
    }),
    projectId: z.string().min(1, {
        message: "Project id is required",
    }),
});

export const editProjectContentSchema = z.object({
    userId: z.string().min(1, {
        message: "User id is required",
    }),
    projectId: z.string().min(1, {
        message: "Project id is required",
    }),
    chapters: z.string(),
});

export const editProjectSettingsDetail = z.object({
    userId: z.string().min(1, {
        message: "User id is required",
    }),
    projectName: z.string().max(50, {
        message: "Project name is too long, max 50 characters",
    }),
    projectDescription: z.string().max(255, {
        message: "Project description is too long, max 255 characters",
    }).optional(),
    projectId: z.string().min(1, {
        message: "Project id is required",
    }),
    logoUrl: z.string().max(2083, {
        message: "Logo url is too long, max 2083 characters",
    }).optional(),
    projectCategories: z.array(z.any()).optional(),
});

// Check allow image only
export const fileImageSchema = z.object({
    image: z
        .any()
        .refine(
            (file) => file?.size <= MAX_FILE_SIZE,
            `Max image size is ${MAX_FILE_SIZE}MB.`,
        )
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported.",
        ),
});
