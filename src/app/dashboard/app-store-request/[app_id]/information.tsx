import { fetchAppInfoByAppId } from "./fetch";
import { notFound } from "next/navigation";
import ApproveRejectButtons from "./ApproveRejectButtons";

export default async function InformationView({ appId }: { appId: string }) {
  const data = await fetchAppInfoByAppId(appId);
  if (!data) return notFound();
  const { app, project, appType } = data;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Information</h1>
        <p className="text-gray-500 text-sm">App information (read-only)</p>
      </div>
      <div className="space-y-4 bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="space-y-1">
          <label className="block text-sm font-medium">App Name</label>
          <input
            type="text"
            value={project?.name || "-"}
            readOnly
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
          />
        </div>
        <div className="space-y-1 mt-3">
          <label className="block text-sm font-medium">Sub Title</label>
          <input
            type="text"
            value={app?.subtitle || "-"}
            readOnly
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
          />
        </div>
        <div className="space-y-1 mt-3">
          <label className="block text-sm font-medium">Type</label>
          <input
            type="text"
            value={appType?.name || "-"}
            readOnly
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
          />
        </div>
      </div>
      <div className="space-y-2 bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold">About</h3>
        <textarea
          value={app?.aboutDesc || "-"}
          readOnly
          className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-gray-50"
          rows={5}
        />
      </div>
      <div className="space-y-2 bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold">Web URL</h3>
        <input
          type="text"
          value={app?.webUrl || "-"}
          readOnly
          className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-gray-50"
        />
      </div>
      <ApproveRejectButtons appId={app.id.toString()} />
    </div>
  );
} 