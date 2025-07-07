'use client';

import { useEffect, useState } from 'react';
import { fetchApps } from '@/app/appstore/fetch';
import type { App } from '@/types/app_types';

interface InformationTabProps {
  appId: string;
}

export default function InformationTab({ appId }: InformationTabProps) {
  const [app, setApp] = useState<App | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchApps();
        if (
          data &&
          "success" in data &&
          data.success &&
          "data" in data &&
          Array.isArray(data.data.apps)
        ) {
          // Find the specific app by ID
          const appData = data.data.apps.find((item: any) => 
            item.app && item.app.id === parseInt(appId)
          );
          
          if (appData) {
            const transformedApp = {
              ...appData.app,
              project: appData.project,
              appType: appData.appType,
              category: appData.category,
              projectCategories: appData.projectCategories,
            };
            setApp(transformedApp);
          } else {
            setError('App not found');
          }
        } else {
          setError('Failed to load app data');
        }
      } catch (err) {
        setError('Failed to load app details');
      } finally {
        setLoading(false);
      }
    };

    fetchAppDetails();
  }, [appId]);

  if (loading) {
    return <div className="max-w-3xl space-y-6">
      <p>Loading app details...</p>
    </div>;
  }

  if (error) {
    return <div className="max-w-3xl space-y-6">
      <p className="text-red-500">{error}</p>
    </div>;
  }

  if (!app) {
    return <div className="max-w-3xl space-y-6">
      <p>App not found</p>
    </div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">App Information</h2>
        <p className="text-sm text-gray-500">
          Review the app details before making a decision
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-md p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              App Name
            </label>
            <p className="text-sm text-gray-900">{app.subtitle || 'No name provided'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <p className="text-sm text-gray-900">{app.project?.name || 'No project name'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              App Type
            </label>
            <p className="text-sm text-gray-900">{app.appType?.name || 'Not specified'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              app.status === 'accepted' ? 'bg-green-100 text-green-800' :
              app.status === 'denied' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Unknown'}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            About Description
          </label>
          <p className="text-sm text-gray-900">{app.aboutDesc || 'No description provided'}</p>
        </div>

        {app.webUrl && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Web URL
            </label>
            <a 
              href={app.webUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              {app.webUrl}
            </a>
          </div>
        )}

        {app.appFile && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              App File
            </label>
            <a 
              href={app.appFile} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Download App File
            </a>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
          Approve
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
          Reject
        </button>
        <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition">
          Request Changes
        </button>
      </div>
    </div>
  );
} 