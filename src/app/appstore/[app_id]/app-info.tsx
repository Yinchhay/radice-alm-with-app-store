import { getBaseUrl } from "@/lib/server_utils";
import { notFound } from "next/navigation";
import AppBanner from "./_components/app-banner";

async function getAppById(appId: string) {
    try {
        const response = await fetch(
            `${await getBaseUrl()}/api/public/app/${appId}`,
            {
                method: "GET",
                cache: "no-store",
            },
        );

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.success ? data.data.app : null;
    } catch (error) {
        console.error("Error fetching app:", error);
        return null;
    }
}

export default async function AppPage({
    params,
}: {
    params: { app_id: string };
}) {
    const app = await getAppById(params.app_id);

    if (!app) {
        notFound();
    }

    return (
        <AppBanner
            bannerImage={app.bannerImage || "/placeholders/logo_placeholder.png"}
            title={`ID: ${app.id} - ${app.project?.name || "No Name"}`}
            subtitle={app.subtitle}
        />
    );
}

