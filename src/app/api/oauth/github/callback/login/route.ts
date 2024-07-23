import { github } from "@/auth/github";
import { lucia } from "@/auth/lucia";
import { getBaseUrl, revalidateTags } from "@/lib/server_utils";
import {
    getOAuthProviderByGithubId,
    updateOAuthProviderAccessTokenById,
} from "@/repositories/oauth_provider";
import { GetUserRolesAndRolePermissions_C_Tag } from "@/repositories/users";
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
        return Response.redirect(
            `${await getBaseUrl()}/login?type=github&error_message=Bad request`,
        );
    }

    try {
        const tokens = await github.validateAuthorizationCode(code);
        const githubUserResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
            },
        });
        const githubUser: GitHubUser = await githubUserResponse.json();
        const existingUserOAuthProvider = await getOAuthProviderByGithubId(
            githubUser.id,
        );

        if (!existingUserOAuthProvider) {
            // if not found, user is not in the system (they must request to join and get accepted by application reviewer first, then login. for the first time login, we will ask the user to connect to github)
            return Response.redirect(
                `${await getBaseUrl()}/login?type=github&error_message=User not found`,
            );
        }

        // even though currently we don't need access token, but we store it anyway in case we need to use it.
        await updateOAuthProviderAccessTokenById(
            existingUserOAuthProvider.id,
            tokens.accessToken,
        );

        const session = await lucia.createSession(
            existingUserOAuthProvider.userId,
            {},
        );
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        );

        // invalidate permission cache
        // this invalidate apply to current user only
        await revalidateTags<GetUserRolesAndRolePermissions_C_Tag>(
            `getUserRolesAndRolePermissions_C:${existingUserOAuthProvider.userId}`,
        );

        return Response.redirect(`${await getBaseUrl()}/dashboard`);
    } catch (e) {
        // the specific error message depends on the provider
        if (e instanceof OAuth2RequestError) {
            // invalid code
            return Response.redirect(
                `${await getBaseUrl()}/login?type=github&error_message=Bad request`,
            );
        }

        return Response.redirect(
            `${await getBaseUrl()}/login?type=github&error_message=Internal server error`,
        );
    }
}
