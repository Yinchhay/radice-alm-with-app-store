"use client";
import { useState } from "react";
import AppActionButton from "./app-action-button";
import { IconX, IconVideo, IconPhoto } from "@tabler/icons-react";
import { useTesterAuth } from "@/app/contexts/TesterAuthContext";

export default function BugReportForm({ 
    appId, 
    onLoginRequired 
}: { 
    appId: number;
    onLoginRequired?: () => void;
}) {
    const [showForm, setShowForm] = useState(false);
    const { isAuthenticated } = useTesterAuth();
    const [bugTitle, setBugTitle] = useState("");
    const [bugDescription, setBugDescription] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'video') => {
        const file = event.target.files?.[0];
        if (file) {
            const newFile = {
                name: file.name,
                size: formatFileSize(file.size),
                type: fileType,
                raw: file,
            };
            setUploadedFiles(prev => [...prev, newFile]);
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/file', { method: 'POST', body: formData });
        if (!res.ok) throw new Error('File upload failed');
        const data = await res.json();
        return data.url;
    };

    const handleSubmit = async () => {
        if (!bugTitle.trim() || !bugDescription.trim()) {
            alert("Please fill in both title and description");
            return;
        }
        setIsSubmitting(true);
        try {
            let imageUrl, videoUrl;
            for (const file of uploadedFiles) {
                if (file.type === 'image') {
                    imageUrl = await uploadFile(file.raw as File);
                } else if (file.type === 'video') {
                    videoUrl = await uploadFile(file.raw as File);
                }
            }
            const res = await fetch(`/api/public/app/${appId}/bug-report`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: bugTitle,
                    description: bugDescription,
                    ...(imageUrl && { image: imageUrl }),
                    ...(videoUrl && { video: videoUrl }),
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                console.error("Bug report error:", errorData);
                throw new Error("Failed to submit bug report");
            }
            setBugTitle("");
            setBugDescription("");
            setUploadedFiles([]);
            setShowForm(false);
            alert("Bug report submitted successfully!");
        } catch (error) {
            console.error("Error submitting bug report:", error);
            alert("Failed to submit bug report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mb-8">
            <button
                type="button"
                className="text-xl font-semibold flex items-center"
                onClick={() => {
                    if (!isAuthenticated) {
                        onLoginRequired?.();
                        return;
                    }
                    setShowForm((prev) => !prev);
                }}
            >
                Experienced a Bug?
                <span className={`ml-2 transition-transform duration-200 ${showForm ? '' : 'rotate-180'}`}>
                    <img src={"/ui/arrow2.svg"} alt="arrow" className="w-4 h-4 mb-2 inline-block" />
                </span>
            </button>
            {showForm && (
                <div className="mt-8 p-5">
                    <div className="mb-5">
                        <label className="block text-xs text-gray-500 mb-2">Bug Title *</label>
                        <input
                            type="text"
                            value={bugTitle}
                            onChange={(e) => setBugTitle(e.target.value)}
                            onClick={() => {
                                if (!isAuthenticated) {
                                    onLoginRequired?.();
                                }
                            }}
                            className="rounded-lg w-full px-3 py-2 bg-white border border-gray-200 placeholder:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder={isAuthenticated ? "Brief description of the bug" : "Please log in to report a bug"}
                            maxLength={100}
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-xs text-gray-500 mb-2">Bug Description *</label>
                        <textarea
                            value={bugDescription}
                            onChange={(e) => setBugDescription(e.target.value)}
                            onClick={() => {
                                if (!isAuthenticated) {
                                    onLoginRequired?.();
                                }
                            }}
                            className="rounded-lg w-full px-3 py-2 bg-white border border-gray-200 placeholder:text-sm placeholder:text-gray-400 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder={isAuthenticated ? "Please describe the bug in detail" : "Please log in to report a bug"}
                            maxLength={1000}
                        />
                        <div className="text-xs text-gray-500 mt-1 text-right">
                            {bugDescription.length}/1000
                        </div>
                    </div>
                    <div className="mb-5">
                        <label className="block text-xs text-gray-500 mb-2">Attachments (Optional)</label>
                        <div className="flex gap-4 mb-3 mt-1">
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, 'image')}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="border px-4 py-2 rounded cursor-pointer hover:bg-gray-50 transition-colors duration-200 inline-flex items-center gap-2"
                                >
                                    <IconPhoto size={16} />
                                    Image
                                </label>
                            </div>
                            <div>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => handleFileUpload(e, 'video')}
                                    className="hidden"
                                    id="video-upload"
                                />
                                <label
                                    htmlFor="video-upload"
                                    className="border px-4 py-2 rounded cursor-pointer hover:bg-gray-50 transition-colors duration-200 inline-flex items-center gap-2"
                                >
                                    <IconVideo size={16} />
                                    Video
                                </label>
                            </div>
                        </div>
                        {uploadedFiles.length > 0 && (
                            <div className="space-y-2">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                                        <div className="flex items-center gap-2">
                                            {file.type === 'image' ? (
                                                <IconPhoto size={16} className="text-blue-600" />
                                            ) : (
                                                <IconVideo size={16} className="text-purple-600" />
                                            )}
                                            <span className="text-sm">{file.name}</span>
                                            <span className="text-xs text-gray-500">{file.size}</span>
                                        </div>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                        >
                                            <IconX size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end mt-2">
                        <AppActionButton
                            onClick={handleSubmit}
                            disabled={isSubmitting || !bugTitle.trim() || !bugDescription.trim()}
                            className="text-sm !px-6"
                        >
                            {isSubmitting ? "Submitting..." : "Send Bug Report"}
                        </AppActionButton>
                    </div>
                </div>
            )}
        </div>
    );
}