import { getAuthUser, lucia, validateRequest } from "@/auth/lucia";
import { hasPermission } from "@/lib/IAM";
import { Permissions } from "@/types/IAM";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const requiredPermissions = new Set([
    Permissions.CREATE_USERS,
    Permissions.DELETE_USERS,
]);

export default async function Page() {
    const user = await getAuthUser();
    if (!user) {
        return redirect("/test/login");
    }
    const userPermission = await hasPermission(user.id, requiredPermissions);

    return (
        <>
            <h1>Hi {user.lastName}</h1>
            <p>{userPermission.message}</p>
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
