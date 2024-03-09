import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
            new URL("/dashboard/manage/associated-project", request.url),
        );
    }

    return NextResponse.next();
}
