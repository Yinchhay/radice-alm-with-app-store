"use client";
import React, { useState, useEffect } from "react";
import { getBaseUrl } from "@/lib/server_utils";
import { notFound } from "next/navigation";
import AppBanner from "./_components/app-banner";
import AppActionButton from "./_components/app-action-button";
import AppScreenshotsCarousel from "./_components/app-screenshots-carousel";
import AppReviews from "./_components/app-reviews";
import BugReportForm from "./_components/bug-report-form";
import Popup from "@/components/Popup";
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

async function fetchCurrentVersion(appId: string) {
    try {
        const response = await fetch(
            `${await getBaseUrl()}/api/public/app/${appId}/version`,
            {
                method: "GET",
                cache: "no-store",
            },
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.success ? data.data.current : null;
    } catch (error) {
        console.error("Error fetching current version:", error);
        return null;
    }
}

function useApp(appId: string) {
    const [app, setApp] = useState<App | null>(null);
    const [currentVersion, setCurrentVersion] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const [fetchedApp, versionData] = await Promise.all([
                getAppById(appId),
                fetchCurrentVersion(appId)
            ]);
            setApp(fetchedApp);
            setCurrentVersion(versionData);
            setLoading(false);
        })();
    }, [appId]);

    return { app, currentVersion, loading };
}

