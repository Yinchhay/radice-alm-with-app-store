import { auth } from "@/auth/lucia";
import { HttpStatusCode } from "@/types/server";
import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface IBody {
    username: string,
    email: string,
    password: string,
    phone_number: number,
    is_active: boolean,
    profile?: Record<string, any>,
    oauth_id?: Record<string, any>,
    skillset?: Record<string, any>,
    preferences?: Record<string, any>,
    roles: Record<string, any>,
}

export async function POST(request: NextRequest) {
    try {
        const body: IBody = await request.json()
        // basic check
        if (
            typeof body.username !== "string" ||
            body.username.length < 4 ||
            body.username.length > 31
        ) {
            return NextResponse.json({
                message: "Invalid username",
                status: HttpStatusCode.BAD_REQUEST_400
            }, {
                status: HttpStatusCode.BAD_REQUEST_400
            });
        }
        if (
            typeof body.password !== "string" ||
            body.password.length < 6 ||
            body.password.length > 255
        ) {
            return NextResponse.json({
                message: "Invalid password",
                status: HttpStatusCode.BAD_REQUEST_400
            }, {
                status: HttpStatusCode.BAD_REQUEST_400
            });
        }

        const user = await await auth.createUser({
            // providerId + providerUserId = "username:usernameProviderUserId"
            key: {
                providerId: 'email', // auth method
                // very important to convert toLowerCase
                providerUserId: body.email.toLowerCase(), // unique id when using "username" auth method
                password: body.password, // password when using "username" auth method, hashed automatically by lucia
            },
            // attributes to store in the database
            attributes: {
                username: body.username,
                email: body.email,
                phone_number: Number(body.phone_number),
                profile: body.profile || undefined,
                oauth_id: body.oauth_id || undefined,
                skillset: body.skillset || undefined,
                preferences: body.preferences || undefined,
                roles: body.roles
            }
        })

        const session = await auth.createSession({
            userId: user.userId,
            attributes: {}
        });

        const authRequest = auth.handleRequest(request.method, context);

        authRequest.setSession(session);

        return NextResponse.json({
            message: "user has created",
            user: user,
            status: HttpStatusCode.OK_200,
        }, {
            status: HttpStatusCode.OK_200
        });
    } catch (err) {
        return NextResponse.json({
            error: "An unknown error occurred :(",
            message: err,
            status: HttpStatusCode.INTERNAL_SERVER_ERROR_500
        }, {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR_500
        }
        );
    }
}