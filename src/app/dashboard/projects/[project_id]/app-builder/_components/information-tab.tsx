'use client';

import { useRef, useState, useEffect } from 'react';
import { fetchAppBuilderData, FetchAppBuilderData, saveAppDraft } from '../fetch';
import Button from '@/components/Button';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

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

// Enhanced helper for inserting markdown at cursor or line start
function insertAtCursor(
  textarea: HTMLTextAreaElement | null,
  before: string,
  after: string = '',
  placeholder: string = '',
  block = false,
  linePrefix = ''
) {
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.substring(start, end) || placeholder;
  let newValue, cursorPos;
  if (block) {
    // Insert as block (e.g., code block, hr)
    newValue =
      value.substring(0, start) + before + selected + after + value.substring(end);
    cursorPos = start + before.length + selected.length + after.length;
  } else if (linePrefix) {
    // Insert at start of each selected line
    const lines = value.substring(start, end).split('\n');
    const modified = lines.map(line => linePrefix + (line || placeholder)).join('\n');
    newValue = value.substring(0, start) + modified + value.substring(end);
    cursorPos = start + linePrefix.length;
  } else {
    // Inline wrap
    newValue =
      value.substring(0, start) + before + selected + after + value.substring(end);
    cursorPos = start + before.length + selected.length + after.length;
  }
  textarea.value = newValue;
  textarea.setSelectionRange(cursorPos, cursorPos);
  textarea.focus();
  const event = new Event('input', { bubbles: true });
  textarea.dispatchEvent(event);
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
    if (!validateFields()) return;
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
    if (!validateFields()) return;
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
          <div className="text-xs text-gray-500">Project name (read-only)</div>
        </div>

        <div className="space-y-1 mt-3">
          <label className="block text-sm font-medium">Sub Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            required
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
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
              <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Bold" onClick={() => insertAtCursor(aboutRef.current, '**', '**', 'bold text')}><span style={{fontWeight:'bold'}}>B</span></button>
              <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Italic" onClick={() => insertAtCursor(aboutRef.current, '*', '*', 'italic text')}><span style={{fontStyle:'italic'}}>I</span></button>
              <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Inline Code" onClick={() => insertAtCursor(aboutRef.current, '`', '`', 'code')}><span style={{fontFamily:'monospace'}}>&lt;/&gt;</span></button>
              <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Code Block" onClick={() => insertAtCursor(aboutRef.current, '\n```\n', '\n```\n', 'code block', true)}><span style={{fontFamily:'monospace'}}>```</span></button>
              <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Quote" onClick={() => insertAtCursor(aboutRef.current, '', '', 'quote', false, '> ')}><span>"</span></button>
              <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Heading 1" onClick={() => insertAtCursor(aboutRef.current, '', '', 'Heading 1', false, '# ')}><span>H1</span></button>
              <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Heading 2" onClick={() => insertAtCursor(aboutRef.current, '', '', 'Heading 2', false, '## ')}><span>H2</span></button>
              <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Heading 3" onClick={() => insertAtCursor(aboutRef.current, '', '', 'Heading 3', false, '### ')}><span>H3</span></button>
              <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Bullet List" onClick={() => insertAtCursor(aboutRef.current, '', '', 'list item', false, '- ')}><span>&#8226;</span></button>
              <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Horizontal Rule" onClick={() => insertAtCursor(aboutRef.current, '\n---\n', '', '', true)}><span>&mdash;</span></button>
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
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
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
                <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Bold" onClick={() => insertAtCursor(whatsNewRef.current, '**', '**', 'bold text')}><span style={{fontWeight:'bold'}}>B</span></button>
                <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Italic" onClick={() => insertAtCursor(whatsNewRef.current, '*', '*', 'italic text')}><span style={{fontStyle:'italic'}}>I</span></button>
                <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Inline Code" onClick={() => insertAtCursor(whatsNewRef.current, '`', '`', 'code')}><span style={{fontFamily:'monospace'}}>&lt;/&gt;</span></button>
                <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Code Block" onClick={() => insertAtCursor(whatsNewRef.current, '\n```\n', '\n```\n', 'code block', true)}><span style={{fontFamily:'monospace'}}>```</span></button>
                <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Quote" onClick={() => insertAtCursor(whatsNewRef.current, '', '', 'quote', false, '> ')}><span>"</span></button>
                <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Heading 1" onClick={() => insertAtCursor(whatsNewRef.current, '', '', 'Heading 1', false, '# ')}><span>H1</span></button>
                <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Heading 2" onClick={() => insertAtCursor(whatsNewRef.current, '', '', 'Heading 2', false, '## ')}><span>H2</span></button>
                <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Heading 3" onClick={() => insertAtCursor(whatsNewRef.current, '', '', 'Heading 3', false, '### ')}><span>H3</span></button>
                <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Bullet List" onClick={() => insertAtCursor(whatsNewRef.current, '', '', 'list item', false, '- ')}><span>&#8226;</span></button>
                <button type="button" className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm" title="Horizontal Rule" onClick={() => insertAtCursor(whatsNewRef.current, '\n---\n', '', '', true)}><span>&mdash;</span></button>
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
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
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
        <FileDropzone label="App file only" onChange={(f) => simulateUpload(f, setAppFiles)} />
        {renderUploadList(appFiles, setAppFiles)}
        {errors.appFiles && <div className="text-xs text-red-500">{errors.appFiles}</div>}

      {/* Card Images */}
      <h3 className="text-[20px] font-semibold mt-6 mb-2">Image <span className="text-red-500">*</span></h3>
      <p className="text-sm font-medium">Card <span className="text-red-500">*</span></p>
        <FileDropzone
          label="Card image only"
          accept="image/*"
          onChange={(f) => simulateUpload(f, setCardImages)}
        />
        {renderUploadList(cardImages, setCardImages)}
        {errors.cardImages && <div className="text-xs text-red-500">{errors.cardImages}</div>}

      {/* Banner Images */}
      <h3 className="text-[20px] font-semibold mt-6 mb-2">Banner <span className="text-red-500">*</span></h3>
        <FileDropzone
          label="Banner image only"
          accept="image/*"
          onChange={(f) => simulateUpload(f, setBannerImages)}
        />
        {renderUploadList(bannerImages, setBannerImages)}
        {errors.bannerImages && <div className="text-xs text-red-500">{errors.bannerImages}</div>}

      {/* Screenshots */}
      <h3 className="text-[20px] font-semibold mt-6 mb-2">Screenshots (Max 8) <span className="text-red-500">*</span></h3>
        <FileDropzone
          label="Screenshot images"
          accept="image/*"
          multiple
          onChange={(f) => simulateUpload(f, setScreenshots)}
        />
        {renderUploadList(screenshots, setScreenshots, true)}
        {errors.screenshots && <div className="text-xs text-red-500">{errors.screenshots}</div>}

      <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
        <Button
          variant="purple"
          className="flex-1 basis-1/2 py-3 text-base font-semibold h-full justify-center"
          onClick={handleContinue}
          disabled={saveLoading || !!webUrlError}
        >
          {saveLoading ? 'Submitting...' : 'Continue'}
        </Button>
        <Button
          variant="outline"
          className="flex-1 basis-1/2 py-3 text-base font-semibold h-full justify-center"
          onClick={handleSave}
          disabled={saveLoading || !!webUrlError}
        >
          {saveLoading ? 'Saving...' : 'Save as Draft'}
        </Button>
      </div>
      {saveMessage && <span className="ml-4 text-sm text-green-600">{saveMessage}</span>}
    </div>
  );
}