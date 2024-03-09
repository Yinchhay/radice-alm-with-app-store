"use server";
import { lucia } from "@/auth/lucia";
import { ActionResult, formatZodError, generateZodError } from "@/lib/form";
import { getUserByEmail } from "@/repositories/users";
import bcrypt from "bcrypt";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { T_LoginActionSchema, formDataSchema } from "./page";

export async function loginAction(
    prevState: any,
    formData: FormData,
): Promise<ActionResult<T_LoginActionSchema>> {
    "use server";
    const data: T_LoginActionSchema = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const validationResult = formDataSchema.safeParse(data);
    if (!validationResult.success) {
        return {
            errors: formatZodError(validationResult.error),
        };
    }

    const userExists = await getUserByEmail(data.email);
    if (!userExists) {
        return {
            // Make sure the error message is not too specific to avoid brute force attack
            errors: formatZodError(
                generateZodError("email", "Email or password is incorrect"),
            ),
        };
    }

    const validPassword = await bcrypt.compare(
        data.password,
        userExists.password,
    );
    if (!validPassword) {
        return {
            errors: formatZodError(
                generateZodError("email", "Email or password is incorrect"),
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
    revalidateTag("getUserRolesAndRolePermissions_C");

    return redirect("/dashboard");
}
