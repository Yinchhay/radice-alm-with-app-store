"use server";
/**
 * Note: server action must be async function
 */

import { cookies, headers } from "next/headers";
import { revalidateTag } from "next/cache";
import { lucia } from "@/auth/lucia";

export async function getBaseUrl(): Promise<string> {
    const protocol = headers().get("x-forwarded-proto") || "http";
    return `${protocol}://${headers().get("x-forwarded-host")}` || "";
}

export async function getFullUrl(): Promise<string> {
    return headers().get("referer") || "";
}

/**
 * custom revalidateTag because I want to have type for it
 * when passing generic to the function it will infer the type so that we can ensure that the tag
 * is valid, if the tag is not valid typescript will show an error
 * example usage: revalidateTag<Generic in /repositories>("getUserById_C:123")
 * using array of tags: revalidateTags<Generic in /repositories>("getUserById_C:123", "getUserById_C:124")
 */
export async function revalidateTags<T>(...tags: T[]): Promise<void> {
    for (const tag of tags) {
        revalidateTag(tag as string);
    }
}

export async function getSessionCookie(): Promise<string | null> {
    return cookies().get(lucia.sessionCookieName)?.value ?? null;
}