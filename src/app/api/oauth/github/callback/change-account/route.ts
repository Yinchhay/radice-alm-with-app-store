import { github } from "@/auth/github";
import { getAuthUser } from "@/auth/lucia";
import { CodeVerificationType } from "@/drizzle/schema";
import { getBaseUrl } from "@/lib/server_utils";
import {
    generateVerificationCode,
    getVerificationCodeByUserIdAndType,
} from "@/repositories/code_verifications";
import { getOAuthProviderByUserId } from "@/repositories/oauth_provider";
import { ErrorMessage } from "@/types/error";
import { UserType } from "@/types/user";
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import { isWithinExpirationDate } from "oslo";

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
            `${await getBaseUrl()}/dashboard/account?error_message=Bad request, failed to change github account"`,
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
                `${await getBaseUrl()}/dashboard/account?error_message=Your account type cannot change github account`,
            );
        }

        const userHasLinkedGithubOAuth = await getOAuthProviderByUserId(
            user.id,
        );

        // check if the user has linked github account before
        if (!userHasLinkedGithubOAuth) {
            return Response.redirect(
                `${await getBaseUrl()}/dashboard/account?error_message=You are required to link your github account`,
            );
        }

        // check if the github account is not the same
        if (userHasLinkedGithubOAuth.providerUserId != githubUser.id) {
            return Response.redirect(
                `${await getBaseUrl()}/dashboard/account?error_message=The github account you are trying to change is not the same as the current linked github account`,
            );
        }

        // verification code in db
        const existingCode = await getVerificationCodeByUserIdAndType(
            userHasLinkedGithubOAuth.userId,
            CodeVerificationType.CHANGE_GITHUB,
        );

        // normally we set expire date 5min, if the code exist and not expired yet. skip sending email to user to avoid spamming
        if (existingCode && isWithinExpirationDate(existingCode.expiresAt)) {
            return Response.redirect(
                `${await getBaseUrl()}/dashboard/account/change-github?verify_code=${existingCode.code}`,
            );
        }

        const eightDigitCode = await generateVerificationCode(
            userHasLinkedGithubOAuth.userId,
            CodeVerificationType.CHANGE_GITHUB,
        );

        if (!eightDigitCode) {
            return Response.redirect(
                `${await getBaseUrl()}/dashboard/account?error_message=Failed to generate verification code`,
            );
        }

        return Response.redirect(
            `${await getBaseUrl()}/dashboard/account/change-github?verify_code=${eightDigitCode}`,
        );
    } catch (e) {
        // the specific error message depends on the provider
        if (e instanceof OAuth2RequestError) {
            return Response.redirect(
                `${await getBaseUrl()}/dashboard/account?error_message=Invalid code`,
            );
        }

        return Response.redirect(
            `${await getBaseUrl()}/dashboard/account?error_message=Failed to change github`,
        );
    }
}
