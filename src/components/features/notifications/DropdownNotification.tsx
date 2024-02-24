"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
// import React, { useEffect, useRef, useState } from "react";

import React, { useState, useRef, useMemo } from "react";
import { createPopper } from "@popperjs/core";
import { FaRegUser } from "react-icons/fa";
import { MdExitToApp, MdNotifications } from "react-icons/md";
import { IoMdNotifications, IoMdNotificationsOutline } from "react-icons/io";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import Popup from "@/components/shared/Popup";
import Loading from "@/components/shared/Loading";
import dayjs from "dayjs";
import { useLocale } from "next-intl";
import useSeenNotifications from "@/hooks/useSeenNotifications";
import useNotifications from "@/hooks/useNotifications";
import relativeTime from "dayjs/plugin/relativeTime";

const convertToReadNotifcations = (notifications: Partial<Notification>[]) => {
  return notifications.map((notification: any) => ({
    ...notification,
    isRead: true,
  }));
};

const NotificationDropdown = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const avatarRef: any = useRef(null);
  const dropdownRef: any = useRef(null);
  let popperInstance: any = null;
  const { mutate: seenNotifications } = useSeenNotifications();
  const { data: notifications, isLoading } = useNotifications();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const user: any = session?.user;

  const { mutate } = useMutation<any>({
    mutationKey: ["seenNotification"],
    mutationFn: async (notifications: any) => {
      const readNotifications = convertToReadNotifcations(notifications);

      const response = await api.seenNotifications(user?.id, readNotifications);
      return response?.data;
    },
    onMutate: (notifications: any) => {
      const readNotifications = convertToReadNotifcations(notifications);
      queryClient.setQueryData(["notifications"], readNotifications);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  //   const { data: session } = useSession();
  const api = useApi();
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //   const user = session?.user;
  const locale = useLocale();

  //   const { data: notifications, isLoading } = useQuery<any>({
  //     queryKey: ["notifications", user],
  //     queryFn: async () => {
  //       const response = await api.getNotifications(user?.id as string);
  //       return response?.data;
  //     },
  //     refetchInterval: 10 * 60 * 1000,
  //   });

  console.log(notifications);
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

  const handleOptionClick = (option: any) => {
    console.log("Opção selecionada:", option);
    // Lógica para lidar com a opção selecionada
    setDropdownVisible(false);
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

  //   const handlePopupClick = () => {
  //     // seenNotifcations(notifications);
  //     console.log("chamado");
  //   };

  const unreadCount = useMemo(
    () =>
      !notifications || !user?.id
        ? 0
        : notifications.reduce((total: any, notification: any) => {
            if (!notification.isRead) {
              return total + 1;
            }

            return total;
          }, 0),
    [notifications, user?.id]
  );

  dayjs.extend(relativeTime);

  const handlePopupClick = async () => {
    seenNotifications(notifications);
    mutate(notifications);
    const readNotifications = convertToReadNotifcations(notifications);

    const response = await api.seenNotifications(user?.id, readNotifications);
    queryClient.setQueryData(["notifications"], response?.data);
  };

  console.log(notifications);
  return (
    // <div className="w-full">
    //   <div className="" ref={avatarRef} onClick={handleAvatarClick}>
    //     {/* Conteúdo do avatar */}
    //     {dropdownVisible ? (
    //       <IoMdNotifications size={28} />
    //     ) : (
    //       <IoMdNotificationsOutline size={28} />
    //     )}
    //   </div>
    //   {dropdownVisible && (
    //     <div
    //       className="dropdown bg-neutral-800 w-72 md:w-[500px] rounded-xl"
    //       ref={dropdownRef}
    //     >
    //       <div className="p-3 flex flex-col gap-2">
    //         <h1 className="text-xl font-semibold">Notifications</h1>
    //         {data?.map((notification: any) => (
    //           <div
    //             key={notification.id}
    //             className="p-2 hover:bg-neutral-700 rounded-md flex gap-2 cursor-pointer flex-col"
    //           >
    //             <h2>{notification.type}</h2>

    //             <p>{notification.content}</p>
    //           </div>
    //         ))}
    //         {/* <div
    //           onClick={() => handleOptionClick("Option 1")}
    //           className="p-2 hover:bg-neutral-700 rounded-md flex items-center gap-2 font-medium cursor-pointer"
    //         >
    //           <FaRegUser />
    //           Profile
    //         </div>
    //         <div
    //           onClick={() => handleOptionClick("Option 2")}
    //           className="p-2 hover:bg-neutral-700 rounded-md flex items-center gap-2 font-medium cursor-pointer"
    //         >
    //           <MdExitToApp size={19} />
    //           Exit
    //         </div> */}
    //         {/* Adicione quantas opções desejar */}
    //       </div>
    //     </div>
    //   )}
    // </div>

    <Popup
      onClick={handlePopupClick}
      type="click"
      placement="bottom-start"
      showArrow
      reference={
        <div className="relative">
          <MdNotifications className="w-6 h-6 hover:text-primary-300 transition-colors" />

          {unreadCount > 0 && (
            <div className="flex items-center justify-center absolute w-4 h-4 -top-1 -right-1 text-xs text-white font-semibold bg-primary-500 rounded-full">
              {unreadCount}
            </div>
          )}
        </div>
      }
      className="space-y-2 relative h-96 w-80 md:w-[30rem] overflow-y-scroll no-scrollbar bg-background-800"
    >
      <h1 className="text-xl font-semibold">Notifications</h1>

      {isLoading ? (
        <Loading className="w-6 h-6" />
      ) : notifications?.length ? (
        notifications?.map((notification: any) => (
          <div key={notification.id}>
            <div className="flex justify-between p-2 hover:bg-white/10 transition duration-300">
              <div className="rounded-md flex gap-2">
                <div className="space-y-1">
                  <p>{notification.content}</p>
                  <p className="text-sm text-gray-400">
                    {notification.createdAt &&
                      dayjs(notification.createdAt, {
                        locale: locale || "en",
                      }).fromNow()}
                  </p>
                </div>
              </div>

              {!notification?.isRead && (
                <div className="ml-4">
                  <div className="bg-primary-500 w-3 h-3 rounded-full" />
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400">No notifications</p>
      )}
    </Popup>
  );
};

export default NotificationDropdown;
