"use server";
import { z } from "zod";
import { loginCredentialSchema } from "../api/login/schema";
import { FetchLoginCredential } from "../api/login/route";
import { fetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import { getBaseUrl } from "@/lib/server_utils";
import { lucia } from "@/auth/lucia";
import { cookies } from "next/headers";

// mark as use server to hide api end point
export async function fetchLoginCredential(
    body: z.infer<typeof loginCredentialSchema>,
): ResponseJson<FetchLoginCredential> {
    try {
        const response = await fetch(`${await getBaseUrl()}/api/login`, {
            method: "POST",
            body: JSON.stringify(body),
        });

        const result: Awaited<ResponseJson<FetchLoginCredential>> =
            await response.json();
        if (result.success) {
            // manually set cookie in server action because using 'use server', make set-cookie not automatically set cookie in browser for us.
            const sessionCookie = lucia.createSessionCookie(
                result.data.sessionId,
            );
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes,
            );
        }

        return result;
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}
