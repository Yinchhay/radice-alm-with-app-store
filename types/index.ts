import { NextRequest } from "next/server";

export interface AuthUser {
    email: string,
    username: string,
    userId: string,
}

// add additional type to request so we can pass information through request in middleware
export interface CustomRequest extends NextRequest {
    currentUser: AuthUser;
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