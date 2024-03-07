import { lucia } from "@/auth/lucia";
import { getUserByEmail } from "@/repositories/users";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
    return (
        <>
            <h1>Sign in</h1>
            <form action={login}>
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

async function login(formData: FormData): Promise<ActionResult> {
    "use server";
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

    const userExists = await getUserByEmail(email);
    if (!userExists) {
        return {
            error: "Incorrect username or password",
        };
    }

    const validPassword = await bcrypt.compare(password, userExists.password);
    if (!validPassword) {
        return {
            error: "Incorrect username or password",
        };
    }

    const session = await lucia.createSession(userExists.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
    );

    return redirect("/");
}
