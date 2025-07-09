import {
    UserProficiencies,
    UserProficienciesLevel,
    UserSkillSet,
} from "@/drizzle/schema";

// Important do not change hasLinkedGithub to false, we use it to filter users who have linked github account to consider as members of the system
export const hasLinkedGithub = true;
export const RECAPTCHA_KEY = process.env.RECAPTCHA_KEY ?? "";
export const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET ?? "";

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

export function dateToString(date: Date) {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function dateToStringDetail(date: Date) {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    });
}
export function splitArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}
export interface FileDetails {
    name: string;
    extension: string;
}

export function extractFileDetails(filename: string): FileDetails {
    // Assuming the UUID length is fixed at 36 characters
    const UUID_LENGTH = 36;

    // Find the position of the last dot which separates the extension
    const lastDotIndex = filename.lastIndexOf(".");

    let extension: string = "";
    let filenameWithoutExtension: string;

    if (lastDotIndex === -1) {
        // No dot found, hence no extension
        filenameWithoutExtension = filename;
    } else {
        extension = filename.substring(lastDotIndex);
        filenameWithoutExtension = filename.substring(0, lastDotIndex);
    }

    // Get the filename without the UUID and remove the trailing hyphen if it exists
    const nameWithoutUUID = filenameWithoutExtension.slice(0, -UUID_LENGTH);
    const cleanName = nameWithoutUUID.endsWith("-")
        ? nameWithoutUUID.slice(0, -1)
        : nameWithoutUUID;

    return {
        name: cleanName,
        extension: extension,
    };
}

export type ProjectStatusElement = {
    name: string;
    value: boolean;
};

const ALL_STATUSES = [
    "requirements",
    "definition",
    "analysis",
    "approved",
    "chartered",
    "design",
    "development",
    "build",
    "test",
    "release",
    "live",
    "retiring",
    "retired",
];

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function convertToProjectStatusElements(
    statusObj: { [key: string]: boolean } | null,
): ProjectStatusElement[] {
    if (statusObj === null) {
        return ALL_STATUSES.map((status) => ({
            name: capitalize(status),
            value: false,
        }));
    }

    return ALL_STATUSES.map((status) => ({
        name: capitalize(status),
        value: statusObj[status] !== undefined ? statusObj[status] : false,
    }));
}

type ProficiencyKey = keyof typeof UserProficienciesLevel;
type SkillSetToChipReturnType = {
    [K in ProficiencyKey]: string[];
};
export function skillSetToChips(
    skillSets: UserSkillSet[] | null,
): SkillSetToChipReturnType {
    const chips: SkillSetToChipReturnType = {
        Know: [],
        Do: [],
        Teach: [],
    };

    if (!skillSets || !Array.isArray(skillSets) || skillSets.length === 0) {
        return chips;
    }

    skillSets.forEach((sk) => {
        if (!sk.proficiency || !Array.isArray(sk.proficiency)) {
            return;
        }

        sk.proficiency.forEach((p) => {
            switch (p) {
                case UserProficienciesLevel.Do:
                    chips.Do.push(sk.skill);
                    break;
                case UserProficienciesLevel.Know:
                    chips.Know.push(sk.skill);
                    break;
                case UserProficienciesLevel.Teach:
                    chips.Teach.push(sk.skill);
                    break;
            }
        });
    });

    return chips;
}

export async function createCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

// lib/server_utils.ts - Add this function if it doesn't exist
export async function getBaseUrl(): Promise<string> {
    if (process.env.NODE_ENV === "production") {
        return process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";
    }
    return "http://localhost:3000";
}