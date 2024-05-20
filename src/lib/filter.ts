import { users } from "@/drizzle/schema";

export function filterGetOnlyUserNotInRole(
    usersInARole: (typeof users.$inferSelect)[],
    usersInTheSystem: (typeof users.$inferSelect)[],
    searchUserEmail: string = "",
) {
    // filter: return true = user will be kept in array, vice versa
    return usersInTheSystem.filter((user) => {
        return (
            // if user in the userInRole remove that user from array cuz we need user not in the role.
            !usersInARole.some((userInRole) => userInRole.id === user.id) &&
            // filter user based
            user.email.toLowerCase().includes(searchUserEmail.toLowerCase())
        );
    });
}

export function findItemsToBeCreated<T, K>(
    items: K[],
    existingItems: T[],
    key: keyof T,
) {
    return items.filter(
        (item) =>
            !existingItems.find(
                (existingItem) => existingItem[key] === item,
            ),
    );
}

export function findItemsToBeDeleted<T, K extends keyof T>(
    items:  (T[K])[],
    existingItems: T[],
    key: K,
) {
    return existingItems.filter(
        (existingItem) =>
            !items.includes(existingItem[key]),
    );
}
