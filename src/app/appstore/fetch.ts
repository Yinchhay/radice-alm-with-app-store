import { getBaseUrl, getSessionCookie } from "@/lib/server_utils";

export async function fetchApps() {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(`${await getBaseUrl()}/api/public/app`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${sessionId}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return { success: false, data: { apps: [] } };
    }
}