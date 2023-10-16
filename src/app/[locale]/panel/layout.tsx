import SidebarPanel from "@/components/shared/SidebarPanel";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex relative">
      <SidebarPanel />
      <div className="w-full">{children}</div>
    </div>
  );
}
