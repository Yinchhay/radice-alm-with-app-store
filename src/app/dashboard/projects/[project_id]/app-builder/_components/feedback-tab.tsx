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

        const allFeedback: Feedback[] = [];
        await Promise.all(apps.map(async (app) => {
          const res = await fetch(`/api/public/app/${app.id}/feedback`);
          const data = await res.json();
          if (data.success && data.data && data.data.feedbacks) {
            allFeedback.push(...data.data.feedbacks);
          }
        }));
        setFeedbackList(allFeedback);
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

  return (
    <div className="max-w-3xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Feedback</h2>
        <p className="text-sm text-gray-500">
          This is where you can view feedbacks submitted by your user for all apps in this project
        </p>
      </div>
      {loading ? (
        <div>Loading feedback...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : feedbackList.length === 0 ? (
        <div className="text-gray-500">No feedback available for this project.</div>
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
