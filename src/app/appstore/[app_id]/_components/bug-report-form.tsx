"use client";
import { useState } from "react";
import AppActionButton from "./app-action-button";
import { IconX, IconVideo, IconPhoto, IconInfoCircle } from "@tabler/icons-react";
import { useTesterAuth } from "@/app/contexts/TesterAuthContext";
import Popup from "@/components/Popup";

export default function BugReportForm({
  appId,
  onLoginRequired,
}: {
  appId: number;
  onLoginRequired?: () => void;
}) {
  const { isAuthenticated } = useTesterAuth();
  const [showForm, setShowForm] = useState(false);
  const [bugTitle, setBugTitle] = useState("");
  const [bugDescription, setBugDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showGuidePopup, setShowGuidePopup] = useState(false);

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    fileType: "image" | "video"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (fileType === "image" && uploadedFiles.some((f) => f.type === "image")) return;
    if (fileType === "video" && uploadedFiles.some((f) => f.type === "video")) return;

    const newFile = {
      name: file.name,
      size: formatFileSize(file.size),
      type: fileType,
      raw: file,
    };
    setUploadedFiles((prev) => [...prev, newFile]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleSubmit = async () => {
    if (!bugTitle.trim() || !bugDescription.trim()) {
      alert("Please fill in both title and description");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", bugTitle);
      formData.append("description", bugDescription);

      const imageFile = uploadedFiles.find((f) => f.type === "image");
      const videoFile = uploadedFiles.find((f) => f.type === "video");
      if (imageFile) formData.append("image", imageFile.raw as File);
      if (videoFile) formData.append("video", videoFile.raw as File);

      const res = await fetch(`/api/public/app/${appId}/bug-report`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to submit bug report");

      setBugTitle("");
      setBugDescription("");
      setUploadedFiles([]);
      setShowForm(false);
      setShowSuccessPopup(true);
    } catch (err) {
      console.error("Error submitting bug report:", err);
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
        <span
          className={`ml-2 transition-transform duration-200 ${showForm ? "" : "rotate-180"}`}
        >
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
              className="rounded-lg w-full px-3 py-2 bg-white border border-gray-200 placeholder:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Brief description of the bug"
              maxLength={100}
            />
          </div>

          <div className="mb-5">
            <label className="block text-xs text-gray-500 mb-2 flex items-center gap-1">
              Bug Description *
              <IconInfoCircle
                size={14}
                className="text-blue-500 cursor-pointer"
                onClick={() => setShowGuidePopup(true)}
                title="Bug reporting tips"
              />
            </label>
            <textarea
              value={bugDescription}
              onChange={(e) => setBugDescription(e.target.value)}
              className="rounded-lg w-full px-3 py-2 bg-white border border-gray-200 placeholder:text-sm placeholder:text-gray-400 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Describe the issue in detail"
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {bugDescription.length}/1000
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs text-gray-500 mb-2">Attachments (Optional)</label>
            <div className="flex gap-4 mb-3 mt-1">
              <label htmlFor="image-upload" className={`border px-4 py-2 rounded cursor-pointer transition-colors duration-200 inline-flex items-center gap-2 ${uploadedFiles.some((f) => f.type === "image") ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-50"}`}>
                <IconPhoto size={16} />
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "image")}
                className="hidden"
                id="image-upload"
                disabled={uploadedFiles.some((f) => f.type === "image")}
              />

              <label htmlFor="video-upload" className="border px-4 py-2 rounded cursor-pointer hover:bg-gray-50 transition-colors duration-200 inline-flex items-center gap-2">
                <IconVideo size={16} />
                Video
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileUpload(e, "video")}
                className="hidden"
                id="video-upload"
              />
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                    <div className="flex items-center gap-2">
                      {file.type === "image" ? (
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

      {/* Success Popup */}
      <Popup
        isOpen={showSuccessPopup}
        onClose={() => {
          setShowSuccessPopup(false);
          window.location.reload();
        }}
        title="Bug Report Submitted"
      >
        <div className="text-center">
          <p className="mb-6 text-gray-600">
            Thank you for your feedback! Your bug report has been submitted successfully.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setShowSuccessPopup(false);
                window.location.reload();
              }}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Popup>

      {/* Bug Guide Popup */}
      <Popup
        isOpen={showGuidePopup}
        onClose={() => setShowGuidePopup(false)}
        title="How to Write a Good Bug Report"
      >
        <ul className="text-sm text-left list-disc list-inside space-y-1 text-gray-700">
          <li><strong>Platform</strong>: Browser or Mobile</li>
          <li><strong>Version</strong>: e.g., 1.0.3 – Stage/Release/Production</li>
          <li><strong>Bug Type</strong>: UI, Visual, Text, Behavioral, Functional, Logical, etc.</li>
          <li><strong>Reporter</strong>: Your name (auto-captured)</li>
          <li><strong>Date Reported</strong>: Auto-filled</li>
          <li><strong>Description</strong>: Clear explanation of what’s wrong</li>
          <li><strong>Steps to Reproduce</strong>: How to recreate the bug</li>
          <li><strong>Expected Output</strong>: What should’ve happened</li>
          <li><strong>Screenshot/Video</strong>: Optional but helpful</li>
          <li><strong>Degree</strong>: Blocker, Critical, High, Medium, Low</li>
        </ul>
      </Popup>
    </div>
  );
}
