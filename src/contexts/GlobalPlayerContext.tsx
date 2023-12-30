"use client";

import React, { createContext, useContext, useRef, useEffect } from "react";

const VideoContext = createContext<any>(null);

export const VideoProvider = ({ children }: any) => {
  const videoRef: any = useRef(null);
  const intervalRef: any = useRef(null);

  const handleTimeUpdate = () => {
    console.log("chamado hehe");
    const video: any = videoRef.current;
    if (video && video.readyState >= 2) {
      const currentTime = Math.floor(video.currentTime);
      const animeId = 1; // Substitua pelo ID do anime atual
      const episodeId = 1; // Substitua pelo ID do episódio atual

      // Salve o tempo assistido no localStorage a cada 10 segundos
      if (currentTime > 0 && currentTime % 10 === 0) {
        const storedData = localStorage.getItem("watchedEpisodes");

        const watchedEpisodes = storedData ? JSON.parse(storedData) : [];

        const existingEpisodeIndex = watchedEpisodes.findIndex(
          (episode: any) =>
            episode.animeId === animeId && episode.episodeId === episodeId
        );

        if (existingEpisodeIndex !== -1) {
          watchedEpisodes[existingEpisodeIndex].timestamp = currentTime;
        } else {
          watchedEpisodes.push({ animeId, episodeId, timestamp: currentTime });
        }

        console.log(watchedEpisodes);
        localStorage.setItem(
          "watchedEpisodes",
          JSON.stringify(watchedEpisodes)
        );
      }
    }
  };

  useEffect(() => {
    console.log("chamado");

    const video: any = videoRef.current;
    if (video) {
      console.log("chamado");
      video.addEventListener("timeupdate", handleTimeUpdate());

      // Definir um intervalo para verificar a cada segundo
      intervalRef.current = setInterval(handleTimeUpdate, 1000);
    }
    return () => {
      if (video) {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <VideoContext.Provider value={{ videoRef }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  return useContext(VideoContext);
};
