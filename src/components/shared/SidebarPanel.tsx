"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Button from "./Button";
import { AiOutlinePlus } from "react-icons/ai";

const SidebarPanel = () => {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname.startsWith("/panel/upload/")) {
    return null;
  }

  const handleChangePage = (page: string) => {
    router.push(page);
  };

  return (
    <div className="w-1/5 bg-neutral-900 h-screen text-white pt-20 px-4">
      <div>
        <Button
          primary
          className="w-full flex gap-2"
          onClick={() => handleChangePage("/panel/upload")}
        >
          <AiOutlinePlus size={24} />
          Add new data
        </Button>
      </div>
      <div className="mt-6 space-y-4 px-2">
        <Button
          primary
          className={`cursor-pointer w-full font-semibold px-8 ${
            pathname === "/panel/home-page"
              ? "!bg-neutral-600"
              : "bg-transparent"
          }`}
          onClick={() => handleChangePage("/panel/home-page")}
        >
          Home Page
        </Button>
        <Button
          primary
          className={`cursor-pointer w-full font-semibold px-8 ${
            pathname === "/panel/anime" ? "!bg-neutral-600" : "bg-transparent"
          }`}
          onClick={() => handleChangePage("/panel/anime")}
        >
          Animes
        </Button>
        <Button
          primary
          className={`cursor-pointer w-full font-semibold px-8 ${
            pathname === "/panel/manga" ? "!bg-neutral-600" : "bg-transparent"
          }`}
          onClick={() => handleChangePage("/panel/manga")}
        >
          Manga
        </Button>
      </div>
    </div>
  );
};

export default React.memo(SidebarPanel);
