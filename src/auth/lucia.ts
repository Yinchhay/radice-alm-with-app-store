import { Lucia, Session, TimeSpan, User } from "lucia";
import { DrizzleMySQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/drizzle/db";
import { users, sessions } from "@/drizzle/schema";
import { InferSelectModel } from "drizzle-orm";
import { cache } from "react";
import { cookies } from "next/headers";
import { localDebug } from "@/lib/utils";

const adapter = new DrizzleMySQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        // this sets cookies with super long expiration
        // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
        expires: false, // session cookies have very long lifespan (2 years)
        attributes: {
            // set to `true` when using HTTPS
            secure: process.env.NODE_ENV === "production",
        },
    },
    sessionExpiresIn: new TimeSpan(2, "w"),
    getUserAttributes: (attributes) => {
        return {
            firstName: attributes.firstName,
            lastName: attributes.lastName,
            id: attributes.id,
        };
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

// declare type for lucia so that we when we get session from lucia it has type
interface DatabaseUserAttributes extends InferSelectModel<typeof users> {}

/**
 * using cache to prevent multiple calls to database, upon page render
 * react will memoize the result of this function
 * note: the cache will be invalidated on every page refresh
 */
export const validateRequest = cache(
    async (): Promise<
        { user: User; session: Session } | { user: null; session: null }
    > => {
        const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
        if (!sessionId) {
            return {
                user: null,
                session: null,
            };
        }

        try {
            const result = await lucia.validateSession(sessionId);
            // If Session.fresh is true, it indicates the session expiration has been extended and you should set a new session cookie.
            if (result.session && result.session.fresh) {
                const sessionCookie = lucia.createSessionCookie(
                    result.session.id,
                );
                cookies().set(
                    sessionCookie.name,
                    sessionCookie.value,
                    sessionCookie.attributes,
                );
            }

            // If the session is not found, it means the session has expired or the session ID is invalid. You should clear the session cookie.
            if (!result.session) {
                const sessionCookie = lucia.createBlankSessionCookie();
                cookies().set(
                    sessionCookie.name,
                    sessionCookie.value,
                    sessionCookie.attributes,
                );
            }
            return result;
        } catch (error: any) {
            localDebug(error.message, "/auth/lucia.ts, validateRequest()");
            // next.js throws when you attempt to set cookie when rendering page
        }

        return {
            user: null,
            session: null,
        };
    },
);

// Server side only
export const getAuthUser = cache(async () => {
    const result = await validateRequest();
    return result.user;
});
