import { z } from "zod";
import { imageOnlyValidation } from "../project/[project_id]/schema";

export const createMediaSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, {
            message: "Media title is required",
        })
        .max(255, {
            message: "Media title must be less than or equal to 255 characters",
        }),
    description: z.string().trim().max(2083, {
        message: "Description must be less than or equal to 2083 characters",
    }),
    date: z.coerce.date(),
    images: z.array(imageOnlyValidation),
});

export const deleteMediaSchema = z.object({
    mediaId: z
        .number({
            required_error: "Media id is required",
        })
        .positive({
            message: "Media id must be positive",
        }),
});

export const editMediaSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, {
            message: "Media title is required",
        })
        .max(255, {
            message: "Media title must be less than or equal to 255 characters",
        }),
    description: z.string().trim().max(2083, {
        message: "Description must be less than or equal to 2083 characters",
    }),
    date: z.coerce.date(),
    mediaId: z
        .number({
            required_error: "Media id is required",
        })
        .positive({
            message: "Media id must be positive",
        }),
});
