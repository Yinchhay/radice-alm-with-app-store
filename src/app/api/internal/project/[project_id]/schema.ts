import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/file";
import { z } from "zod";
import { fileAnySchema } from "../../file/schema";

export const getOneAssociatedProjectSchema = z.object({
    userId: z.string().trim().min(1, {
        message: "User id is required",
    }),
    projectId: z.string().trim().min(1, {
        message: "Project id is required",
    }),
});

export const editProjectContentSchema = z.object({
    userId: z.string().trim().min(1, {
        message: "User id is required",
    }),
    projectId: z.string().trim().min(1, {
        message: "Project id is required",
    }),
    chapters: z.string().trim(),
});

export const editProjectSettingsDetail = z.object({
    userId: z.string().trim().min(1, {
        message: "User id is required",
    }),
    projectName: z.string().trim().max(50, {
        message: "Project name is too long, max 50 characters",
    }),
    projectDescription: z
        .string()
        .trim()
        .max(255, {
            message: "Project description is too long, max 255 characters",
        })
        .optional(),
    logoUrl: z
        .string()
        .trim()
        .max(2083, {
            message: "Logo url is too long, max 2083 characters",
        })
        .optional(),
    projectCategories: z.array(z.any()).optional(),
});

export const editMemberArray = z
    .array(
        z.object({
            userId: z.string().trim().min(1, {
                message: "User id is required",
            }),
            title: z
                .string()
                .trim()
                .max(50, {
                    message: "Title is too long, max 50 characters",
                })
                .optional(),
            canEdit: z.boolean({
                required_error: "Can edit is required",
                invalid_type_error: "Can edit must be a boolean",
            }),
        }),
    )
    .optional();

export const editProjectSettingsMembers = z.object({
    membersToUpdate: editMemberArray,
    membersToDelete: z.array(z.string().trim()).optional(),
    membersToAdd: editMemberArray,
});

export const editPartnerArray = z.array(z.string().trim()).optional();
export const editProjectSettingsPartners = z.object({
    partnersToDelete: editPartnerArray,
    partnersToAdd: editPartnerArray,
});

// Check allow image only
export const imageOnlyValidation = z
    .any()
    .refine(
        (file) => file?.size <= MAX_FILE_SIZE,
        `Max image size is ${MAX_FILE_SIZE}MB.`,
    )
    .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported.",
    );
export const fileImageSchema = z.object({
    image: imageOnlyValidation,
});

export const editProjectSettingsFiles = z.object({
    fileToRemove: z.array(z.string().trim()).optional(),
    fileToUpload: fileAnySchema.optional(),
});

export const editProjectSettingsLinks = z.object({
    links: z.array(
        z.object({
            title: z.string().trim().min(1, {
                message: "Title is required",
            }),
            link: z
                .string()
                .trim()
                .min(1, {
                    message: "Link is required",
                })
                .url({
                    message: "Invalid URL",
                }),
        }),
    ),
});
