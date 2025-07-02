"use client";
import { useState } from "react";
import Link from "next/link";
import Information from "./Information";
import Feedback from "./Feedback";
import BugReports from "./BugReports";
import VersionLogs from "./VersionLogs";

export default function AppBuilderTabs({ app }: { app: any }) {
    const [tab, setTab] = useState("Information");
    const tabs = ["Information", "Feedback", "Bug Reports", "Version Logs"];

    return (
        <div>
            <div className="mb-4">
                <Link href="/dashboard/projects">
                    <button className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-medium transition">&larr; Back to Projects</button>
                </Link>
            </div>
            <h1 className="text-5xl font-bold mb-4">App Builder</h1>
            <div className="flex gap-4 border-b mb-6">
                {tabs.map((t) => (
                    <button
                        key={t}
                        className={`py-2 px-4 font-semibold border-b-2 transition-colors duration-150 ${tab === t ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-500"}`}
                        onClick={() => setTab(t)}
                    >
                        {t}
                    </button>
                ))}
            </div>
            <div className="mt-4">
                {tab === "Information" && <Information app={app} />}
                {tab === "Feedback" && <Feedback />}
                {tab === "Bug Reports" && <BugReports />}
                {tab === "Version Logs" && <VersionLogs />}
            </div>
        </div>
    );
} 