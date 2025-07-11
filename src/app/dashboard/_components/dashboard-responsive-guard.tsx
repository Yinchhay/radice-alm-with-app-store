"use client";
import React, { useEffect, useState } from "react";

export default function DashboardResponsiveGuard({ children }: { children: React.ReactNode }) {
  const [tooSmall, setTooSmall] = useState(false);
  useEffect(() => {
    function handleResize() {
      setTooSmall(window.innerWidth < 1024);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (tooSmall) {
    return (
      <div
        className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black bg-opacity-80 text-white text-center px-6 min-h-screen"
        style={{ display: "flex" }}
      >
        <div className="bg-white bg-opacity-90 text-black rounded-xl p-8 shadow-lg max-w-xs">
          <h2 className="text-xl font-bold mb-4">Screen Too Small</h2>
          <p className="mb-2">The dashboard is best experienced on a desktop or larger screen.</p>
          <p>Please switch to a bigger device to access this page.</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
} 