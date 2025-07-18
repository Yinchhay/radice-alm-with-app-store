export const dynamic = "force-dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import AppStorePage from "./AppStoreClient";

export default function Page() {
  return (
    <div>
      <Navbar variant="appstore" />
      <Suspense fallback={<div className="text-center py-10">Loading Appstore…</div>}>
        <AppStorePage />
      </Suspense>
      <Footer />
    </div>
  );
}
