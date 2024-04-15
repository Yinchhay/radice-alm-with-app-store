import { db } from "@/drizzle/db";
import { oauthProviders } from "@/drizzle/schema";
import { OAuthProviderId } from "@/types/oauth";
import { eq } from "drizzle-orm";

export const getOAuthProviderByGithubId = async (githubId: string) => {
    return await db.query.oauthProviders.findFirst({
        where: (oauthProviders, { eq, and }) =>
            and(
                eq(oauthProviders.providerId, OAuthProviderId.Github),
                eq(oauthProviders.providerUserId, githubId),
            ),
    });
};

export const getOAuthProviderByUserId = async (userId: string) => {
    return await db.query.oauthProviders.findFirst({
        where: (oauthProviders, { eq, and }) =>
            and(
                eq(oauthProviders.providerId, OAuthProviderId.Github),
                eq(oauthProviders.userId, userId),
            ),
    });
};

export const updateOAuthProviderAccessTokenById = async (
    oauthProvidersId: number,
    accessToken: string,
) => {
    return await db
        .update(oauthProviders)
        .set({
            accessToken: accessToken,
        })
        .where(eq(oauthProviders.id, oauthProvidersId));
};

export const createOauthProvider = async (
    oauthProvider: typeof oauthProviders.$inferInsert,
) => {
    return await db.insert(oauthProviders).values(oauthProvider);
};
