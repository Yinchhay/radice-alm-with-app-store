import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // experiment route will be disabled in production
    if (request.nextUrl.pathname.startsWith("/test")) {
        if (process.env.NODE_ENV !== "development") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}
