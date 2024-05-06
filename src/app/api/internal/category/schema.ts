/**
 * When run `npm run build` Next js check for Linting and checking validity of types.
 * it requires us to write zod schema in separate file like this.
 */

import { z } from "zod";

export const createCategoryFormSchema = z.object({
    name: z.string().min(1, {
        message: "Category name is required",
    }).max(50, {
        message: "Category name must be less than or equal to 50 characters",
    }),
    description: z.string().max(255, {
        message: "Description must be less than or equal to 255 characters",
    }),
});

export const deleteCategoryFormSchema = z.object({
    categoryId: z
        .number({
            required_error: "Category id is required",
        })
        .positive({
            message: "Category id must be positive",
        }),
});

export const editCategoryFormSchema = z.object({
    name: z.string().min(1, {
        message: "Category name is required",
    }).max(50, {
        message: "Category name must be less than or equal to 50 characters",
    }),
    description: z.string().max(255, {
        message: "Description must be less than or equal to 255 characters",
    }),
    categoryId: z
        .number({
            required_error: "Category id is required",
        })
        .positive({
            message: "Category id must be positive",
        }),
});