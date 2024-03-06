import { lucia } from "@/auth/lucia";
import { createUser, getUserByUsername } from "@/repositories/users";
import bcrypt from "bcrypt";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
    return (
        <>
            <h1>Create an account</h1>
            <form action={signup}>
                <label htmlFor="username">Username</label>
                <input name="username" id="username" />
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
    const SALT_ROUNDS = 10;

    const username = formData.get("username");
    // username must be between 4 ~ 31 characters
    if (
        typeof username !== "string" ||
        username.length < 3 ||
        username.length > 31
    ) {
        return {
            error: "Invalid username",
        };
    }
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

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const userId = generateId(15);

    const userExists = await getUserByUsername(username);
    if (userExists) {
        return {
            error: "Username already exists",
        };
    }

    const createdUser = await createUser({
        id: userId,
        username,
        password: hashedPassword,
    });

    if (!createdUser) {
        return {
            error: "Failed to create user",
        };
    }

    // remove session and set session if being used by internal user (admin)
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
    );

    return redirect("/");
}
