import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildSomethingWentWrongErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";

import { lucia, validateRequest } from "@/auth/lucia";
import { cookies, headers } from "next/headers";

export type FetchLogoutUser = Record<string, never>;

const successMessage = "Logout successfully";
const unsuccessMessage = "Logout failed";

export async function POST() {
    try {
        const validationResponse = await validateRequest();

        const { session } = validationResponse;
        if (!session) {
            return buildNoBearerTokenErrorResponse();
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
        console.error(error); // Log the error for debugging
        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}