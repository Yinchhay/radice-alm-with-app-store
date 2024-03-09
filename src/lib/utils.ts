import { Permissions } from "@/types/IAM";

export const PermissionNames = new Map<number, string>([
    [Permissions.CREATE_USERS, "Create users"],
    [Permissions.EDIT_USERS, "Edit users"],
    [Permissions.DELETE_USERS, "Delete users"],
    [Permissions.CREATE_CATEGORIES, "Create categories"],
    [Permissions.EDIT_CATEGORIES, "Edit categories"],
    [Permissions.DELETE_CATEGORIES, "Delete categories"],
    [Permissions.CREATE_ROLES, "Create roles"],
    [Permissions.EDIT_ROLES, "Edit roles"],
    [Permissions.DELETE_ROLES, "Delete roles"],
    [Permissions.CREATE_PARTNERS, "Create partners"],
    [Permissions.EDIT_PARTNERS, "Edit partners"],
    [Permissions.DELETE_PARTNERS, "Delete partners"],
    [Permissions.APPROVE_AND_REJECT_APPLICATION_FORMS, "Approve and reject application forms"],
    [Permissions.CREATE_OWN_PROJECTS, "Create own projects"],
    [Permissions.CHANGE_PROJECT_STATUS, "Change project status"],
    [Permissions.DELETE_PROJECTS, "Delete projects"],
]);
 
export const localDebug = (message: string, from: string): void => {
    if (process.env.NODE_ENV === "development") {
        console.debug(`From ${from}: ${message}`);
    }
};
