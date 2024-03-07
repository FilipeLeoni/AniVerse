"use client";

import SidebarPanel from "@/components/shared/SidebarPanel";
import { usePathname } from "next/navigation";
import React from "react";

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const renderSideBar =
    pathname.startsWith("/panel/upload/anime/") ||
    pathname.startsWith("/panel/upload/manga/")
      ? false
      : true;

  return (
    <div className="flex relative">
      {renderSideBar && (
        <div className="md:mr-[14%]">
          <SidebarPanel />
        </div>
      )}

      <div className="w-full mt-20 md:mt-0 p-4 md:px-32 md:py-12 min-h-screen">
        {children}
      </div>
    </div>
  );
}
