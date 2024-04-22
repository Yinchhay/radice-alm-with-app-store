/**
 * When run `npm run build` Next js check for Linting and checking validity of types.
 * it requires us to write zod schema in separate file like this.
 */

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

export const editRoleFormSchema = z.object({
    name: z.string().min(1, {
        message: "Role name is required",
    }),
    roleId: z
        .number({
            required_error: "Role id is required",
        })
        .positive({
            message: "Role id must be positive",
        }),
});

export const addUserToRoleFormSchema = z.object({
    userId: z.string().min(1, {
        message: "A user is required",
    }),
});