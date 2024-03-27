"use server";
import { lucia } from "@/auth/lucia";
import {
    ActionResult,
    formatZodError,
    generateAndFormatZodError,
} from "@/lib/form";
import {
    GetUserRolesAndRolePermissions_C_Tag,
    getUserByEmail,
} from "@/repositories/users";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { loginFormSchema } from "./schema";
import { z } from "zod";
import { ErrorMessage } from "@/types/error";
import { localDebug } from "@/lib/utils";
import { revalidateTags } from "@/lib/server_utils";
import { redirect } from "next/navigation";

export async function loginAction(
    prevState: any,
    formData: FormData,
): Promise<ActionResult<z.infer<typeof loginFormSchema>>> {
    "use server";
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
        revalidateTags<GetUserRolesAndRolePermissions_C_Tag>(
            `getUserRolesAndRolePermissions_C:${userExists.id}`,
        );
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

    // redirect should be called outside of try catch block because next js will throw
    // error for next js to handle itself
    // ref: https://www.youtube.com/watch?v=53slouncImA
    redirect("/dashboard/manage/associated-project");
}
