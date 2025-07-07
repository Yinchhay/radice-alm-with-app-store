"use client";

import { useEffect, useState } from "react";
import { fetchApps } from "@/app/appstore/fetch";
import type { App } from "@/types/app_types";
import Pagination from "../../../components/Pagination";
import { useSearchParams } from "next/navigation";

interface PaginationData {
    totalRows: number;
    rowsPerPage: number;
    maxPage: number;
    page: number;
}

export default function AppStoreRequestsPage() {
    const [pendingApps, setPendingApps] = useState<App[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationData>({
        totalRows: 0,
        rowsPerPage: 5,
        maxPage: 1,
        page: 1,
    });
    
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    useEffect(() => {
        let isMounted = true;
        const getPendingApps = async () => {
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
                    console.log("All apps:", data.data.apps); // Debug log
                    
                    // Log all app statuses to see what we have
                    data.data.apps.forEach((item: any, index: number) => {
                        if (item.app) {
                            console.log(`App ${index}:`, {
                                id: item.app.id,
                                status: item.app.status,
                                statusType: typeof item.app.status,
                                name: item.app.subtitle || item.project?.name
                            });
                        } else {
                            console.log(`Item ${index} has no app data:`, item);
                        }
                    });
                    
                    // Temporarily show all apps to debug
                    const allAppsData = data.data.apps.filter((item: any) => item.app);
                    
                    console.log("All apps on current page:", allAppsData.length);
                    console.log("Current page:", data.data.page, "of", data.data.maxPage);
                    
                    // Filter for pending status only (check multiple case variations)
                    const pendingAppsData = allAppsData.filter((item: any) => {
                        const status = item.app?.status;
                        const isPending = status === "pending" || status === "Pending" || status === "PENDING";
                        console.log("Checking app:", item.app?.id, "Status:", status, "Is pending:", isPending);
                        return isPending;
                    });
                    
                    console.log("Pending apps found:", pendingAppsData.length);
                    
                    // Transform the data to match the expected format
                    const transformedApps = pendingAppsData.map((item: any) => ({
                        ...item.app,
                        project: item.project,
                        appType: item.appType,
                        category: item.category,
                        projectCategories: item.projectCategories,
                    }));
                    
                    setPendingApps(transformedApps);
                    
                    // Update pagination data
                    if (data.data.totalRows !== undefined) {
                        setPagination({
                            totalRows: data.data.totalRows,
                            rowsPerPage: data.data.rowsPerPage,
                            maxPage: data.data.maxPage,
                            page: data.data.page,
                        });
                    }
                } else {
                    console.log("No valid data structure found"); // Debug log
                    setPendingApps([]);
                }
            } catch (err) {
                if (!isMounted) return;
                setError("Failed to load apps. Please try again.");
                setPendingApps([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        getPendingApps();
        return () => {
            isMounted = false;
        };
    }, [currentPage]);

    return (
        <div className="w-full max-w-[1000px] mx-auto">
            <h1 className="text-2xl font-bold mb-4">Pending App Store Requests</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : pendingApps.length === 0 ? (
                <div>
                    <p>No pending app requests found.</p>
                    <p className="text-sm text-gray-500 mt-2">All apps have been processed or there are no pending requests.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pendingApps.map((app) => (
                        <div
                            key={app.id}
                            className="border rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between bg-white"
                        >
                            <div className="space-y-1">
                                <div>
                                    <span className="font-bold">Project / App Name:</span> {app.project?.name || app.subtitle || "No Name"}
                                </div>
                                <div>
                                    <span className="font-bold">Type:</span> {app.appType?.name || "-"}
                                </div>
                                <div>
                                    {/* Priority relation is not available in the API response; fallback to '-' */}
                                    <span className="font-bold">Update Type:</span> {"-"}
                                </div>
                                <div>
                                    <span className="font-bold">Status:</span> {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : "-"}
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0 flex items-center justify-end">
                                <button
                                    className="border border-gray-300 rounded-lg px-4 py-2 font-semibold hover:bg-gray-100 transition"
                                    // onClick={() => ...} // Add navigation logic if needed
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Pagination Component */}
            {!loading && !error && pagination.maxPage > 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination page={currentPage} maxPage={pagination.maxPage} />
                </div>
            )}
        </div>
    );
}