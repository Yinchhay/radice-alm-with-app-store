
export interface AuthUser {
    email: string,
    username: string,
    userId: string,
}

export interface Session {
    user: AuthUser,
    sessionId: string,
    activePeriodExpiresAt: Date,
    idlePeriodExpiresAt: Date,
    state: string,
    fresh: boolean,
}

export enum SponsorLevel {
    BRONZE = "BRONZE",
    SILVER = "SILVER",
    GOLD = "GOLD",
    PLATINUM = "PLATINUM",
    DIAMOND = "DIAMOND",
}

export enum SponsorType {
    COMPANY = "COMPANY",
    INDIVIDUAL = "INDIVIDUAL",
}