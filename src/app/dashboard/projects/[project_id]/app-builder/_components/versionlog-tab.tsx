'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

interface VersionLog {
  id: string;
  version: string;
  releaseDate: string;
  changes: string[];
  type: 'major' | 'minor' | 'patch';
  timeAgo: string;
  summary: string;
}

interface VersionLogsTabProps {
  appId: number;
}

async function fetchVersionLogs(appId: number): Promise<VersionLog[]> {
  // Use absolute URL for local dev
  const res = await fetch(`/api/public/app/${appId}/version`);
  const data = await res.json();
  if (!data.success || !data.data) return [];
  // Map the API response to VersionLog[]
  const versions = [data.data.current, ...(data.data.previous || [])]
    .filter(Boolean)
    .filter((v: any) => v.versionNumber); // Only accepted versions
  return versions.map((v: any) => ({
    id: v.id?.toString() ?? '',
    version: v.versionNumber || `${v.majorVersion}.${v.minorVersion}.${v.patchVersion}`,
    releaseDate: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : '',
    type: v.majorVersion > 0 && v.minorVersion === 0 && v.patchVersion === 0 ? 'major' : v.minorVersion > 0 && v.patchVersion === 0 ? 'minor' : 'patch',
    timeAgo: v.createdAt ? timeAgo(new Date(v.createdAt)) : '',
    summary: v.content || '',
    changes: v.changes || [],
  }));
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function VersionLogsTab({ appId }: VersionLogsTabProps) {
  const [versionLogs, setVersionLogs] = useState<VersionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchVersionLogs(appId)
      .then(setVersionLogs)
      .catch(() => setError('Failed to fetch version logs'))
      .finally(() => setLoading(false));
  }, [appId]);

  // Standard heading for all states
  const MainHeading = (
    <div className="space-y-1 mb-6">
      <h1 className="text-[24px] font-semibold">Version Logs</h1>
      <p className="text-gray-500 text-sm">This is where you can view the version history</p>
    </div>
  );

  return (
    <div className="max-w-3xl">
      {MainHeading}
      {loading ? (
        <div>Loading version logs...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
      <div className="space-y-10">
          {versionLogs.length === 0 ? (
            <div className="text-gray-500">No version logs found.</div>
          ) : (
            versionLogs.map((log) => (
          <div key={log.id}>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900"> {log.version} </h3>
              <span className="text-sm text-gray-500">{log.timeAgo}</span>
            </div>
            {/* Summary */}
            <div className="prose max-w-none text-gray-700 text-sm mb-3">
              <ReactMarkdown
                remarkPlugins={[remarkGfm as any]}
                rehypePlugins={[rehypeSanitize as any]}
              >
                {log.summary}
              </ReactMarkdown>
            </div>
            {/* Bullet list */}
                {log.changes && log.changes.length > 0 && (
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
              {log.changes.map((change, index) => (
                <li key={index}>{change}</li>
              ))}
            </ul>
                )}
            {/* End note */}
          </div>
            ))
          )}
      </div>
      )}
    </div>
  );
}
