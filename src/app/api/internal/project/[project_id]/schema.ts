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
