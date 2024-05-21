import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readBearerToken } from "./lib/utils";
import { buildNoBearerTokenErrorResponse } from "./lib/response";

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // if (process.env.NODE_ENV !== "development") {
    //     // experiment route will be disabled in production
    //     const prodRestrictedRoutes = [
    //         "/api",
    //         "/dashboard",
    //         "/link_oauth",
    //         "/login",
    //         "/ui",
    //         "/test",
    //         "/animations",
    //     ];
    //     if (
    //         prodRestrictedRoutes.some((restrictedRoute) =>
    //             pathname.startsWith(restrictedRoute),
    //         )
    //     ) {
    //         return NextResponse.redirect(new URL("/", request.url));
    //     }
    // }

    //  compare case insensitive, return 0 if the two strings are equal
    if (pathname.localeCompare("/dashboard") === 0) {
        return NextResponse.redirect(
            new URL("/dashboard/projects", request.url),
        );
    }

    if (pathname.startsWith("/api/internal")) {
        const authorizationHeader = request.headers.get("Authorization");
        const sessionId = readBearerToken(authorizationHeader ?? "");

        if (!sessionId) {
            return buildNoBearerTokenErrorResponse();
        }
    }

    return NextResponse.next();
}
