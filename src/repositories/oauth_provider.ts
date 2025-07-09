import { db } from "@/drizzle/db";
import { oauthProviders, users } from "@/drizzle/schema";
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

export const getOAuthProviderByGoogleId = async (googleId: string) => {
    return await db.query.oauthProviders.findFirst({
        where: (oauthProviders, { eq, and }) =>
            and(
                eq(oauthProviders.providerId, OAuthProviderId.Google),
                eq(oauthProviders.providerUserId, googleId),
            ),
    });
};

export const getOAuthProviderByUserId = async (userId: string) => {
    return await db.query.oauthProviders.findFirst({
        with: {
            user: {
                columns: {
                    email: true,
                },
            },
        },
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

export const updateOAuthProviderById = async (
    oauthProvidersId: number,
    githubId: string,
    accessToken: string,
) => {
    return await db
        .update(oauthProviders)
        .set({
            providerUserId: githubId,
            accessToken: accessToken,
        })
        .where(eq(oauthProviders.id, oauthProvidersId));
};

// export const createOauthProvider = async (
//     oauthProvider: typeof oauthProviders.$inferInsert,
// ) => {
//     return await db.transaction(async (tx) => {
//         await tx
//             .update(users)
//             .set({ hasLinkedGithub: true })
//             .where(eq(users.id, oauthProvider.userId));

//         return await tx.insert(oauthProviders).values(oauthProvider);
//     });
// };

export const createOauthProvider = async (
    oauthProvider: typeof oauthProviders.$inferInsert,
) => {
    return await db.transaction(async (tx) => {
        // Update user based on provider type
        if (oauthProvider.providerId === OAuthProviderId.Github) {
            await tx
                .update(users)
                .set({ hasLinkedGithub: true })
                .where(eq(users.id, oauthProvider.userId));
        } else if (oauthProvider.providerId === OAuthProviderId.Google) {
            await tx
                .update(users)
                .set({ hasLinkedGoogle: true }) // Assuming you have this field
                .where(eq(users.id, oauthProvider.userId));
        }
        
        return await tx.insert(oauthProviders).values(oauthProvider);
    });
};