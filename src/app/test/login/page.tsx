import { lucia } from "@/auth/lucia";
import { revalidateTags } from "@/lib/server_utils";
import { GetUserRolesAndRolePermissions_C_Tag, getUserByEmail } from "@/repositories/users";
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

async function login(formData: FormData): Promise<void> {
    "use server";
    const email = formData.get("email") as string;
    
    const password = formData.get("password");
    if (
        typeof password !== "string" ||
        password.length < 6 ||
        password.length > 255
    ) {
        // You can handle error display here, e.g., by redirecting to an error page or using a state
        return;
    }

    const userExists = await getUserByEmail(email);
    if (!userExists) {
        // Handle error (e.g., redirect or set error state)
        return;
    }

    const validPassword = await bcrypt.compare(password, userExists.password);
    if (!validPassword) {
        // Handle error (e.g., redirect or set error state)
        return;
    }

    const session = await lucia.createSession(userExists.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
    );

    // invalidate permission cache
    await revalidateTags<GetUserRolesAndRolePermissions_C_Tag>(`getUserRolesAndRolePermissions_C:${userExists.id}`);

    redirect("/test/dashboard");
}
