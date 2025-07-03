'use client';

import { useRef, useState, useEffect } from 'react';

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

export default function InformationTab({ projectName = 'UniSaga' }) {
  const [priorityTesting, setPriorityTesting] = useState(false);
  const [description, setDescription] = useState(
    'UniSaga is a gamified mobile app that transforms university life into an engaging adventure...'
  );
  const [webUrl, setWebUrl] = useState('unisaga.paragoniu.app');

  const [appFiles, setAppFiles] = useState<any[]>([]);
  const [cardImages, setCardImages] = useState<any[]>([]);
  const [bannerImages, setBannerImages] = useState<any[]>([]);
  const [screenshots, setScreenshots] = useState<any[]>([]);

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

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Information</h1>
        <p className="text-gray-500 text-sm">
          Fill in your app information and prepare it for listing on our store.
        </p>
      </div>

      <div className="space-y-4 bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Sub Title</label>
          <input
            type="text"
            value={projectName}
            readOnly
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
          />
          <div className="text-xs text-gray-500">1/30 words</div>
        </div>

        <div className="space-y-1 mt-3">
          <label className="block text-sm font-medium">Type</label>
          <select className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm">
            <option>Web</option>
            <option>Mobile</option>
            <option>Desktop</option>
          </select>
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

      <div className="space-y-2 bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold">About</h3>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
          rows={5}
          maxLength={300}
        />
        <div className="text-xs text-gray-500">20/300 words</div>
      </div>

      <div className="space-y-2 bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold">Web URL</h3>
        <input
          type="url"
          value={webUrl}
          onChange={(e) => setWebUrl(e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
        />
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
        <button className="w-64 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-900">
          Continue
        </button>
      </div>
    </div>
  );
}