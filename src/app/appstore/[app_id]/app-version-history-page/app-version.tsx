"use client";
import React, { useState, useEffect } from "react";
import { getBaseUrl } from "@/lib/server_utils";
import { notFound } from "next/navigation";
import AppActionButton from "../_components/app-action-button";
import AppBanner from "../_components/app-banner";
import NonRouterPushPagination from "@/components/NonRouterPushPagination";
import type { App } from "@/types/app_types";

interface VersionInfo {
    id: number;
    versionNumber: string;
    majorVersion: number;
    minorVersion: number;
    patchVersion: number;
    content: string;
    createdAt: string;
    isCurrent: boolean;
}

interface VersionHistoryData {
    current: VersionInfo | null;
    previous: VersionInfo[];
}

export default function AppVersionHistoryWrapper(props: {
    params: { app_id: string };
}) {
    return <AppVersionHistory {...props} />;
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

async function getVersionHistory(
    appId: string,
): Promise<VersionHistoryData | null> {
    try {
        const response = await fetch(
            `${await getBaseUrl()}/api/public/app/${appId}/version`,
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
        return data.success ? data.data : null;
    } catch (error) {
        console.error("Error fetching version history:", error);
        return null;
    }
}

function useAppAndVersions(appId: string) {
    const [app, setApp] = useState<App | null>(null);
    const [versions, setVersions] = useState<VersionHistoryData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const [fetchedApp, fetchedVersions] = await Promise.all([
                getAppById(appId),
                getVersionHistory(appId),
            ]);
            setApp(fetchedApp);
            setVersions(fetchedVersions);
            setLoading(false);
        })();
    }, [appId]);

    return { app, versions, loading };
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function timeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return formatDate(dateString);
}

