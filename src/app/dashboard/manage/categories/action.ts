"use server";
import { z } from "zod";
import {
    createCategoryFormSchema,
    deleteCategoryFormSchema,
    editCategoryFormSchema,
} from "./page";
import {
    ActionResult,
    formatZodError,
    generateAndFormatZodError,
} from "@/lib/form";
import {
    GetCategories_C_Tag,
    createCategory,
    deleteCategoryById,
    editCategory,
} from "@/repositories/category";
import { ErrorMessage } from "@/types/error";
import { localDebug } from "@/lib/utils";
import { MysqlErrorCodes } from "@/types/db";
import { hasPermission } from "@/lib/IAM";
import { getAuthUser } from "@/auth/lucia";
import { Permissions } from "@/types/IAM";
import { revalidateTags } from "@/lib/serverUtils";

export async function createCategoryAction(
    prevState: any,
    formData: FormData,
): Promise<ActionResult<z.infer<typeof createCategoryFormSchema>>> {
    try {
        const requiredPermission = new Set([Permissions.CREATE_CATEGORIES]);
        const user = await getAuthUser();
        if (!user) {
            return {
                errors: generateAndFormatZodError(
                    "unknown",
                    ErrorMessage.UserUnauthenticated,
                ),
            };
        }

        const userPermission = await hasPermission(user.id, requiredPermission);
        if (!userPermission.canAccess) {
            return {
                errors: generateAndFormatZodError(
                    "unknown",
                    ErrorMessage.NoPermissionToPerformThisAction,
                ),
            };
        }

        const data: z.infer<typeof createCategoryFormSchema> = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
        };

        const validationResult = createCategoryFormSchema.safeParse(data);
        if (!validationResult.success) {
            return {
                errors: formatZodError(validationResult.error),
            };
        }

        await createCategory(data);
        revalidateTags<GetCategories_C_Tag>("getCategories_C");

        return {
            errors: null,
        };
    } catch (error: any) {
        localDebug(error.message, "createCategoryAction");

        if (error.code === MysqlErrorCodes.ER_DUP_ENTRY) {
            return {
                errors: generateAndFormatZodError(
                    "name",
                    // remember try to make message clear, in this case only name has unique constraint
                    "Category name already exists",
                ),
            };
        }

        return {
            errors: generateAndFormatZodError(
                "unknown",
                ErrorMessage.SomethingWentWrong,
            ),
        };
    }
}

export async function editCategoryAction(
    categoryId: number,
    prevState: any,
    formData: FormData,
): Promise<ActionResult<z.infer<typeof editCategoryFormSchema>>> {
    try {
        const requiredPermission = new Set([Permissions.EDIT_CATEGORIES]);
        const user = await getAuthUser();
        if (!user) {
            return {
                errors: generateAndFormatZodError(
                    "unknown",
                    ErrorMessage.UserUnauthenticated,
                ),
            };
        }

        const userPermission = await hasPermission(user.id, requiredPermission);
        if (!userPermission.canAccess) {
            return {
                errors: generateAndFormatZodError(
                    "unknown",
                    ErrorMessage.NoPermissionToPerformThisAction,
                ),
            };
        }

        const data: z.infer<typeof editCategoryFormSchema> = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            categoryId: categoryId,
        };

        const validationResult = editCategoryFormSchema.safeParse(data);
        if (!validationResult.success) {
            return {
                errors: formatZodError(validationResult.error),
            };
        }

        await editCategory(categoryId, data);
        revalidateTags<GetCategories_C_Tag>("getCategories_C");

        return {
            errors: null,
        };
    } catch (error: any) {
        localDebug(error.message, "editCategoryAction");
        if (error.code === MysqlErrorCodes.ER_DUP_ENTRY) {
            return {
                errors: generateAndFormatZodError(
                    "name",
                    // remember try to make message clear, in this case only name has unique constraint
                    "Category name already exists",
                ),
            };
        }

        return {
            errors: generateAndFormatZodError(
                "unknown",
                ErrorMessage.SomethingWentWrong,
            ),
        };
    }
}

export async function deleteCategoryAction(
    categoryId: number,
    prevState: any,
    formData: FormData,
): Promise<ActionResult<z.infer<typeof deleteCategoryFormSchema>>> {
    try {
        const requiredPermission = new Set([Permissions.DELETE_CATEGORIES]);
        const user = await getAuthUser();
        if (!user) {
            return {
                errors: generateAndFormatZodError(
                    "unknown",
                    ErrorMessage.UserUnauthenticated,
                ),
            };
        }

        const userPermission = await hasPermission(user.id, requiredPermission);
        if (!userPermission.canAccess) {
            return {
                errors: generateAndFormatZodError(
                    "unknown",
                    ErrorMessage.NoPermissionToPerformThisAction,
                ),
            };
        }

        const data: z.infer<typeof deleteCategoryFormSchema> = {
            categoryId: categoryId,
        };

        const validationResult = deleteCategoryFormSchema.safeParse(data);
        if (!validationResult.success) {
            return {
                errors: formatZodError(validationResult.error),
            };
        }

        await deleteCategoryById(data.categoryId);
        revalidateTags<GetCategories_C_Tag>("getCategories_C");

        return {
            errors: null,
        };
    } catch (error) {
        return {
            errors: generateAndFormatZodError(
                "unknown",
                ErrorMessage.SomethingWentWrong,
            ),
        };
    }
}
