'use client';

import { useRef, useState, useEffect } from 'react';
import { fetchAppBuilderData, FetchAppBuilderData, saveAppDraft } from '../fetch';
import Button from '@/components/Button';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';


function FileDropzone({
  label,
  accept = '*',
  multiple = false,
  onChange,
  disabled = false,
}: {
  label: string;
  accept?: string;
  multiple?: boolean;
  onChange?: (files: FileList) => void;
  disabled?: boolean;
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

// Enhanced helper for inserting markdown at cursor or line start
function insertAtCursor(
  textarea: HTMLTextAreaElement | null,
  before: string,
  after: string = '',
  placeholder: string = '',
  block = false,
  linePrefix = '',
  setValue?: (val: string) => void
) {
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.substring(start, end) || placeholder;
  let newValue, cursorPos;
  if (block) {
    newValue = value.substring(0, start) + before + selected + after + value.substring(end);
    cursorPos = start + before.length + selected.length + after.length;
  } else if (linePrefix) {
    const lines = value.substring(start, end).split('\n');
    const modified = lines.map(line => linePrefix + (line || placeholder)).join('\n');
    newValue = value.substring(0, start) + modified + value.substring(end);
    cursorPos = start + linePrefix.length;
  } else {
    newValue = value.substring(0, start) + before + selected + after + value.substring(end);
    cursorPos = start + before.length + selected.length + after.length;
  }
  textarea.value = newValue;
  textarea.setSelectionRange(cursorPos, cursorPos);
  textarea.focus();
  const event = new Event('input', { bubbles: true });
  textarea.dispatchEvent(event);
  if (setValue) setValue(newValue);
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

  // Add debug state for UI console
  const [debugLog, setDebugLog] = useState<any>({});

  // Add at the top of the component
  const [sessionCookie, setSessionCookie] = useState<string | null>(null);
  const [userAgent, setUserAgent] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';').map(c => c.trim());
      const authSession = cookies.find(c => c.startsWith('auth_session='));
      setSessionCookie(authSession || null);
      setUserAgent(window.navigator.userAgent);
    }
  }, []);

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

  const [errors, setErrors] = useState<any>({});

  const validateFields = () => {
    const newErrors: any = {};
    if (!subtitle.trim()) newErrors.subtitle = 'Required';
    if (!appType) newErrors.appType = 'Required';
    if (!description.trim()) newErrors.description = 'Required';
    if (!webUrl.trim()) newErrors.webUrl = 'Required';
    if (appFiles.length === 0) newErrors.appFiles = 'Required';
    if (cardImages.length === 0) newErrors.cardImages = 'Required';
    if (bannerImages.length === 0) newErrors.bannerImages = 'Required';
    if (screenshots.length === 0) newErrors.screenshots = 'Required';
    if (latestAcceptedVersion && !whatsNew.trim()) newErrors.whatsNew = 'Required';
    if (latestAcceptedVersion && !updateType) newErrors.updateType = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const aboutRef = useRef<HTMLTextAreaElement>(null);
  const whatsNewRef = useRef<HTMLTextAreaElement>(null);

  // Update file state handlers to store actual File objects
  const handleAppFileChange = (files: FileList) => setAppFiles(Array.from(files));
  const handleCardImageChange = (files: FileList) => setCardImages(Array.from(files));
  const handleBannerImageChange = (files: FileList) => setBannerImages(Array.from(files));
  const handleScreenshotsChange = (files: FileList) => setScreenshots(Array.from(files));

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
            // If there are existing files, populate them as {url: ...}
            if (response.data.app.appFile) {
              setAppFiles([{ url: response.data.app.appFile }]);
            }
            if (response.data.app.cardImage) {
              setCardImages([{ url: response.data.app.cardImage }]);
            }
            if (response.data.app.bannerImage) {
              setBannerImages([{ url: response.data.app.bannerImage }]);
            }
            if (response.data.app.screenshots && Array.isArray(response.data.app.screenshots)) {
              setScreenshots(response.data.app.screenshots.map((url: string) => ({ url })));
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

  // Prefill updateType from appData.updateType
  useEffect(() => {
    if (appData && appData.app && typeof appData.app.updateType === 'string') {
      setUpdateType(appData.app.updateType as 'major' | 'minor' | 'patch');
    }
  }, [appData]);

  // Prefill what's new from appData.aboutDesc
  useEffect(() => {
    if (appData && appData.app && typeof appData.app.aboutDesc === 'string') {
      setWhatsNew(appData.app.aboutDesc);
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

  // Update renderUploadList to preview both File and {url: ...} objects
  const renderUploadList = (uploads: any[], setter: Function, showHandle: boolean = false) => (
    <div className="space-y-2">
      {uploads.map((file, idx) => {
        let previewUrl = '';
        if (file instanceof File) {
          previewUrl = URL.createObjectURL(file);
        } else if (file.url) {
          previewUrl = file.url;
        }
        const isImage = previewUrl && (previewUrl.endsWith('.png') || previewUrl.endsWith('.jpg') || previewUrl.endsWith('.jpeg') || previewUrl.endsWith('.gif'));
        return (
          <div
            key={idx}
            className="relative flex items-center gap-2 p-3 bg-gray-50 rounded overflow-hidden"
          >
            {showHandle && <div className="text-gray-400 text-lg select-none">⋮⋮</div>}
            <div className="flex-1 flex items-center gap-3">
              {isImage && previewUrl && (
                <img src={previewUrl} alt="preview" className="w-12 h-12 object-cover rounded" />
              )}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="truncate">{file.name || file.url || 'File'}</span>
                  <span className="text-xs text-gray-500">
                    {file.size ? file.size : ''} {file.progress !== undefined ? (file.progress < 100 ? `${file.progress}%` : 'Uploaded') : ''}
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded">
                  <div
                    className="h-1.5 bg-black rounded transition-all duration-200"
                    style={{ width: `${file.progress !== undefined ? file.progress : 100}%` }}
                  />
                </div>
              </div>
            </div>
            <button
              className="text-gray-500 hover:text-red-500 text-sm ml-2"
              onClick={() => setter((prev: any) => prev.filter((_: any, i: number) => i !== idx))}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );

  async function uploadFilesIfNeeded(files: any[], projectId: string) {
    // files: array of File or {url: string} objects
    // returns: array of URLs (string)
    const uploadable = files.filter(f => f instanceof File);
    const existing = files.filter(f => !(f instanceof File) && f.url);
    let uploadedUrls: string[] = [];
    if (uploadable.length > 0) {
      const formData = new FormData();
      formData.append('projectId', projectId);
      uploadable.forEach(file => formData.append('files', file));
      const res = await fetch('/api/internal/file/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success && data.paths) {
        uploadedUrls = data.paths.map((p: string) => '/uploads/' + p);
      } else {
        throw new Error(data.message || 'File upload failed');
      }
    }
    // Return all URLs (existing + uploaded)
    return [
      ...existing.map(f => f.url),
      ...uploadedUrls,
    ];
  }

  const handleSave = async () => {
    if (!appData) return;
    if (!validateFields()) return;
    setSaveLoading(true);
    setSaveMessage(null);
    try {
      // 1. Upload new screenshots if any
      let screenshotUrls = screenshots;
      if (screenshots.some(f => f instanceof File)) {
        const formData = new FormData();
        screenshots.filter(f => f instanceof File).forEach(file => formData.append('screenshots', file));
        const res = await fetch(`/api/internal/app/${projectId}/images/screenshots`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success && data.newScreenshotPaths) {
          // Combine already-uploaded and newly-uploaded URLs
          screenshotUrls = [
            ...screenshots.filter(f => !(f instanceof File)),
            ...data.newScreenshotPaths.map((url: string) => ({ url })),
          ];
          setScreenshots(screenshotUrls); // update local state
        }
      }

      // 2. Upload other files if needed (appFiles, cardImages, bannerImages)
      const [appFileUrl] = await uploadFilesIfNeeded(appFiles, projectId);
      const [cardImageUrl] = await uploadFilesIfNeeded(cardImages, projectId);
      const [bannerImageUrl] = await uploadFilesIfNeeded(bannerImages, projectId);

      // 3. Save the draft, using the URLs
      const payload = {
        subtitle,
        aboutDesc: description,
        type: appType !== '' ? Number(appType) : undefined,
        webUrl,
        status: 'draft',
        appFile: appFileUrl,
        cardImage: cardImageUrl,
        bannerImage: bannerImageUrl,
      };
      setDebugLog((prev: any) => ({ ...prev, payload }));
      // If the current app is accepted, create a new draft app
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
        if (data.success && data.data && data.data.appId) {
          // Now PATCH the new draft app with the form content
          const patchRes = await fetch(`/api/internal/app/${data.data.appId}/edit`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            cache: 'no-cache',
            credentials: 'include',
          });
          const patchData = await patchRes.json();
          setDebugLog((prev: any) => ({ ...prev, response: patchData }));
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
        const res = await fetch(`/api/internal/app/${appData.appId}/edit`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          cache: 'no-cache',
          credentials: 'include',
        });
        const data = await res.json();
        setDebugLog((prev: any) => ({ ...prev, response: data }));
        if (data.success) {
          setSaveMessage('Saved as draft!');
        } else {
          setSaveMessage(data.message || 'Failed to save.');
        }
      }
    } catch (err) {
      setSaveMessage('Failed to save.');
      setDebugLog((prev: any) => ({ ...prev, error: String(err) }));
    } finally {
      setSaveLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!appData) return;
    if (!validateFields()) return;
    setSaveLoading(true);
    setSaveMessage(null);
    setDebugInfo(null);
    try {
      // 1. Upload new screenshots if any
      let screenshotUrls = screenshots;
      if (screenshots.some(f => f instanceof File)) {
        const formData = new FormData();
        screenshots.filter(f => f instanceof File).forEach(file => formData.append('screenshots', file));
        const res = await fetch(`/api/internal/app/${projectId}/images/screenshots`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success && data.newScreenshotPaths) {
          screenshotUrls = [
            ...screenshots.filter(f => !(f instanceof File)),
            ...data.newScreenshotPaths.map((url: string) => ({ url })),
          ];
          setScreenshots(screenshotUrls); // update local state
        }
      }

      // 2. Upload other files if needed (appFiles, cardImages, bannerImages)
      const [appFileUrl] = await uploadFilesIfNeeded(appFiles, projectId);
      const [cardImageUrl] = await uploadFilesIfNeeded(cardImages, projectId);
      const [bannerImageUrl] = await uploadFilesIfNeeded(bannerImages, projectId);
      const screenshotUrlList = screenshotUrls.map((f: any) => f.url || f.name);

      // 3. Save updateType in draft before publishing
      await saveAppDraft({
        appId: appData.appId!,
        subtitle,
        aboutDesc: description,
        type: appType !== '' ? Number(appType) : undefined,
        webUrl,
        updateType,
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
              type: appType !== '' ? Number(appType) : undefined,
              webUrl,
              status: 'pending',
              appFile: appFileUrl,
              cardImage: cardImageUrl,
              bannerImage: bannerImageUrl,
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
            type: appType !== '' ? Number(appType) : undefined,
            webUrl,
            status: 'pending',
            appFile: appFileUrl,
            cardImage: cardImageUrl,
            bannerImage: bannerImageUrl,
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

  const MainHeading = (
    <div className="space-y-1 mb-6">
      <h1 className="text-[24px] font-semibold">Information</h1>
      <p className="text-gray-500 text-sm">Fill in your app information and prepare it for listing on our store.</p>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {MainHeading}
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
        {MainHeading}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Information</h1>
          <p className="text-red-500 text-sm">
            Error: {error}
          </p>
        </div>
      </div>
    );
  }

  // Limit for screenshots
  const MAX_SCREENSHOTS = 8;

  return (
    <div className="space-y-6">
      {MainHeading}

      <h3 className="text-[20px] font-semibold mb-2">Basic Information</h3>

        <div className="space-y-1">
          <label className="block text-sm font-medium">App Name</label>
          <input
            type="text"
            value={appData?.project?.name || 'Loading...'}
            readOnly
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
          />
          <div className="text-xs text-gray-500">Project name</div>
        </div>

        <div className="space-y-1 mt-3">
          <label className="block text-sm font-medium">Sub Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            required
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm"
          />
          {errors.subtitle && <div className="text-xs text-red-500">{errors.subtitle}</div>}
          <div className="text-xs text-gray-500">1/30 words</div>
        </div>

        <div className="space-y-1 mt-3">
          <label className="block text-sm font-medium">Type <span className="text-red-500">*</span></label>
          <select 
            value={appType}
            onChange={(e) => setAppType(e.target.value)}
            required
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Select Type</option>
            {appTypeOptions.map((option) => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
          {errors.appType && <div className="text-xs text-red-500">{errors.appType}</div>}
        </div>

        <div className="space-y-1 mt-3">
          <label className="block text-sm font-medium">About <span className="text-red-500">*</span></label>
          {/* Integrated Markdown Toolbar + Textarea */}
          <div className="rounded-md border border-gray-300 bg-white overflow-hidden">
            <div className="flex flex-nowrap gap-1 px-2 py-2 bg-white border-b border-gray-200 shadow-sm overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 rounded-t-md">
              <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Bold" onClick={() => insertAtCursor(aboutRef.current, '**', '**', 'bold text', false, '', setDescription)}><span style={{fontWeight:'bold'}}>B</span></button>
              <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Bullet List" onClick={() => insertAtCursor(aboutRef.current, '', '', 'list item', false, '- ')}><span>&#8226;</span></button>
            </div>
            <textarea
              ref={aboutRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-1.5 text-sm bg-white border-0 focus:ring-0 focus:outline-none resize-none min-h-[100px]"
              rows={5}
              maxLength={300}
              placeholder="Describe your app..."
              style={{borderRadius: 0}}
            />
          </div>
          {errors.description && <div className="text-xs text-red-500">{errors.description}</div>}
          <div className="text-xs text-gray-500">{description.length}/300 words</div>
          {/* Markdown Preview for About */}
          <div className="mt-2 p-2 border border-dashed border-gray-300 rounded bg-gray-50">
            <div className="text-xs text-gray-500 mb-1">Markdown Preview:</div>
            <ReactMarkdown
              className="prose max-w-none text-sm leading-5"
              remarkPlugins={[remarkGfm as any]}
              rehypePlugins={[rehypeSanitize as any]}
            >
              {description || "Nothing to preview."}
            </ReactMarkdown>
          </div>
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

      {/* Update Information Section */}
      {latestAcceptedVersion && (
        <>
          <h3 className="text-[20px] font-semibold mb-2">Update Information</h3>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Update Type <span className="text-red-500">*</span></label>
            <select
              value={updateType}
              onChange={e => setUpdateType(e.target.value as 'major' | 'minor' | 'patch')}
              required
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
            >
              <option value="major">Major</option>
              <option value="minor">Minor</option>
              <option value="patch">Patch</option>
            </select>
            {errors.updateType && <div className="text-xs text-red-500">{errors.updateType}</div>}
            <div className="text-xs text-gray-600 mt-1">Next version: <span className="font-mono">{getNextVersion()}</span></div>
          </div>
          <div className="space-y-1 mt-3">
            <label className="block text-sm font-medium">What's New <span className="text-red-500">*</span></label>
            {/* Integrated Markdown Toolbar + Textarea */}
            <div className="rounded-md border border-gray-300 bg-white overflow-hidden">
              <div className="flex flex-nowrap gap-1 px-2 py-2 bg-white border-b border-gray-200 shadow-sm overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 rounded-t-md">
                <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Bold" onClick={() => insertAtCursor(whatsNewRef.current, '**', '**', 'bold text', false, '', setWhatsNew)}><span style={{fontWeight:'bold'}}>B</span></button>
                <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Bullet List" onClick={() => insertAtCursor(whatsNewRef.current, '', '', 'list item', false, '- ')}><span>&#8226;</span></button>
              </div>
              <textarea
                ref={whatsNewRef}
                value={whatsNew}
                onChange={e => setWhatsNew(e.target.value)}
                required
                className="w-full px-3 py-1.5 text-sm bg-white border-0 focus:ring-0 focus:outline-none resize-none min-h-[100px]"
                rows={5}
                maxLength={300}
                placeholder="Describe what's new in this update..."
                style={{borderRadius: 0}}
              />
            </div>
            {errors.whatsNew && <div className="text-xs text-red-500">{errors.whatsNew}</div>}
            <div className="text-xs text-gray-500">{whatsNew.length}/300 words</div>
            {/* Markdown Preview for What's New */}
            <div className="mt-2 p-2 border border-dashed border-gray-300 rounded bg-gray-50">
              <div className="text-xs text-gray-500 mb-1">Markdown Preview:</div>
              <ReactMarkdown
                className="prose max-w-none text-sm leading-5"
                remarkPlugins={[remarkGfm as any]}
                rehypePlugins={[rehypeSanitize as any]}
              >
                {whatsNew || "Nothing to preview."}
              </ReactMarkdown>
            </div>
          </div>
        </>
      )}

      <h3 className="text-[20px] font-semibold mt-6 mb-2">Web URL <span className="text-red-500">*</span></h3>
        <input
          type="text"
          value={webUrl}
          onChange={e => setWebUrl(e.target.value)}
          required
          className={`w-full px-3 py-1.5 border ${webUrlError ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm`}
          placeholder="https://yourapp.com"
        />
        {errors.webUrl && <div className="text-xs text-red-500">{errors.webUrl}</div>}
        <div className="text-xs text-gray-500">Enter the full URL, including http:// or https://</div>
        {webUrlError && <div className="text-xs text-red-500 font-semibold">{webUrlError}</div>}

      {/* App Files */}
      <h3 className="text-[20px] font-semibold mt-6 mb-2">App File <span className="text-red-500">*</span></h3>
        <FileDropzone label="App file only" onChange={handleAppFileChange} multiple={false} accept="*" disabled={appFiles.length > 0} />
        {renderUploadList(appFiles, setAppFiles)}
        {errors.appFiles && <div className="text-xs text-red-500">{errors.appFiles}</div>}

      {/* Card Images */}
      <h3 className="text-[20px] font-semibold mt-6 mb-2">Image <span className="text-red-500">*</span></h3>
      <p className="text-sm font-medium">Card <span className="text-red-500">*</span></p>
        <FileDropzone
          label="Card image only"
          accept="image/*"
          onChange={handleCardImageChange}
          multiple={false}
          disabled={cardImages.length > 0}
        />
        {renderUploadList(cardImages, setCardImages)}
        {errors.cardImages && <div className="text-xs text-red-500">{errors.cardImages}</div>}

      {/* Banner Images */}
      <h3 className="text-[20px] font-semibold mt-6 mb-2">Banner <span className="text-red-500">*</span></h3>
        <FileDropzone
          label="Banner image only"
          accept="image/*"
          onChange={handleBannerImageChange}
          multiple={false}
          disabled={bannerImages.length > 0}
        />
        {renderUploadList(bannerImages, setBannerImages)}
        {errors.bannerImages && <div className="text-xs text-red-500">{errors.bannerImages}</div>}

      {/* Screenshots */}
      <h3 className="text-[20px] font-semibold mt-6 mb-2">Screenshots (Max 8) <span className="text-red-500">*</span></h3>
        <FileDropzone
          label="Screenshot images"
          accept="image/*"
          multiple
          onChange={files => {
            setScreenshots(prev => {
              const newFiles = Array.from(files);
              // Only add up to 8 screenshots
              if (prev.length + newFiles.length > MAX_SCREENSHOTS) {
                return [...prev, ...newFiles.slice(0, MAX_SCREENSHOTS - prev.length)];
              }
              return [...prev, ...newFiles];
            });
          }}
          disabled={screenshots.length >= MAX_SCREENSHOTS}
        />
        {/* Only allow drag-and-drop reordering for new (File) screenshots */}
        <DragDropContext onDragEnd={result => {
          if (!result.destination) return;
          setScreenshots(prev => {
            const files = prev.filter(f => f instanceof File);
            const others = prev.filter(f => !(f instanceof File));
            if (files.length === 0) return prev;
            const reordered = Array.from(files);
            const [removed] = reordered.splice(result.source.index, 1);
            if (result.destination) {
              reordered.splice(result.destination.index, 0, removed);
            }
            return [...others, ...reordered];
          });
        }}>
          <Droppable droppableId="screenshots-droppable">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {/* Show already-uploaded screenshots (not draggable) */}
                {screenshots.filter(f => !(f instanceof File)).map((file, idx) => (
                  <div key={file.url || file.name || idx} style={{ background: '#eee', margin: '8px 0', padding: 8, borderRadius: 4 }}>
                    {file.name || file.url || 'File'} (uploaded)
                  </div>
                ))}
                {/* Show new screenshots (draggable) */}
                {screenshots.filter(f => f instanceof File).map((file, idx) => {
                  const uniqueId = file.name || String(idx);
                  return (
                    <Draggable key={uniqueId} draggableId={uniqueId} index={idx}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            background: "#fff",
                            margin: "8px 0",
                            padding: 8,
                            borderRadius: 4,
                          }}
                        >
                          {file.name || 'File'}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {errors.screenshots && <div className="text-xs text-red-500">{errors.screenshots}</div>}

      <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
        <Button
          type="button"
          variant="purple"
          className="flex-1 basis-1/2 py-3 text-base font-semibold h-full justify-center"
          onClick={handleContinue}
          disabled={saveLoading || !!webUrlError}
        >
          {saveLoading ? 'Submitting...' : 'Continue'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 basis-1/2 py-3 text-base font-semibold h-full justify-center"
          onClick={handleSave}
          disabled={saveLoading || !!webUrlError}
        >
          {saveLoading ? 'Saving...' : 'Save as Draft'}
        </Button>
      </div>
      {saveMessage && <span className="ml-4 text-sm text-green-600">{saveMessage}</span>}
      {/* Debug Console */}
      <div className="mt-8 p-4 bg-gray-100 border border-gray-300 rounded text-xs text-gray-800">
        <div className="font-bold mb-2">Debug Console</div>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{JSON.stringify(debugLog, null, 2)}</pre>
      </div>
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-400 rounded text-xs text-yellow-900">
        <div className="font-bold mb-2">Auth/Session Debug</div>
        <div><b>auth_session cookie:</b> <span style={{wordBreak:'break-all'}}>{sessionCookie || 'Not found'}</span></div>
        <div><b>User Agent:</b> {userAgent}</div>
        <div><b>Current User:</b> {appData && appData.user ? JSON.stringify(appData.user, null, 2) : 'Not available in this context'}</div>
        <div><b>Current Time:</b> {new Date().toLocaleString()}</div>
      </div>
    </div>
  );
}