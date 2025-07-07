"use client";
import { fetchApps } from "./fetch";
import { AppCard } from "@/components/AppCard";
import SearchBar from "@/components/SearchBar";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Pagination from "@/components/NonRouterPushPagination";
import type { App } from "@/types/app_types";

export default function AppStorePage() {
    const [apps, setApps] = useState<App[]>([]);
    const [activeType, setActiveType] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";
    const appsPerPage = 6;
    const [openTestingPage, setOpenTestingPage] = useState(1);
    const [livePage, setLivePage] = useState(1);

    useEffect(() => {
        let isMounted = true;

        const getApps = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchApps();
                if (!isMounted) return;

                if (
                    data &&
                    "success" in data &&
                    data.success &&
                    "data" in data &&
                    Array.isArray(data.data.apps)
                ) {
                    const sortedApps = data.data.apps
                        .map((item: any) => ({
                            ...item.app,
                            project: item.project,
                            appType: item.appType,
                            category: item.category,
                            projectCategories: item.projectCategories,
                        }))
                        .sort(
                            (a: App, b: App) =>
                                (b.featuredPriority ?? 0) -
                                (a.featuredPriority ?? 0),
                        );
                    setApps(sortedApps);
                } else {
                    setApps([]);
                }
            } catch (error) {
                if (!isMounted) return;
                console.error("Error fetching apps:", error);
                setError("Failed to load apps. Please try again.");
                setApps([]);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        getApps();

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredApps = apps.filter((app: App) => {
        const matchesSearch =
            (app.project?.name?.toLowerCase() || "").includes(searchQuery) ||
            (app.subtitle?.toLowerCase() || "").includes(searchQuery) ||
            (app.aboutDesc?.toLowerCase() || "").includes(searchQuery);

        const matchesType =
            activeType === "All" ||
            (activeType === "Web" && app.type === 1) ||
            (activeType === "Mobile" && app.type === 2) ||
            (activeType === "API" && app.type === 3) ||
            (activeType === "EdTech" && app.category?.name === "EdTech") ||
            (activeType === "FinTech" && app.category?.name === "FinTech") ||
            (activeType === "Humanitarian Engineering" &&
                app.category?.name === "Humanitarian Engineering") ||
            (activeType === "Gamification" &&
                app.category?.name === "Gamification");

        return matchesSearch && matchesType;
    });

    const groupedByPriority: Record<number, App[]> = filteredApps.reduce(
        (groups, app) => {
            const priority = app.featuredPriority ?? 0;
            if (!groups[priority]) groups[priority] = [];
            groups[priority].push(app);
            return groups;
        },
        {} as Record<number, App[]>,
    );

    const PriorityOrder = [
        { key: 2, label: "Open for Testing" },
        { key: 1, label: "Live" },
    ];

    function getPaginatedApps(appsForStatus: App[], page: number) {
        const maxPage = Math.max(
            1,
            Math.ceil(appsForStatus.length / appsPerPage),
        );
        const paginatedApps = appsForStatus.slice(
            (page - 1) * appsPerPage,
            page * appsPerPage,
        );
        return { paginatedApps, maxPage };
    }

    return (
        <div className="flex justify-center">
            <div className="flex-1 max-w-[1440px] px-4">
                <div className="w-full mx-auto px-4">
                    <div style={{ marginTop: "25px" }}>
                        <h1 className="text-4xl text-center text-gray-900">
                            Discover Paragon Students' Best Apps
                        </h1>
                    </div>
                    <div
                        style={{ marginTop: "40px", marginBottom: "40px" }}
                        className="max-w-xl mx-auto"
                    >
                        <SearchBar placeholder="Search apps..." />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 justify-center">
                        <span className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            UAT
                        </span>
                        {[
                            "All",
                            "Web",
                            "Mobile",
                            "API",
                            "EdTech",
                            "FinTech",
                            "Humanitarian Engineering",
                            "Gamification",
                        ].map((type) => (
                            <button
                                key={type}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    activeType === type
                                        ? "bg-gray-300 text-black"
                                        : "bg-white text-black-700 hover:bg-gray-100 border"
                                }`}
                                onClick={() => setActiveType(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: "60px", marginBottom: "80px" }}>
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-gray-500">Loading apps...</div>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-red-500 text-center">
                                <p className="mb-2">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    ) : (
                        PriorityOrder.map(({ key, label }) => {
                            const page = key === 2 ? openTestingPage : livePage;
                            const appsForStatus = groupedByPriority[key] || [];
                            const { paginatedApps, maxPage } = getPaginatedApps(
                                appsForStatus,
                                page,
                            );
                            return (
                                <div key={key} className="mb-12">
                                    <div className="flex items-center gap-2 mb-4">
                                        <h2 className="text-xl font-semibold">
                                            {label}
                                        </h2>
                                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                                    </div>
                                    <div className="grid gap-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                        {paginatedApps.length > 0 ? (
                                            paginatedApps.map((app: App) => (
                                                <AppCard
                                                    key={app.id}
                                                    app={app}
                                                />
                                            ))
                                        ) : (
                                            <div className="col-span-full text-gray-400 text-center">
                                                No apps in this section
                                            </div>
                                        )}
                                    </div>
                                    {maxPage > 1 && (
                                        <div className="flex justify-center mt-6">
                                            <Pagination
                                                page={page}
                                                maxPage={maxPage}
                                                onPageChange={(newPage) => {
                                                    if (key === 2) {
                                                        setOpenTestingPage(
                                                            newPage,
                                                        );
                                                    } else {
                                                        setLivePage(newPage);
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}