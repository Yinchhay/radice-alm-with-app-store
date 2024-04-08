import {
    buildErrorResponse,
    buildSomethingWentWrongErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";

import { lucia, validateRequest } from "@/auth/lucia";
import { cookies } from "next/headers";
import { generateAndFormatZodError } from "@/lib/form";

export type FetchLogoutUser = Record<string, never>;

const successMessage = "Logout successfully";
const unsuccessMessage = "Logout failed";

/**
 * It's not necessary to send session via bearer token, we can check user's cookie
 */
export async function POST() {
    try {
        const { session } = await validateRequest();

        if (!session) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "No session to invalidate",
                ),
            );
        }

        await lucia.invalidateSession(session.id);

        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        );
        return buildSuccessResponse<FetchLogoutUser>(successMessage, {});
    } catch (error) {
        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}
