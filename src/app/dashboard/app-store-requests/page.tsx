"use client";

import { useEffect, useState } from "react";
import { fetchApps } from "@/app/appstore/fetch";
import type { App } from "@/types/app_types";

export default function AppStoreRequestsPage() {
    const [pendingApps, setPendingApps] = useState<App[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                    // Flatten and filter for pending status
                    const allApps = data.data.apps.map((item: any) => ({
                        ...item.app,
                        project: item.project,
                        appType: item.appType,
                        category: item.category,
                        projectCategories: item.projectCategories,
                    }));
                    setPendingApps(allApps.filter((app: App) => app.status === "pending"));
                } else {
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
    }, []);

    return (
        <div className="w-full max-w-[1000px] mx-auto">
            <h1 className="text-2xl font-bold mb-4">App Store Requests</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : pendingApps.length === 0 ? (
                <p>No pending app requests found.</p>
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
        </div>
    );
}