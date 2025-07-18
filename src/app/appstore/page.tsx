export const dynamic = "force-dynamic";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import AppStorePage from "./AppStoreClient";
import Navbar from "@/components/Navbar";

export default function Page() {
  return (
    <div>
      <Navbar variant="tester"/>
      <Suspense fallback={<div className="text-center py-10">Loading Appstore…</div>}>
        <AppStorePage />
      </Suspense>
      <Footer />
    </div>
  );
}
