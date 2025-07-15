// app/api/auth/callback/google/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTesterByEmail, createTester } from "@/repositories/tester";
import {
    generateTesterToken,
    setTesterAuthCookie,
} from "@/app/middleware/tester-auth";

interface GoogleTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    id_token: string;
}

interface GoogleUserInfo {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const state = searchParams.get("state");

    // Enhanced error logging
    console.log("OAuth callback received:", {
        code: code ? "present" : "missing",
        error,
        state,
        fullUrl: request.url,
        userAgent: request.headers.get("user-agent"),
        referer: request.headers.get("referer"),
    });

    if (error) {
        console.error("OAuth error received:", error);
        return NextResponse.redirect(
            new URL(`/testers/login?error=${error}`, request.url),
        );
    }

    if (!code) {
        console.error("No authorization code received");
        return NextResponse.redirect(
            new URL("/testers/login?error=no_code", request.url),
        );
    }

    try {
        // Exchange code for access token
        const tokenResponse = await fetch(
            "https://oauth2.googleapis.com/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: process.env.GOOGLE_CLIENT_ID!,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                    code,
                    grant_type: "authorization_code",
                    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
                }),
            },
        );

        const tokenData: GoogleTokenResponse = await tokenResponse.json();

        if (!tokenResponse.ok) {
            throw new Error("Failed to exchange code for token");
        }

        // Get user info from Google
        const userResponse = await fetch(
            `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`,
        );

        const userData: GoogleUserInfo = await userResponse.json();

        if (!userResponse.ok) {
            throw new Error("Failed to fetch user info");
        }

        // Check if tester exists or create new one
        let tester = await getTesterByEmail(userData.email);

        if (!tester) {
            const newTester = {
                email: userData.email,
                firstName: userData.given_name || "",
                lastName: userData.family_name || "",
                profileUrl: userData.picture || null,
                password: "",
                phoneNumber: null,
                description: null,
            };
            await createTester(newTester);
            tester = await getTesterByEmail(userData.email);
        }

        if (!tester) {
            throw new Error("Failed to create or retrieve tester");
        }

        // Generate your custom token
        const customToken = generateTesterToken({
            id: tester.id,
            email: tester.email,
        });

        // Create response and set only your custom cookie
        const response = NextResponse.redirect(
            new URL("/testers/dashboard", request.url),
        );

        setTesterAuthCookie(response, customToken);

        return response;
    } catch (error) {
        console.error("Google OAuth callback error:", error);
        return NextResponse.redirect(
            new URL("/testers/login?error=callback_error", request.url),
        );
    }
}

// I hate you moneath, why did you delete this file