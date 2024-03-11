import { BasicRoomUser, Room, RoomUser } from "@/@types";
import Peer from "peerjs";
import React from "react";
import { Socket } from "socket.io-client";

interface ContextProps {
  room: Room;
  socket: Socket;
  basicRoomUser: BasicRoomUser;
  peer: Peer;
  roomUser: RoomUser;
}

interface ReactContextProviderProps {
  value: ContextProps;
  children: React.ReactNode;
}

const RoomContext = React.createContext<any>(null);

export const RoomContextProvider: React.FC<any> = ({ children, value }) => {
  console.log("chamado");

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRoomInfo = () => {
  return React.useContext(RoomContext);
};
