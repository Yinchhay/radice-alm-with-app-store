import { lucia } from "@/auth/lucia";
import { localDebug } from "@/lib/utils";
import { createUser, getUserByEmail } from "@/repositories/users";
import { UserType } from "@/types/user";

import bcrypt from "bcrypt";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
    return (
        <>
            <h1>Create an account</h1>
            <form action={signup}>
                <label htmlFor="firstName">First Name</label>
                <input name="firstName" id="firstName" />
                <br />
                <label htmlFor="lastName">Last Name</label>
                <input name="lastName" id="lastName" />
                <br />
                <label htmlFor="email">Email</label>
                <input name="email" id="email" />
                <br />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
                <br />
                <button>Continue</button>
            </form>
        </>
    );
}

interface ActionResult {
    error: string;
}

async function signup(formData: FormData): Promise<ActionResult> {
    "use server";

    try {
        const SALT_ROUNDS = 10;

        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const email = formData.get("email") as string;

        const password = formData.get("password");
        if (
            typeof password !== "string" ||
            password.length < 6 ||
            password.length > 255
        ) {
            return {
                error: "Invalid password",
            };
        }

        // const userExists = await getUserByEmail(email);
        // if (userExists) {
        //     return {
        //         error: "Email already exists",
        //     };
        // }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        // const userId = generateId(15);

        const createdUser = await createUser({
            // id: userId,
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: hashedPassword,
            type: UserType.USER,
        });

        if (!createdUser) {
            return {
                error: "Failed to create user",
            };
        }

        // remove session and set session if being used by internal user (admin)
        const session = await lucia.createSession(createdUser[0].insertId.toString(), {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        );

        return redirect("/");
    } catch (error: any) {
        localDebug(error.message, "signUpAction");

        return {
            error: "Unknown error",
        };
    }
}
