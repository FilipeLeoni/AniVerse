import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
// import React, { useEffect, useRef, useState } from "react";

import React, { useState, useRef } from "react";
import { createPopper } from "@popperjs/core";
import { FaRegUser } from "react-icons/fa";
import { MdExitToApp } from "react-icons/md";
import Link from "next/link";

const AvatarDropdown = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const avatarRef: any = useRef(null);
  const dropdownRef: any = useRef(null);
  let popperInstance: any = null;

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const { data: session } = useSession();

  const createPopperInstance = () => {
    if (avatarRef.current && dropdownRef.current) {
      popperInstance = createPopper(avatarRef.current, dropdownRef.current, {
        placement: "bottom-start",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 10],
            },
          },
        ],
      });
    }
  };

  const destroyPopperInstance = () => {
    if (popperInstance) {
      popperInstance.destroy();
      popperInstance = null;
    }
  };

  const handleClickOutside = (event: any) => {
    if (
      !avatarRef.current.contains(event.target) &&
      !dropdownRef.current.contains(event.target)
    ) {
      setDropdownVisible(false);
    }
  };

  const handleAvatarClick = () => {
    toggleDropdown();
  };

  // Adiciona e remove o event listener quando o dropdown é mostrado ou oculto
  React.useEffect(() => {
    if (dropdownVisible) {
      createPopperInstance();
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      destroyPopperInstance();
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      destroyPopperInstance();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownVisible]);

  return (
    <div className="avatar-dropdown w-full cursor-pointer">
      <div
        className="avatar w-10 h-10"
        ref={avatarRef}
        onClick={handleAvatarClick}
      >
        {/* Conteúdo do avatar */}
        <Image
          src={
            session?.user?.profilePicture || "/images/avatar-placeholder.png"
          }
          alt="Avatar"
          fill
          className="object-cover overflow-hidden rounded-full"
        />
      </div>
      {dropdownVisible && (
        <div
          className="dropdown bg-neutral-900 w-72 md:w-80 rounded-xl"
          ref={dropdownRef}
        >
          <div className=" p-3 flex flex-col gap-2">
            <Link href={`/profile/${session?.user?.id}`}>
              <div className="p-2 hover:bg-neutral-700 rounded-md flex items-center gap-2 font-medium cursor-pointer">
                <FaRegUser />
                Profile
              </div>
            </Link>
            <div onClick={() => signOut()}>
              <div className="p-2 hover:bg-neutral-800 rounded-md flex items-center gap-2 font-medium cursor-pointer">
                <MdExitToApp size={19} />
                Exit
              </div>
            </div>
            {/* Adicione quantas opções desejar */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;

{
  /* <Image
            src={
              session?.user?.profilePicture || "/images/avatar-placeholder.png"
            }
            alt="Avatar"
            fill
            className="object-cover overflow-hidden rounded-full"
          /> */
}
