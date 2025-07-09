// app/api/oauth/google/login/route.ts
import { google } from "@/auth/google";
import { getBaseUrl } from "@/lib/server_utils";
import { generateState, generateCodeVerifier } from "arctic";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const state = generateState();
        const codeVerifier = generateCodeVerifier();
        
        // Create authorization URL with PKCE
        const url = await google.createAuthorizationURL(state, codeVerifier, {
            scopes: ["openid", "email", "profile"]
        });
        
        // Set the redirect URI explicitly
        const baseUrl = await getBaseUrl();
        url.searchParams.set("redirect_uri", `${baseUrl}/api/oauth/google/callback`);
        
        const cookieStore = cookies();
        
        // Store state and code verifier in cookies
        cookieStore.set("google_oauth_state", state, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 10, // 10 minutes
        });
        
        cookieStore.set("google_code_verifier", codeVerifier, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 10, // 10 minutes
        });
        
        return Response.redirect(url.toString());
        
    } catch (error) {
        console.error("OAuth Login Error:", error);
        return new Response("OAuth Login Failed", { status: 500 });
    }
}
