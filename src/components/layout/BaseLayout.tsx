"use client";

import React from "react";
import Footer from "@/components/partials/Footer";
import Header from "@/components/partials/Header";
import { usePathname } from "next/navigation";
import { LayoutRoutes } from "@/utils/LayoutRoutes";

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const showLayout = !LayoutRoutes.some((route) => pathname.startsWith(route));
  return (
    <main>
      {showLayout && <Header />}

      <div className="app">{children}</div>

      {showLayout && <Footer />}
    </main>
  );
};

export default BaseLayout;
