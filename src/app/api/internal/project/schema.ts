import { z } from "zod";

export const createProjectFormSchema = z.object({
    name: z.string().min(1, {
        message: "Project name is required",
    }),
    userId: z.string().min(1, {
        message: "User id is required",
    }),
});
