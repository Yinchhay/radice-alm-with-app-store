"use server";
import { z } from "zod";
import {
    createCategoryFormSchema,
    deleteCategoryFormSchema,
    editCategoryFormSchema,
} from "./schema";
import { actionErrorSomethingWentWrong, ActionResult } from "@/lib/form";
import { GetCategories_C_Tag } from "@/repositories/category";
import { revalidateTags } from "@/lib/server_utils";
import {
    fetchCreateCategory,
    fetchDeleteCategoryById,
    fetchEditCategoryById,
} from "./fetch";

export async function createCategoryAction(
    prevState: any,
    formData: FormData,
): Promise<ActionResult<z.infer<typeof createCategoryFormSchema>>> {
    try {
        const body: z.infer<typeof createCategoryFormSchema> = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
        };
        const result = await fetchCreateCategory(body);
        if (!result.success) {
            return {
                errors: result.errors,
            };
        }

        // even though we invalidated the cache tag in api, however it will not update the ui
        // until we refresh the page. so we invalidate cache tag in server action to make ui change
        revalidateTags<GetCategories_C_Tag>("getCategories_C");
        return {
            errors: null,
        };
    } catch (error) {
        return actionErrorSomethingWentWrong<
            z.infer<typeof createCategoryFormSchema>
        >();
    }
}

export async function editCategoryAction(
    categoryId: number,
    prevState: any,
    formData: FormData,
): Promise<ActionResult<z.infer<typeof editCategoryFormSchema>>> {
    try {
        const body: z.infer<typeof editCategoryFormSchema> = {
            categoryId: categoryId,
            name: formData.get("name") as string,
            description: formData.get("description") as string,
        };
        const result = await fetchEditCategoryById(body);
        if (!result.success) {
            return {
                errors: result.errors,
            };
        }

        // even though we invalidated the cache tag in api, however it will not update the ui
        // until we refresh the page. so we invalidate cache tag in server action to make ui change
        revalidateTags<GetCategories_C_Tag>("getCategories_C");
        return {
            errors: null,
        };
    } catch (error) {
        return actionErrorSomethingWentWrong<
            z.infer<typeof editCategoryFormSchema>
        >();
    }
}

export async function deleteCategoryAction(
    categoryId: number,
    prevState: any,
    formData: FormData,
): Promise<ActionResult<z.infer<typeof deleteCategoryFormSchema>>> {
    try {
        const result = await fetchDeleteCategoryById(categoryId);
        if (!result.success) {
            return {
                errors: result.errors,
            };
        }

        // even though we invalidated the cache tag in api, however it will not update the ui
        // until we refresh the page. so we invalidate cache tag in server action to make ui change
        revalidateTags<GetCategories_C_Tag>("getCategories_C");
        return {
            errors: null,
        };
    } catch (error) {
        return actionErrorSomethingWentWrong<
            z.infer<typeof deleteCategoryFormSchema>
        >();
    }
}
