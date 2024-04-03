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
import { useUser } from "@/contexts/UserContext";
import Player from "netplayer";
import toast from "react-hot-toast";

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const roomId = params.roomId;
  // const user = useUser();
  // console.log(user);
  const [socket, setSocket] = useState<Socket | any>();
  const [peer, setPeer] = useState<Peer>();
  const { data, isLoading } = useRoom(Number(roomId));
  const queryClient = useQueryClient();
  const [sessionLoaded, setSessionLoaded] = useState(false);

  const { data: session, status } = useSession();

  const [basicRoomUser, setBasicRoomUser] = useState<BasicRoomUser>({
    userId: "", // Inicialmente vazio até que os dados do usuário estejam disponíveis
    avatarUrl: "",
    name: "",
    isGuest: false,
  });

  useEffect(() => {
    if (session?.user && !sessionLoaded) {
      setBasicRoomUser({
        userId: session.user.id,
        avatarUrl: session.user.profilePicture || "",
        name: session.user.name,
        isGuest: false,
      });
      setSessionLoaded(true);
    }
  }, [session, sessionLoaded]);

  const [roomUser, setRoomUser] = useState<any>(null);

  const handleGuestRegister = useCallback((name: string) => {
    setBasicRoomUser({
      name,
      userId: randomString(8),
      avatarUrl: null,
      isGuest: true,
    });
  }, []);

  const config = {
    socketServerUrl: process.env.NEXT_PUBLIC_API_URL as string,
  };

  useEffect(() => {
    if (!basicRoomUser.name) return;
    if (socket) return;
    let newSocket: Socket | null = null;
    let newPeer: Peer | null = null;

    const roomQuery = ["room", roomId];

    const optimisticUpdateRoom = (update: (room: any) => Room) => {
      queryClient.setQueryData(roomQuery, update);
    };

    const createSocket = (peerId?: string) => {
      const { origin } = new URL(config.socketServerUrl);

      // const socket = io("http://localhost:8000");
      const socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
        query: { roomId },
      });

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

      optimisticUpdateRoom((room) => {
        room?.users.push(roomUser);

        return room;
      });

      socket.on("event", (event: any) => {
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

      // socket.on("disconnect", (reason) => {
      //   console.log("user disconnected", reason);

      //   optimisticUpdateRoom((room) => {
      //     room.users = room?.users?.filter(
      //       (user: any) => user.id !== socket.id
      //     );

      //     return room;
      //   });

      //   createSocket(peerId);
      // });

      socket.on("disconnecting", () => {
        console.log("chamadoa qui"); // the Set contains at least the socket ID
      });

      // socket.on("disconnect", () => {
      //   console.log("Disconnected from server");
      // });

      // socket.on("disconnect", () => {
      //   // socket.rooms.size === 0
      //   console.log("chamado aqu");
      // });

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
      socket?.disconnect();
      newSocket?.disconnect();
      newPeer?.disconnect();
    };
  }, [roomId, basicRoomUser, socket, queryClient, config.socketServerUrl]);

  return (
    <React.Fragment>
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
    </React.Fragment>

    // <div>
    //   <Player
    //     // ref={playerRef}
    //     sources={[
    //       {
    //         file: "https://s22.anime-sama.fr/videos/Solo%20Leveling/Saison%201/VF/Solo_Leveling_1_VF.mp4",
    //       },
    //     ]}
    //     // subtitles={data?.subtitles || []}
    //     // fonts={data?.fonts || []}
    //     className="object-contain w-full h-full"
    //     // components={components}
    //     // hotkeys={hotkeys}
    //     // thumbnail={data?.thumbnail}
    //     autoPlay
    //   />
    // </div>
  );
}
