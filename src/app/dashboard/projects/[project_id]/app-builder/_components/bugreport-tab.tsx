'use client';

import React, { useEffect, useState, useCallback } from 'react';

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
  tester?: {
    firstName: string;
    lastName?: string;
  };
}

interface BugReportsTabProps {
  projectId: number;
}

interface AppSummary {
  id: number;
  name: string;
}

export default function BugReportsTab({ projectId }: BugReportsTabProps) {
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Helper to get auth_session from cookies (not HttpOnly)
  const getSessionToken = () => {
    if (typeof document === 'undefined') return undefined;
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_session='))
      ?.split('=')[1];
  };

  // ESC key support for closing overlay
  useEffect(() => {
    if (!fullscreenImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreenImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenImage]);

  // Helper to extract filename for caption
  const getImageFilename = useCallback((url: string) => {
    try {
      return url.split('/').pop();
    } catch {
      return '';
    }
  }, []);

  useEffect(() => {
    const fetchAllBugReports = async () => {
      setLoading(true);
      setError(null);
      // Removed setDebugLogs([])
      try {
        const appsRes = await fetch(`/api/internal/project/${projectId}/app`);
        const appsData = await appsRes.json();
        let apps: AppSummary[] = [];
        if (appsData.success && appsData.data && Array.isArray(appsData.data.apps)) {
          apps = appsData.data.apps.map((app: any) => ({ id: app.id, name: app.name || app.subtitle || app.title || `App #${app.id}` }));
        } else if (appsData.success && Array.isArray(appsData.data)) {
          apps = appsData.data.map((app: any) => ({ id: app.id, name: app.name || app.subtitle || app.title || `App #${app.id}` }));
        } else {
          setError(appsData.message || 'Failed to fetch apps for project');
          setLoading(false);
          return;
        }
        if (apps.length === 0) {
          setBugReports([]);
          setLoading(false);
          return;
        }

        // Use the new internal API endpoint that directly uses project ID
        const sessionToken = getSessionToken();
        let headers = {};
        if (sessionToken) {
          headers = { Authorization: `Bearer ${sessionToken}` };
        }
        
        try {
          const res = await fetch(`/api/internal/project/${projectId}/bug-report`, {
            headers,
            credentials: 'include',
          });
          const data = await res.json();
          if (data.success && data.data && data.data.bugReports) {
            setBugReports(data.data.bugReports);
          } else {
            setBugReports([]);
          }
        } catch (err) {
          setBugReports([]);
        }
      } catch (err) {
        setError('Failed to fetch bug reports');
    } finally {
        setLoading(false);
      }
    };
    if (projectId) fetchAllBugReports();
  }, [projectId]);

  if (loading) return <div>Loading bug reports...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Bug Reports</h2>
        <p className="text-gray-600">
          This is where you can view bug reports submitted by your users for all apps in this project
        </p>
      </div>
      <div className="space-y-10">
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
          bugReports
            .slice()
            .sort((a, b) => new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime())
            .map((report) => (
              <div
                key={report.id}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-gray-900">
                    {report.tester && report.tester.firstName
                      ? `${report.tester.firstName} ${report.tester.lastName ?? ''}`.trim()
                      : report.testerId || 'Unknown User'}
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
                    <img
                      src={report.image}
                      alt="Bug report"
                      className="w-48 h-36 object-cover rounded-lg cursor-pointer"
                      onClick={() => setFullscreenImage(report.image!)}
                    />
                  </div>
                )}
              </div>
            ))
        )}
      </div>
      {/* Fullscreen image overlay */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 animate-fadein"
          style={{ animation: 'fadein 0.2s' }}
          onClick={() => setFullscreenImage(null)}
        >
          <button
            className="absolute top-8 right-10 text-white text-4xl font-bold bg-black bg-opacity-60 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-90 focus:outline-none shadow-lg border border-white/30 transition"
            onClick={e => { e.stopPropagation(); setFullscreenImage(null); }}
            aria-label="Close"
            title="Close"
          >
            ×
          </button>
          <div className="flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <img
              src={fullscreenImage}
              alt="Full screen bug report"
              className="max-w-[90vw] max-h-[80vh] rounded-xl shadow-2xl border-4 border-white/80 bg-white"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
            />
            <div className="mt-4 text-white text-sm bg-black bg-opacity-50 px-4 py-1 rounded-lg shadow">
              {getImageFilename(fullscreenImage)}
            </div>
          </div>
          <style>{`
            @keyframes fadein {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}