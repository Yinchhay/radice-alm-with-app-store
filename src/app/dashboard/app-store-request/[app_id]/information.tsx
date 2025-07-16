import { fetchAppInfoByAppId } from "./fetch";
import { notFound } from "next/navigation";
import ApproveRejectButtons from "./ApproveRejectButtons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export default async function InformationView({ appId }: { appId: string }) {
  const data = await fetchAppInfoByAppId(appId);
  if (!data) return notFound();
  const { app, project, appType, subtitle, aboutDesc, type, webUrl, featuredPriority, appFile, cardImage, bannerImage, screenshots, whatsNew, versionNumber } = data;

  // Always show main heading and subheading
  const MainHeading = (
    <div className="space-y-1 mb-6">
      <h1 className="text-2xl font-bold">Information</h1>
      <p className="text-gray-500 text-sm">App information (read-only)</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {MainHeading}
      <h3 className="text-xl font-bold mb-2">Basic Information</h3>
        <div className="space-y-1">
          <label className="block text-sm font-medium">App Name</label>
          <input
            type="text"
            value={project?.name || "-"}
            readOnly
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
          />
          <div className="text-xs text-gray-500">Project name (read-only)</div>
        </div>
        <div className="space-y-1 mt-3">
          <label className="block text-sm font-medium">Sub Title</label>
          <input
            type="text"
            value={subtitle || "-"}
            readOnly
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
          />
        </div>
        <div className="space-y-1 mt-3">
          <label className="block text-sm font-medium">Type</label>
          <input
            type="text"
            value={appType?.name || type || "-"}
            readOnly
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
          />
        </div>
        <div className="space-y-1 mt-3">
          <label className="block text-sm font-medium">About</label>
          <div className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-gray-50 min-h-[120px]">
            <ReactMarkdown
              className="prose max-w-none text-sm leading-5"
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
            >
              {aboutDesc || "No description available."}
            </ReactMarkdown>
          </div>
        </div>
        <div className="space-y-1 mt-4">
          <label className="block text-sm font-medium">Request Testing Priority</label>
          <input
            type="text"
            value={featuredPriority ? "Yes" : "No"}
            readOnly
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
          />
        </div>
      {versionNumber && (
        <>
          <h3 className="text-xl font-bold mb-2">Update Information</h3>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Update Type</label>
            <input
              type="text"
              value="-"
              readOnly
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
            />
            <div className="text-xs text-gray-600 mt-1">Version: <span className="font-mono">{versionNumber}</span></div>
          </div>
          <div className="space-y-1 mt-3">
            <label className="block text-sm font-medium">What's New</label>
            <div className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-gray-50 min-h-[120px]">
              <ReactMarkdown
                className="prose max-w-none text-sm leading-5"
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
              >
                {whatsNew || "No changelog available."}
              </ReactMarkdown>
            </div>
          </div>
        </>
      )}
      <h3 className="text-xl font-bold mt-6 mb-2">Web URL</h3>
        <input
          type="text"
          value={webUrl || "-"}
          readOnly
          className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-gray-50"
        />
      <h3 className="text-xl font-bold mt-6 mb-2">App File</h3>
        {appFile ? (
          <a href={appFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download App File</a>
        ) : (
          <div className="text-gray-400">No app file uploaded.</div>
        )}
      <h3 className="text-xl font-bold mt-6 mb-2">Image</h3>
      <div className="mb-2">
        <span className="text-sm font-medium">Card</span>
          {cardImage ? (
            <img src={cardImage} alt="Card" className="mt-2 rounded-md max-h-32" />
          ) : (
            <div className="text-gray-400">No card image uploaded.</div>
          )}
        </div>
      <h3 className="text-xl font-bold mt-6 mb-2">Banner</h3>
        {bannerImage ? (
          <img src={bannerImage} alt="Banner" className="mt-2 rounded-md max-h-32" />
        ) : (
          <div className="text-gray-400">No banner image uploaded.</div>
        )}
      <h3 className="text-xl font-bold mt-6 mb-2">Screenshots (Max 8)</h3>
        {screenshots && screenshots.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {screenshots.map((s, i) => (
              <img key={i} src={s.imageUrl} alt={`Screenshot ${i + 1}`} className="rounded-md max-h-32" />
            ))}
          </div>
        ) : (
          <div className="text-gray-400">No screenshots uploaded.</div>
        )}
      <ApproveRejectButtons appId={app.id.toString()} />
    </div>
  );
} 