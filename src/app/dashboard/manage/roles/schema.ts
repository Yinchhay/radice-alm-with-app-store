import { z } from "zod";

export const createRoleFormSchema = z.object({
    name: z.string().min(1, {
        message: "Role name is required",
    }),
});

export const deleteRoleFormSchema = z.object({
    roleId: z
        .number({
            required_error: "Role id is required",
        })
        .positive({
            message: "Role id must be positive",
        }),
});