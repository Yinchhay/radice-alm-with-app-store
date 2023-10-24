import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth/lucia";
import { cookies } from "next/headers";

interface IBody {
    email: string,
    password: string,
}

export async function POST(request: NextRequest) {
    try {
        const body: IBody = await request.json()

        // basic check
        if (
            typeof body.email !== "string" ||
            body.email.length < 4 ||
            body.email.length > 31
        ) {
            return NextResponse.json({
                error: "Invalid email"
            }, {
                status: 400
            });
        }
        
        if (
            typeof body.password !== "string" ||
            body.password.length < 6 ||
            body.password.length > 255
        ) {
            return NextResponse.json({
                error: "Invalid password"
            }, {
                status: 400
            });
        }

        // find user by key
        const user = await auth.useKey("email", body.email.toLowerCase(), body.password);
        // and validate password

        const session = await auth.createSession({
            userId: user.userId,
            attributes: {}
        });

        const authRequest = auth.handleRequest({
            request,
            cookies
        });
        
        authRequest.setSession(session);

        return NextResponse.json({
            message: "user has been logged in",
            user: user,
            status: 200,
        }, {
            status: 200
        });
    } catch (e) {
        // this part depends on the database you're using
        // check for unique constraint error in user table
        console.log(e);

        return NextResponse.json({
            error: "An unknown error occurred :(",
            e: e,
        }, {
            status: 500
        });
    }
}