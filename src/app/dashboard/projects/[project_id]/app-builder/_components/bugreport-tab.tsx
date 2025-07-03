'use client';

import React from 'react';

interface BugReport {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  title: string;
  description: string;
  timestamp: string;
  images?: string[];
}

// Sample data matching the screenshot
const bugReports: BugReport[] = [
  {
    id: '1',
    user: {
      name: 'Sothea Seng',
      avatar: '/api/placeholder/40/40'
    },
    title: 'I can walk',
    description: 'Before I started using this tool, I was disabled. Now, I can walk.',
    timestamp: '11 Jun 2025, 8:42pm',
    images: ['/api/placeholder/200/150', '/api/placeholder/200/150']
  },
  {
    id: '2',
    user: {
      name: 'Sothea Seng',
      avatar: '/api/placeholder/40/40'
    },
    title: 'I can walk',
    description: 'Before I started using this tool, I was disabled. Now, I can walk.',
    timestamp: '11 Jun 2025, 8:42pm',
    images: ['/api/placeholder/200/150']
  }
];

export default function BugReportsTab() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Bug Reports</h2>
        <p className="text-gray-600">
          This is where you can view bug reports submitted by your users
        </p>
      </div>

      <div className="space-y-6">
        {bugReports.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            {/* Header with user info and timestamp */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {report.user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <span className="font-medium text-gray-900">
                  {report.user.name}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {report.timestamp}
              </span>
            </div>

            {/* Bug report title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {report.title}
            </h3>

            {/* Bug report description */}
            <p className="text-gray-700 mb-4 leading-relaxed">
              {report.description}
            </p>

            {/* Attached images */}
            {report.images && report.images.length > 0 && (
              <div className="flex gap-4 flex-wrap">
                {report.images.map((image, index) => (
                  <div
                    key={index}
                    className="w-48 h-36 bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Image {index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state if no reports */}
      {bugReports.length === 0 && (
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
            No bug reports yet
          </h3>
          <p className="text-gray-500">
            Bug reports from your users will appear here when they submit them.
          </p>
        </div>
      )}
    </div>
  );
}