import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readBearerToken, readSessionCookie } from "./auth/lucia-middleware";
import { buildNoBearerTokenErrorResponse } from "./lib/response";

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const publicRoutes = [
        "/tester-login",
        "/tester-registration",
        "/api/auth",
    ];
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    if (process.env.NODE_ENV !== "development") {
        // experiment route will be disabled in production
        const prodRestrictedRoutes = ["/test", "/animations"];
        if (
            prodRestrictedRoutes.some((restrictedRoute) =>
                pathname.startsWith(restrictedRoute),
            )
        ) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    //  compare case insensitive, return 0 if the two strings are equal
    if (pathname.localeCompare("/dashboard") === 0) {
        return NextResponse.redirect(
            new URL("/dashboard/projects", request.url),
        );
    }

    if (pathname.startsWith("/api/internal")) {
        const authorizationHeader = request.headers.get("Authorization");
        let sessionId = readBearerToken(authorizationHeader ?? "");

        if (!sessionId) {
            const cookieHeader = request.headers.get("cookie");
            sessionId = readSessionCookie(cookieHeader ?? "");
        }

        if (!sessionId) {
            return buildNoBearerTokenErrorResponse();
        }
    }

    return NextResponse.next();
}
