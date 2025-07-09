'use client';

import { Star } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

interface Feedback {
  id: number;
  testerId?: string;
  title: string;
  review: string;
  starRating: number;
  createdAt: string;
}

interface FeedbackTabProps {
  appId: number;
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

export default function FeedbackTab({ appId }: FeedbackTabProps) {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/public/app/${appId}/feedback`);
        const data = await res.json();
        if (data.success && data.data && data.data.feedbacks) {
          setFeedbackList(data.data.feedbacks);
        } else {
          setError(data.message || 'Failed to fetch feedback');
        }
      } catch (err) {
        setError('Failed to fetch feedback');
      } finally {
        setLoading(false);
      }
    };
    if (appId) fetchFeedback();
  }, [appId]);

  if (loading) return <div>Loading feedback...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Feedback</h2>
        <p className="text-sm text-gray-500">
          This is where you can view feedbacks submitted by your user
        </p>
      </div>
      {feedbackList.length === 0 ? (
        <div className="text-gray-500">No feedback available for this app.</div>
      ) : (
        feedbackList.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-white border border-gray-200 rounded-md p-4 space-y-2"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300" />
                <div className="text-sm font-medium">{feedback.testerId || 'User'}</div>
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
