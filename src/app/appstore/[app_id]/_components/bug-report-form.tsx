"use client";
import { useState } from "react";
import AppActionButton from "./app-action-button";
import { IconX, IconVideo, IconPhoto } from "@tabler/icons-react";

export default function BugReportForm({ appId }: { appId: number }) {
    const [showForm, setShowForm] = useState(false);
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

    const handleSubmit = async () => {
        if (!bugTitle.trim() || !bugDescription.trim()) {
            alert("Please fill in both title and description");
            return;
        }
        setIsSubmitting(true);
        try {
            console.log("Submitting bug report:", {
                appId,
                title: bugTitle,
                description: bugDescription,
                files: uploadedFiles,
            });
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
                className="text-xl font-semibold mb-2 flex items-center"
                onClick={() => setShowForm((prev) => !prev)}
            >
                Experienced a Bug?
                <span className={`ml-2 transition-transform duration-200 ${showForm ? '' : 'rotate-180'}`}>
                    <img src={"/ui/arrow2.svg"} alt="arrow" className="w-4 h-4 mb-2 inline-block" />
                </span>
            </button>
            {showForm && (
                <div className="mt-4">
                    <div className="mt-4">
                        <label className="text-xs text-gray-500">Bug Title *</label>
                        <input
                            type="text"
                            value={bugTitle}
                            onChange={(e) => setBugTitle(e.target.value)}
                            className="rounded-lg w-full px-3 py-2 bg-white border border-gray-200 mt-1 placeholder:text-sm placeholder:text-gray-400"
                            placeholder="Brief description of the bug"
                            maxLength={100}
                        />
                    </div>
                    <div className="mt-4">
                        <label className="text-xs text-gray-500">Bug Description *</label>
                        <textarea
                            value={bugDescription}
                            onChange={(e) => setBugDescription(e.target.value)}
                            className="rounded-lg w-full px-3 py-2 bg-white border border-gray-200 mt-1 placeholder:text-sm placeholder:text-gray-400 h-24 resize-none"
                            placeholder="Please describe the bug in detail"
                            maxLength={1000}
                        />
                        <div className="text-xs text-gray-500 mt-1 text-right">
                            {bugDescription.length}/1000
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="text-xs text-gray-500">Attachments (Optional)</label>
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
                    <div className="mt-5 flex justify-end">
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