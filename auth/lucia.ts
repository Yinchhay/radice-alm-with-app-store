// lucia.ts
import { lucia } from "lucia";
import { prisma } from "@lucia-auth/adapter-prisma";
import "lucia/polyfill/node";
import { nextjs_future } from "lucia/middleware";
import { cache } from "react";
import * as context from "next/headers";
import { Session } from "@/types";
import { default as client} from '../lib/prisma';
// import { github } from "@lucia-auth/oauth/providers";

// https://lucia-auth.com/guidebook/sign-in-with-username-and-password/nextjs-app


// expect error
export const auth = lucia({
    adapter: prisma(client, {
        // "users" is the name of the table in the database
        user: "users",
        // "key" is the name of the table in the database
        key: "key",
        // "sessions" is the name of the table in the database
        session: "session",
    }),
    env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
    middleware: nextjs_future(),
    sessionCookie: {
        expires: false
    },
    // when we console log session these are the attribute that we can specify to show in session
    getUserAttributes: (data) => {
        return {
            username: data.username,
            email: data.email,
        };
    },
    // default session expires in 1 day and idle expires in 14 days
    sessionExpiresIn: {
        activePeriod: 60 * 24, // 1 day
        idlePeriod: 60 * 24 * 14, // 14 day
    }
});

export type Auth = typeof auth;

// export const githubAuth = github(auth, {
// 	clientId: process.env.GITHUB_CLIENT_ID ?? "",
// 	clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
// });

export const getPageSession: () => Promise<Session | null> = cache(() => {
    const authRequest = auth.handleRequest("GET", context);
    return authRequest.validate();
});