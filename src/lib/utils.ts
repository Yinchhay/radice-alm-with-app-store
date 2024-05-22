import { Permissions } from "@/types/IAM";

export const PermissionNames = new Map<number, string>([
    [Permissions.CREATE_USERS, "Create users"],
    // [Permissions.EDIT_USERS, "Edit users"],
    [Permissions.DELETE_USERS, "Delete users"],
    [Permissions.CREATE_CATEGORIES, "Create categories"],
    [Permissions.EDIT_CATEGORIES, "Edit categories"],
    [Permissions.DELETE_CATEGORIES, "Delete categories"],
    [Permissions.CREATE_ROLES, "Create roles"],
    [Permissions.EDIT_ROLES, "Edit roles"],
    [Permissions.DELETE_ROLES, "Delete roles"],
    [Permissions.CREATE_PARTNERS, "Create partners"],
    // [Permissions.EDIT_PARTNERS, "Edit partners"],
    [Permissions.DELETE_PARTNERS, "Delete partners"],
    [
        Permissions.APPROVE_AND_REJECT_APPLICATION_FORMS,
        "Approve and reject application forms",
    ],
    [Permissions.CREATE_OWN_PROJECTS, "Create own projects"],
    [Permissions.CHANGE_PROJECT_STATUS, "Change project status"],
    [Permissions.DELETE_PROJECTS, "Delete projects"],
]);

export function localDebug(message: string, from: string): void {
    if (process.env.NODE_ENV === "development") {
        console.debug(`From ${from}: ${message}`);
    }
}

export function readBearerToken(authorizationHeader: string): string | null {
    const [authScheme, token] = authorizationHeader.split(" ") as [
        string,
        string | undefined,
    ];
    if (authScheme.toUpperCase() !== "BEARER") {
        return null;
    }
    return token ?? null;
}

export function generatePassword(): string {
    const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
}