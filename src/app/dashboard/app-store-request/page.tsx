import DashboardPageTitle from "@/components/DashboardPageTitle";
import { fetchPendingApps } from "./fetch";
import Pagination from "@/components/Pagination";
import { getPaginationMaxPage, ROWS_PER_PAGE } from "@/lib/pagination";
import { Suspense } from "react";
import Link from "next/link";

export default async function AppStoreRequestPage() {
  const page = 1;
  const { data: pendingApps, totalRows } = await fetchPendingApps(page, ROWS_PER_PAGE);
  const maxPage = getPaginationMaxPage(totalRows, ROWS_PER_PAGE);

  return (
    <div className="w-full max-w-[1000px] mx-auto">
      <DashboardPageTitle title="App Store Requests" />
      <div className="mt-10">
        {pendingApps.length === 0 ? (
          <div className="text-gray-500 text-center py-12">No pending app store requests.</div>
        ) : (
          pendingApps.map((item) => (
            <div key={item.app.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex items-start justify-between mb-6">
              <div>
                <div className="text-md mb-1">
                  <span className="font-semibold">Project / App Name:</span> <span className="font-normal">{item.project?.name || "-"}</span>
                </div>
                <div className="mb-1">
                  <span className="font-semibold">Type:</span> {item.appType?.name || "-"}
                </div>
                <div>
                  <span className="font-semibold">Status:</span> {item.app.status ? item.app.status.charAt(0).toUpperCase() + item.app.status.slice(1) : "-"}
                </div>
              </div>
              <div className="flex items-center">
                <Link
                  href={item.app?.id ? `/dashboard/app-store-request/${item.app.id}` : "#"}
                  className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 text-black font-medium hover:bg-gray-200 transition"
                  prefetch={false}
                >
                  View
                </Link>
              </div>
            </div>
          ))
        )}
        <div className="flex justify-end mt-2">
          <Suspense fallback={null}>
            <Pagination page={page} maxPage={maxPage} />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 