function AppPage({ params }: { params: { app_id: string } }) {
    const { app, currentVersion, loading } = useApp(params.app_id);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] animate-fade-in">
                <svg className="animate-spin h-12 w-12 text-black mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span className="text-lg text-black">Loading app details…</span>
            </div>
        );
    }
    if (!app) {
        notFound();
    }
    const { project, appType, webUrl, appFile } = app;

    const screenshots =
        app.screenshots?.map((screenshot: any, index: number) => ({
            id: index,
            imageUrl: screenshot.imageUrl,
            sortOrder: screenshot.sortOrder,
        })) || [];

    const getAction = () => {
        if (
            (appType?.name === "Web" || appType?.name === "Mobile") &&
            (webUrl || appFile)
        ) {
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
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
                    <div className="mb-8">
                        <AppBanner
                            bannerImage={app.bannerImage || "/placeholders/placeholder.png"}
                            title={project?.name || "No Name"}
                            subtitle={app.subtitle}
                        />
                    </div>
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        <div className="lg:w-1/3 lg:min-w-[300px] lg:max-w-md">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                    {project?.name || "No Name"}
                                </h1>
                                <div className="text-base text-gray-600 mb-4 leading-relaxed">
                                    {app.subtitle || "No subtitle"}
                                </div>
                                {project?.projectMembers && (
                                    <div className="mb-6">
                                        <div className="text-sm font-bold">
                                            {project.projectMembers
                                                .map(
                                                    (member) =>
                                                        `${member.user?.firstName} ${member.user?.lastName}`,
                                                )
                                                .join(", ")}
                                        </div>
                                    </div>
                                )}
                                <AppActionButton
                                    onClick={() => {
                                        if (action.url)
                                            window.open(action.url, "_blank");
                                    }}
                                    disabled={action.disabled}
                                >
                                    {action.label}
                                </AppActionButton>
                        </div>
                        <div className="lg:w-2/3 lg:flex-1">
                            <AppScreenshotsCarousel
                                screenshots={screenshots}
                                appName={project?.name || "App"}
                            />
                            <div className="mb-10">
                                <h2 className="text-xl mb-4 font-semibold">
                                    About
                                </h2>
                                <p className="text-sm leading-5 break-words whitespace-pre-wrap max-w-none overflow-wrap-anywhere word-break-break-all sm:word-break-normal" style={{ color: "rgba(0,0,0,0.64)", overflowWrap: "anywhere", wordBreak: "break-word" }}>
                                    {app.aboutDesc || "No description available."}
                                </p>
                            </div>
                            <div className="mb-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold">
                                        What's New
                                    </h2>
                                    <a
                                        href={`/appstore/${params.app_id}/app-version-history-page`}
                                        className="text-xs"
                                        style={{ color: "#0000FF" }}
                                    >
                                        Version History
                                    </a>
                                </div>
                                <div className="text-sm leading-5" style={{ color: "rgba(0,0,0,0.64)" }}>
                                    {currentVersion?.content ? (
                                        <div className="space-y-2 max-w-none overflow-wrap-anywhere">
                                            {currentVersion.content.split('\n').map((line: string, index: number) => (
                                                <p key={index} className={line.trim() === '' ? 'h-2' : 'break-words whitespace-pre-wrap word-break-break-all sm:word-break-normal'} style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>
                                                    {line.startsWith('- ') ? (
                                                        <span className="flex items-start gap-2">
                                                            <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
                                                            <span className="break-words whitespace-pre-wrap word-break-break-all sm:word-break-normal" style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>{line.substring(2)}</span>
                                                        </span>
                                                    ) : line.startsWith('* ') ? (
                                                        <span className="flex items-start gap-2">
                                                            <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
                                                            <span className="break-words whitespace-pre-wrap word-break-break-all sm:word-break-normal" style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>{line.substring(2)}</span>
                                                        </span>
                                                    ) : (
                                                        line || <br />
                                                    )}
                                                </p>
                                            ))}
                                        </div>
                                    ) : (
                                        "No update information available."
                                    )}
                                </div>
                            </div>
                            <div className="mb-10">
                                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-x-80">
                                    {/* Left column */}
                                    <div className="flex flex-col">
                                        <div className="mb-6">
                                            <h3 className="text-base sm:text-lg font-semibold mb-2">
                                                Updated on
                                            </h3>
                                            <div className="text-sm sm:text-base text-gray-600 mb-3">
                                                {currentVersion?.updatedAt
                                                    ? new Date(
                                                        currentVersion.updatedAt,
                                                    ).toLocaleDateString(
                                                        undefined,
                                                        {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        },
                                                    )
                                                    : "N/A"}
                                            </div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2">
                                                Version
                                            </h3>
                                            <div className="text-sm sm:text-base text-gray-600">
                                                {currentVersion?.versionNumber || "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Right column */}
                                    <div className="flex flex-col">
                                        <h3 className="text-base sm:text-lg font-semibold mb-4">
                                            Compatibility
                                        </h3>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={
                                                        appType?.name === "Web"
                                                            ? "/ui/tick.mark.svg"
                                                            : "/ui/x_mark.svg"
                                                    }
                                                    alt="Web"
                                                    className="w-6 h-6"
                                                />
                                                <span className="text-sm">
                                                    Web
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={
                                                        appType?.name ===
                                                        "Mobile"
                                                            ? "/ui/tick.mark.svg"
                                                            : "/ui/x_mark.svg"
                                                    }
                                                    alt="Mobile"
                                                    className="w-6 h-6"
                                                />
                                                <span className="text-sm">
                                                    Andriod
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={"/ui/x_mark.svg"}
                                                    alt="iOS"
                                                    className="w-6 h-6"
                                                />
                                                <span className="text-sm">
                                                    iOS
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-10">
                                <AppReviews
                                    appId={app.id}
                                    appName={project?.name || "App"}
                                    onLoginRequired={() => setShowLoginPopup(true)}
                                />
                            </div>
                            <div className="mb-10">
                                <BugReportForm 
                                    appId={app.id}
                                    onLoginRequired={() => setShowLoginPopup(true)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Popup
                isOpen={showLoginPopup}
                onClose={() => setShowLoginPopup(false)}
                title="Authentication Required"
            >
                <div className="text-center">
                    <p className="mb-6 text-gray-600">
                        You need to be logged in to write reviews and report bugs.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => {
                                setShowLoginPopup(false);
                                window.location.href = '/tester-registration';
                            }}
                            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Sign Up
                        </button>
                        <button
                            onClick={() => setShowLoginPopup(false)}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Popup>
        </div>
    );
}
