import { github } from "@/auth/github";
import { getAuthUser } from "@/auth/lucia";
import { getBaseUrl } from "@/lib/server_utils";
import {
    createOauthProvider,
    getOAuthProviderByUserId,
} from "@/repositories/oauth_provider";
import { updateUserHasLinkedGithubByUserId } from "@/repositories/users";
import { ErrorMessage } from "@/types/error";
import { OAuthProviderId } from "@/types/oauth";
import { UserType } from "@/types/user";
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
            `${await getBaseUrl()}/link-oauth/github?error_message=Bad request"`,
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

        const user = await getAuthUser();
        if (!user) {
            return Response.redirect(
                `${await getBaseUrl()}/login?type=github&error_message=${ErrorMessage.UserUnauthenticated}`,
            );
        }

        if (user.type !== UserType.USER) {
            return Response.redirect(
                `${await getBaseUrl()}/link-oauth/github?error_message=Your account type cannot link to github account`,
            );
        }

        const userHasLinkedGithubOAuth = await getOAuthProviderByUserId(
            user.id,
        );
        // check if the user has linked github account before
        if (userHasLinkedGithubOAuth) {
            // check if the github account is the same
            if (userHasLinkedGithubOAuth.providerUserId == githubUser.id) {
                // if somehow the user has linked github but the flag is not set yet
                // just a very rare case
                if (!user.hasLinkedGithub) {
                    await updateUserHasLinkedGithubByUserId(user.id, {
                        hasLinkedGithub: true,
                    });
                }

                return Response.redirect(
                    `${await getBaseUrl()}/link-oauth/github?error_message=The github account has already linked to your account`,
                );
            }

            // check if the github account is linked to another user
            if (userHasLinkedGithubOAuth.providerUserId != githubUser.id) {
                return Response.redirect(
                    `${await getBaseUrl()}/link-oauth/github?error_message=The github account has already linked to another user's account`,
                );
            }
        }

        // if never linked before, we create oauth provider record
        const oauthProvider = await createOauthProvider({
            userId: user.id,
            providerId: OAuthProviderId.Github,
            providerUserId: githubUser.id,
            accessToken: tokens.accessToken,
        });
        if (oauthProvider[0].affectedRows < 1) {
            return Response.redirect(
                `${await getBaseUrl()}/link-oauth/github?error_message=Failed to link github`,
            );
        }

        return Response.redirect(
            `${await getBaseUrl()}/link-oauth/github?message=Linked github successfully&success=1`,
        );
    } catch (e) {
        // the specific error message depends on the provider
        if (e instanceof OAuth2RequestError) {
            return Response.redirect(
                `${await getBaseUrl()}/link-oauth/github?error_message=Invalid code`,
            );
        }

        return Response.redirect(
            `${await getBaseUrl()}/link-oauth/github?error_message=Failed to link github`,
        );
    }
}
