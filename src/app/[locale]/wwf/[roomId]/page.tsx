"use client";
import React, { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Peer } from "peerjs";
import { useRoom } from "@/hooks/useRoom";
import { BasicRoomUser, Room, RoomUser } from "@/@types";
import { useSession } from "next-auth/react";
import { randomString } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { RoomContextProvider } from "@/contexts/RoomContext";
import { RoomStateContextProvider } from "@/contexts/RoomStateContext";
import classNames from "classnames";
import RoomPlayer from "@/components/features/wwf/RoomPage/RoomPlayer";
import Sidebar from "@/components/features/wwf/RoomPage/Sidebar";
import GuestRegister from "@/components/features/wwf/RoomPage/GuestRegister";

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const roomId = params.roomId;
  console.log(roomId);
  const [socket, setSocket] = useState<Socket>();
  const [peer, setPeer] = useState<Peer>();
  const { data } = useRoom(Number(roomId));
  const queryClient = useQueryClient();

  const { data: session } = useSession();

  console.log(session?.user?.id);
  const [basicRoomUser, setBasicRoomUser] = useState<BasicRoomUser>({
    userId: session?.user?.id as string,
    avatarUrl: session?.user?.profilePicture as string,
    name: session?.user?.name || "tester",
    isGuest: false,
  });
  const [roomUser, setRoomUser] = useState<any>(null);

  console.log(basicRoomUser);

  const handleGuestRegister = useCallback((name: string) => {
    setBasicRoomUser({
      name,
      userId: randomString(8),
      avatarUrl: null,
      isGuest: true,
    });
  }, []);

  const config = {
    socketServerUrl: "http://localhost:8000",
  };

  useEffect(() => {
    let newSocket: Socket | null = null;
    let newPeer: Peer | null = null;

    const roomQuery = ["room", roomId];

    const optimisticUpdateRoom = (update: (room: any) => Room) => {
      queryClient.setQueryData(roomQuery, update);
    };

    const createSocket = (peerId?: string) => {
      const { origin } = new URL(config.socketServerUrl);

      const socket = io("http://localhost:8000");

      socket.on("connect", () => {
        console.log(socket.id);
      });

      const roomUser = {
        ...basicRoomUser,
        id: socket.id,
        roomId: roomId,
      };

      setRoomUser(roomUser);

      socket.emit("join", roomId, peerId, roomUser);

      console.log(roomUser);
      optimisticUpdateRoom((room) => {
        room?.users.push(roomUser);

        return room;
      });

      socket.on("event", (event: any) => {
        console.log(event.content?.[2]);
        if (event.content?.[2] === roomUser.id) return;

        if (event.eventType === "join") {
          optimisticUpdateRoom((room) => ({
            ...room,
            users: [...room.users, event.user],
          }));
        } else if (event.eventType === "leave") {
          optimisticUpdateRoom((room) => ({
            ...room,
            users: room?.users?.filter(
              (user: any) => user.userId !== event.user.userId
            ),
          }));
        }
      });

      socket.on("changeEpisode", (episode) => {
        console.log("changeEpisde", episode);

        optimisticUpdateRoom((data) => ({
          ...data,
          episode,
        }));
      });

      setSocket(socket);

      socket.on("disconnect", (reason) => {
        console.log("user disconnected", reason);

        optimisticUpdateRoom((room) => {
          room.users = room?.users?.filter(
            (user: any) => user.id !== socket.id
          );

          return room;
        });

        createSocket(peerId);
      });

      socket.on("reconnect", () => {
        console.log("reconnected");
      });

      socket.on("reconnect_attempt", (attemp) => {
        console.log("reconnecting attempt", attemp);
      });

      socket.on("reconnect_error", (error: Error) => {
        console.log("reconnect error");

        console.error(error);
      });

      socket.on("reconnect_failed", () => {
        console.log("reconnect failed");
      });

      newSocket = socket;

      return socket;
    };

    createSocket();

    const init = async () => {
      const { default: Peer }: any = await import("peerjs");

      if (!basicRoomUser?.name) return;

      const peer = new Peer(null, { debug: 3 });

      peer.on("open", (id: any) => {
        createSocket(id);
      });

      peer.on("close", () => {
        console.log("peer closed");

        peer.reconnect();
      });

      setPeer(peer);

      newPeer = peer;
    };

    init();

    return () => {
      newSocket?.off();

      newSocket?.disconnect();
      newPeer?.disconnect();
    };
  }, [queryClient, roomId, basicRoomUser]);

  useEffect(() => {
    setBasicRoomUser({
      userId: session?.user?.id as string,
      avatarUrl: session?.user?.profilePicture as string,
      name: session?.user?.name || "tester",
      isGuest: false,
    });
  }, [session]);

  console.log(socket);
  return (
    <React.Fragment>
      {/* <Head
        title={`${title || mediaTitle} - Kaguya`}
        description={t("head_description", {
          mediaTitle,
          username: data.hostUser.name,
        })}
        image={data.media.bannerImage || data.media.coverImage.extraLarge}
      /> */}

      {!basicRoomUser?.name || !basicRoomUser?.userId ? (
        <GuestRegister onRegister={handleGuestRegister} />
      ) : socket ? (
        <RoomContextProvider
          value={{
            room: data,
            basicRoomUser: basicRoomUser,
            socket,
            peer,
            roomUser,
          }}
        >
          <RoomStateContextProvider>
            <div className="pt-20 h-screen flex flex-col md:flex-row overflow-y-hidden">
              <div
                className={classNames(
                  `shrink-0 w-full md:w-[75%] bg-background-900`
                )}
              >
                <RoomPlayer />
              </div>

              <Sidebar />
            </div>
          </RoomStateContextProvider>
        </RoomContextProvider>
      ) : (
        <div className="py-20 flex items-center justify-center w-full h-screen">
          Loading...
        </div>
      )}

      {/* ) : (
        <div className="py-20 flex items-center justify-center w-full h-screen">
          Loading...
        </div> */}
      {/* )} */}
    </React.Fragment>
  );
}
