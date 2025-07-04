'use client';

import React from 'react';

interface VersionLog {
  id: string;
  version: string;
  releaseDate: string;
  changes: string[];
  type: 'major' | 'minor' | 'patch';
  timeAgo: string;
  summary: string;
}

const versionLogs: VersionLog[] = [
  {
    id: '1',
    version: '2.1.0',
    releaseDate: '11 Jun 2025',
    type: 'minor',
    timeAgo: '1w ago',
    summary: 'We’re always working to make your experience better! This update focuses on behind-the-scenes improvements to make the app smoother and more reliable.',
    changes: [
      'Added new bug reporting feature',
      'Improved user interface responsiveness',
      'Fixed memory leak in image processing',
      'Enhanced security measures'
    ]
  },
  {
    id: '2',
    version: '2.0.5',
    releaseDate: '28 May 2025',
    type: 'patch',
    timeAgo: '2w ago',
    summary: 'We’ve optimized the system to run faster and more efficiently. This update includes key fixes and minor improvements.',
    changes: [
      'Fixed crash when uploading large files',
      'Improved error handling',
      'Updated dependencies for security'
    ]
  },
  {
    id: '3',
    version: '2.0.0',
    releaseDate: '15 May 2025',
    type: 'major',
    timeAgo: '3w ago',
    summary: 'This major update brings a brand-new UI, performance improvements, and more accessibility.',
    changes: [
      'Complete UI redesign',
      'New dashboard layout',
      'Enhanced performance',
      'Added dark mode support',
      'Improved accessibility features'
    ]
  }
];

export default function VersionLogsTab() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">Version Logs</h2>
        <p className="text-gray-600 text-sm">This is where you can view the version history</p>
      </div>

      <div className="space-y-10">
        {versionLogs.map((log) => (
          <div key={log.id}>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900"> {log.version} </h3>
              <span className="text-sm text-gray-500">{log.timeAgo}</span>
            </div>

            {/* Summary */}
            <p className="text-gray-700 text-sm mb-3">{log.summary}</p>

            {/* Bullet list */}
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
              {log.changes.map((change, index) => (
                <li key={index}>{change}</li>
              ))}
            </ul>

            {/* End note */}
            <p className="text-gray-700 text-sm mt-3">
              Update now to enjoy a more polished and dependable experience!
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