function VersionCard({
    version,
    isCurrent,
}: {
    version: VersionInfo;
    isCurrent?: boolean;
}) {
    return (
        <div className="mb-6 sm:mb-8 p-4 sm:p-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
                <h3 className="text-base font-bold text-gray-900">
                    {version.versionNumber}
                </h3>
                <div className="text-sm text-gray-500">
                    {timeAgo(version.createdAt)}
                </div>
            </div>

            <div className="text-sm text-gray-700 leading-relaxed">
                {version.content ? (
                    <div className="space-y-2 max-w-none overflow-wrap-anywhere">
                        {version.content.split("\n").map((line, index) => (
                            <p
                                key={index}
                                className={
                                    line.trim() === ""
                                        ? "h-2"
                                        : "break-words whitespace-pre-wrap word-break-break-all sm:word-break-normal"
                                }
                                style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                            >
                                {line.startsWith("- ") ? (
                                    <span className="flex items-start gap-2">
                                        <span className="text-gray-400 mt-1 flex-shrink-0">
                                            •
                                        </span>
                                        <span className="break-words whitespace-pre-wrap word-break-break-all sm:word-break-normal" style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>
                                            {line.substring(2)}
                                        </span>
                                    </span>
                                ) : line.startsWith("* ") ? (
                                    <span className="flex items-start gap-2">
                                        <span className="text-gray-400 mt-1 flex-shrink-0">
                                            •
                                        </span>
                                        <span className="break-words whitespace-pre-wrap word-break-break-all sm:word-break-normal" style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>
                                            {line.substring(2)}
                                        </span>
                                    </span>
                                ) : (
                                    line || <br />
                                )}
                            </p>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">
                        No release notes available for this version.
                    </p>
                )}
            </div>
        </div>
    );
}

function AppVersionHistory({ params }: { params: { app_id: string } }) {
    const { app, versions, loading } = useAppAndVersions(params.app_id);
    const [filterType, setFilterType] = useState<
        "all" | "major" | "minor" | "patch"
    >("all");
    const [currentPage, setCurrentPage] = useState(1);
    const versionsPerPage = 5;

    useEffect(() => {
        setCurrentPage(1);
    }, [filterType]);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] animate-fade-in">
                <svg
                    className="animate-spin h-12 w-12 text-black mb-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                </svg>
                <span className="text-lg text-black">
                    Loading version history…
                </span>
            </div>
        );
    }

    if (!app) {
        notFound();
    }

    if (!versions || (!versions.current && versions.previous.length === 0)) {
        return (
            <div className="flex justify-center">
                <div className="flex-1 max-w-[1440px] px-4">
                    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
                        {app && (
                            <div className="mb-8">
                                <AppBanner
                                    bannerImage={
                                        app.bannerImage ||
                                        "/placeholders/placeholder.png"
                                    }
                                    title={app.project?.name || "App"}
                                    subtitle={app.subtitle}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Combine current and previous versions
    const allVersions = [
        ...(versions.current ? [versions.current] : []),
        ...versions.previous,
    ].sort((a, b) => {
        if (a.majorVersion !== b.majorVersion) {
            return b.majorVersion - a.majorVersion;
        }
        if (a.minorVersion !== b.minorVersion) {
            return b.minorVersion - a.minorVersion;
        }
        return b.patchVersion - a.patchVersion;
    });

    const filteredVersions = allVersions.filter((version) => {
        if (filterType === "all") return true;

        const versionType =
            version.majorVersion > 1 ||
            (version.majorVersion === 1 &&
                version.minorVersion === 0 &&
                version.patchVersion === 0)
                ? "major"
                : version.minorVersion > 0
                  ? "minor"
                  : "patch";

        return versionType === filterType;
    });

    const maxPage = Math.ceil(filteredVersions.length / versionsPerPage);
    const startIndex = (currentPage - 1) * versionsPerPage;
    const endIndex = startIndex + versionsPerPage;
    const paginatedVersions = filteredVersions.slice(startIndex, endIndex);

    return (
        <div className="flex justify-center">
            <div className="flex-1 max-w-[1440px] px-4">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
                    {app && (
                        <div className="mb-8">
                            <AppBanner
                                bannerImage={
                                    app.bannerImage ||
                                    "/placeholders/placeholder.png"
                                }
                                title={app.project?.name || "App"}
                                subtitle={app.subtitle}
                            />
                        </div>
                    )}
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* Left column */}
                        <div className="lg:w-1/3 lg:min-w-[300px] lg:max-w-md">
                            <div className="sticky top-6">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                    {app.project?.name || "App"}
                                </h1>
                                <div className="text-base text-gray-600 mb-4 leading-relaxed">
                                    {app?.subtitle || "No subtitle"}
                                </div>
                                {app?.project?.projectMembers && (
                                    <div className="mb-6">
                                        <div className="text-sm font-bold">
                                            {app.project.projectMembers
                                                .map(
                                                    (member: any) =>
                                                        `${member.user?.firstName} ${member.user?.lastName}`,
                                                )
                                                .join(", ")}
                                        </div>
                                    </div>
                                )}
                                {app && (
                                    <AppActionButton
                                        onClick={() => {
                                            const { appType, webUrl, appFile } =
                                                app;
                                            let url = null;
                                            if (
                                                (appType?.name === "Web" ||
                                                    appType?.name === "Mobile") &&
                                                (webUrl || appFile)
                                            ) {
                                                url = webUrl || appFile;
                                            } else if (
                                                appType?.name === "API" &&
                                                appFile
                                            ) {
                                                url = appFile;
                                            }
                                            if (url) window.open(url, "_blank");
                                        }}
                                        disabled={!app.webUrl && !app.appFile}
                                    >
                                        {(() => {
                                            const { appType, webUrl, appFile } =
                                                app;
                                            if (
                                                (appType?.name === "Web" ||
                                                    appType?.name === "Mobile") &&
                                                (webUrl || appFile)
                                            ) {
                                                return "Start Testing";
                                            } else if (
                                                appType?.name === "API" &&
                                                appFile
                                            ) {
                                                return "View Documentation";
                                            }
                                            return "Not Available";
                                        })()}
                                    </AppActionButton>
                                )}
                            </div>
                        </div>                            {/* Right column */}
                            <div className="lg:w-2/3 lg:flex-1">
                                <div className="mb-6 lg:mb-8 hidden sm:block">
                                    <button
                                        onClick={() => window.history.back()}
                                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 19l-7-7 7-7"
                                            />
                                        </svg>
                                        Back
                                    </button>
                                </div>
                                <div className="mb-6 lg:mb-8">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        Version History
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {allVersions.length} version
                                        {allVersions.length !== 1 ? "s" : ""}{" "}
                                        released
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                {filteredVersions.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">
                                            No versions found matching your
                                            criteria.
                                        </p>
                                    </div>
                                ) : (
                                    paginatedVersions.map((version) => (
                                        <VersionCard
                                            key={version.id}
                                            version={version}
                                            isCurrent={version.isCurrent}
                                        />
                                    ))
                                )}
                            </div>
                            {maxPage > 1 && (
                                <div className="flex justify-center mt-8">
                                    <NonRouterPushPagination
                                        page={currentPage}
                                        maxPage={maxPage}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
