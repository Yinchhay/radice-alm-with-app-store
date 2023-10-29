import exp from "constants";
import { headers } from "next/headers";

export const serverUrlPath = (path: string) => {
    const host = headers().get("host");
    const protocol = process?.env.NODE_ENV === "development" ? "http" : "https"

    return `${protocol}://${host}${path}`;
}