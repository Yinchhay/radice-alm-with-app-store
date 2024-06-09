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
