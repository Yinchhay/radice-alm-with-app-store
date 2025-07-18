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
import InformationSection from "./appbuilder-modules/InformationSection";
import BannerAndCardSection from "./appbuilder-modules/BannerAndCardSection";
import UpdateInformationSection from "./appbuilder-modules/UpdateInformationSection";
import ScreenshotsSection from "./appbuilder-modules/ScreenshotsSection";
import { useRouter } from "next/navigation";
import AppUploadSection from "./appbuilder-modules/AppUploadSection";

// Use env for API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function FileDropzone({
    label,
    accept = "*",
    multiple = false,
    onChange,
    disabled = false,
}: {
    label: string;
    accept?: string;
    multiple?: boolean;
    onChange?: (files: FileList) => void;
    disabled?: boolean;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && onChange) {
            onChange(e.dataTransfer.files);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition"
        >
            <input
                type="file"
                accept={accept}
                multiple={multiple}
                ref={inputRef}
                onChange={(e) => {
                    if (e.target.files && onChange) {
                        onChange(e.target.files);
                    }
                }}
                className="hidden"
            />
            <p className="text-sm text-gray-500 mb-1">
                Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-400">{label}</p>
        </div>
    );
}

interface InformationTabProps {
    projectId: string;
}

// Enhanced helper for inserting markdown at cursor or line start
function insertAtCursor(
    textarea: HTMLTextAreaElement | null,
    before: string,
    after: string = "",
    placeholder: string = "",
    block = false,
    linePrefix = "",
    setValue?: (val: string) => void,
) {
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const selected = value.substring(start, end) || placeholder;
    let newValue, cursorPos;
    if (block) {
        newValue =
            value.substring(0, start) +
            before +
            selected +
            after +
            value.substring(end);
        cursorPos = start + before.length + selected.length + after.length;
    } else if (linePrefix) {
        const lines = value.substring(start, end).split("\n");
        const modified = lines
            .map((line) => linePrefix + (line || placeholder))
            .join("\n");
        newValue = value.substring(0, start) + modified + value.substring(end);
        cursorPos = start + linePrefix.length;
    } else {
        newValue =
            value.substring(0, start) +
            before +
            selected +
            after +
            value.substring(end);
        cursorPos = start + before.length + selected.length + after.length;
    }
    textarea.value = newValue;
    textarea.setSelectionRange(cursorPos, cursorPos);
    textarea.focus();
    const event = new Event("input", { bubbles: true });
    textarea.dispatchEvent(event);
    if (setValue) setValue(newValue);
}

// Add this function to call the backend to reorder screenshots
async function reorderScreenshotsOnServer(appId: number, newOrder: string[]) {
    try {
        const res = await fetch(
            `${API_BASE_URL}/api/internal/app/${appId}/images/screenshots`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "reorder", order: newOrder }),
                credentials: "include",
            },
        );
        return await res.json();
    } catch (e) {
        return { success: false, message: "Failed to reorder screenshots" };
    }
}

// Add a function to delete screenshots on the backend
async function deleteScreenshotOnServer(appId: number, screenshotId: number) {
    try {
        const res = await fetch(
            `${API_BASE_URL}/api/internal/app/${appId}/images/screenshots?screenshot_id=${screenshotId}`,
            {
                method: "DELETE",
                credentials: "include",
            },
        );
        return await res.json();
    } catch (e) {
        return { success: false, message: "Failed to delete screenshot" };
    }
}

async function fetchScreenshotIds(
    appId: number,
    urls: string[],
): Promise<{ url: string; id: number }[]> {
    try {
        const res = await fetch(
            `${API_BASE_URL}/api/internal/app/${appId}/images/screenshots`,
            {
                method: "GET",
                credentials: "include",
            },
        );
        const data = await res.json();
        if (data.success && data.screenshots) {
            const urlToId = new Map();
            data.screenshots.forEach((s: any) => {
                if (s.imageUrl) {
                    urlToId.set(s.imageUrl, s.id);
                }
            });
            return urls
                .map((url) => ({
                    url,
                    id: urlToId.get(url),
                }))
                .filter((item: { url: string; id: number }) => item.id);
        }
        return [];
    } catch (e) {
        console.error("Failed to fetch screenshot IDs:", e);
        return [];
    }
}

