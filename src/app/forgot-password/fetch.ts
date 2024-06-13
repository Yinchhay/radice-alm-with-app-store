"use server";

import { z } from "zod";
import {
    forgotPasswordSchema,
    verifyForgotPasswordCodeSchema,
} from "../api/forgot-password/schema";
import { fetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import { FetchForgotPasswordSendEmail } from "../api/forgot-password/route";
import { getBaseUrl } from "@/lib/server_utils";
import { FetchVerifyForgotPasswordCodeData } from "../api/forgot-password/verify-code/route";

export async function fetchForgotPasswordSendEmail(
    body: z.infer<typeof forgotPasswordSchema>,
): ResponseJson<FetchForgotPasswordSendEmail> {
    try {
        const response = await fetch(
            `${await getBaseUrl()}/api/forgot-password`,
            {
                method: "POST",
                body: JSON.stringify(body),
            },
        );

        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}

export async function fetchVerifyForgotPasswordCode(
    body: z.infer<typeof verifyForgotPasswordCodeSchema>,
): ResponseJson<FetchVerifyForgotPasswordCodeData> {
    try {
        const response = await fetch(
            `${await getBaseUrl()}/api/forgot-password/verify-code`,
            {
                method: "PATCH",
                body: JSON.stringify(body),
            },
        );

        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}