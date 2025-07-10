'use client';

import { useEffect, useState } from 'react';
import InformationTab from './information-tab';
import FeedbackTab from './feedback-tab';
import BugReportsTab from './bugreport-tab';
import VersionLogsTab from './versionlog-tab';
import { fetchAppBuilderData } from '../fetch';

interface AppBuilderClientWrapperProps {
  projectId: string;
}

export default function AppBuilderClientWrapper({ projectId }: AppBuilderClientWrapperProps) {
  const [activeTab, setActiveTab] = useState('information');
  const [appId, setAppId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAppId = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchAppBuilderData(projectId);
        if (response.success && response.data && response.data.appId) {
          setAppId(response.data.appId);
        } else {
          setError(response.message || 'Failed to load appId');
        }
      } catch (err) {
        setError('Failed to load appId');
      } finally {
        setLoading(false);
      }
    };
    loadAppId();
  }, [projectId]);

  const tabs = [
    { id: 'information', label: 'Information' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'bug-reports', label: 'Bug Reports' },
    { id: 'version-logs', label: 'Version Logs' }
  ];

  return (
    <div className="pl-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? 'border-b-2 border-purple-500 text-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="py-4">
        {activeTab === 'information' && <InformationTab projectId={projectId} />}
        {activeTab === 'feedback' && (loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : <FeedbackTab projectId={Number(projectId)} />)}
        {activeTab === 'bug-reports' && (loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : <BugReportsTab projectId={Number(projectId)} />)}
        {activeTab === 'version-logs' && <VersionLogsTab />}
      </div>
    </div>
  );
}