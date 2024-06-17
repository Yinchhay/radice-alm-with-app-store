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
    "retired",
    "retiring",
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
