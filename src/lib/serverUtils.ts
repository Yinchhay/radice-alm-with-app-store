import { headers } from "next/headers";

export const getBaseUrl = (): string => {
    return headers().get("x-forwarded-host") || "";
};