import { z } from "zod";
import { loginCredentialSchema } from "./schema";
import {
    buildErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { HttpStatusCode } from "@/types/http";
import {
    getUserByEmail,
    GetUserRolesAndRolePermissions_C_Tag,
} from "@/repositories/users";
import bcrypt from "bcrypt";
import { lucia } from "@/auth/lucia";
import { cookies } from "next/headers";
import { revalidateTags } from "@/lib/server_utils";

export type FetchLoginCredential = {
    sessionId: string
};

const successMessage = "Login by credential successfully";
const unsuccessMessage = "Login by credential failed";

export async function POST(request: Request, response: Response) {
    try {
        const body: z.infer<typeof loginCredentialSchema> =
            await request.json();

        const validationResult = loginCredentialSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const userExists = await getUserByEmail(body.email);
        if (!userExists) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "email",
                    "Email or password is incorrect",
                ),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        const validPassword = await bcrypt.compare(
            body.password,
            userExists.password,
        );
        if (!validPassword) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "email",
                    "Email or password is incorrect",
                ),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        const session = await lucia.createSession(userExists.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        );

        // invalidate permission cache
        // this invalidate apply to current user only
        await revalidateTags<GetUserRolesAndRolePermissions_C_Tag>(
            `getUserRolesAndRolePermissions_C:${userExists.id}`,
        );

        return buildSuccessResponse<FetchLoginCredential>(successMessage, {
            sessionId: session.id,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
