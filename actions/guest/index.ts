'use server'

import { auth } from "@/auth/lucia";
import { ResponseMessage } from "@/types/server";
import * as context from "next/headers";
import { redirect } from "next/navigation";

export const loginWithPassWord = async (formData: FormData) => {
    try {
        const email = formData.get('email');
        const password = formData.get('password');
        if (
            typeof email !== "string" ||
            email.length < 4 ||
            email.length > 31
        ) throw new Error("Email is invalid");

        if (
            typeof password !== "string" ||
            password.length < 6 ||
            password.length > 255
        ) throw new Error("Password is invalid");

        // find user by key
        const user = await auth.useKey("email", email.toLowerCase(), password);

        // and validate password

        const session = await auth.createSession({
            userId: user.userId,
            attributes: {}
        });

        const authRequest = auth.handleRequest("POST", context);

        authRequest.setSession(session);

        return {
            success: true,
            message: ResponseMessage.SUCCESS
        };
    } catch (err) {
        // lucia will throw an error even if credential provided is incorrect
        return {
            success: false,
            message: ResponseMessage.INVALID_CREDENTIAL,
        };
    }
}

export const logCurrentUserOut = async (formData: FormData) => {
    try {
        const authRequest = auth.handleRequest("POST", context);
        // check if user is authenticated
        const session = await authRequest.validate();

        if (!session) throw new Error("User is not authenticated");

        // console.log(session.user.userId);

        // make sure to invalidate the current session!
        await auth.invalidateSession(session.sessionId);

        // delete dead sessions for the user | it will succeed regardless of the validity of the user id.
        // delete the expired sessions for the user
        await auth.deleteDeadUserSessions(session.user.userId);

        // delete session cookie
        authRequest.setSession(null);

        redirect('/login');
    } catch (err) {
        return {
            success: false,
            message: ResponseMessage.INTERNAL_SERVER_ERROR,
        };
    }
}