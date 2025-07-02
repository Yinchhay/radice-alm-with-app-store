"use client";
import { useState } from "react";

const typeOptions = [
  { value: 1, label: "Web" },
  { value: 2, label: "Mobile" },
  { value: 3, label: "API" },
];

export default function Information({ app }: { app?: any }) {
  const initialType = typeOptions.find(opt => opt.value === app?.type)?.label || "";
  const [subtitle, setSubtitle] = useState(app?.subtitle || "");
  const [type, setType] = useState(initialType);
  const [priority, setPriority] = useState(true);
  const [about, setAbout] = useState(app?.aboutDesc || "");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Information</h2>
      <p className="mb-6 text-gray-600">
        Fill in your app information and prepare it for listing on our store.
      </p>

      <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
      <div className="mb-4">
        <label className="block font-medium mb-1">Sub Title</label>
        <input
          className="border rounded px-3 py-2 w-full"
          value={subtitle}
          onChange={e => setSubtitle(e.target.value)}
          maxLength={30}
        />
        <div className="text-xs text-gray-400">{subtitle.length}/30 words</div>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Type</label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option value="">Select type</option>
          {typeOptions.map(opt => (
            <option key={opt.value} value={opt.label}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Request Testing Priority</label>
        <div className="text-xs text-gray-400 mb-1">
          Use this if your project is highly experimental or urgently requires QA.
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={`px-4 py-1 rounded border ${priority ? "bg-purple-200 border-purple-400 text-purple-800" : "bg-white border-gray-300 text-gray-600"}`}
            onClick={() => setPriority(true)}
          >
            Yes
          </button>
          <button
            type="button"
            className={`px-4 py-1 rounded border ${!priority ? "bg-gray-200 border-gray-400 text-gray-800" : "bg-white border-gray-300 text-gray-600"}`}
            onClick={() => setPriority(false)}
          >
            No
          </button>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2 mt-8">Description</h3>
      <div className="mb-4">
        <label className="block font-medium mb-1">About</label>
        <textarea
          className="border rounded px-3 py-2 w-full"
          value={about}
          onChange={e => setAbout(e.target.value)}
          rows={4}
          maxLength={300}
        />
        <div className="text-xs text-gray-400">{about.length}/300 words</div>
      </div>
    </div>
  );
} 