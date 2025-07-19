"use client";

import React, { useEffect, useState, useCallback } from "react";

interface BugReport {
    id: number;
    title: string;
    description: string;
    image?: string;
    video?: string;
    testerId?: string;
    appId?: number;
    createdAt?: string;
    updatedAt?: string;
    tester?: {
        firstName: string;
        lastName?: string;
    };
}

interface BugReportsTabProps {
    projectId: number;
}

interface AppSummary {
    id: number;
    name: string;
}

function getMediaUrl(mediaPath: string | null | undefined): string {
    if (!mediaPath) {
        return "/placeholders/placeholder.png";
    }

    if (mediaPath.startsWith("http")) {
        return mediaPath;
    }

    if (mediaPath.startsWith("/uploads/")) {
        const filename = mediaPath.replace("/uploads/", "");
        return `/api/file?filename=${filename}`;
    }

    return `/api/file?filename=${mediaPath}`;
}

export default function BugReportsTab({ projectId }: BugReportsTabProps) {
    const [bugReports, setBugReports] = useState<BugReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
    const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null);

    // Helper to get auth_session from cookies (not HttpOnly)
    const getSessionToken = () => {
        if (typeof document === "undefined") return undefined;
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth_session="))
            ?.split("=")[1];
    };

    // ESC key support for closing overlay
    useEffect(() => {
        if (!fullscreenImage && !fullscreenVideo) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setFullscreenImage(null);
                setFullscreenVideo(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [fullscreenImage, fullscreenVideo]);

    // Helper to extract filename for caption
    const getImageFilename = useCallback((url: string) => {
        try {
            return url.split("/").pop();
        } catch {
            return "";
        }
    }, []);

    useEffect(() => {
        const fetchAllBugReports = async () => {
            setLoading(true);
            setError(null);
            // Removed setDebugLogs([])
            try {
                const appsRes = await fetch(
                    `/api/internal/project/${projectId}/app`,
                );
                const appsData = await appsRes.json();
                let apps: AppSummary[] = [];
                if (
                    appsData.success &&
                    appsData.data &&
                    Array.isArray(appsData.data.apps)
                ) {
                    apps = appsData.data.apps.map((app: any) => ({
                        id: app.id,
                        name:
                            app.name ||
                            app.subtitle ||
                            app.title ||
                            `App #${app.id}`,
                    }));
                } else if (appsData.success && Array.isArray(appsData.data)) {
                    apps = appsData.data.map((app: any) => ({
                        id: app.id,
                        name:
                            app.name ||
                            app.subtitle ||
                            app.title ||
                            `App #${app.id}`,
                    }));
                } else {
                    setError(
                        appsData.message || "Failed to fetch apps for project",
                    );
                    setLoading(false);
                    return;
                }
                if (apps.length === 0) {
                    setBugReports([]);
                    setLoading(false);
                    return;
                }

                // Use the new internal API endpoint that directly uses project ID
                const sessionToken = getSessionToken();
                let headers = {};
                if (sessionToken) {
                    headers = { Authorization: `Bearer ${sessionToken}` };
                }

                try {
                    const res = await fetch(
                        `/api/internal/project/${projectId}/bug-report`,
                        {
                            headers,
                            credentials: "include",
                        },
                    );
                    const data = await res.json();
                    if (data.success && data.data && data.data.bugReports) {
                        setBugReports(data.data.bugReports);
                    } else {
                        setBugReports([]);
                    }
                } catch (err) {
                    setBugReports([]);
                }
            } catch (err) {
                setError("Failed to fetch bug reports");
            } finally {
                setLoading(false);
            }
        };
        if (projectId) fetchAllBugReports();
    }, [projectId]);

    // Standard heading for all states
    const MainHeading = (
        <div className="space-y-1 mb-6">
            <h1 className="text-[24px] font-semibold">Bug Reports</h1>
            <p className="text-gray-500 text-sm">
                This is where you can view bug reports submitted by your users
                for all apps in this project
            </p>
        </div>
    );

    if (loading)
        return (
            <div>
                {MainHeading}
                <div>Loading bug reports...</div>
            </div>
        );
    if (error)
        return (
            <div>
                {MainHeading}
                <div className="text-red-500">{error}</div>
            </div>
        );

    return (
        <div className="max-w-4xl">
            {MainHeading}
            <div className="space-y-10">
                {bugReports.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg
                                className="mx-auto h-12 w-12"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No bug reports yet
                        </h3>
                        <p className="text-gray-500">
                            Bug reports from your users will appear here when
                            they submit them.
                        </p>
                    </div>
                ) : (
                    <div className="border border-[#E6E8EC] rounded-lg bg-white">
                        {bugReports
                            .slice()
                            .sort(
                                (a, b) =>
                                    new Date(b.createdAt ?? "").getTime() -
                                    new Date(a.createdAt ?? "").getTime(),
                            )
                            .map((report, idx, arr) => (
                                <div
                                    key={report.id}
                                    className={
                                        idx !== arr.length - 1
                                            ? 'relative after:content-[" "] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-[#E6E8EC]'
                                            : ""
                                    }
                                    style={{
                                        fontFamily: "Inter",
                                        padding: "24px",
                                        border: "none",
                                        borderRadius: 0,
                                        marginBottom: 0,
                                        background: "transparent",
                                    }}
                                >
                                    {/* Top row: avatar, name, and time */}
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "100%",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: "12px",
                                            }}
                                        >
                                            {/* Avatar */}
                                            <div
                                                className="w-8 h-8 rounded-full bg-[#B1B5C3] flex items-center justify-center font-bold"
                                                style={{
                                                    color: "var(--OnBackground, #000)",
                                                    fontFamily: "Inter",
                                                    fontSize: "14px",
                                                    fontStyle: "normal",
                                                    fontWeight: 400,
                                                    lineHeight: "20px",
                                                }}
                                            >
                                                {report.tester &&
                                                report.tester.firstName ? (
                                                    report.tester.firstName
                                                        .charAt(0)
                                                        .toLowerCase()
                                                ) : (
                                                    <span className="text-gray-200">
                                                        ●
                                                    </span>
                                                )}
                                            </div>
                                            <div
                                                className="font-normal text-[#23272E]"
                                                style={{ fontSize: "14px" }}
                                            >
                                                {report.tester &&
                                                report.tester.firstName
                                                    ? `${report.tester.firstName} ${report.tester.lastName ?? ""}`.trim()
                                                    : report.testerId ||
                                                      "Unknown User"}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                color: "var(--OnBackground32, rgba(0, 0, 0, 0.32))",
                                                fontFamily: "Inter",
                                                fontSize: "12px",
                                                fontStyle: "normal",
                                                fontWeight: 400,
                                                lineHeight: "normal",
                                                marginLeft: "12px",
                                            }}
                                        >
                                            {report.createdAt
                                                ? new Date(
                                                      report.createdAt,
                                                  ).toLocaleString()
                                                : ""}
                                        </div>
                                    </div>
                                    {/* Title */}
                                    <div
                                        style={{
                                            color: "var(--OnBackground, #000)",
                                            fontFamily: "Inter",
                                            fontSize: "20px",
                                            fontStyle: "normal",
                                            fontWeight: 600,
                                            lineHeight: "20px",
                                            marginTop: "20px",
                                        }}
                                    >
                                        {report.title}
                                    </div>
                                    {/* Description */}
                                    <div
                                        style={{
                                            color: "var(--OnBackground64, rgba(0, 0, 0, 0.64))",
                                            fontFamily: "Inter",
                                            fontSize: "14px",
                                            fontStyle: "normal",
                                            fontWeight: 400,
                                            lineHeight: "20px",
                                            marginTop: "20px",
                                        }}
                                    >
                                        {report.description}
                                    </div>
                                    {/* Media (images/videos) */}
                                    {(report.image || report.video) && (
                                        <div className="flex flex-row gap-2 mt-5">
                                            {report.image && (
                                                <img
                                                    src={getMediaUrl(
                                                        report.image,
                                                    )}
                                                    alt="Bug report"
                                                    className="object-cover cursor-pointer aspect-[16/9] rounded"
                                                    style={{
                                                        width: "50%",
                                                        minWidth: 0,
                                                        maxWidth: "50%",
                                                        height: "auto",
                                                    }}
                                                    onClick={() =>
                                                        setFullscreenImage(
                                                            getMediaUrl(
                                                                report.image!,
                                                            ),
                                                        )
                                                    }
                                                    onError={(e) => {
                                                        e.currentTarget.onerror =
                                                            null;
                                                        e.currentTarget.src =
                                                            "/placeholders/placeholder.png";
                                                    }}
                                                />
                                            )}
                                            {report.video && (
                                                <video
                                                    src={getMediaUrl(
                                                        report.video,
                                                    )}
                                                    controls
                                                    className="object-cover cursor-pointer aspect-[16/9] rounded"
                                                    style={{
                                                        width: "50%",
                                                        minWidth: 0,
                                                        maxWidth: "50%",
                                                        height: "auto",
                                                    }}
                                                    onClick={() =>
                                                        setFullscreenVideo(
                                                            getMediaUrl(
                                                                report.video!,
                                                            ),
                                                        )
                                                    }
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                )}
            </div>
            {/* Fullscreen image overlay */}
            {fullscreenImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 animate-fadein"
                    style={{ animation: "fadein 0.2s" }}
                    onClick={() => setFullscreenImage(null)}
                >
                    <button
                        className="absolute top-8 right-10 text-white text-4xl font-bold bg-black bg-opacity-60 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-90 focus:outline-none shadow-lg border border-white/30 transition"
                        onClick={(e) => {
                            e.stopPropagation();
                            setFullscreenImage(null);
                        }}
                        aria-label="Close"
                        title="Close"
                    >
                        ×
                    </button>
                    <div
                        className="flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={fullscreenImage}
                            alt="Full screen bug report"
                            className="max-w-[90vw] max-h-[80vh] rounded-xl shadow-2xl border-4 border-white/80 bg-white"
                            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
                        />
                        <div className="mt-4 text-white text-sm bg-black bg-opacity-50 px-4 py-1 rounded-lg shadow">
                            {getImageFilename(fullscreenImage)}
                        </div>
                    </div>
                    <style>{`
            @keyframes fadein {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
                </div>
            )}
            {/* Fullscreen video overlay */}
            {fullscreenVideo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 animate-fadein"
                    style={{ animation: "fadein 0.2s" }}
                    onClick={() => setFullscreenVideo(null)}
                >
                    <button
                        className="absolute top-8 right-10 text-white text-4xl font-bold bg-black bg-opacity-60 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-90 focus:outline-none shadow-lg border border-white/30 transition"
                        onClick={(e) => {
                            e.stopPropagation();
                            setFullscreenVideo(null);
                        }}
                        aria-label="Close"
                        title="Close"
                    >
                        ×
                    </button>
                    <div
                        className="flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <video
                            src={fullscreenVideo}
                            controls
                            autoPlay
                            className="max-w-[90vw] max-h-[80vh] rounded-xl shadow-2xl border-4 border-white/80 bg-white"
                            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
                        />
                        <div className="mt-4 text-white text-sm bg-black bg-opacity-50 px-4 py-1 rounded-lg shadow">
                            {getImageFilename(fullscreenVideo)}
                        </div>
                    </div>
                    <style>{`
            @keyframes fadein {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
                </div>
            )}
        </div>
    );
}