export interface IAuthUserPreferences {
    language: string,
}

export interface IAuthUser {
    email: string,
    username: string,
    userId: string,
    preferences: IAuthUserPreferences,
    roles: {
        roleIds: string[],
    }
}

export interface ISession {
    user: IAuthUser,
    sessionId: string,
    activePeriodExpiresAt: Date,
    idlePeriodExpiresAt: Date,
    state: string,
    fresh: boolean,
}

export enum Permissions {
    CREATE_PROJECT = 1,
    DELETE_PROJECT = 2, 
    EDIT_PROJECT = 3,
    EDIT_OWN_PROFILE = 4,
    DELETE_MEMBER_ACCOUNT = 5,
    EDIT_MEMBER_PROJECT = 6,
    DELETE_MEMBER_PROJECT = 7,
    CHANGE_ACCOUNT_ROLE = 8,
    MODIFY_ROLE =9,
    REVIEW_APPLICANT = 10,
    MODIFY_PARTNER = 11,
}

export enum PartnerLevel {
    BRONZE = "BRONZE",
    SILVER = "SILVER",
    GOLD = "GOLD",
    PLATINUM = "PLATINUM",
    DIAMOND = "DIAMOND",
}

export enum PartnerType {
    COMPANY = "COMPANY",
    INDIVIDUAL = "INDIVIDUAL",
}