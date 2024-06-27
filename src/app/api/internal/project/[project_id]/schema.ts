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
        .max(400, {
            message: "Project description is too long, max 400 characters",
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
        "Only .jpg, .jpeg, .png and .webp formats are allowed.",
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
                    message: "URL is invalid",
                }),
        }),
    ),
});

export const projectPipeLineStatusType = z.object({
    requirements: z.boolean({
        required_error: "Requirements is required",
        invalid_type_error: "Requirements must be a boolean",
    }),
    definition: z.boolean({
        required_error: "Definition is required",
        invalid_type_error: "Definition must be a boolean",
    }),
    analysis: z.boolean({
        required_error: "Analysis is required",
        invalid_type_error: "Analysis must be a boolean",
    }),
    approved: z.boolean({
        required_error: "Approved is required",
        invalid_type_error: "Approved must be a boolean",
    }),
    chartered: z.boolean({
        required_error: "Chartered is required",
        invalid_type_error: "Chartered must be a boolean",
    }),
    design: z.boolean({
        required_error: "Design is required",
        invalid_type_error: "Design must be a boolean",
    }),
    development: z.boolean({
        required_error: "Development is required",
        invalid_type_error: "Development must be a boolean",
    }),
    build: z.boolean({
        required_error: "Build is required",
        invalid_type_error: "Build must be a boolean",
    }),
    test: z.boolean({
        required_error: "Test is required",
        invalid_type_error: "Test must be a boolean",
    }),
    release: z.boolean({
        required_error: "Release is required",
        invalid_type_error: "Release must be a boolean",
    }),
    live: z.boolean({
        required_error: "Live is required",
        invalid_type_error: "Live must be a boolean",
    }),
    retiring: z.boolean({
        required_error: "Retiring is required",
        invalid_type_error: "Retiring must be a boolean",
    }),
    retired: z.boolean({
        required_error: "Retired is required",
        invalid_type_error: "Retired must be a boolean",
    }),
});
export const editProjectSettingsPipelines = z.object({
    pipelineStatus: projectPipeLineStatusType,
});

export const transferProjectOwnershipSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, {
            message: "Transfer to user email is required",
        })
        .email({
            message: "Invalid email format",
        }),
});

export const updateProjectPublicStatusSchema = z.object({
    status: z.boolean({
        required_error: "Status is required",
        invalid_type_error: "Status must be a boolean",
    }),
});
