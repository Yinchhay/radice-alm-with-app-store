// "use client";

// import { useEffect, useState, useRef, useCallback } from "react";
// import InformationTab from "./information-tab";
// import FeedbackTab from "./feedback-tab";
// import BugReportsTab from "./bugreport-tab";
// import VersionLogsTab from "./versionlog-tab";
// import { fetchAppBuilderData } from "../fetch";


// interface AppBuilderClientWrapperProps {
//   projectId: string;
// }

// // Global cache to prevent duplicate requests across component remounts
// const initializationCache = new Map<string, Promise<any>>();

// export default function AppBuilderClientWrapper({ projectId }: AppBuilderClientWrapperProps) {
//   const [activeTab, setActiveTab] = useState('information');
//   const [appId, setAppId] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);

//   // Function to invalidate cache and refresh data
//   const refreshData = useCallback(() => {
//     const cacheKey = `app-builder-${projectId}`;
//     initializationCache.delete(cacheKey);
//     setRefreshTrigger(prev => prev + 1);
//   }, [projectId]);

//   const loadAppId = useCallback(async () => {
//     const cacheKey = `app-builder-${projectId}`;
    
//     // Check if we already have a pending request for this project
//     if (initializationCache.has(cacheKey)) {
//       try {
//         const cachedResponse = await initializationCache.get(cacheKey);
//         if (cachedResponse.success && cachedResponse.data && cachedResponse.data.appId) {
//           setAppId(cachedResponse.data.appId);
//         } else {
//           setError(cachedResponse.message || 'Failed to load appId');
//         }
//       } catch (err) {
//         setError('Failed to load appId');
//       } finally {
//         setLoading(false);
//       }
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     // Create and cache the promise
//     const requestPromise = fetchAppBuilderData(projectId);
//     initializationCache.set(cacheKey, requestPromise);
    
//     try {
//       const response = await requestPromise;
//       if (response.success && response.data && response.data.appId) {
//         setAppId(response.data.appId);
//       } else {
//         setError(response.message || 'Failed to load appId');
//       }
//     } catch (err) {
//       setError('Failed to load appId');
//       // Remove from cache on error so it can be retried
//       initializationCache.delete(cacheKey);
//     } finally {
//       setLoading(false);
//     }
//   }, [projectId, refreshTrigger]);

//   useEffect(() => {
//     loadAppId();
//   }, [loadAppId]);

//   const tabs = [
//     { id: 'information', label: 'Information' },
//     { id: 'feedback', label: 'Feedback' },
//     { id: 'bug-reports', label: 'Bug Reports' },
//     { id: 'version-logs', label: 'Version Logs' }
//   ];

//   return (
//     <div className="pl-6">
//       {/* Tab Navigation */}
//       <div className="flex border-b border-gray-200">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`px-4 py-2 text-sm font-medium ${
//               activeTab === tab.id
//                 ? 'border-b-2 border-purple-500 text-black'
//                 : 'text-gray-500 hover:text-gray-700'
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* Tab Content */}
//       <div className="py-4">
//         {activeTab === 'information' && <InformationTab projectId={projectId} onDataRefresh={refreshData} />}
//         {activeTab === 'feedback' && (loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : <FeedbackTab projectId={Number(projectId)} />)}
//         {activeTab === 'bug-reports' && (loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : <BugReportsTab projectId={Number(projectId)} />)}
//         {activeTab === 'version-logs' && appId && <VersionLogsTab appId={appId} />}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import InformationTab from "./information-tab";
import FeedbackTab from "./feedback-tab";
import BugReportsTab from "./bugreport-tab";
import VersionLogsTab from "./versionlog-tab";
import { fetchAppBuilderData } from "../fetch";

interface AppBuilderClientWrapperProps {
  projectId: string;
}

// Global cache to prevent duplicate requests across component remounts
const initializationCache = new Map<string, Promise<any>>();

export default function AppBuilderClientWrapper({ projectId }: AppBuilderClientWrapperProps) {
  const [activeTab, setActiveTab] = useState('information');
  const [appId, setAppId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to invalidate cache and refresh data
  const refreshData = useCallback(() => {
    const cacheKey = `app-builder-${projectId}`;
    initializationCache.delete(cacheKey);
    setRefreshTrigger(prev => prev + 1);
  }, [projectId]);

  const loadAppId = useCallback(async () => {
    const cacheKey = `app-builder-${projectId}`;
    
    // Check if we already have a pending request for this project
    if (initializationCache.has(cacheKey)) {
      try {
        const cachedResponse = await initializationCache.get(cacheKey);
        if (cachedResponse.success && cachedResponse.data && cachedResponse.data.appId) {
          setAppId(cachedResponse.data.appId);
        } else {
          setError(cachedResponse.message || 'Failed to load appId');
        }
      } catch (err) {
        setError('Failed to load appId');
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError(null);
    
    // Create and cache the promise
    const requestPromise = fetchAppBuilderData(projectId);
    initializationCache.set(cacheKey, requestPromise);
    
    try {
      const response = await requestPromise;
      if (response.success && response.data && response.data.appId) {
        setAppId(response.data.appId);
      } else {
        setError(response.message || 'Failed to load appId');
      }
    } catch (err) {
      setError('Failed to load appId');
      // Remove from cache on error so it can be retried
      initializationCache.delete(cacheKey);
    } finally {
      setLoading(false);
    }
  }, [projectId, refreshTrigger]);

  useEffect(() => {
    loadAppId();
  }, [loadAppId]);

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
        {activeTab === 'information' && <InformationTab projectId={projectId} onDataRefresh={refreshData} />}
        {activeTab === 'feedback' && (loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : <FeedbackTab projectId={Number(projectId)} />)}
        {activeTab === 'bug-reports' && (loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : <BugReportsTab projectId={Number(projectId)} />)}
        {activeTab === 'version-logs' && appId && <VersionLogsTab appId={appId} />}
      </div>
    </div>
  );
}