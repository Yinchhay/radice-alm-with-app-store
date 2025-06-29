"use client";
import React, { useState } from "react";
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

export default function AppPageWrapper(props: { params: { app_id: string } }) {
    return <AppPage {...props} />;
}

function AppPage({
    params,
}: {
    params: { app_id: string };
}) {
    const [showReview, setShowReview] = useState(false);
    const [showBug, setShowBug] = useState(false);
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

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Banner at the top */}
            <div className="mb-8">
                <AppBanner
                    bannerImage={app.bannerImage || "/placeholders/logo_placeholder.png"}
                    title={app.project?.name || "No Name"}
                    subtitle={app.subtitle}
                />
            </div>
            {/* Split layout below the banner */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left: Only App Name, Subtitle, Authors */}
                <div className="flex-1 min-w-[260px] max-w-xs flex flex-col justify-start">
                    <h1 className="text-5xl font-bold mb-2">Scholarize</h1>
                    <div className="text-lg text-gray-700 mb-2">TEST SUBTITLE</div>
                    <div className="mb-4 font-bold">
                        Rotnak HANG, Pisethsambath PHOK, Sihak Vityea SAM
                    </div>
                </div>
                {/* Right: Everything else */}
                <div className="flex-[2] min-w-[300px]">
                    {/* Screenshots */}
                    <div className="flex gap-4 mb-8">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="bg-black w-72 h-44 flex items-center justify-center text-white text-lg rounded">
                                Screenshots (Max 8)
                            </div>
                        ))}
                    </div>
                    {/* About */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">About</h2>
                        <p className="text-gray-700">Krukit offers a comprehensive suite of tools designed to enhance the teaching experience. From customizable rubrics and activity tracking to interactive spin wheels, KruKit simplifies classroom management and helps educators stay organized and engaged. Discover how Krukit can transform your teaching approach.</p>
                    </div>
                    {/* What's New */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">What's New <a href="#" className="text-blue-600 text-sm ml-2">Version History</a></h2>
                        <p className="text-gray-700">Krukit offers a comprehensive suite of tools designed to enhance the teaching experience. From customizable rubrics and activity tracking to interactive spin wheels, KruKit simplifies classroom management and helps educators stay organized and engaged. Discover how Krukit can transform your teaching approach.</p>
                    </div>
                    {/* Updated on, Version, Compatibility */}
                    <div className="mb-8 flex flex-col md:flex-row gap-12">
                        <div>
                            <div className="font-bold">Updated on</div>
                            <div className="mb-2">Jun 17, 2025</div>
                            <div className="font-bold">Version</div>
                            <div>18.1</div>
                        </div>
                        <div>
                            <div className="font-bold mb-2">Compatibility</div>
                            <div className="flex flex-col gap-2">
                                <span className="flex items-center gap-2"><span className="text-green-600">✔</span> Web</span>
                                <span className="flex items-center gap-2"><span className="text-red-600">✘</span> Android</span>
                                <span className="flex items-center gap-2"><span className="text-red-600">✘</span> iOS</span>
                            </div>
                        </div>
                    </div>
                    {/* Ratings and Reviews */}
                    <div className="mt-12 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Ratings and Reviews <span className="text-gray-400">&gt;</span></h2>
                        {/* Example reviews */}
                        <div className="mb-4">
                            <div className="font-semibold">Sothea Seng</div>
                            <div className="text-yellow-400">★★★★★</div>
                            <div className="text-gray-700 text-sm mb-2">Before I started using this tool, I was disabled. Now, I can walk.</div>
                        </div>
                        <div className="mb-4">
                            <div className="font-semibold">Yinchhay Im</div>
                            <div className="text-yellow-400">★★★★☆</div>
                            <div className="text-gray-700 text-sm mb-2">Before I used this tool, my brain was a mess of forgotten thoughts and misplaced ideas. I could never find anything! Now? Everything's organized. I can actually remember what I had for breakfast and my houseplants seem happier. It's like a tiny, digital organizer for your brain. Love it!</div>
                        </div>
                    </div>
                    {/* Write a Review (toggle) */}
                    <div className="mb-12">
                        <h2
                            className="text-xl font-semibold mb-2 cursor-pointer select-none flex items-center justify-between"
                            onClick={() => setShowReview((v) => !v)}
                        >
                            Write a Review
                            <span className="text-gray-400 ml-2">{showReview ? "▲" : "▼"}</span>
                        </h2>
                        {showReview && (
                            <div>
                                <div className="flex items-center mb-2">
                                    <span className="text-yellow-400 text-2xl">★★★★☆</span>
                                </div>
                                <input className="border rounded px-3 py-2 mb-2 w-full" placeholder="Title (Optional)" />
                                <textarea className="border rounded px-3 py-2 mb-2 w-full" placeholder="Review (Optional)" />
                                <button className="bg-black text-white px-6 py-2 rounded">Submit review</button>
                            </div>
                        )}
                    </div>
                    {/* Bug Report (toggle) */}
                    <div className="mb-12">
                        <h2
                            className="text-xl font-semibold mb-2 cursor-pointer select-none flex items-center justify-between"
                            onClick={() => setShowBug((v) => !v)}
                        >
                            Experienced a Bug?
                            <span className="text-gray-400 ml-2">{showBug ? "▲" : "▼"}</span>
                        </h2>
                        {showBug && (
                            <div>
                                <input className="border rounded px-3 py-2 mb-2 w-full" placeholder="Bug title *" />
                                <textarea className="border rounded px-3 py-2 mb-2 w-full" placeholder="Bug description *" />
                                <div className="flex gap-4 mb-2">
                                    <div>
                                        <button className="border px-4 py-2 rounded">Image</button>
                                        <div className="text-xs mt-1">bug_image.png 1.4 mb</div>
                                    </div>
                                    <div>
                                        <button className="border px-4 py-2 rounded">Video</button>
                                        <div className="text-xs mt-1">bug_video.mp4 16 mb</div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 mb-2">Bugs will be reported under <span className="font-mono">sseng7@paragoniu.edu.kh</span></div>
                                <button className="bg-black text-white px-6 py-2 rounded">Send bug report</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

