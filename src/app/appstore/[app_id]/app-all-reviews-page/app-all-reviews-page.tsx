"use client";
import { useState, useEffect } from "react";
import AppReviews from "../_components/app-reviews";
import { getBaseUrl } from "@/lib/server_utils";
import AppActionButton from "../_components/app-action-button";
import AppBanner from "../_components/app-banner";
import NonRouterPushPagination from "@/components/NonRouterPushPagination";

interface AppAllReviewsPageProps {
    params: { app_id: string };
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

export default function AppAllReviewsPage({ params }: AppAllReviewsPageProps) {
    const [appName, setAppName] = useState<string>("App");
    const [appData, setAppData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [reviews, setReviews] = useState([]);
    const reviewsPerPage = 5;

    useEffect(() => {
        async function fetchAppData() {
            try {
                const app = await getAppById(params.app_id);
                if (app) {
                    setAppData(app);
                    if (app.project && app.project.name) {
                        setAppName(app.project.name);
                    }
                }
            } catch (error) {
                console.error("Error fetching app data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAppData();
    }, [params.app_id]);

    useEffect(() => {
        async function fetchReviewsAndMeta() {
            try {
                const response = await fetch(
                    `/api/public/app/${params.app_id}/feedback?page=${currentPage}&rowsPerPage=${reviewsPerPage}`,
                );
                if (!response.ok) throw new Error("Failed to fetch reviews");
                const data = await response.json();
                setMaxPage(data.data.maxPage || 1);
                const sortedReviews = (data.data.feedbacks || []).slice().sort((a: any, b: any) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                setReviews(sortedReviews);
            } catch (error) {
                console.error(error);
            }
        }
        fetchReviewsAndMeta();
    }, [params.app_id, currentPage]);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] animate-fade-in">
                <svg className="animate-spin h-12 w-12 text-black mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span className="text-lg text-black">Loading app's reviews…</span>
            </div>
        );
    }

    return (
        <div className="flex justify-center">
            <div className="flex-1 max-w-[1440px] px-4">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
                    {appData && (
                        <div className="mb-8">
                            <AppBanner
                                bannerImage={appData.bannerImage || "/placeholders/placeholder.png"}
                                title={appName}
                                subtitle={appData.subtitle}
                            />
                        </div>
                    )}
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* Left column */}
                        <div className="lg:w-1/3 lg:min-w-[300px] lg:max-w-md">
                            <div className="sticky top-6">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{appName}</h1>
                                <div className="text-base text-gray-600 mb-4 leading-relaxed">
                                    {appData?.subtitle || "No subtitle"}
                                </div>
                                {appData?.project?.projectMembers && (
                                    <div className="mb-6">
                                        <div className="text-sm text-gray-700">
                                            {appData.project.projectMembers
                                                .map(
                                                    (member: any) =>
                                                        `${member.user?.firstName} ${member.user?.lastName}`,
                                                )
                                                .join(", ")}
                                        </div>
                                    </div>
                                )}
                                {appData && (
                                    <AppActionButton
                                        onClick={() => {
                                            const { appType, webUrl, appFile } =
                                                appData;
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
                                        disabled={
                                            !appData.webUrl && !appData.appFile
                                        }
                                    >
                                        {(() => {
                                            const { appType, webUrl, appFile } =
                                                appData;
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
                        </div>
                        {/* Right column */}
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
                                <h2 className="text-xl font-semibold">Rating and Reviews</h2>
                            </div>
                            <AppReviews
                                appId={parseInt(params.app_id)}
                                appName={appName}
                                reviews={reviews}
                                maxReviews={reviewsPerPage}
                                showHeader={false}
                                showForm={false}
                            />
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
