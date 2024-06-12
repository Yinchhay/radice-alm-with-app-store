import { Permissions } from "@/types/IAM";

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

export const PermissionsToFilterIfNotSuperAdmin = [
    Permissions.EDIT_ROLES,
    Permissions.DELETE_ROLES,
    Permissions.CREATE_ROLES,
];