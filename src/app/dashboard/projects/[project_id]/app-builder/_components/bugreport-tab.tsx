'use client';

import React, { useEffect, useState } from 'react';

interface BugReport {
  id: number;
  title: string;
  description: string;
  image?: string;
  video?: string;
  testerId?: string;
  appId?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface BugReportsTabProps {
  appId: number;
}

export default function BugReportsTab({ appId }: BugReportsTabProps) {
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBugReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/public/app/${appId}/bug-report`);
        const data = await res.json();
        if (data.success && data.data && data.data.bugReports) {
          setBugReports(data.data.bugReports);
        } else {
          setError(data.message || 'Failed to fetch bug reports');
        }
      } catch (err) {
        setError('Failed to fetch bug reports');
      } finally {
        setLoading(false);
      }
    };
    if (appId) fetchBugReports();
  }, [appId]);

  if (loading) return <div>Loading bug reports...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Bug Reports</h2>
        <p className="text-gray-600">
          This is where you can view bug reports submitted by your users
        </p>
      </div>
      <div className="space-y-6">
        {bugReports.length === 0 ? (
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
        ) : (
          bugReports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-gray-900">
                  {report.testerId || 'Unknown User'}
                </span>
                <span className="text-sm text-gray-500">
                  {report.createdAt ? new Date(report.createdAt).toLocaleString() : ''}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {report.title}
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {report.description}
              </p>
              {report.image && (
                <div className="flex gap-4 flex-wrap">
                  <img src={report.image} alt="Bug report" className="w-48 h-36 object-cover rounded-lg" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}