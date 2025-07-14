// app/api/auth/google/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const googleAuthUrl = new URL(
        "https://accounts.google.com/o/oauth2/v2/auth",
    );

    googleAuthUrl.searchParams.append(
        "client_id",
        process.env.GOOGLE_CLIENT_ID!,
    );
    googleAuthUrl.searchParams.append(
        "redirect_uri",
        `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
    );
    googleAuthUrl.searchParams.append("response_type", "code");
    googleAuthUrl.searchParams.append("scope", "openid profile email");
    googleAuthUrl.searchParams.append("access_type", "offline");

    // Add state parameter for security and debugging
    const state = Math.random().toString(36).substring(2, 15);
    googleAuthUrl.searchParams.append("state", state);

    // Add prompt parameter to ensure fresh consent
    googleAuthUrl.searchParams.append("prompt", "select_account");

    return NextResponse.redirect(googleAuthUrl.toString());
}
