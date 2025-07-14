'use client';

import { useRef, useState, useEffect } from 'react';
import { fetchAppBuilderData, FetchAppBuilderData, saveAppDraft } from '../fetch';

function FileDropzone({
  label,
  accept = '*',
  multiple = false,
  onChange,
}: {
  label: string;
  accept?: string;
  multiple?: boolean;
  onChange?: (files: FileList) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && onChange) {
      onChange(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition"
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        ref={inputRef}
        onChange={(e) => {
          if (e.target.files && onChange) {
            onChange(e.target.files);
          }
        }}
        className="hidden"
      />
      <p className="text-sm text-gray-500 mb-1">Click to upload or drag and drop</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

interface InformationTabProps {
  projectId: string;
}

export default function InformationTab({ projectId }: InformationTabProps) {
  const [loading, setLoading] = useState(true);
  const [appData, setAppData] = useState<FetchAppBuilderData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [priorityTesting, setPriorityTesting] = useState(false);
  const [description, setDescription] = useState('');
  const [webUrl, setWebUrl] = useState('');
  const [appType, setAppType] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [currentAppStatus, setCurrentAppStatus] = useState<string>('');

  const [appFiles, setAppFiles] = useState<any[]>([]);
  const [cardImages, setCardImages] = useState<any[]>([]);
  const [bannerImages, setBannerImages] = useState<any[]>([]);
  const [screenshots, setScreenshots] = useState<any[]>([]);

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [webUrlError, setWebUrlError] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Add state for update type and what's new
  const [updateType, setUpdateType] = useState<'major' | 'minor' | 'patch'>('major');
  const [whatsNew, setWhatsNew] = useState('');
  const [latestAcceptedVersion, setLatestAcceptedVersion] = useState<{major: number, minor: number, patch: number} | null>(null);

  // Static app type options
  const appTypeOptions = [
    { id: 1, name: 'Web' },
    { id: 2, name: 'Mobile' },
    { id: 3, name: 'Desktop' },
  ];

  // Simple URL validation: must start with http:// or https:// or be empty
  const validateWebUrl = (url: string) => {
    if (!url) return '';
    if (/^https?:\/\//.test(url)) return '';
    return 'URL must start with http:// or https://';
  };

  // Fetch app data on component mount
  useEffect(() => {
    const loadAppData = async () => {
      try {
        setLoading(true);
        const response = await fetchAppBuilderData(projectId);
        
        if (response.success && response.data) {
          setAppData(response.data);
          setCurrentAppStatus(response.data.status);
          
          // Populate form fields with fetched data
          if (response.data.app) {
            setSubtitle(response.data.app.subtitle || '');
            // Use aboutDesc from content field if available, otherwise fall back to app.aboutDesc
            const aboutDesc = (response.data as any).aboutDesc || response.data.app.aboutDesc || '';
            setDescription(aboutDesc);
            setWebUrl(response.data.app.webUrl || '');
            setPriorityTesting(response.data.app.featuredPriority === 1);
            setAppType(response.data.app.type ? String(response.data.app.type) : '');
            
            // If there are existing files, populate them
            if (response.data.app.appFile) {
              setAppFiles([{
                name: 'Existing App File',
                size: 'Uploaded',
                progress: 100,
                url: response.data.app.appFile
              }]);
            }
            
            if (response.data.app.cardImage) {
              setCardImages([{
                name: 'Existing Card Image',
                size: 'Uploaded',
                progress: 100,
                url: response.data.app.cardImage
              }]);
            }
            
            if (response.data.app.bannerImage) {
              setBannerImages([{
                name: 'Existing Banner Image',
                size: 'Uploaded',
                progress: 100,
                url: response.data.app.bannerImage
              }]);
            }
          }
        } else {
          setError(response.message || 'Failed to load app data');
        }
      } catch (err) {
        setError('An error occurred while loading app data');
        console.error('Error loading app data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAppData();
  }, [projectId]);

  useEffect(() => {
    if (appData && (appData as any).updateType) {
      setUpdateType((appData as any).updateType as 'major' | 'minor' | 'patch');
    }
  }, [appData]);

  useEffect(() => {
    setWebUrlError(validateWebUrl(webUrl));
  }, [webUrl]);

  // Fetch latest accepted version on mount or when appData changes
  useEffect(() => {
    async function fetchLatestAcceptedVersion() {
      if (!appData?.appId) return;
      try {
        const res = await fetch(`http://localhost:3000/api/public/app/${appData.appId}/version`);
        const data = await res.json();
        console.log('Version API response:', data);
        // Only set latestAcceptedVersion if there's a current version with a finalized versionNumber
        // This means the version has been accepted and finalized
        if (data.success && data.data && data.data.current && 
            data.data.current.versionNumber && 
            data.data.current.versionNumber !== null && 
            data.data.current.versionNumber !== '' &&
            data.data.current.isCurrent === true) {
          setLatestAcceptedVersion({
            major: data.data.current.majorVersion ?? 0,
            minor: data.data.current.minorVersion ?? 0,
            patch: data.data.current.patchVersion ?? 0,
          });
        } else {
          setLatestAcceptedVersion(null);
        }
      } catch (error) {
        console.log('Error fetching version:', error);
        setLatestAcceptedVersion(null);
      }
    }
    fetchLatestAcceptedVersion();
  }, [appData?.appId]);

  const formatSize = (bytes: number) =>
    bytes < 1024
      ? `${bytes} B`
      : bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const simulateUpload = (files: FileList, setter: Function) => {
    const uploads = Array.from(files).map(file => ({
      name: file.name,
      size: formatSize(file.size),
      progress: 0,
    }));
    setter((prev: any) => [...prev, ...uploads]);

    uploads.forEach((_, index) => {
      const interval = setInterval(() => {
        setter((prev: any) => {
          const updated = [...prev];
          const fileIndex = prev.length - uploads.length + index;
          if (updated[fileIndex].progress < 100) {
            updated[fileIndex].progress += 10;
          }
          return [...updated];
        });
      }, 150);
      setTimeout(() => clearInterval(interval), 1600);
    });
  };

  const renderUploadList = (uploads: any[], setter: Function, showHandle: boolean = false) => (
    <div className="space-y-2">
      {uploads.map((file, idx) => (
        <div
          key={idx}
          className="relative flex items-center gap-2 p-3 bg-gray-50 rounded overflow-hidden"
        >
          {showHandle && <div className="text-gray-400 text-lg select-none">⋮⋮</div>}
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="truncate">{file.name}</span>
              <span className="text-xs text-gray-500">
                {file.size} • {file.progress < 100 ? `${file.progress}%` : 'Uploaded'}
              </span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded">
              <div
                className="h-1.5 bg-black rounded transition-all duration-200"
                style={{ width: `${file.progress}%` }}
              />
            </div>
          </div>
          <button
            className="text-gray-500 hover:text-red-500 text-sm ml-2"
            onClick={() => setter((prev: any) => prev.filter((_: any, i: number) => i !== idx))}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );

  const handleSave = async () => {
    if (!appData) return;
    setSaveLoading(true);
    setSaveMessage(null);
    try {
      // If the current app is accepted, create a new draft app
      if (currentAppStatus === 'accepted') {
        // Call the internal project app POST endpoint to create a new draft
        const sessionId = await (await import('../fetch')).getSessionCookie();
        const baseUrl = await (await import('../fetch')).getBaseUrl();
        const res = await fetch(`${baseUrl}/api/internal/project/${projectId}/app`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionId}`,
          },
          cache: 'no-cache',
        });
        const data = await res.json();
        if (data.success && data.data && data.data.appId) {
          // Now PATCH the new draft app with the form content
          const patchRes = await fetch(`${baseUrl}/api/internal/app/${data.data.appId}/edit`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionId}`,
            },
            body: JSON.stringify({
              subtitle,
              aboutDesc: description,
              type: appType !== '' ? Number(appType) : null,
              webUrl, // always send as string
              status: 'draft',
            }),
            cache: 'no-cache',
          });
          const patchData = await patchRes.json();
          if (patchData.success) {
            setSaveMessage('Saved as draft!');
            // Refetch app data to update UI to the new draft
            const updated = await fetchAppBuilderData(projectId);
            if (updated.success && updated.data) {
              setAppData(updated.data);
              setCurrentAppStatus(updated.data.status);
            }
          } else {
            setSaveMessage(patchData.message || 'Failed to save.');
          }
        } else {
          setSaveMessage(data.message || 'Failed to create draft.');
        }
      } else {
        const data = await saveAppDraft({
          appId: appData.appId!,
          subtitle,
          aboutDesc: description,
          type: appType !== '' ? Number(appType) : null,
          webUrl, // always send as string
          updateType,
          existingContent: appData.app?.content || '',
        });
        if (data.success) {
          setSaveMessage('Saved as draft!');
        } else {
          setSaveMessage(data.message || 'Failed to save.');
        }
      }
    } catch (err) {
      setSaveMessage('Failed to save.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!appData) return;
    setSaveLoading(true);
    setSaveMessage(null);
    setDebugInfo(null);
    try {
      // Save updateType in draft before publishing
      await saveAppDraft({
        appId: appData.appId!,
        subtitle,
        aboutDesc: description,
        type: appType !== '' ? Number(appType) : null,
        webUrl,
        updateType,
        existingContent: appData.app?.content || '',
      });
      // If the current app is accepted, create a new draft app (then set to pending)
      if (currentAppStatus === 'accepted') {
        const res = await fetch(`/api/internal/project/${projectId}/app`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache',
          credentials: 'include',
        });
        const data = await res.json();
        setDebugInfo({ step: 'create-draft', data });
        if (data.success && data.data && data.data.appId) {
          // Now PATCH the new draft app with the form content and status 'pending'
          const patchRes = await fetch(`/api/internal/app/${data.data.appId}/edit`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              subtitle,
              aboutDesc: description,
              type: appType !== '' ? Number(appType) : null,
              webUrl,
              status: 'pending',
            }),
            cache: 'no-cache',
            credentials: 'include',
          });
          const patchData = await patchRes.json();
          setDebugInfo((prev: any) => ({ ...prev, step: 'patch-pending', patchData }));
          if (patchData.success) {
            // Call publish endpoint to increment version and save what's new
            await fetch(`/api/internal/app/${data.data.appId}/publish`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ updateType, whatsNew }),
              credentials: 'include',
            });
            setSaveMessage('Submitted for review!');
            const updated = await fetchAppBuilderData(projectId);
            if (updated.success && updated.data) {
              setAppData(updated.data);
              setCurrentAppStatus(updated.data.status);
            }
          } else {
            setSaveMessage(patchData.message || 'Failed to submit.');
          }
        } else {
          setSaveMessage(data.message || 'Failed to create draft.');
        }
      } else {
        // Save as pending
        const res = await fetch(`/api/internal/app/${appData.appId}/edit`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subtitle,
            aboutDesc: description,
            type: appType !== '' ? Number(appType) : null,
            webUrl,
            status: 'pending',
          }),
          cache: 'no-cache',
          credentials: 'include',
        });
        const data = await res.json();
        setDebugInfo({ step: 'patch-pending', data });
        if (data.success) {
          // Only call publish endpoint if there is an accepted version
          if (latestAcceptedVersion) {
            await fetch(`/api/internal/app/${appData.appId}/publish`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ updateType, whatsNew }),
              credentials: 'include',
            });
          }
          setSaveMessage('Submitted for review!');
        } else {
          setSaveMessage(data.message || 'Failed to submit.');
        }
      }
    } catch (err) {
      setDebugInfo({ step: 'exception', error: String(err) });
      setSaveMessage('Failed to submit.');
    } finally {
      setSaveLoading(false);
    }
  };

  // Helper to compute next version
  function getNextVersion() {
    const v = latestAcceptedVersion;
    if (!v) return '1.0.0'; // Always show 1.0.0 for brand new app
    let major = v.major;
    let minor = v.minor;
    let patch = v.patch;
    switch (updateType) {
      case 'major':
        major += 1;
        minor = 0;
        patch = 0;
        break;
      case 'minor':
        minor += 1;
        patch = 0;
        break;
      case 'patch':
        patch += 1;
        break;
    }
    return `${major}.${minor}.${patch}`;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Information</h1>
          <p className="text-gray-500 text-sm">
            Loading app information...
          </p>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Information</h1>
          <p className="text-red-500 text-sm">
            Error: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Information</h1>
        <p className="text-gray-500 text-sm">
          Fill in your app information and prepare it for listing on our store.
          {appData?.isNewApp && (
            <span className="text-blue-600 font-medium"> Creating new app...</span>
          )}
        </p>
      </div>

      <div className="space-y-4 bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div className="space-y-1">
          <label className="block text-sm font-medium">App Name</label>
          <input
            type="text"
            value={appData?.project?.name || 'Loading...'}
            readOnly
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
          />
          <div className="text-xs text-gray-500">Project name (read-only)</div>
        </div>

        <div className="space-y-1 mt-3">
          <label className="block text-sm font-medium">Sub Title</label>
          <input
            type="text"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
          />
          <div className="text-xs text-gray-500">1/30 words</div>
        </div>

        <div className="space-y-1 mt-3">
          <label className="block text-sm font-medium">Type</label>
          <select 
            value={appType}
            onChange={(e) => setAppType(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Select Type</option>
            {appTypeOptions.map((option) => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1 mt-3">
          <label className="block text-sm font-medium">About</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
            rows={5}
            maxLength={300}
            placeholder="Describe your app..."
          />
          <div className="text-xs text-gray-500">{description.length}/300 words</div>
        </div>

        <div className="space-y-1 mt-4">
          <label className="block text-sm font-medium">Request Testing Priority</label>
          <p className="text-xs text-gray-500">
            Use this if your project is highly experimental or urgently requires QA.
          </p>

          {/* Bordered Toggle */}
          <div className="mt-2 p-1 border border-gray-300 rounded-md inline-flex bg-white gap-1">
            <button
              onClick={() => setPriorityTesting(true)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                priorityTesting
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => setPriorityTesting(false)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                !priorityTesting
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {/* Update Information Section */}
      {latestAcceptedVersion && (
        <div className="space-y-4 bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold">Update Information</h3>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Update Type</label>
            <select
              value={updateType}
              onChange={e => setUpdateType(e.target.value as 'major' | 'minor' | 'patch')}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
            >
              <option value="major">Major</option>
              <option value="minor">Minor</option>
              <option value="patch">Patch</option>
            </select>
            <div className="text-xs text-gray-600 mt-1">Next version: <span className="font-mono">{getNextVersion()}</span></div>
          </div>
          <div className="space-y-1 mt-3">
            <label className="block text-sm font-medium">What's New</label>
            <textarea
              value={whatsNew}
              onChange={e => setWhatsNew(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
              rows={5}
              maxLength={1000}
              placeholder="Describe what's new in this update..."
            />
            <div className="text-xs text-gray-500">{whatsNew.length}/1000 words</div>
          </div>
        </div>
      )}

      <div className="space-y-2 bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold">Web URL</h3>
        <input
          type="text"
          value={webUrl}
          onChange={e => setWebUrl(e.target.value)}
          className={`w-full px-3 py-1.5 border ${webUrlError ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm`}
          placeholder="https://yourapp.com"
        />
        <div className="text-xs text-gray-500">Enter the full URL, including http:// or https://</div>
        {webUrlError && <div className="text-xs text-red-500 font-semibold">{webUrlError}</div>}
      </div>

      {/* App Files */}
      <div className="space-y-2 bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold">App File</h3>
        <FileDropzone label="App file only" onChange={(f) => simulateUpload(f, setAppFiles)} />
        {renderUploadList(appFiles, setAppFiles)}
      </div>

      {/* Card Images */}
      <div className="space-y-2 bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold">Image</h3>
        <p className="text-sm font-medium">Card</p>
        <FileDropzone
          label="Card image only"
          accept="image/*"
          onChange={(f) => simulateUpload(f, setCardImages)}
        />
        {renderUploadList(cardImages, setCardImages)}
      </div>

      {/* Banner Images */}
      <div className="space-y-2 bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold">Banner</h3>
        <FileDropzone
          label="Banner image only"
          accept="image/*"
          onChange={(f) => simulateUpload(f, setBannerImages)}
        />
        {renderUploadList(bannerImages, setBannerImages)}
      </div>

      {/* Screenshots */}
      <div className="space-y-2 bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold">Screenshots (Max 8)</h3>
        <FileDropzone
          label="Screenshot images"
          accept="image/*"
          multiple
          onChange={(f) => simulateUpload(f, setScreenshots)}
        />
        {renderUploadList(screenshots, setScreenshots, true)}
      </div>

      <div className="flex justify-center pt-4">
        <button
          className="w-64 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-900"
          onClick={handleContinue}
          disabled={saveLoading || !!webUrlError}
        >
          {saveLoading ? 'Submitting...' : 'Continue'}
        </button>
      </div>

      <div className="pt-4">
        <button
          onClick={handleSave}
          disabled={saveLoading || !!webUrlError}
          className={`w-full py-3 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 ${saveLoading || webUrlError ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {saveLoading ? 'Saving...' : 'Save as Draft'}
        </button>
        {saveMessage && <span className="ml-4 text-sm text-green-600">{saveMessage}</span>}
      </div>
      {debugInfo && (
        <div className="bg-yellow-50 border border-yellow-300 rounded p-3 text-xs text-yellow-900 overflow-x-auto">
          <strong>Debug Info:</strong>
          <pre className="whitespace-pre-wrap break-all">{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}