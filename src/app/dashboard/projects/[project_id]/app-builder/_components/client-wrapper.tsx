'use client';

import { useState } from 'react';
import InformationTab from './information-tab';
import FeedbackTab from './feedback-tab';
import BugReportsTab from './bugreport-tab';
import VersionLogsTab from './versionlog-tab';

export default function AppBuilderClientWrapper() {
  const [activeTab, setActiveTab] = useState('information');

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
        {activeTab === 'information' && <InformationTab />}
        {activeTab === 'feedback' && <FeedbackTab />}
        {activeTab === 'bug-reports' && <BugReportsTab />}
        {activeTab === 'version-logs' && <VersionLogsTab />}
      </div>
    </div>
  );
}