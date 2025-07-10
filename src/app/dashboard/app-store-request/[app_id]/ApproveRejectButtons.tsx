"use client";
import { useState } from "react";

export default function ApproveRejectButtons({ appId }: { appId: string }) {
  const [loading, setLoading] = useState<"" | "approve" | "reject">("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleAction(action: "approve" | "reject") {
    setLoading(action);
    setMessage(null);
    try {
      const res = await fetch(`/api/internal/app/${appId}/${action}`, {
        method: "PATCH",
        credentials: "include",
      });
      if (res.ok) {
        setMessage(action === "approve" ? "App approved!" : "App rejected!");
        // Optionally, refresh or redirect
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data?.message || `Failed to ${action} app.`);
      }
    } catch (e) {
      setMessage(`Failed to ${action} app.`);
    } finally {
      setLoading("");
    }
  }

  return (
    <div className="flex gap-4 justify-center pt-6">
      <button
        type="button"
        className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
        disabled={loading === "approve" || loading === "reject"}
        onClick={() => handleAction("approve")}
      >
        {loading === "approve" ? "Approving..." : "Accept"}
      </button>
      <button
        type="button"
        className="px-6 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50"
        disabled={loading === "approve" || loading === "reject"}
        onClick={() => handleAction("reject")}
      >
        {loading === "reject" ? "Rejecting..." : "Reject"}
      </button>
      {message && <span className="ml-4 text-sm font-medium text-gray-700">{message}</span>}
    </div>
  );
} 