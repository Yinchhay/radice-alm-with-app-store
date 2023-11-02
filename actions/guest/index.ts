'use server'

import { auth } from "@/auth/lucia";
import { ResponseMessage } from "@/types/server";
import * as context from "next/headers";

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