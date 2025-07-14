'use client';

import { Star } from 'lucide-react';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

interface Feedback {
  id: number;
  testerId?: string;
  title: string;
  review: string;
  starRating: number;
  createdAt: string;
  tester?: {
    firstName: string;
    lastName?: string;
  };
}

interface FeedbackTabProps {
  projectId: number;
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, idx) => (
        <Star key={idx} size={16} fill="gold" stroke="gold" />
      ))}
    </div>
  );
}

export default function FeedbackTab({ projectId }: FeedbackTabProps) {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to get auth_session from cookies (not HttpOnly)
  const getSessionToken = () => {
    if (typeof document === 'undefined') return undefined;
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_session='))
      ?.split('=')[1];
  };

  // Log on first render
  React.useEffect(() => {
  }, [projectId]);

  React.useEffect(() => {
    const fetchAllFeedback = async () => {
      setLoading(true);
      setError(null);
      try {
        const sessionToken = getSessionToken();
        let headers = {};
        if (sessionToken) {
          headers = { Authorization: `Bearer ${sessionToken}` };
        } else {
        }
        const appsRes = await fetch(`/api/internal/project/${projectId}/app`, {
          headers,
          credentials: 'include',
        });
        const appsData = await appsRes.json();

        let apps: { id: number; name: string }[] = [];
        if (appsData.success && appsData.data && Array.isArray(appsData.data.apps)) {
          apps = appsData.data.apps.map((app: any) => ({ id: app.id, name: app.name || `App #${app.id}` }));
        } else if (appsData.success && Array.isArray(appsData.data)) {
          apps = appsData.data.map((app: any) => ({ id: app.id, name: app.name || `App #${app.id}` }));
        } else {
          setError(appsData.message || 'Failed to fetch apps for project');
          setLoading(false);
          return;
        }

        if (apps.length === 0) {
          setFeedbackList([]);
          setLoading(false);
          return;
        }

        // Use the new internal API endpoint that directly uses project ID
        const res = await fetch(`/api/internal/project/${projectId}/feedback`, {
          headers,
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success && data.data && data.data.feedbacks) {
          setFeedbackList(data.data.feedbacks);
        } else {
          setFeedbackList([]);
        }
      } catch (err) {
        setError('Failed to fetch feedback');
      } finally {
        setLoading(false);
      }
    };
    if (projectId) {
      fetchAllFeedback();
    } else {
    }
  }, [projectId]);

  // Standard heading for all states
  const MainHeading = (
    <div className="space-y-1 mb-6">
      <h1 className="text-[24px] font-semibold">Feedback</h1>
      <p className="text-gray-500 text-sm">This is where you can view feedback submitted by your users for all apps in this project</p>
    </div>
  );

  return (
    <div className="max-w-3xl space-y-6">
      {MainHeading}
      {loading ? (
        <div>Loading feedback...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : feedbackList.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No feedback yet
          </h3>
          <p className="text-gray-500">
            Feedback from your users will appear here when they submit them.
          </p>
        </div>
      ) : (
        feedbackList
          .slice() // copy to avoid mutating state
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white border border-gray-200 rounded-md p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300" />
                  <div className="text-sm font-medium">
                    {feedback.tester && feedback.tester.firstName
                      ? `${feedback.tester.firstName} ${feedback.tester.lastName ?? ''}`.trim()
                      : feedback.testerId || 'User'}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {format(new Date(feedback.createdAt), 'dd MMM yyyy, h:mma')}
                </div>
              </div>
              <StarRating count={Number(feedback.starRating)} />
              <div className="font-medium">{feedback.title}</div>
              <p className="text-sm text-gray-600">{feedback.review}</p>
            </div>
          ))
      )}
    </div>
  );
}