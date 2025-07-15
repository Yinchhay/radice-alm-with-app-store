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

        // Generate your custom tester token
        const customToken = generateTesterToken({
            id: tester.id,
            email: tester.email,
        });

        // Create response and set your custom cookie
        const response = NextResponse.redirect(
            new URL("/testers/dashboard", request.url),
        );

        // Set your custom tester-token cookie
        setTesterAuthCookie(response, customToken);

        // Optional: Clear NextAuth cookies if you don't want them
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