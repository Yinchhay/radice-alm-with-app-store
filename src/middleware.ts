import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readBearerToken } from "./lib/utils";
import { HttpStatusCode } from "./types/http";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
} from "./lib/response";

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // experiment route will be disabled in production
    if (pathname.startsWith("/test")) {
        if (process.env.NODE_ENV !== "development") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    //  compare case insensitive, return 0 if the two strings are equal
    if (pathname.localeCompare("/dashboard") === 0) {
        return NextResponse.redirect(
            new URL("/dashboard/manage/projects", request.url),
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
