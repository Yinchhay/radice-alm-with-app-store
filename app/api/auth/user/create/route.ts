import { NextResponse } from 'next/server'
import * as context from "next/headers";
import { auth } from '@/auth/lucia';
import type { NextRequest } from "next/server";

// https://lucia-auth.com/guidebook/sign-in-with-username-and-password/nextjs-app

interface IBody {
    username: string,
    email: string,
    password: string,
    phone_number: number,
    is_active: boolean,
    profile?: Record<string, any>,
    oauth_id?: Record<string, any>,
    skillset?: Record<string, any>,
    roles: string,
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
                message: "Invalid username"
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
                message: "Invalid password"
            }, {
                status: 400
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
                roles: body.roles
            }
        })

        // console.log(user)

        const session = await auth.createSession({
            userId: user.userId,
            attributes: {}
        });

        const authRequest = auth.handleRequest(request.method, context);

        authRequest.setSession(session);

        return NextResponse.json({
            message: "user has created",
            user: user,
            status: 200,
        }, {
            status: 200
        });
    } catch (e) {
        // this part depends on the database you're using
        console.log(e);

        return NextResponse.json({
            error: "An unknown error occurred :(",
            e: e,
        }, {
            status: 500
        }
        );
    }
}