"use server";
import { FetchChangePasswordData } from "@/app/api/internal/account/change-password/route";
import {
    changePasswordSchema,
    updateProfileInformationFormSchema,
} from "@/app/api/internal/account/schema";
import { FetchUpdateProfileInformation } from "@/app/api/internal/account/update-profile-information/route";
import { fetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import { getBaseUrl, getSessionCookie } from "@/lib/server_utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function fetchUpdateProfileInformation(
    body: z.infer<typeof updateProfileInformationFormSchema>,
    formData: FormData,
    pathname: string,
): ResponseJson<FetchUpdateProfileInformation> {
    try {
        // by default, profileLogo is already in the formData if it exists
        const logo = formData.get("profileLogo");
        if (logo instanceof File && logo.size === 0) {
            formData.delete("profileLogo");
        }

        formData.append("skillSet", JSON.stringify(body.skillSet));
        formData.append("firstName", body.firstName);
        formData.append("lastName", body.lastName);
        formData.append("description", body.description);
        formData.append(
            "currentProfileLogo",
            body.currentProfileLogo as string,
        );

        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/account/update-profile-information`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: formData,
            },
        );

        revalidatePath(pathname);
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function fetchChangePassword(
    body: z.infer<typeof changePasswordSchema>,
    pathname: string,
): ResponseJson<FetchChangePasswordData> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/account/change-password`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify(body),
            },
        );

        revalidatePath(pathname);
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}
