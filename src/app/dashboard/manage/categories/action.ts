"use server";
import { z } from "zod";
import { createCategoryFormSchema } from "./page";
import { ActionResult, formatZodError, generateZodError } from "@/lib/form";
import { createCategory } from "@/repositories/category";
import { ErrorMessage } from "@/types/error";
import { localDebug } from "@/lib/utils";

export async function createCategoryAction(
    prevState: any,
    formData: FormData,
): Promise<ActionResult<z.infer<typeof createCategoryFormSchema>>> {
    try {
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

        const categoryCreated = await createCategory(data);
        // TODO: add create category fail

        return {
            errors: null,
        };
    } catch (error: any) {
        localDebug(error.message, "createCategoryAction");
        return {
            errors: formatZodError(
                generateZodError("unknown", ErrorMessage.SomethingWentWrong),
            ),
        };
    }
}
