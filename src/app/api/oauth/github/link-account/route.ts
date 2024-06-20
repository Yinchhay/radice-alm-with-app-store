import { github } from "@/auth/github";
import { getAuthUser } from "@/auth/lucia";
import { getBaseUrl } from "@/lib/server_utils";
import { UserType } from "@/types/user";
import { generateState } from "arctic";
import { cookies } from "next/headers";

/**
 * Flow: /api/oauth/github/link-account -> (redirect to github) -> (successfully authorized by github)
 *  -> (github redirect to /api/oauth/github/callback/link-account)
 *  -> /api/oauth/github/callback/link-account (handle callback logic)
 */

export async function GET(request: Request) {
    try {
        const user = await getAuthUser();

        if (!user) {
            return Response.redirect(`${await getBaseUrl()}/login`);
        }

        if (user.hasLinkedGithub) {
            return Response.redirect(
                `${await getBaseUrl()}/link-oauth/github?error_message=User already linked github account`,
            );
        }

        if (user.type !== UserType.USER) {
            return Response.redirect(
                `${await getBaseUrl()}/link-oauth/github?error_message=Your account type cannot link to github account`,
            );
        }

        const state = generateState();
        const url = await github.createAuthorizationURL(state);

        /**
         * NOTE: since github callback can only be set to one URL but we can have sub callback URL
         * we need to set the redirect_uri to the sub callback URL to handle different logic in this
         * case we set the redirect_uri to /api/oauth/github/callback/link-account
         *
         * - callback is what github will redirect to after user authorize the app
         */
        url.searchParams.set(
            "redirect_uri",
            `${await getBaseUrl()}/api/oauth/github/callback/link-account`,
        );

        cookies().set("github_oauth_state", state, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            // set cookie to expire in 10 minutes
            maxAge: 60 * 10,
            sameSite: "lax",
        });

        return Response.redirect(url);
    } catch (error: any) {
        return new Response("Something went wrong", { status: 500 });
    }
}
