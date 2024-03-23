"use client";
import { roles } from "@/drizzle/schema";
import { DeleteRole } from "./delete_role";

export function Role({
    role,
}: {
    role: typeof roles.$inferSelect;
}) {
    return (
        <>
            <div className="flex gap-8">
                <p>{role.name}</p>
                <DeleteRole role={role} />
            </div>
        </>
    );
}
