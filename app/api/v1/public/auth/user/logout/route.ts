import { auth } from "@/auth/lucia";
import * as context from "next/headers";

import { NextResponse, type NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
	const authRequest = auth.handleRequest(request.method, context);
	// check if user is authenticated
	const session = await authRequest.validate();

	if (!session) {
		return NextResponse.json({
            message: "User did not login why u want to log them out man ? :)",
            status: 300,
        }, {
            status: 300
        });
	}

	// console.log(session.user.userId);

	// make sure to invalidate the current session!
	await auth.invalidateSession(session.sessionId);

	// delete dead sessions for the user | it will succeed regardless of the validity of the user id.
	// delete the expired sessions for the user
	await auth.deleteDeadUserSessions(session.user.userId);

	// delete session cookie
	authRequest.setSession(null);

	return NextResponse.json({
            message: "User has been logged out :)",
            status: 200,
        }, {
            status: 200
        });
};