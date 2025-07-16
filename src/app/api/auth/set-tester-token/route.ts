// app/api/auth/set-tester-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getTesterByEmail } from "@/repositories/tester";
import {
    generateTesterToken,
    setTesterAuthCookie,
    clearTesterAuthCookie,
} from "@/app/middleware/tester-auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.redirect(
                new URL("/testers/login?error=no_session", request.url),
            );
        }

        const tester = await getTesterByEmail(session.user.email);

        if (!tester) {
            return NextResponse.redirect(
                new URL("/testers/login?error=user_not_found", request.url),
            );
        }

        const customToken = generateTesterToken({
            id: tester.id,
            email: tester.email,
        });

        const response = NextResponse.redirect(
            new URL("/testers/dashboard", request.url),
        );

        setTesterAuthCookie(response, customToken);

        // Clear NextAuth cookies
        response.cookies.delete("next-auth.session-token");
        response.cookies.delete("__Secure-next-auth.session-token");
        response.cookies.delete("next-auth.csrf-token");
        response.cookies.delete("__Host-next-auth.csrf-token");

        return response;
    } catch (error) {
        console.error("Set tester token error:", error);
        return NextResponse.redirect(
            new URL("/testers/login?error=token_error", request.url),
        );
    }
}

// damn bro