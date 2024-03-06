import { db } from "@/drizzle/db";
import { unstable_cache as cache } from "next/cache";

export const getUserById = cache(
    async (userId: string) => {
        console.log("Fetching user by id", userId);

        return (
            (await db.query.users.findFirst({
                where: (users, { eq }) => eq(users.id, userId),
            })) || null
        );
    },
    ["userById"],
    {
        tags: ["userById"],
    },
);
