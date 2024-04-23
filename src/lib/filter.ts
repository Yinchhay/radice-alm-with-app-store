import { users } from "@/drizzle/schema";

export function filterGetOnlyUserNotInRole(usersInARole: typeof users.$inferSelect[], usersInTheSystem: typeof users.$inferSelect[]) {
    return usersInTheSystem.filter((user) => {
        return !usersInARole.some((userInRole) => userInRole.id === user.id);
    });
}