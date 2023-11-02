'use server'

import { auth } from "@/auth/lucia";
import { ResponseMessage } from "@/types/server";
import * as context from "next/headers";
import { redirect } from "next/navigation";

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