"use client";
import { useState } from "react";
import Overlay from "@/components/Overlay";
import { useRouter } from "next/navigation";

export default function ApproveRejectButtons({ appId }: { appId: string }) {
  const [loading, setLoading] = useState<"" | "approve" | "reject">("");
  const [message, setMessage] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [showRejectOverlay, setShowRejectOverlay] = useState(false);
  const router = useRouter();

  async function handleAction(action: "approve" | "reject") {
    if (action === "reject" && !reason.trim()) {
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
        body: action === "reject" ? JSON.stringify({ reason }) : undefined,
      });
      if (res.ok) {
        setMessage(action === "approve" ? "App approved!" : "App rejected!");
        setShowRejectOverlay(false);
        // Redirect to app store request list after success
        setTimeout(() => {
          router.push("/dashboard/app-store-request");
        }, 500);
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
          onClick={() => setShowRejectOverlay(true)}
        >
          Reject
        </button>
      </div>
      {message && <span className="ml-4 text-sm font-medium text-gray-700">{message}</span>}
      {showRejectOverlay && (
        <Overlay onClose={() => setShowRejectOverlay(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[400px] max-w-full p-6 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-center">Reject Application</h2>
            <label className="w-full text-sm font-medium mb-1" htmlFor="reject-reason">Reasoning</label>
            <textarea
              id="reject-reason"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-2"
              rows={4}
              maxLength={300}
              placeholder="Enter your reason for rejection..."
              value={reason}
              onChange={e => setReason(e.target.value)}
              disabled={loading === "reject"}
            />
            <div className="w-full text-xs text-gray-500 mb-4 text-right">{reason.length}/300 words</div>
            <button
              type="button"
              className="w-full px-6 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50"
              disabled={loading === "reject"}
              onClick={() => handleAction("reject")}
            >
              {loading === "reject" ? "Rejecting..." : "Reject"}
            </button>
            <button
              type="button"
              className="mt-2 w-full px-6 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
              onClick={() => setShowRejectOverlay(false)}
              disabled={loading === "reject"}
            >
              Cancel
            </button>
            {message && <span className="block mt-2 text-sm font-medium text-gray-700">{message}</span>}
          </div>
        </Overlay>
      )}
    </div>
  );
} 