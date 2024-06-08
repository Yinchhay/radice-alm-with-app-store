"use server";

import { FetchPublicProjectsByIdData } from "@/app/api/public/members/[member_id]/projects/route";
import { FetchPublicMemberByIdData } from "@/app/api/public/members/[member_id]/route";
import { db } from "@/drizzle/db";
import { ResponseJson, fetchErrorSomethingWentWrong } from "@/lib/response";
import { getBaseUrl } from "@/lib/server_utils";
import { UserType } from "@/types/user";

// TODO: Missing isPublic
export async function getPublicMemberById(
    memberId: string,
): ResponseJson<FetchPublicMemberByIdData> {
    try {
        const response = await fetch(
            `${await getBaseUrl()}/api/public/members/${memberId}`,
            {
                method: "GET",
                cache: "no-cache",
            },
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}
export async function getPublicProjectByMemberId(
    memberId: string,
): ResponseJson<FetchPublicProjectsByIdData> {
    try {
        const response = await fetch(
            `${await getBaseUrl()}/api/public/members/${memberId}/projects`,
            {
                method: "GET",
                cache: "no-cache",
            },
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function getGithubProfileURL(githubID: string) {
    try {
        const response = await fetch(
            `https://api.github.com/user/${githubID}`,
            {
                method: "GET",
                cache: "no-cache",
            },
        );
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}
