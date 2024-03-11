"use server";
import { lucia } from "@/auth/lucia";
import {
    ActionResult,
    formatZodError,
    generateAndFormatZodError,
} from "@/lib/form";
import { getUserByEmail } from "@/repositories/users";
import bcrypt from "bcrypt";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginFormSchema } from "./page";
import { z } from "zod";
import { ErrorMessage } from "@/types/error";
import { localDebug } from "@/lib/utils";

export async function loginAction(
    prevState: any,
    formData: FormData,
): Promise<ActionResult<z.infer<typeof loginFormSchema>>> {
    try {
        const data: z.infer<typeof loginFormSchema> = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        };

        const validationResult = loginFormSchema.safeParse(data);
        if (!validationResult.success) {
            return {
                errors: formatZodError(validationResult.error),
            };
        }

        const userExists = await getUserByEmail(data.email);
        if (!userExists) {
            return {
                // Make sure the error message is not too specific to avoid brute force attack
                errors: generateAndFormatZodError(
                    "email",
                    "Email or password is incorrect",
                ),
            };
        }

        const validPassword = await bcrypt.compare(
            data.password,
            userExists.password,
        );
        if (!validPassword) {
            return {
                errors: generateAndFormatZodError(
                    "email",
                    "Email or password is incorrect",
                ),
            };
        }

        const session = await lucia.createSession(userExists.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        );

        // invalidate permission cache
        // this invalidate apply to all users in system
        revalidateTag("getUserRolesAndRolePermissions_C");

        return redirect("dashboard/manage/associated-project");
    } catch (error: any) {
        localDebug(error.message, "loginAction");

        /**
         *  if some unknown error that we didn't or forgot to handle, it's best to not show the
         *  actual error message to the user
         */
        return {
            errors: generateAndFormatZodError(
                "unknown",
                ErrorMessage.SomethingWentWrong,
            ),
        };
    }
}
