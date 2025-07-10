import DashboardPageTitle from "@/components/DashboardPageTitle";
import { fetchPendingApps } from "./fetch";
import Pagination from "@/components/Pagination";
import { getPaginationMaxPage, ROWS_PER_PAGE } from "@/lib/pagination";
import { Suspense } from "react";
import Link from "next/link";

export default async function AppStoreRequestPage({ searchParams }: { searchParams?: { page?: string } }) {
  const page = Number(searchParams?.page) || 1;
  const { data: pendingApps, totalRows } = await fetchPendingApps(page, ROWS_PER_PAGE);
  const maxPage = getPaginationMaxPage(totalRows, ROWS_PER_PAGE);

  return (
    <div className="w-full max-w-[1000px] mx-auto">
      <DashboardPageTitle title="App Store Requests" />
      <div className="mt-4">
        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.6 10.6Z"/></svg>
            </span>
            <input
              type="text"
              placeholder="Search request"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-base bg-gray-50"
              disabled
            />
          </div>
        </div>
        {pendingApps.length === 0 ? (
          <div className="text-gray-500 text-center py-12">No pending app store requests.</div>
        ) : (
          pendingApps.map((item) => (
            <div key={item.app.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex items-start justify-between mb-6">
              <div>
                <div className="font-bold text-md mb-1">
                  <span className="font-semibold">Project / App Name:</span> {item.project?.name || "-"}
                </div>
                <div className="mb-1">
                  <span className="font-semibold">Type:</span> {item.appType?.name || "-"}
                </div>
                <div className="mb-1">
                  <span className="font-semibold">Update Type:</span> {item.app.updateType || "-"}
                </div>
                <div>
                  <span className="font-semibold">Status:</span> {item.app.status || "-"}
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