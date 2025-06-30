"use client";
import React, { useState } from "react";
import { getBaseUrl } from "@/lib/server_utils";
import { notFound } from "next/navigation";
import AppBanner from "./_components/app-banner";
import AppScreenshotsCarousel from "./_components/app-screenshots-carousel";
import AppMetadata from "./_components/app-metadata";
import AppReviews from "./_components/app-reviews";
import BugReportForm from "./_components/bug-report-form";

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

export default function AppPageWrapper(props: { params: { app_id: string } }) {
    return <AppPage {...props} />;
}

function AppPage({
    params,
}: {
    params: { app_id: string };
}) {
    const [app, setApp] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Fetch app data on mount
    React.useEffect(() => {
        (async () => {
            const fetchedApp = await getAppById(params.app_id);
            setApp(fetchedApp);
            setLoading(false);
        })();
    }, [params.app_id]);

    if (loading) {
        return <div className="max-w-6xl mx-auto px-4 py-8">Loading...</div>;
    }
    if (!app) {
        notFound();
    }

    const screenshots = app.screenshots?.map((screenshot: any, index: number) => ({
        id: index,
        imageUrl: screenshot.imageUrl,
        sortOrder: screenshot.sortOrder,
    })) || [];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <AppBanner
                    bannerImage={app.bannerImage || "/placeholders/logo_placeholder.png"}
                    title={app.project?.name || "No Name"}
                    subtitle={app.subtitle}
                />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 min-w-[260px] max-w-sm flex flex-col justify-start">
                    <h1 className="text-4xl font-bold mb-2">{app.project?.name || "No Name"}</h1>
                    <div className="text-sm text-gray-700 mb-2">{app.subtitle || "No subtitle"}</div>
                    {app.project?.projectMembers && (
                        <div className="mb-4 text-sm font-bold">
                            {app.project.projectMembers.map((member: any) => `${member.user.firstName} ${member.user.lastName}`).join(", ")}
                        </div>
                    )}
                    <button
                        className={`bg-black text-white font-semibold py-2 px-6 rounded mb-2 w-fit hover:bg-gray-800 transition-colors${!app.webUrl && !app.appFile ? ' opacity-50 cursor-not-allowed' : ''}`}
                        type="button"
                        onClick={() => {
                            if (app.webUrl) {
                                window.open(app.webUrl, '_blank');
                            } else if (app.appFile) {
                                window.open(app.appFile, '_blank');
                            }
                        }}
                        disabled={!app.webUrl && !app.appFile}
                    >
                        Start Testing
                    </button>
                    {/* View Document Button */}
                    {app.apiDocUrl && (
                        <button
                            className="bg-gray-200 text-black font-semibold py-2 px-6 rounded w-fit hover:bg-gray-300 transition-colors ml-2"
                            type="button"
                            onClick={() => window.open(app.apiDocUrl, '_blank')}
                        >
                            View Document
                        </button>
                    )}
                </div>
                <div className="flex-1 min-w-[300px] max-w-3xl">
                    <AppScreenshotsCarousel
                        screenshots={screenshots}
                        appName={app.project?.name || "App"}
                    />
                    
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-3">About</h2>
                        <p className="text-sm text-gray-700">{app.aboutDesc || "No description available."}</p>
                    </div>
                    <div className="mb-6">
                        <h2 className="flex text-xl mb-3">What's New</h2>
                        <a href="#" className="ml-auto text-sm" style={{ color: "#0000FF" }}>Version History</a>
                        <p className="text-sm text-gray-700">{app.content || "No update information available."}</p>
                    </div>
                    
                    {/* App Metadata */}
                    <AppMetadata
                        appName={app.project?.name || "App"}
                        appType={app.appType?.name || "Unknown"}
                        webUrl={app.webUrl}
                        appFile={app.appFile}
                        versions={app.versions}
                        updatedAt={app.updatedAt}
                    />
                    
                    {/* Reviews */}
                    <AppReviews
                        appId={app.id}
                        appName={app.project?.name || "App"}
                        reviews={[]} // TODO: Add reviews data from API
                    />
                    
                    {/* Bug Report */}
                    <BugReportForm
                        appId={app.id}
                        appName={app.project?.name || "App"}
                    />
                </div>
            </div>
        </div>
    );
}

