"use client";
import { useState } from "react";

export default function ApproveRejectButtons({ appId }: { appId: string }) {
  const [loading, setLoading] = useState<"" | "approve" | "reject">("");
  const [message, setMessage] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  async function handleAction(action: "approve" | "reject") {
    if (!reason.trim()) {
      setMessage("Please provide a reason before proceeding.");
      return;
    }
    setLoading(action);
    setMessage(null);
    try {
      const res = await fetch(`/api/internal/app/${appId}/${action}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
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
    <div className="flex flex-col items-center gap-4 pt-6">
      <textarea
        className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md text-sm"
        rows={3}
        placeholder="Enter reasoning for approval or rejection..."
        value={reason}
        onChange={e => setReason(e.target.value)}
        disabled={loading === "approve" || loading === "reject"}
      />
      <div className="flex gap-4 justify-center w-full">
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
      </div>
      {message && <span className="ml-4 text-sm font-medium text-gray-700">{message}</span>}
    </div>
  );
} 