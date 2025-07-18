import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export default function UpdateInformationSection({
    updateType,
    setUpdateType,
    whatsNew,
    setWhatsNew,
    errors,
    latestAcceptedVersion,
    getNextVersion,
    whatsNewRef,
    insertAtCursor,
}: any) {
    function countWords(str: string) {
        return str.trim() === '' ? 0 : str.trim().split(/\s+/).length;
    }
    return (
        <div className="mt-6">
            <h3 className="text-[20px] font-semibold mb-2">Update Information</h3>
            <div className="space-y-1">
                <label className="block text-sm font-medium">
                    Update Type <span className="text-red-500">*</span>
                </label>
                <select
                    value={updateType}
                    onChange={(e) => setUpdateType(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                >
                    <option value="">Select Update Type</option>
                    <option value="major">Major</option>
                    <option value="minor">Minor</option>
                    <option value="patch">Patch</option>
                </select>
                {errors.updateType && (
                    <div className="text-xs text-red-500 mt-1">{errors.updateType}</div>
                )}
            </div>
            <div className="space-y-1 mt-3">
                <label className="block text-sm font-medium">Next Version</label>
                <input
                    type="text"
                    value={getNextVersion()}
                    readOnly
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
                />
            </div>
            <div className="space-y-1 mt-3">
                <label className="block text-sm font-medium">
                    What's New <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col md:flex-row gap-4 min-h-[220px] h-[220px]">
                    <div className="flex-1 min-w-0 flex flex-col h-full min-h-0">
                        <div className="rounded-md border border-gray-300 bg-white overflow-hidden h-full flex-1 min-h-0 flex flex-col">
                            <div className="flex flex-nowrap gap-1 px-2 py-2 bg-white border-b border-gray-200 shadow-sm overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 rounded-t-md">
                                <button
                                    type="button"
                                    className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm"
                                    title="Bold"
                                    onClick={() => insertAtCursor(whatsNewRef.current, "**", "**", "bold text", false, "", setWhatsNew)}
                                >
                                    <span style={{ fontWeight: "bold" }}>B</span>
                                </button>
                                <button
                                    type="button"
                                    className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm hover:bg-gray-100 active:bg-gray-200 transition shadow-sm"
                                    title="Bullet List"
                                    onClick={() => insertAtCursor(whatsNewRef.current, "", "", "list item", false, "- ", setWhatsNew)}
                                >
                                    <span>&#8226;</span>
                                </button>
                            </div>
                            <textarea
                                ref={whatsNewRef}
                                value={whatsNew}
                                onChange={(e) => setWhatsNew(e.target.value)}
                                required
                                className="w-full h-full flex-1 px-3 py-1.5 text-sm bg-white border-0 focus:ring-0 focus:outline-none resize-none min-h-0"
                                rows={5}
                                maxLength={300}
                                placeholder="Describe what's new..."
                                style={{ borderRadius: 0 }}
                            />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col h-full min-h-0">
                        <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-2 h-full flex-1 min-h-0">
                            <div className="text-xs text-gray-500 mb-1">Markdown Preview:</div>
                            <ReactMarkdown
                                children={whatsNew}
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeSanitize]}
                                className="markdown-preview"
                            />
                        </div>
                    </div>
                </div>
                {errors.whatsNew && (
                    <div className="text-xs text-red-500 mt-1">{errors.whatsNew}</div>
                )}
                <div className="text-xs text-gray-500 mt-1">{countWords(whatsNew)}/300 words</div>
            </div>
        </div>
    );
} 