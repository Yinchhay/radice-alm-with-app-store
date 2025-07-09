import { google } from "@/auth/google";
import { lucia } from "@/auth/lucia";
import { getBaseUrl, revalidateTags } from "@/lib/server_utils";
import {
    getOAuthProviderByGoogleId,
    updateOAuthProviderAccessTokenById,
} from "@/repositories/oauth_provider";
import { GetUserRolesAndRolePermissions_C_Tag } from "@/repositories/users";
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";

type GoogleUser = {
    id: string;
    email: string;
    name: string;
    picture: string;
    verified_email: boolean;
    // Add more attributes as needed
};

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    
    const cookieStore = cookies();
    const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
    const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;
    
    // Validate OAuth parameters
    if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
        return Response.redirect(
            `${await getBaseUrl()}/login?type=google&error_message=Bad request`,
        );
    }
    
    try {
        // Exchange code for tokens
        const tokens = await google.validateAuthorizationCode(code, codeVerifier);
        
        // Get user information from Google
        const googleUserResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
            },
        });
        
        if (!googleUserResponse.ok) {
            throw new Error("Failed to fetch user info from Google");
        }
        
        const googleUser: GoogleUser = await googleUserResponse.json();
        
        // Check if user exists in your system
        const existingUserOAuthProvider = await getOAuthProviderByGoogleId(
            googleUser.id,
        );
        
        if (!existingUserOAuthProvider) {
            // User not found - redirect with error
            // This maintains the "whitelist" approach from the GitHub example
            return Response.redirect(
                `${await getBaseUrl()}/login?type=google&error_message=User not found`,
            );
        }
        
        // Update stored access token for future API calls
        await updateOAuthProviderAccessTokenById(
            existingUserOAuthProvider.id,
            tokens.accessToken,
        );
        
        // Create session using Lucia
        const session = await lucia.createSession(
            existingUserOAuthProvider.userId,
            {},
        );
        
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookieStore.set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        );
        
        // Clean up OAuth cookies
        cookieStore.delete("google_oauth_state");
        cookieStore.delete("google_code_verifier");
        
        // Invalidate permission cache for this user
        await revalidateTags<GetUserRolesAndRolePermissions_C_Tag>(
            `getUserRolesAndRolePermissions_C:${existingUserOAuthProvider.userId}`,
        );
        
        // Redirect to dashboard
        return Response.redirect(`${await getBaseUrl()}/dashboard`);
        
    } catch (e) {
        // Clean up OAuth cookies on error
        cookieStore.delete("google_oauth_state");
        cookieStore.delete("google_code_verifier");
        
        // Handle specific OAuth errors
        if (e instanceof OAuth2RequestError) {
            return Response.redirect(
                `${await getBaseUrl()}/login?type=google&error_message=Bad request`,
            );
        }
        
        console.error("Google OAuth Error:", e);
        return Response.redirect(
            `${await getBaseUrl()}/login?type=google&error_message=Internal server error`,
        );
    }
}