"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import Button from "./Button";
import {
  AiOutlineHome,
  AiOutlineLeftCircle,
  AiOutlinePlus,
  AiOutlineVideoCameraAdd,
} from "react-icons/ai";
import Link from "next/link";
import { BiImageAdd } from "react-icons/bi";
import { isMobile } from "react-device-detect";
import classNames from "classnames";
import Drawer from "./Drawer";
import { GiHamburgerMenu } from "react-icons/gi";
import NavItem from "./NavItem";
import Logo from "./Logo";

const SidebarPanel = () => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const drawerRef = useRef<any>();

  const handleChangePage = (page: string) => {
    router.push(page);
  };

  const toggleDropdown = () => {
    setIsOpenDropdown(!isOpenDropdown);
  };

  const Options = [
    { name: "Upload Anime", href: "/panel/upload/anime" },
    { name: "Upload Manga", href: "/panel/upload/manga" },
    { name: "Upload Episode", href: "/panel/anime/episodes" },
    { name: "Upload Chapter", href: "/panel/manga/chapters" },
  ];

  const routes = [
    {
      name: "Home",
      href: "/panel/home",
    },
    {
      name: "Anime",
      href: "/panel/anime",
    },
    {
      name: "Manga",
      href: "/panel/manga",
    },
    ...Options,
  ];

  return (
    <>
      <div className="fixed top-4 left-4">
        <Drawer
          ref={drawerRef}
          containerClassName="sm:hidden mr-4"
          className="flex justify-between flex-col py-8"
          button={<GiHamburgerMenu className="w-8 h-8" />}
        >
          <div>
            <Logo />

            <div className="space-y-2">
              {routes.map((route) => (
                <div onClick={drawerRef.current?.close()} key={route.href}>
                  <NavItem className="block" href={route.href}>
                    {({ isActive }: any) => (
                      <p
                        className={classNames(
                          "pl-4 border-l-4 font-bold text-2xl",
                          isActive
                            ? "border-primary-500 text-white"
                            : "border-background-900 text-typography-secondary"
                        )}
                      >
                        {route.name}
                      </p>
                    )}
                  </NavItem>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 items-center justify-center text-white">
            <AiOutlineLeftCircle size={20} />
            Exit admin panel
          </div>
        </Drawer>
      </div>
      <div
        className={classNames(
          "fixed w-1/5 bg-neutral-950 h-screen text-white pt-10 px-4 flex-col justify-between",
          isOpen ? "" : "hidden md:inline-block"
        )}
      >
        <div>
          <Logo />
        </div>
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

          {isOpenDropdown && (
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
              pathname === "/panel/home" ? "!bg-neutral-600" : "bg-transparent"
            }`}
            onClick={() => handleChangePage("/panel/home")}
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
        <Link
          href={"/anime"}
          className="flex gap-2 items-center justify-center text-white absolute bottom-10 left-1/2 -translate-x-1/2 rounded pr-6 p-3 hover:bg-neutral-900 cursor-pointer"
        >
          <AiOutlineLeftCircle size={20} />
          Exit admin panel
        </Link>
      </div>
    </>
  );
};

export default React.memo(SidebarPanel);
