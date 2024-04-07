import { github } from "@/auth/github";
import { lucia } from "@/auth/lucia";
import {
    getOAuthProviderByGithubId,
    updateOAuthProviderAccessTokenById,
} from "@/repositories/oauth_provider";
import { HttpStatusCode } from "@/types/http";
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";

type GitHubUser = {
    id: string;
    login: string;
    // there are more attributes, console log githubUser variable to see more attribute
};

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const storedState = cookies().get("github_oauth_state")?.value ?? null;

    if (!code || !state || !storedState || state !== storedState) {
        return new Response(null, {
            status: HttpStatusCode.BAD_REQUEST_400,
        });
    }

    try {
        const tokens = await github.validateAuthorizationCode(code);
        const githubUserResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
            },
        });
        const githubUser: GitHubUser = await githubUserResponse.json();
        const existingUser = await getOAuthProviderByGithubId(githubUser.id);

        if (existingUser) {
            // even though currently we don't need access token, but we store it anyway in case we need to use it.
            await updateOAuthProviderAccessTokenById(
                existingUser.id,
                tokens.accessToken,
            );

            const session = await lucia.createSession(existingUser.userId, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes,
            );
            return new Response(null, {
                status: HttpStatusCode.FOUND_302,
                headers: {
                    Location: "/dashboard",
                },
            });
        }

        // if not found, user is not in the system (they must request to join and get accepted by application reviewer first, then login. for the first time login, we will ask the user to connect to github)
        // Note: use a 3XX code to let the browser know a redirect is required.
        // ref: https://stackoverflow.com/questions/66108986/nodejs-doesnt-redirect-when-changing-location-header
        return new Response(null, {
            status: HttpStatusCode.TEMPORARY_REDIRECT_307,
            headers: {
                Location: "/login?type=github&error_message=User not found",
            },
        });
    } catch (e) {
        // the specific error message depends on the provider
        if (e instanceof OAuth2RequestError) {
            // invalid code
            return new Response(null, {
                status: HttpStatusCode.TEMPORARY_REDIRECT_307,
                headers: {
                    Location: "/login?type=github&error_message=Bad request",
                },
            });
        }

        return new Response(null, {
            status: HttpStatusCode.TEMPORARY_REDIRECT_307,
            headers: {
                Location:
                    "/login?type=github&error_message=Internal server error",
            },
        });
    }
}