async function uploadScreenshotsWithProgress(
    files: File[],
    appId: number,
    updateProgress: (
        file: File,
        percent: number,
        done?: boolean,
        uploadedUrl?: string,
    ) => void,
) {
    const uploadedUrls: string[] = [];
    await Promise.all(
        files.map(
            (file) =>
                new Promise<void>((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    const formData = new FormData();
                    formData.append("screenshots", file);
                    xhr.open(
                        "POST",
                        `${API_BASE_URL}/api/internal/app/${appId}/images/screenshots`,
                        true,
                    );
                    xhr.withCredentials = true;
                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const percent = Math.round(
                                (event.loaded / event.total) * 100,
                            );
                            updateProgress(file, percent);
                        }
                    };
                    xhr.onload = function () {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            try {
                                const data = JSON.parse(xhr.responseText);
                                if (
                                    data.success &&
                                    data.newScreenshotPaths &&
                                    data.newScreenshotPaths.length > 0
                                ) {
                                    uploadedUrls.push(
                                        data.newScreenshotPaths[0],
                                    );
                                    updateProgress(
                                        file,
                                        100,
                                        true,
                                        data.newScreenshotPaths[0],
                                    );
                                }
                                resolve();
                            } catch (e) {
                                reject(e);
                            }
                        } else {
                            reject(xhr.statusText);
                        }
                    };
                    xhr.onerror = function () {
                        reject(xhr.statusText);
                    };
                    xhr.send(formData);
                }),
        ),
    );

    if (uploadedUrls.length > 0) {
        const screenshotData = await fetchScreenshotIds(appId, uploadedUrls);
        return screenshotData.map((item) => ({ url: item.url, id: item.id }));
    }

    return [];
}

function makeScreenshotObj(fileOrUrl: any) {
    if (fileOrUrl instanceof File) {
        return {
            file: fileOrUrl,
            url: undefined,
            progress: 0,
            key: `${fileOrUrl.name}_${fileOrUrl.lastModified}_${crypto.randomUUID()}`,
        };
    } else if (typeof fileOrUrl === "string") {
        return {
            file: undefined,
            url: fileOrUrl,
            progress: 100,
            key: fileOrUrl,
        };
    } else if (fileOrUrl && fileOrUrl.key) {
        return fileOrUrl;
    } else if (fileOrUrl && fileOrUrl.url) {
        const key = fileOrUrl.id
            ? `${fileOrUrl.id}_${fileOrUrl.url}`
            : fileOrUrl.url;
        return { ...fileOrUrl, progress: 100, key };
    }
    return fileOrUrl;
}

function useDisableScrollOnDrag() {
    useEffect(() => {
        function handleDragStart() {
            document.body.style.overflow = "hidden";
        }
        function handleDragEnd() {
            document.body.style.overflow = "";
        }
        window.addEventListener("dragstart", handleDragStart);
        window.addEventListener("dragend", handleDragEnd);
        window.addEventListener("drop", handleDragEnd);
        return () => {
            window.removeEventListener("dragstart", handleDragStart);
            window.removeEventListener("dragend", handleDragEnd);
            window.removeEventListener("drop", handleDragEnd);
            document.body.style.overflow = "";
        };
    }, []);
}

function dedupeByKey(arr: any[]) {
    const seen = new Set();
    const result = arr.filter((item) => {
        if (!item.key) return true;
        if (seen.has(item.key)) {
            console.log("Deduping screenshot with key:", item.key);
            return false;
        }
        seen.add(item.key);
        return true;
    });
    console.log(
        "Screenshot keys after dedupe:",
        result.map((i) => i.key),
    );
    return result;
}

