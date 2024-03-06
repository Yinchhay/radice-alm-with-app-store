/**
 * Next js cache using server action experiment
 */

import { getUserById } from "@/repositories/users"
import { revalidatePath, revalidateTag } from "next/cache"
import { Button } from "./btn"
import { getBaseUrl } from "@/lib/utils"
import { Metadata } from "next";

// dynamic metadata
export async function generateMetadata() : Promise<Metadata> {
    const user = await getUserById("100")

    return {
        title: user?.username || "Unkown user",
    }
}


export default async function TestPage() {
    const user = await getUserById("1")
    async function revalidateUser() {
        "use server"
        console.log("Revalidat user by id")
        // revalidateTag("userById")
        revalidatePath("/test")
    }

    return (
        <div>
            <h1>Server url {getBaseUrl()}</h1>
            <h1>User name: {user?.username}</h1>
            <h1>Test Page</h1>
            <p>
                This is a test page. You can edit this page by opening{" dd"}
                <code>src/app/test/page.tsx</code>.
            </p>
            <Button revalidateUser={revalidateUser} />
        </div>
    )
}
