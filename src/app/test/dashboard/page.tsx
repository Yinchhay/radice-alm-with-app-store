import { getAuthUser, lucia, validateRequest } from "@/auth/lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
    const user = await getAuthUser();
    if (!user) {
        return redirect("/test/login");
    }

    return (
        <>
            <h1>Hi {user.username}</h1>
            <form action={logout}>
                <button>Sign out</button>
            </form>
        </>
    );
}

interface ActionResult {
    error: string;
}

async function logout(): Promise<ActionResult> {
    "use server";
    const { user, session } = await validateRequest();
    if (!session) {
        return {
            error: "Unauthorized",
        };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
    );
    return redirect("/test/login");
}
