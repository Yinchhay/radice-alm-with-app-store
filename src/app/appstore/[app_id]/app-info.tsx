"use client";
import React, { useState, useEffect } from "react";
import { getBaseUrl } from "@/lib/server_utils";
import { notFound } from "next/navigation";
import AppBanner from "./_components/app-banner";
import AppActionButton from "./_components/app-action-button";
import AppScreenshotsCarousel from "./_components/app-screenshots-carousel";
import AppReviews from "./_components/app-reviews";
import BugReportForm from "./_components/bug-report-form";
import type { App } from "@/types/app_types";

export default function AppPageWrapper(props: { params: { app_id: string } }) {
    return <AppPage {...props} />;
}

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

function useApp(appId: string) {
    const [app, setApp] = useState<App | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const fetchedApp = await getAppById(appId);
            setApp(fetchedApp);
            setLoading(false);
        })();
    }, [appId]);

    return { app, loading };
}

function AppPage({ params }: { params: { app_id: string } }) {
    const { app, loading } = useApp(params.app_id);
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="text-3xl text-gray-500">Loading...</span>
            </div>
        );
    }
    if (!app) {
        notFound();
    }
    const { project, appType, webUrl, appFile, apiDocUrl } = app;

    const screenshots =
        app.screenshots?.map((screenshot: any, index: number) => ({
            id: index,
            imageUrl: screenshot.imageUrl,
            sortOrder: screenshot.sortOrder,
        })) || [];

    const getAction = () => {
        if ((appType?.name === "Web" || appType?.name === "Mobile") && (webUrl || appFile)) {
            return {
                url: webUrl || appFile,
                label: "Start Testing",
                disabled: false,
            };
        } else if (appType?.name === "API" && appFile) {
            return {
                url: appFile,
                label: "View Documentation",
                disabled: false,
            };
        }
        return {
            url: null,
            label: "Not Available",
            disabled: true,
        };
    };

    const action = getAction();

    return (
        <div className="flex justify-center">
            <div className="flex-1 max-w-[1440px] px-4">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <AppBanner
                            bannerImage={
                                app.bannerImage ||
                                "/placeholders/logo_placeholder.png"
                            }
                            title={project?.name || "No Name"}
                            subtitle={app.subtitle}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 min-w-[260px] max-w-sm flex flex-col justify-start">
                            <h1 className="text-4xl font-bold mb-2">
                                {project?.name || "No Name"}
                            </h1>
                            <div className="text-sm text-gray-700 mb-2">
                                {app.subtitle || "No subtitle"}
                            </div>
                            {project?.projectMembers && (
                                <div className="mb-4 text-sm font-bold">
                                    {project.projectMembers
                                        .map(
                                            (member) =>
                                                `${member.user?.firstName} ${member.user?.lastName}`,
                                        )
                                        .join(", ")}
                                </div>
                            )}
                            <AppActionButton
                                onClick={() => {
                                    if (action.url) window.open(action.url, "_blank");
                                }}
                                disabled={action.disabled}
                            >
                                {action.label}
                            </AppActionButton>
                        </div>
                        <div className="flex-1 min-w-[300px] max-w-3xl">
                            <AppScreenshotsCarousel
                                screenshots={screenshots}
                                appName={project?.name || "App"}
                            />

                            <div className="mb-8">
                                <h2 className="text-xl mb-3 font-semibold">
                                    About
                                </h2>
                                <p className="text-sm text-gray-700">
                                    {app.aboutDesc ||
                                        "No description available."}
                                </p>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-xl font-semibold">
                                        What's New
                                    </h2>
                                    <a
                                        href="#"
                                        className="text-xs"
                                        style={{ color: "#0000FF" }}
                                    >
                                        Version History
                                    </a>
                                </div>
                                <p className="text-sm text-gray-700">
                                    {app.content ||
                                        "No update information available."}
                                </p>
                            </div>
                            {/* Reviews */}
                            <AppReviews
                                appId={app.id}
                                appName={project?.name || "App"}
                            />
                            <BugReportForm appId={app.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
