// app/api/auth/google/callback/route.ts
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

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        throw new Error("Missing Google OAuth credentials");
    }

    if (error) {
        return NextResponse.redirect(
            new URL(`/testers/login?error=${error}`, request.url),
        );
    }

    if (!code) {
        return NextResponse.redirect(
            new URL("/testers/login?error=no_code", request.url),
        );
    }
    
    try {
        const redirectUri = new URL("/api/auth/google/callback", process.env.APP_URL).toString();
        
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
                    redirect_uri: redirectUri,
                }),
            },
        );

        const tokenData: GoogleTokenResponse = await tokenResponse.json();

        if (!tokenResponse.ok) {
            throw new Error("Failed to exchange code for token");
        }

        const userResponse = await fetch(
            `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`,
        );

        const userData: GoogleUserInfo = await userResponse.json();

        if (!userResponse.ok) {
            throw new Error("Failed to fetch user info");
        }

        let tester = await getTesterByEmail(userData.email);

        if (!tester) {
            const newTester = {
                email: userData.email,
                firstName: userData.given_name || "",
                lastName: userData.family_name || "",
                profileUrl: userData.picture || null,
                password: "", // You might want to handle this differently for OAuth users
                phoneNumber: null,
                description: null,
            };
            await createTester(newTester);
            tester = await getTesterByEmail(userData.email);
        }

        if (!tester) {
            throw new Error("Failed to create or retrieve tester");
        }

        const customToken = generateTesterToken({
            id: tester.id,
            email: tester.email,
        });

        const response = NextResponse.redirect(
            new URL("/appstore", process.env.APP_URL),
        );

        setTesterAuthCookie(response, customToken);

        return response;
    } catch (error) {
        console.error("Google OAuth callback error:", error);
        return NextResponse.redirect(
            new URL("/testers/login?error=callback_error", process.env.APP_URL),
        );
    }
}