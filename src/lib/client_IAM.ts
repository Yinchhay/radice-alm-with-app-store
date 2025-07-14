/**
 * Anything related to IAM that's going to be used in the client side should be here.
 */

import { Permissions } from "@/types/IAM";

export const PermissionNames = new Map<number, string>([
    [Permissions.CREATE_USERS, "Create users"],
    [Permissions.DELETE_USERS, "Delete users"],
    [Permissions.CREATE_CATEGORIES, "Create categories"],
    [Permissions.EDIT_CATEGORIES, "Edit categories"],
    [Permissions.DELETE_CATEGORIES, "Delete categories"],
    [Permissions.CREATE_ROLES, "Create roles"],
    [Permissions.EDIT_ROLES, "Edit roles"],
    [Permissions.DELETE_ROLES, "Delete roles"],
    [Permissions.CREATE_PARTNERS, "Create partners"],
    [Permissions.DELETE_PARTNERS, "Delete partners"],
    [
        Permissions.APPROVE_AND_REJECT_APPLICATION_FORMS,
        "Approve and reject application forms",
    ],
    [Permissions.CREATE_OWN_PROJECTS, "Create own projects"],
    [Permissions.CHANGE_PROJECT_STATUS, "Change project status"],
    // [Permissions.CHANGE_PROJECT_PRIORITY, "Change project priority"],
    [Permissions.CREATE_MEDIA, "Create media"],
    [Permissions.EDIT_MEDIA, "Edit media"],
    [Permissions.DELETE_MEDIA, "Delete media"],
]);