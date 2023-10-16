"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import Button from "./Button";
import {
  AiOutlineHome,
  AiOutlinePlus,
  AiOutlineVideoCameraAdd,
} from "react-icons/ai";
import Link from "next/link";
import { BiImageAdd } from "react-icons/bi";

const SidebarPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // if (pathname.startsWith("/panel/upload/anime/")) {
  //   return null;
  // }

  const handleChangePage = (page: string) => {
    router.push(page);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const Options = [
    { name: "Upload Anime", href: "/panel/upload/anime" },
    { name: "Upload Manga", href: "/panel/upload/manga" },
    { name: "Upload Episode", href: "/panel/anime/episodes" },
    { name: "Upload Chapter", href: "/panel/upload/chapter" },
  ];

  return (
    <div className="w-1/4 bg-neutral-950 h-screen text-white pt-20 px-4">
      <div className="relative">
        <Button
          id="dropdownDefaultButton"
          data-dropdown-toggle="dropdown"
          primary
          className="w-full flex gap-2"
          onClick={toggleDropdown}
        >
          <AiOutlinePlus size={32} />
          Upload
        </Button>

        {isOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-56 text-white rounded-md shadow-lg bg-neutral-900 ring-1 ring-black ring-opacity-5 focus:outline-none transition-all">
            <div
              className="py-1 transition-all"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {Options.map((option, index) => (
                <Link
                  key={index}
                  href={option.href}
                  className="block px-4 py-2 hover:bg-neutral-700 transition-all rounded-md"
                >
                  {option.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 space-y-2">
        <Button
          primary
          className={`cursor-pointer w-full font-bold flex gap-2 items-center ${
            pathname === "/panel/home-page"
              ? "!bg-neutral-600"
              : "bg-transparent"
          }`}
          onClick={() => handleChangePage("/panel/home-page")}
        >
          <AiOutlineHome size={24} />
          Home
        </Button>
        <Button
          primary
          className={`cursor-pointer w-full font-bold flex gap-2 items-center ${
            pathname === "/panel/anime" ? "!bg-neutral-600" : "bg-transparent"
          }`}
          onClick={() => handleChangePage("/panel/anime")}
        >
          <AiOutlineVideoCameraAdd size={24} />
          Anime
        </Button>
        <Button
          primary
          className={`cursor-pointer w-full font-bold flex gap-2 items-center ${
            pathname === "/panel/manga" ? "!bg-neutral-600" : "bg-transparent"
          }`}
          onClick={() => handleChangePage("/panel/manga")}
        >
          <BiImageAdd size={24} />
          Manga
        </Button>
      </div>
    </div>
  );
};

export default React.memo(SidebarPanel);
