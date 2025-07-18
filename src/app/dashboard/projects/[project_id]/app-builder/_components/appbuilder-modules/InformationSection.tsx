import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export default function InformationSection({
    projectName,
    subtitle,
    setSubtitle,
    appType,
    setAppType,
    appTypeOptions,
    description,
    setDescription,
    aboutRef,
    errors,
    priorityTesting,
    setPriorityTesting,
    insertAtCursor,
    webUrl,
    setWebUrl,
    webUrlError,
}: any) {
    // Word count helper
    function countWords(str: string) {
        return str.trim() === '' ? 0 : str.trim().split(/\s+/).length;
    }
    // Handler for contentEditable markdown input
    const handleMarkdownInput = (e: React.FormEvent<HTMLDivElement>) => {
        setDescription(e.currentTarget.innerText);
    };
    return (
        <>
            <h3 className="text-[20px] font-semibold mb-2">Basic Information</h3>
            <div className="space-y-1">
                <label className="block text-sm font-medium">App Name</label>
                <input
                    type="text"
                    value={projectName}
                    readOnly
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
                />
                <div className="text-xs text-gray-500">Project name</div>
            </div>
            <div className="space-y-1 mt-3">
                <label className="block text-sm font-medium">
                    Sub Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm"
                />
                {errors.subtitle && (
                    <div className="text-xs text-red-500">{errors.subtitle}</div>
                )}
                <div className="text-xs text-gray-500">{countWords(subtitle)}/30 words</div>
            </div>
            <div className="space-y-1 mt-3">
                <label className="block text-sm font-medium">
                    Type <span className="text-red-500">*</span>
                </label>
                <select
                    value={appType}
                    onChange={(e) => setAppType(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                >
                    <option value="">Select Type</option>
                    {appTypeOptions.map((option: any) => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
                {errors.appType && (
                    <div className="text-xs text-red-500">{errors.appType}</div>
                )}
            </div>
            <div className="space-y-1 mt-3">
                <label className="block text-sm font-medium">
                    About <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col md:flex-row gap-4 min-h-[220px] h-[220px]">
                    <div className="flex-1 min-w-0 flex flex-col h-full min-h-0">
                        <div className="rounded-md border border-gray-300 bg-white overflow-hidden h-full flex-1 min-h-0 flex flex-col">
                            <div className="flex flex-nowrap gap-1 px-2 py-2 bg-white border-b border-gray-200 shadow-sm overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 rounded-t-md">
                                <button
                                    type="button"
                                    className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm"
                                    title="Bold"
                                    onClick={() => insertAtCursor(aboutRef.current, "**", "**", "bold text", false, "", setDescription)}
                                >
                                    <span style={{ fontWeight: "bold" }}>B</span>
                                </button>
                                <button
                                    type="button"
                                    className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm"
                                    title="Bullet List"
                                    onClick={() => insertAtCursor(aboutRef.current, "", "", "list item", false, "- ", setDescription)}
                                >
                                    <span>&#8226;</span>
                                </button>
                            </div>
                            <textarea
                                ref={aboutRef}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="w-full h-full flex-1 px-3 py-1.5 text-sm bg-white border-0 focus:ring-0 focus:outline-none resize-none min-h-0"
                                rows={5}
                                maxLength={300}
                                placeholder="Describe your app..."
                                style={{ borderRadius: 0 }}
                            />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col h-full min-h-0">
                        <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-2 h-full flex-1 min-h-0">
                            <div className="text-xs text-gray-500 mb-1">Markdown Preview:</div>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeSanitize]}
                                className="markdown-preview"
                            >
                                {description}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
                {errors.description && (
                    <div className="text-xs text-red-500 mt-1">{errors.description}</div>
                )}
                <div className="text-xs text-gray-500 mt-1">{countWords(description)}/300 words</div>
            </div>
            <div className="space-y-1 mt-4">
                <label className="block text-sm font-medium">Request Testing Priority</label>
                <p className="text-xs text-gray-500">Use this if your project is highly experimental or urgently requires QA.</p>
                <div className="mt-2 p-1 border border-gray-300 rounded-md inline-flex bg-white gap-1">
                    <button
                        onClick={() => setPriorityTesting(true)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${priorityTesting ? "bg-purple-600 text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => setPriorityTesting(false)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${!priorityTesting ? "bg-purple-600 text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                        No
                    </button>
                </div>
            </div>

            <h3 className="text-[20px] font-semibold mt-6 mb-2">Web URL</h3>
            <input
                type="text"
                value={webUrl}
                onChange={(e) => setWebUrl(e.target.value)}
                className={`w-full px-3 py-1.5 border ${webUrlError ? "border-red-500" : "border-gray-300"} rounded-md text-sm`}
                placeholder="https://yourapp.com"
            />
            {errors.webUrl && (
                <div className="text-xs text-red-500">{errors.webUrl}</div>
            )}
            <div className="text-xs text-gray-500">
                Enter the full URL, including http:// or https://
            </div>
            {webUrlError && (
                <div className="text-xs text-red-500 font-semibold">{webUrlError}</div>
            )}
        </>
    );
} 