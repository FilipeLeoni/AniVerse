// import { Episode, VideoSource } from "@/@types";
import { Media } from "@/@types/anilist";
import React from "react";

export interface WatchPlayerContextProps {
  anime: Media;
  episodes: any[];
  currentEpisode: any;
  currentEpisodeIndex: number;
  setEpisode: (episode: any) => void;
  sourceId: string;
  sources: any[];
}

interface WatchContextProviderProps {
  children: React.ReactNode;
  value: WatchPlayerContextProps;
}

const WatchContext = React.createContext<WatchPlayerContextProps | null>(null);

export const WatchContextProvider: React.FC<WatchContextProviderProps> = ({
  children,
  value,
}) => {
  return (
    <WatchContext.Provider value={value}>{children}</WatchContext.Provider>
  );
};

export const useWatchPlayer = () => {
  return React.useContext(WatchContext);
};
