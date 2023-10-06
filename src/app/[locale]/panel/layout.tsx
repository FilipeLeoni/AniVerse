import SidebarPanel from "@/components/shared/SidebarPanel";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* <SidebarPanel /> */}
      <div className="w-full p-8">{children}</div>
    </div>
  );
}
