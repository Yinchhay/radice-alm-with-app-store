// repositories/appType.ts
import { db } from "@/drizzle/db";
import { appTypes } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function createAppType(input: {
    name: string;
    description?: string;
}) {
    const { name, description } = input;

    if (!name || typeof name !== "string") {
        throw new Error("Invalid 'name'");
    }

    const insertedIds = await db
        .insert(appTypes)
        .values({ name, description })
        .$returningId() as { id: number }[]; // [{ id: number }]

    const insertedId = insertedIds[0]?.id;

    if (!insertedId) {
        return null;
    }

    const newAppType = await getAppTypeById(insertedId);
    return newAppType;
}

// Read All
export async function getAllAppTypes() {
    return db.select().from(appTypes).orderBy(appTypes.id);
}

// Read One
export async function getAppTypeById(id: number) {
    const [item] = await db.select().from(appTypes).where(eq(appTypes.id, id));
    return item || null;
}

// Update
export async function updateAppType(
    id: number,
    input: { name: string; description?: string },
) {
    const { name, description } = input;

    if (!name || typeof name !== "string") {
        throw new Error("Invalid 'name'");
    }

    await db
        .update(appTypes)
        .set({ name, description })
        .where(eq(appTypes.id, id));

    // Fetch and return the updated record
    return getAppTypeById(id);
}

// Delete
export async function deleteAppType(id: number) {
    await db.delete(appTypes).where(eq(appTypes.id, id));
    return { success: true };
}
