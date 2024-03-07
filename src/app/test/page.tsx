/**
 * Next js cache using server action experiment
 */

import { getUserById_C } from "@/repositories/users"
import { revalidatePath, revalidateTag } from "next/cache"
import { Button } from "./btn"
import { getBaseUrl } from "@/lib/utils"
import { Metadata } from "next";

// dynamic metadata
export async function generateMetadata() : Promise<Metadata> {
    const user = await getUserById_C("100")

    return {
        title: user?.firstName || "Unkown user",
    }
}


export default async function TestPage() {
    const user = await getUserById_C("oisuvsh01q5sl0g")
    async function revalidateUser() {
        "use server"
        console.log("Revalidat user by id")
        revalidateTag("getUserById_C")
        // revalidatePath("/test")
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
            <Button revalidateUser={revalidateUser} />
        </div>
    )
}
