export enum Permissions {
    // Manage users
    CREATE_USERS = 1,
    EDIT_USERS = 2,
    DELETE_USERS = 3,

    // Manage categories
    CREATE_CATEGORIES = 4,
    EDIT_CATEGORIES = 5,
    DELETE_CATEGORIES = 6,

    // Manage roles
    CREATE_ROLES = 7,
    EDIT_ROLES = 8,
    DELETE_ROLES = 9,

    // Create partners
    CREATE_PARTNERS = 10,
    EDIT_PARTNERS = 11,
    DELETE_PARTNERS = 12,

    // Manage application forms
    APPROVE_AND_REJECT_APPLICATION_FORMS = 13,

    // Manage projects
    CREATE_OWN_PROJECTS = 14,

    // Manage all projects
    CHANGE_PROJECT_STATUS = 15,
    DELETE_PROJECTS = 16,
}