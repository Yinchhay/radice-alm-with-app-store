'use client';

import { Star } from 'lucide-react';
import { format } from 'date-fns';

interface FeedbackTabProps {
  appId: string;
}

type Feedback = {
  id: number;
  testerName: string;
  title: string;
  review: string;
  starRating: number;
  createdAt: string;
};

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
  // TODO: Replace with real fetched data
  const feedbackList: Feedback[] = [
    {
      id: 1,
      testerName: 'John Doe',
      title: 'Great app experience',
      review: 'This app works really well and has a great user interface.',
      starRating: 5,
      createdAt: '2025-01-15T10:30:00',
    },
    {
      id: 2,
      testerName: 'Jane Smith',
      title: 'Good functionality',
      review: 'The app meets my needs and is easy to use.',
      starRating: 4,
      createdAt: '2025-01-14T15:45:00',
    },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Feedback</h2>
        <p className="text-sm text-gray-500">
          User feedback and reviews for this app
        </p>
      </div>

      {feedbackList.length === 0 ? (
        <p className="text-gray-500">No feedback available for this app.</p>
      ) : (
        <div className="space-y-4">
          {feedbackList.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white border border-gray-200 rounded-md p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300" />
                  <div className="text-sm font-medium">{feedback.testerName}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {format(new Date(feedback.createdAt), 'dd MMM yyyy, h:mma')}
                </div>
              </div>

              <StarRating count={feedback.starRating} />

              <div className="font-medium">{feedback.title}</div>

              <p className="text-sm text-gray-600">{feedback.review}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 