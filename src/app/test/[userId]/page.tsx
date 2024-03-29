/**
 * Next js cache using server action experiment
 */

import { GetUserById_C_Tag, getUserById_C } from "@/repositories/users";
import { Button } from "./btn";
import { Metadata } from "next";
import { getBaseUrl, revalidateTags } from "@/lib/server_utils";

// dynamic metadata
export async function generateMetadata({
    params,
}: {
    params: { userId: string };
}): Promise<Metadata> {
    const user = await getUserById_C(params.userId);
    return {
        title: user?.firstName || "Unkown user",
    };
}

export default async function TestPage({
    params,
}: {
    params: { userId: string };
}) {
    const user = await getUserById_C(params.userId);

    async function revalidateUserById() {
        "use server";
        if (!user) return;

        console.log(`Revalidat user ${params.userId}`);
        await revalidateTags<GetUserById_C_Tag>(`getUserById_C:${params.userId}`);
    }

    return (
        <div>
            <h1>Server url {getBaseUrl()}</h1>
            <h1>User name: {user?.firstName}</h1>
            <h1>Test Page</h1>
            <p>
                This is a test page. You can edit this page by opening{" dd"}
                <code>src/app/test/page.tsx</code>.
            </p>
            {user && <Button revalidateUser={revalidateUserById} />}
        </div>
    );
}
