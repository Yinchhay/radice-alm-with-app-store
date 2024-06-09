import { localDebug, RECAPTCHA_SECRET } from "./utils";

export async function verifyRecaptcha(token: string): Promise<boolean> {
    try {
        const response = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${token}`,
            {
                method: "POST",
            },
        );
    
        const result = await response.json();
        return result.success;
    } catch (error) {
        localDebug("Failed to verify recaptcha", "verifyRecaptcha()");
        return false;        
    }
}