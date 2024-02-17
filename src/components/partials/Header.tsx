"use client";

import Button from "@/components/shared/Button";
import Drawer, { DrawerRef } from "@/components/shared/Drawer";

import NavItem from "@/components/shared/NavItem";
import { DISCORD_URL, FACEBOOK_URL } from "@/constants";
import classNames from "classnames";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { AiFillFacebook, AiOutlineSearch } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import Section from "../shared/Section";
import { useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import Logo from "../shared/Logo";
import ProfileDropdown from "../features/users/ProfileDropdown";
import AvatarDropdown from "../features/users/ProfileDropdown";
import { IoMdNotificationsOutline } from "react-icons/io";
import NotificationDropdown from "../features/notifications/DropdownNotification";

const routes = [
  {
    title: "anime",
    href: "/anime",
  },
  {
    title: "manga",
    href: "/manga",
  },
  {
    title: "anime_scene_search",
    href: "/scene-search",
  },
  {
    title: "anime_theme",
    href: "/themes",
  },
  {
    title: "airing_schedule",
    href: "/schedule",
  },
];

const Header = () => {
  const [isTop, setIsTop] = useState(true);
  const drawerRef = useRef<any>();
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    document.addEventListener("scroll", handleScroll);
  }, []);

  const t = useTranslations("Header");

  function handleSingOut() {
    signOut();
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  }

  const showHeader =
    pathname.startsWith("/panel/") || pathname.startsWith("/panel/")
      ? false
      : true;

  return (
    <nav>
      <Section
        className={classNames(
          "px-4 md:px-12 flex items-center h-16 fixed top w-full z-50 transition duration-500 text-white",
          !isTop
            ? "bg-background"
            : "bg-gradient-to-b from-black/80 via-black/60 to-transparent",
          showHeader ? "flex" : "hidden"
        )}
      >
        <Drawer
          ref={drawerRef}
          containerClassName="sm:hidden mr-4"
          className="flex justify-between flex-col py-8"
          button={<GiHamburgerMenu className="w-6 h-6" />}
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
                        {t(route.title)}
                      </p>
                    )}
                  </NavItem>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <ContactItem href={DISCORD_URL} Icon={FaDiscord} />
              <ContactItem href={FACEBOOK_URL} Icon={AiFillFacebook} />
            </div>
          </div>
        </Drawer>

        <div className="relative h-2/3 w-10 mr-8">
          <NavItem href="/">
            {() => (
              <div className="!w-full !h-full pt-2">
                <Logo className="!w-full !h-full" />
              </div>
            )}
          </NavItem>
        </div>

        <div className="hidden sm:flex items-center space-x-6 font-semibold text-primary-100/90">
          {routes.map((route) => (
            <NavItem href={route.href} key={route.href}>
              {({ isActive }: any) => (
                <p
                  className={classNames(
                    "hover:text-white transition duration-300",
                    isActive && "text-primary-300"
                  )}
                >
                  {t(route.title)}
                </p>
              )}
            </NavItem>
          ))}
        </div>

        <div className="flex items-center space-x-4 ml-auto">
          <div>
            <NotificationDropdown />
          </div>
          <NavItem href={"/search"}>
            {({ isActive }: any) => (
              <AiOutlineSearch
                className={classNames(
                  "w-7 h-7 font-semibold hover:text-primary-300 transition duration-300",
                  isActive && "text-primary-300"
                )}
              />
            )}
          </NavItem>

          {!session ? (
            <div className="flex items-center space-x-2">
              <Link href={`/login`}>
                <Button primary>
                  <p className="line-clamp-1">Login</p>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-2 relative">
              <AvatarDropdown />
            </div>
          )}
        </div>
      </Section>
    </nav>
  );
};

const ContactItem: React.FC<{
  Icon: React.ComponentType<any>;
  href: string;
}> = ({ Icon, href }) => {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <Icon className="w-6 h-6 hover:text-primary-300 transition duration-300" />
    </a>
  );
};

export default React.memo(Header);