export default function InformationTab({ projectId }: InformationTabProps) {
    useDisableScrollOnDrag();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [appData, setAppData] = useState<FetchAppBuilderData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [priorityTesting, setPriorityTesting] = useState(false);
    const [description, setDescription] = useState("");
    const [webUrl, setWebUrl] = useState("");
    const [appType, setAppType] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [currentAppStatus, setCurrentAppStatus] = useState<string>("");

    const [appFiles, setAppFiles] = useState<any[]>([]);
    const [cardImages, setCardImages] = useState<any[]>([]);
    const [bannerImages, setBannerImages] = useState<any[]>([]);
    const [cardImagesToDelete, setCardImagesToDelete] = useState<string[]>([]);
    const [bannerImagesToDelete, setBannerImagesToDelete] = useState<string[]>([]);
    const [screenshots, setScreenshots] = useState<any[]>([]);

    const [saveLoading, setSaveLoading] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [webUrlError, setWebUrlError] = useState("");

    const [updateType, setUpdateType] = useState<"major" | "minor" | "patch">(
        "major",
    );
    const [whatsNew, setWhatsNew] = useState("");
    const [latestAcceptedVersion, setLatestAcceptedVersion] = useState<{
        major: number;
        minor: number;
        patch: number;
    } | null>(null);

    const [screenshotsToDelete, setScreenshotsToDelete] = useState<string[]>(
        [],
    );

    const [sessionCookie, setSessionCookie] = useState<string | null>(null);
    const [userAgent, setUserAgent] = useState<string | null>(null);

    const [project, setProject] = useState<any>(null);
    const initialDataRef = useRef<any>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        if (typeof document !== "undefined") {
            const cookies = document.cookie.split(";").map((c) => c.trim());
            const authSession = cookies.find((c) =>
                c.startsWith("auth_session="),
            );
            setSessionCookie(authSession || null);
            setUserAgent(window.navigator.userAgent);
        }
    }, []);

    // After loading data from backend, store it for comparison
    useEffect(() => {
        if (appData) {
            initialDataRef.current = {
                subtitle,
                description,
                appType,
                webUrl,
                cardImages,
                bannerImages,
                screenshots,
                updateType,
                whatsNew,
            };
        }
    }, [appData]);

    // Detect changes
    useEffect(() => {
        if (!initialDataRef.current) return;
        const changed =
            subtitle !== initialDataRef.current.subtitle ||
            description !== initialDataRef.current.description ||
            appType !== initialDataRef.current.appType ||
            webUrl !== initialDataRef.current.webUrl ||
            updateType !== initialDataRef.current.updateType ||
            whatsNew !== initialDataRef.current.whatsNew ||
            JSON.stringify(cardImages) !== JSON.stringify(initialDataRef.current.cardImages) ||
            JSON.stringify(bannerImages) !== JSON.stringify(initialDataRef.current.bannerImages) ||
            JSON.stringify(screenshots) !== JSON.stringify(initialDataRef.current.screenshots);
        setHasUnsavedChanges(changed);
    }, [subtitle, description, appType, webUrl, cardImages, bannerImages, screenshots, updateType, whatsNew]);

    // Warn on browser navigation (refresh, close, back)
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [hasUnsavedChanges]);

    const appTypeOptions = [
        { id: 1, name: "Web" },
        { id: 2, name: "Mobile" },
        { id: 3, name: "API" },
    ];

    const validateWebUrl = (url: string) => {
        if (!url) return "";
        if (/^https?:\/\//.test(url)) return "";
        return "URL must start with http:// or https://";
    };

    const [errors, setErrors] = useState<any>({});

    const validateFields = () => {
        const newErrors: any = {};
        if (!subtitle.trim()) newErrors.subtitle = "Required";
        if (!appType) newErrors.appType = "Required";
        if (!description.trim()) newErrors.description = "Required";
        if (cardImages.length === 0) newErrors.cardImages = "Required";
        if (bannerImages.length === 0) newErrors.bannerImages = "Required";
        if (screenshots.length === 0) newErrors.screenshots = "Required";
        if (latestAcceptedVersion && !whatsNew.trim())
            newErrors.whatsNew = "Required";
        if (latestAcceptedVersion && !updateType)
            newErrors.updateType = "Required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const aboutRef = useRef<HTMLTextAreaElement>(null);
    const whatsNewRef = useRef<HTMLTextAreaElement>(null);

    const handleAppFileChange = (files: FileList) =>
        setAppFiles(Array.from(files));
    const handleCardImageChange = (files: FileList) =>
        setCardImages(Array.from(files).map(file => ({ file, progress: 0, key: `${file.name}_${file.lastModified}_${crypto.randomUUID()}` })));
    const handleBannerImageChange = (files: FileList) =>
        setBannerImages(Array.from(files).map(file => ({ file, progress: 0, key: `${file.name}_${file.lastModified}_${crypto.randomUUID()}` })));
    const handleScreenshotsChange = (files: FileList) =>
        setScreenshots((prev) => {
            const newFiles = Array.from(files).map(makeScreenshotObj);
            if (prev.length + newFiles.length > MAX_SCREENSHOTS) {
                return [
                    ...prev,
                    ...newFiles.slice(0, MAX_SCREENSHOTS - prev.length),
                ];
            }
            return [...prev, ...newFiles];
        });

    useEffect(() => {
        let isMounted = true;
        async function loadAllData() {
            setLoading(true);
            setError(null);
            try {
                const projectRes = await fetch(
                    `${API_BASE_URL}/api/internal/project/${projectId}`,
                    {
                        method: "GET",
                        cache: "no-cache",
                    },
                );
                const projectData = await projectRes.json();
                if (!isMounted) return;
                if (!projectData.success)
                    throw new Error(
                        projectData.message || "Failed to load project",
                    );
                setProject(projectData.data.project);
                let draftApp;
                let appData;
                const appRes = await fetch(
                    `${API_BASE_URL}/api/internal/project/${projectId}/app`,
                    {
                        method: "GET",
                        cache: "no-cache",
                    },
                );
                appData = await appRes.json();
                if (
                    appData.success &&
                    appData.data &&
                    appData.data.app &&
                    (appData.data.status === "draft" ||
                        appData.data.status === "rejected")
                ) {
                    draftApp = appData.data.app;
                } else {
                    // If not found, create a new draft
                    const appPostRes = await fetch(
                        `${API_BASE_URL}/api/internal/project/${projectId}/app`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            cache: "no-cache",
                        },
                    );
                    const appPostData = await appPostRes.json();
                    if (
                        appPostData.success &&
                        appPostData.data &&
                        appPostData.data.app &&
                        (appPostData.data.status === "draft" ||
                            appPostData.data.status === "rejected")
                    ) {
                        draftApp = appPostData.data.app;
                    } else {
                        setError("No draft app found or could not create one.");
                        setLoading(false);
                        return;
                    }
                }
                // Prefill form fields from the draft app
                setAppData({
                    appId: draftApp.id,
                    status: draftApp.status,
                    app: draftApp,
                    isNewApp: false,
                    project: projectData.data.project,
                });
                setCurrentAppStatus(draftApp.status);
                setSubtitle(draftApp.subtitle || "");
                setDescription(draftApp.aboutDesc || "");
                setWebUrl(draftApp.webUrl || "");
                setPriorityTesting(draftApp.featuredPriority === 1);
                setAppType(draftApp.type ? String(draftApp.type) : "");
                if (draftApp.appFile) setAppFiles([{ url: draftApp.appFile }]);
                if (draftApp.cardImage)
                    setCardImages([{ url: draftApp.cardImage }]);
                if (draftApp.bannerImage)
                    setBannerImages([{ url: draftApp.bannerImage }]);
                if (
                    draftApp.screenshots &&
                    Array.isArray(draftApp.screenshots)
                ) {
                    setScreenshots(
                        dedupeByKey(
                            draftApp.screenshots.map((s: any) => {
                                if (
                                    typeof s === "object" &&
                                    s !== null &&
                                    s.id &&
                                    s.imageUrl
                                ) {
                                    return {
                                        id: s.id,
                                        url: s.imageUrl,
                                        key: `${s.id}_${s.imageUrl}`,
                                    };
                                }
                                if (typeof s === "string") {
                                    return makeScreenshotObj(s);
                                }
                                if (s && s.key) {
                                    return s;
                                }
                                return makeScreenshotObj(s);
                            }),
                        ),
                    );

                    setTimeout(() => {
                        setScreenshots((prev) =>
                            prev.map((s) => ({
                                ...s,
                                progress: s.url ? 100 : s.progress,
                            })),
                        );
                    }, 500);
                }
                setLoading(false);
                if (draftApp.id) {
                    fetch(
                        `${API_BASE_URL}/api/public/app/${draftApp.id}/version`,
                    )
                        .then((r) => r.json())
                        .then((data) => {
                            if (!isMounted) return;
                            if (
                                data.success &&
                                data.data &&
                                data.data.current &&
                                data.data.current.versionNumber &&
                                data.data.current.isCurrent === true
                            ) {
                                setLatestAcceptedVersion({
                                    major: data.data.current.majorVersion ?? 0,
                                    minor: data.data.current.minorVersion ?? 0,
                                    patch: data.data.current.patchVersion ?? 0,
                                });
                            } else {
                                setLatestAcceptedVersion(null);
                            }
                        })
                        .catch(() => setLatestAcceptedVersion(null));
                }
            } catch (err: any) {
                if (!isMounted) return;
                setError(err.message || "An error occurred while loading data");
                setLoading(false);
            }
        }
        loadAllData();
        return () => {
            isMounted = false;
        };
    }, [projectId]);

    useEffect(() => {
        if (
            appData &&
            appData.app &&
            typeof appData.app.updateType === "string"
        ) {
            setUpdateType(
                appData.app.updateType as "major" | "minor" | "patch",
            );
        }
    }, [appData]);

    useEffect(() => {
        if (
            appData &&
            appData.app &&
            typeof appData.app.aboutDesc === "string"
        ) {
            setWhatsNew(appData.app.aboutDesc);
        }
    }, [appData]);

    useEffect(() => {
        setWebUrlError(validateWebUrl(webUrl));
    }, [webUrl]);

    useEffect(() => {
        async function fetchLatestAcceptedVersion() {
            if (!appData?.appId) return;
            try {
                const res = await fetch(
                    `${API_BASE_URL}/api/public/app/${appData.appId}/version`,
                );
                const data = await res.json();
                if (
                    data.success &&
                    data.data &&
                    data.data.current &&
                    data.data.current.versionNumber &&
                    data.data.current.versionNumber !== null &&
                    data.data.current.versionNumber !== "" &&
                    data.data.current.isCurrent === true
                ) {
                    setLatestAcceptedVersion({
                        major: data.data.current.majorVersion ?? 0,
                        minor: data.data.current.minorVersion ?? 0,
                        patch: data.data.current.patchVersion ?? 0,
                    });
                } else {
                    setLatestAcceptedVersion(null);
                }
            } catch (error) {
                setLatestAcceptedVersion(null);
            }
        }
        fetchLatestAcceptedVersion();
    }, [appData?.appId]);

    const formatSize = (bytes: number) =>
        bytes < 1024
            ? `${bytes} B`
            : bytes < 1024 * 1024
              ? `${(bytes / 1024).toFixed(1)} KB`
              : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

    const simulateUpload = (files: FileList, setter: Function) => {
        const uploads = Array.from(files).map((file) => ({
            name: file.name,
            size: formatSize(file.size),
            progress: 0,
        }));
        setter((prev: any) => [...prev, ...uploads]);

        uploads.forEach((_, index) => {
            const interval = setInterval(() => {
                setter((prev: any) => {
                    const updated = [...prev];
                    const fileIndex = prev.length - uploads.length + index;
                    if (updated[fileIndex].progress < 100) {
                        updated[fileIndex].progress += 10;
                    }
                    return [...updated];
                });
            }, 150);
            setTimeout(() => clearInterval(interval), 1600);
        });
    };

    const previewCardStyle = {
        background: "#eee",
        margin: "8px 0",
        padding: 8,
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    };
    const previewImageStyle: React.CSSProperties = {
        width: 48,
        height: 48,
        objectFit: "cover",
        borderRadius: 4,
        background: "#fff",
        border: "1px solid #ccc",
    };

    const renderUploadList = useCallback(
        (uploads: any[], setter: Function, showArrows: boolean = false) => (
            <div className="space-y-2">
                {uploads.map((file, idx) => {
                    let previewUrl = "";
                    let filename = "";
                    if (file.file instanceof File) {
                        previewUrl = URL.createObjectURL(file.file);
                        filename = file.file.name;
                    } else if (file.url) {
                        previewUrl = file.url;
                        filename = file.url.split("/").pop() || file.url;
                    }
                    return (
                        <div
                            key={file.key || filename + idx}
                            style={previewCardStyle}
                        >
                            {showArrows && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 4,
                                        marginRight: 8,
                                    }}
                                >
                                    <button
                                        type="button"
                                        aria-label="Move up"
                                        disabled={idx === 0}
                                        onClick={() => {
                                            if (idx === 0) return;
                                            setter((prev: any[]) => {
                                                const arr = [...prev];
                                                [arr[idx - 1], arr[idx]] = [
                                                    arr[idx],
                                                    arr[idx - 1],
                                                ];
                                                // If all have .url, call reorder
                                                if (
                                                    arr.every((f) => f.url) &&
                                                    typeof reorderScreenshotsOnServer ===
                                                        "function" &&
                                                    arr[0].appId
                                                ) {
                                                    reorderScreenshotsOnServer(
                                                        arr[0].appId,
                                                        arr.map((f) => f.url),
                                                    );
                                                }
                                                return arr;
                                            });
                                        }}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor:
                                                idx === 0
                                                    ? "not-allowed"
                                                    : "pointer",
                                            padding: 0,
                                        }}
                                    >
                                        <IconChevronUp size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Move down"
                                        disabled={idx === uploads.length - 1}
                                        onClick={() => {
                                            if (idx === uploads.length - 1)
                                                return;
                                            setter((prev: any[]) => {
                                                const arr = [...prev];
                                                [arr[idx], arr[idx + 1]] = [
                                                    arr[idx + 1],
                                                    arr[idx],
                                                ];
                                                if (
                                                    arr.every((f) => f.url) &&
                                                    typeof reorderScreenshotsOnServer ===
                                                        "function" &&
                                                    arr[0].appId
                                                ) {
                                                    reorderScreenshotsOnServer(
                                                        arr[0].appId,
                                                        arr.map((f) => f.url),
                                                    );
                                                }
                                                return arr;
                                            });
                                        }}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor:
                                                idx === uploads.length - 1
                                                    ? "not-allowed"
                                                    : "pointer",
                                            padding: 0,
                                        }}
                                    >
                                        <IconChevronDown size={20} />
                                    </button>
                                </div>
                            )}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    flex: 1,
                                }}
                            >
                                {previewUrl && (
                                    <img
                                        src={previewUrl}
                                        alt="preview"
                                        style={previewImageStyle}
                                    />
                                )}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: 1,
                                    }}
                                >
                                    <span>{filename}</span>
                                    {file.size && (
                                        <div className="text-xs text-gray-500">
                                            {file.size}
                                        </div>
                                    )}
                                    {file.progress !== undefined && (
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                width: "100%",
                                            }}
                                        >
                                            <div
                                                className="bg-gray-200 h-1.5 rounded mt-1"
                                                style={{ flex: 1, minWidth: 0 }}
                                            >
                                                <div
                                                    className="h-1.5 bg-black rounded transition-all duration-200"
                                                    style={{
                                                        width: `${file.progress !== undefined ? file.progress : 100}%`,
                                                    }}
                                                />
                                            </div>
                                            <span
                                                style={{
                                                    minWidth: 36,
                                                    textAlign: "right",
                                                    fontSize: 12,
                                                    color: "#333",
                                                }}
                                            >
                                                {file.progress < 100
                                                    ? `${file.progress}%`
                                                    : "Uploaded"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    className="ml-2 text-gray-500 hover:text-red-500 text-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setter((prev: any[]) =>
                                            prev.filter(
                                                (_: any, i: number) =>
                                                    i !== idx,
                                            ),
                                        );
                                        if (
                                            file.url &&
                                            typeof setScreenshotsToDelete ===
                                                "function"
                                        )
                                            setScreenshotsToDelete(
                                                (prev: any[]) => [
                                                    ...prev,
                                                    file.url,
                                                ],
                                            );
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        ),
        [],
    );

    async function uploadFilesIfNeeded(files: any[], projectId: string, setProgress?: (idx: number, percent: number) => void, setImageState?: (updater: (prev: any[]) => any[]) => void) {
        const uploadable = files.filter((f) => f instanceof File || (f.file && f.file instanceof File));
        const existing = files.filter((f) => !(f instanceof File) && !f.file && f.url);
        let uploadedUrls: string[] = [];
        if (uploadable.length > 0) {
            const formData = new FormData();
            formData.append("projectId", projectId);
            uploadable.forEach((file, idx) => formData.append("files", file.file || file));
            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${API_BASE_URL}/api/internal/file/upload`, true);
            xhr.withCredentials = true;
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable && setProgress) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    setProgress(0, percent);
                }
            };
            const promise = new Promise<void>((resolve, reject) => {
                xhr.onload = function () {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const data = JSON.parse(xhr.responseText);
            if (data.success && data.paths) {
                uploadedUrls = data.paths.map((p: string) => "/uploads/" + p);
                                // Update state with new URLs and progress
                                if (setImageState) {
                                    setImageState((prev) => prev.map((img, i) => {
                                        if (i < uploadedUrls.length) {
                                            return { ...img, url: uploadedUrls[i], file: undefined, progress: 100 };
                                        }
                                        return img;
                                    }));
                                }
                            }
                            resolve();
                        } catch (e) {
                            reject(e);
                        }
            } else {
                        reject(xhr.statusText);
                    }
                };
                xhr.onerror = function () {
                    reject(xhr.statusText);
                };
            });
            xhr.send(formData);
            await promise;
        }
        return [...existing.map((f) => f.url), ...uploadedUrls];
    }

    const handleSave = async () => {
        if (!appData) return;
        if (!validateFields()) return;
        setSaveLoading(true);
        setSaveMessage(null);
        try {
            // Delete card images marked for deletion
            if (appData?.appId && cardImagesToDelete.length > 0) {
                for (const url of cardImagesToDelete) {
                    await fetch(`${API_BASE_URL}/api/internal/app/${appData.appId}/images/card`, {
                        method: 'DELETE',
                        credentials: 'include',
                    });
                }
                setCardImagesToDelete([]);
            }
            // Delete banner images marked for deletion
            if (appData?.appId && bannerImagesToDelete.length > 0) {
                for (const url of bannerImagesToDelete) {
                    await fetch(`${API_BASE_URL}/api/internal/app/${appData.appId}/images/banner`, {
                        method: 'DELETE',
                        credentials: 'include',
                    });
                }
                setBannerImagesToDelete([]);
            }
            let screenshotObjs = screenshots;
            const isNewFile = (f: any) =>
                f instanceof File || (f.file && f.file instanceof File);
            if (screenshots.some(isNewFile)) {
                const filesToUpload = screenshots
                    .filter(isNewFile)
                    .map((f) => (f instanceof File ? f : f.file));
                const others = screenshots.filter((f) => !isNewFile(f));
                const updateProgress = (
                    file: any,
                    percent: number,
                    done?: boolean,
                    uploadedUrl?: string,
                ) => {
                    setScreenshots((prev: any[]) =>
                        prev.map((f: any) => {
                            if (f === file || (f.file && f.file === file)) {
                                if (done && uploadedUrl) {
                                    return { url: uploadedUrl };
                                }
                                return { ...f, progress: percent };
                            }
                            return f;
                        }),
                    );
                };
                let uploaded: any[] = [];
                if (typeof appData.appId === "number") {
                    uploaded = await uploadScreenshotsWithProgress(
                        filesToUpload,
                        appData.appId,
                        updateProgress,
                    );
                }

                screenshotObjs = [
                    ...others,
                    ...uploaded.map(makeScreenshotObj),
                ];
                setScreenshots(dedupeByKey(screenshotObjs));
            }

            const [appFileUrl] = await uploadFilesIfNeeded(appFiles, projectId);
            const [cardImageUrl] = await uploadFilesIfNeeded(
                cardImages,
                projectId,
                (idx, percent) => setCardImages((prev) => prev.map((img, i) => i === idx ? { ...img, progress: percent } : img)),
                (updater) => setCardImages(updater),
            );
            const [bannerImageUrl] = await uploadFilesIfNeeded(
                bannerImages,
                projectId,
                (idx, percent) => setBannerImages((prev) => prev.map((img, i) => i === idx ? { ...img, progress: percent } : img)),
                (updater) => setBannerImages(updater),
            );
            const payload = {
                subtitle,
                aboutDesc: description,
                type: appType !== "" ? Number(appType) : undefined,
                webUrl,
                status: "draft",
                appFile: appFileUrl,
                cardImage: cardImageUrl,
                bannerImage: bannerImageUrl,
                featuredPriority: !!priorityTesting,
            };
            if (appData?.appId) {
                const orderedUrls = screenshotObjs
                    .filter((f) => f.url)
                    .map((f) => f.url);
                if (orderedUrls.length > 0) {
                    await reorderScreenshotsOnServer(
                        appData.appId,
                        orderedUrls,
                    );
                }
            }
        } catch (err) {
            setSaveMessage("Failed to save.");
        } finally {
            setSaveLoading(false);
        }
    };

    const handleContinue = async () => {
        if (!appData) return;
        if (!validateFields()) return;
        setSaveLoading(true);
        setSaveMessage(null);
        try {
            // Delete card images marked for deletion
            if (appData?.appId && cardImagesToDelete.length > 0) {
                for (const url of cardImagesToDelete) {
                    await fetch(`${API_BASE_URL}/api/internal/app/${appData.appId}/images/card`, {
                        method: 'DELETE',
                        credentials: 'include',
                    });
                }
                setCardImagesToDelete([]);
            }
            // Delete banner images marked for deletion
            if (appData?.appId && bannerImagesToDelete.length > 0) {
                for (const url of bannerImagesToDelete) {
                    await fetch(`${API_BASE_URL}/api/internal/app/${appData.appId}/images/banner`, {
                        method: 'DELETE',
                        credentials: 'include',
                    });
                }
                setBannerImagesToDelete([]);
            }
            // Upload files if needed (appFiles, cardImages, bannerImages, screenshots)
            const [appFileUrl] = await uploadFilesIfNeeded(appFiles, projectId);
            const [cardImageUrl] = await uploadFilesIfNeeded(
                cardImages,
                projectId,
                (idx, percent) => setCardImages((prev) => prev.map((img, i) => i === idx ? { ...img, progress: percent } : img)),
                (updater) => setCardImages(updater),
            );
            const [bannerImageUrl] = await uploadFilesIfNeeded(
                bannerImages,
                projectId,
                (idx, percent) => setBannerImages((prev) => prev.map((img, i) => i === idx ? { ...img, progress: percent } : img)),
                (updater) => setBannerImages(updater),
            );
            // Upload screenshots if needed
            let screenshotObjs = screenshots;
            const isNewFile = (f: any) =>
                f instanceof File || (f.file && f.file instanceof File);
            if (screenshots.some(isNewFile)) {
                const filesToUpload = screenshots
                    .filter(isNewFile)
                    .map((f) => (f instanceof File ? f : f.file));
                const others = screenshots.filter((f) => !isNewFile(f));
                const updateProgress = (
                    file: any,
                    percent: number,
                    done?: boolean,
                    uploadedUrl?: string,
                ) => {
                    setScreenshots((prev: any[]) =>
                        prev.map((f: any) => {
                            if (f === file || (f.file && f.file === file)) {
                                if (done && uploadedUrl) {
                                    return { url: uploadedUrl };
                                }
                                return { ...f, progress: percent };
                            }
                            return f;
                        }),
                    );
                };
                let uploaded: any[] = [];
                if (typeof appData.appId === "number") {
                    uploaded = await uploadScreenshotsWithProgress(
                        filesToUpload,
                        appData.appId,
                        updateProgress,
                    );
                }
                screenshotObjs = [
                    ...others,
                    ...uploaded.map(makeScreenshotObj),
                ];
                setScreenshots(dedupeByKey(screenshotObjs));
            }
            // Prepare payload for edit and publish
            const payload = {
                subtitle,
                aboutDesc: description,
                type: appType !== "" ? Number(appType) : undefined,
                webUrl,
                appFile: appFileUrl,
                cardImage: cardImageUrl,
                bannerImage: bannerImageUrl,
                updateType,
                whatsNew,
                status: "pending",
                featuredPriority: !!priorityTesting,
            };
            // First PATCH to update the draft app
            const editRes = await fetch(
                `${API_BASE_URL}/api/internal/app/${appData.appId}/edit`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                    credentials: "include",
                },
            );
            const editData = await editRes.json();
            if (!editData.success) {
                setSaveMessage(editData.message || "Failed to update draft.");
                setSaveLoading(false);
                return;
            }
            // Then PATCH to publish the draft app
            const publishRes = await fetch(
                `${API_BASE_URL}/api/internal/app/${appData.appId}/publish`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ updateType, whatsNew }),
                    credentials: "include",
                },
            );
            const publishData = await publishRes.json();
            if (publishData.success) {
                setSaveMessage("Submitted for review!");
                // Optionally refetch app data to update UI
                const updated = await fetchAppBuilderData(projectId);
                if (updated.success && updated.data) {
                    setAppData(updated.data);
                    setCurrentAppStatus(updated.data.status);
                }
                // Redirect to projects page
                router.push("/dashboard/projects");
                return;
            } else {
                setSaveMessage(publishData.message || "Failed to submit.");
            }
            // Reorder screenshots if needed
            if (appData?.appId) {
                const orderedUrls = screenshotObjs
                    .filter((f) => f.url)
                    .map((f) => f.url);
                if (orderedUrls.length > 0) {
                    await reorderScreenshotsOnServer(
                        appData.appId,
                        orderedUrls,
                    );
                }
            }
        } catch (err) {
            setSaveMessage("Failed to submit.");
        } finally {
            setSaveLoading(false);
        }
    };

    // Helper to compute next version
    function getNextVersion() {
        const v = latestAcceptedVersion;
        if (!v) return "1.0.0"; // Always show 1.0.0 for brand new app
        let major = v.major;
        let minor = v.minor;
        let patch = v.patch;
        switch (updateType) {
            case "major":
                major += 1;
                minor = 0;
                patch = 0;
                break;
            case "minor":
                minor += 1;
                patch = 0;
                break;
            case "patch":
                patch += 1;
                break;
        }
        return `${major}.${minor}.${patch}`;
    }

    const MainHeading = (
        <div className="space-y-1 mb-6">
            <h1 className="text-[24px] font-semibold">Information</h1>
            <p className="text-gray-500 text-sm">
                Fill in your app information and prepare it for listing on our
                store.
            </p>
        </div>
    );

    // Add a simple loading skeleton
    if (loading) {
        return (
            <div className="p-8 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2" />
                <div className="h-48 bg-gray-200 rounded w-full mb-4" />
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2" />
                <div className="h-48 bg-gray-200 rounded w-full mb-4" />
            </div>
        );
    }

    if (error && currentAppStatus !== "rejected") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
                <div className="bg-white shadow-lg rounded-xl p-8 flex flex-col items-center border border-gray-200 max-w-md w-full">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-yellow-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                        />
                    </svg>
                    <h2 className="text-xl font-bold mb-2 text-gray-800">
                        App Under Review
                    </h2>
                    <p className="text-gray-600 text-center mb-2">
                        This app is under review. You cannot submit or edit
                        information at this time.
                    </p>
                </div>
            </div>
        );
    }

    // Limit for screenshots
    const MAX_SCREENSHOTS = 8;

    return (
        <div className="space-y-6">
            {MainHeading}

            <InformationSection
                projectName={project?.name || "Loading..."}
                subtitle={subtitle}
                setSubtitle={setSubtitle}
                appType={appType}
                setAppType={setAppType}
                appTypeOptions={appTypeOptions}
                description={description}
                setDescription={setDescription}
                aboutRef={aboutRef}
                errors={errors}
                priorityTesting={priorityTesting}
                setPriorityTesting={setPriorityTesting}
                insertAtCursor={insertAtCursor}
                webUrl={webUrl}
                setWebUrl={setWebUrl}
                webUrlError={webUrlError}
            />

            {/* Always show AppUploadSection regardless of type */}
            <AppUploadSection
                appFiles={appFiles}
                setAppFiles={setAppFiles}
                renderUploadList={renderUploadList}
                FileDropzone={FileDropzone}
                errors={errors}
            />

            {latestAcceptedVersion && (
                <UpdateInformationSection
                    updateType={updateType}
                    setUpdateType={setUpdateType}
                    whatsNew={whatsNew}
                    setWhatsNew={setWhatsNew}
                    errors={errors}
                    latestAcceptedVersion={latestAcceptedVersion}
                    getNextVersion={getNextVersion}
                    whatsNewRef={whatsNewRef}
                    insertAtCursor={insertAtCursor}
                />
            )}

            <BannerAndCardSection
                cardImages={cardImages}
                setCardImages={(updater: any) => {
                    setCardImages((prev: any[]) => {
                        const next = typeof updater === 'function' ? updater(prev) : updater;
                        // Find removed card images (with .url)
                        const removed = prev.filter(img => img.url && !next.some((n: any) => n.url === img.url));
                        if (removed.length > 0) {
                            setCardImagesToDelete((old) => [...old, ...removed.map(r => r.url)]);
                        }
                        return next;
                    });
                }}
                bannerImages={bannerImages}
                setBannerImages={(updater: any) => {
                    setBannerImages((prev: any[]) => {
                        const next = typeof updater === 'function' ? updater(prev) : updater;
                        // Find removed banner images (with .url)
                        const removed = prev.filter(img => img.url && !next.some((n: any) => n.url === img.url));
                        if (removed.length > 0) {
                            setBannerImagesToDelete((old) => [...old, ...removed.map(r => r.url)]);
                        }
                        return next;
                                        });
                                    }}
                errors={errors}
                renderUploadList={renderUploadList}
                FileDropzone={FileDropzone}
                setCardImageProgress={(idx: number, percent: number) => setCardImages((prev) => prev.map((img, i) => i === idx ? { ...img, progress: percent } : img))}
                setBannerImageProgress={(idx: number, percent: number) => setBannerImages((prev) => prev.map((img, i) => i === idx ? { ...img, progress: percent } : img))}
                appId={appData?.appId}
            />

            <ScreenshotsSection
                screenshots={screenshots}
                setScreenshots={setScreenshots}
                MAX_SCREENSHOTS={MAX_SCREENSHOTS}
                makeScreenshotObj={makeScreenshotObj}
                dedupeByKey={dedupeByKey}
                renderUploadList={renderUploadList}
                FileDropzone={FileDropzone}
                errors={errors}
                appData={appData}
                deleteScreenshotOnServer={deleteScreenshotOnServer}
            />

            <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
                <Button
                    type="button"
                    variant="purple"
                    className="flex-1 basis-1/2 py-3 text-base font-semibold h-full justify-center"
                    onClick={handleContinue}
                    disabled={saveLoading || !!webUrlError}
                >
                    {saveLoading ? "Submitting..." : "Continue"}
                </Button>
            </div>
            {saveMessage && (
                <span className="ml-4 text-sm text-green-600">
                    {saveMessage}
                </span>
            )}
        </div>
    );
}
