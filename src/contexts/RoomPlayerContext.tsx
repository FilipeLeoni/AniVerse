// import { Episode, VideoSource } from "@/@types";
import { Media } from "@/@types/anilist";
import React from "react";

// interface ContextProps {
//   anime: Media;
//   episodes: Episode[];
//   currentEpisode: Episode;
//   currentEpisodeIndex: number;
//   setEpisode: (episode: Episode) => void;
//   sourceId: string;
//   sources: VideoSource[];
//   isHost: boolean;
// }

interface RoomPlayerContextProviderProps {
  value: any;
}

const RoomPlayerContext = React.createContext<any | null>(null);

export const RoomPlayerContextProvider = ({ children, value }: any) => {
  return (
    <RoomPlayerContext.Provider value={value}>
      {children}
    </RoomPlayerContext.Provider>
  );
};

export const useRoomPlayer = () => {
  return React.useContext(RoomPlayerContext);
};
