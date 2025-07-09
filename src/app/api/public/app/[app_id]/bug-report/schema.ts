import { z } from "zod";

export const createBugReportFormSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, {
            message: "Bug report title is required",
        })
        .max(100, {
            message: "Bug report title must be less than or equal to 100 characters"
        }),
    description: z
        .string()
        .trim()
        .min(1, {
            message: "Bug report description is required"
        }),
    image: z.string().url().max(500).optional(),
    video: z.string().url().max(500).optional(),
    testerId: z.string().trim().min(1, {
        message: "Tester id is required",
    }),
    appId: z.number().int().min(1, {
        message: "App id is required",
    }),
});