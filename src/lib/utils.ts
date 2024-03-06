// this utils file is server side only

import { NextRequest } from "next/server";
import { headers } from "next/headers";

export const getBaseUrl = () => {
    const headersList = headers();
    const domain = headersList.get("x-forwarded-host") || "";
    // const protocol = headersList.get("x-forwarded-proto") || ""
    // const pathname = headersList.get("x-invoke-path") || ""
    return domain;
};
