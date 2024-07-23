/**
 * When run `npm run build` Next js check for Linting and checking validity of types.
 * it requires us to write zod schema in separate file like this.
 */

import { permissions, users } from "@/drizzle/schema";
import { z } from "zod";

export const createRoleFormSchema = z.object({
    name: z.string().trim().min(1, {
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

export const addUserToRoleFormSchema = z.object({
    userId: z.string().trim().min(1, {
        message: "A user is required",
    }),
});

export const editRoleByIdSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, {
            message: "Role name is required",
        })
        .max(50, {
            message: "Role name must not exceed 50 characters",
        }),
    userIds: z.array(z.string().trim().optional()),
    permissionIds: z.array(z.number()),
    roleId: z
        .number({
            required_error: "Role id is required",
        })
        .positive({
            message: "Role id must be positive",
        }),
});
