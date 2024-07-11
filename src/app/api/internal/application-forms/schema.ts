import { z } from "zod";

export const rejectFormApplicationSchema = z.object({
    reason: z
        .string()
        .trim()
        .max(2083, {
            message: "Reason must be less than or equal to 2083 characters",
        })
        .optional(),
});