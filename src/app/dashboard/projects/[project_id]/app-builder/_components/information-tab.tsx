"use client";

import React, {
    useRef,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import {
    fetchAppBuilderData,
    FetchAppBuilderData,
    saveAppDraft,
} from "../fetch";
import Button from "@/components/Button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react";
import InformationSection from "@/appbuilder-modules/InformationSection";
import BannerAndCardSection from "@/appbuilder-modules/BannerAndCardSection";
import UpdateInformationSection from "@/appbuilder-modules/UpdateInformationSection";
import ScreenshotsSection from "@/appbuilder-modules/ScreenshotsSection";
import { useRouter } from "next/navigation";
import AppUploadSection from "@/appbuilder-modules/AppUploadSection";

// Use env for API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

interface InformationTabProps {
    projectId: string;
}

export default function InformationTab({ projectId }: InformationTabProps) {
    const [apiName, setApiName] = useState("");
    const [description, setDescription] = useState("");
    const [endpoint, setEndpoint] = useState("");
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
                e.preventDefault();
        // Here you would call your API to create a new API entry
        setMessage("API submitted! (This is a placeholder)");
    };

                    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Create New API</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">API Name</label>
                    <input
                        type="text"
                        value={apiName}
                        onChange={e => setApiName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                                        </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        rows={3}
                        required
                                                />
                                            </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Endpoint URL</label>
                    <input
                        type="text"
                        value={endpoint}
                        onChange={e => setEndpoint(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 transition"
                >
                    Submit
                </button>
                {message && <div className="text-green-600 mt-2">{message}</div>}
            </form>
        </div>
    );
}
