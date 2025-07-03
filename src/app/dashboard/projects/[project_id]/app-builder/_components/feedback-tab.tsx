'use client';

import { Star } from 'lucide-react';
import { format } from 'date-fns';

type Feedback = {
  id: number;
  testerName: string;
  title: string;
  review: string;
  starRating: number;
  createdAt: string;
};

// Replace this with real fetched data later
const feedbackList: Feedback[] = [
  {
    id: 1,
    testerName: 'Sothea Seng',
    title: 'I can walk',
    review: 'Before I started using this tool, I was disabled. Now, I can walk.',
    starRating: 5,
    createdAt: '2025-06-11T20:42:00',
  },
  {
    id: 2,
    testerName: 'Sothea Seng',
    title: 'I can walk',
    review: 'Before I started using this tool, I was disabled. Now, I can walk.',
    starRating: 5,
    createdAt: '2025-06-11T20:42:00',
  },
  {
    id: 3,
    testerName: 'Sothea Seng',
    title: 'I can walk',
    review: 'Before I started using this tool, I was disabled. Now, I can walk.',
    starRating: 5,
    createdAt: '2025-06-11T20:42:00',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, idx) => (
        <Star key={idx} size={16} fill="gold" stroke="gold" />
      ))}
    </div>
  );
}

export default function FeedbackTab() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Feedback</h2>
        <p className="text-sm text-gray-500">
          This is where you can view feedbacks submitted by your user
        </p>
      </div>

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
  );
}
