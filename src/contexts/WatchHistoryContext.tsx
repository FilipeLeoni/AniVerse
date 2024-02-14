"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Interface para representar os dados do episódio assistido
interface WatchedEpisode {
  animeId: number;
  episodeId: number;
  timestamp: number;
}

// Interface do contexto de armazenamento
interface WatchHistoryContextProps {
  watchedEpisodes: WatchedEpisode[];
  updateWatchedEpisodeTimestamp: (
    animeId: number,
    episodeId: number,
    newTimestamp: number
  ) => void;
}

// Criar o contexto
const WatchHistoryContext = createContext<WatchHistoryContextProps | any>(null);

// Provedor do contexto
export const WatchHistoryProvider = ({ children }: any) => {
  const [watchedEpisodes, setWatchedEpisodes] = useState<WatchedEpisode[]>([]);

  // Função para atualizar o timestamp de um episódio assistido
  const addWatchedEpisode = (
    animeId: number,
    episodeId: number,
    timestamp: number
  ) => {
    const updateEpisodes = [
      ...watchedEpisodes,
      { animeId, episodeId, timestamp: timestamp },
    ];

    console.log("Chamado aqui hehe");
    setWatchedEpisodes(updateEpisodes);
    // Atualizar o timestamp do episódio assistido no estado
    localStorage.setItem("watchedEpisodes", JSON.stringify(updateEpisodes));
  };

  // Simulação: carregar dados do localStorage quando o componente é montado
  useEffect(() => {
    const storedEpisodes = localStorage.getItem("watchedEpisodes");
    if (storedEpisodes) {
      console.log("Chamado rapaz", watchedEpisodes);
      setWatchedEpisodes(JSON.parse(storedEpisodes));
    }
  }, []);

  // Simulação: Atualizar o localStorage sempre que watchedEpisodes for alterado
  useEffect(() => {
    console.log("Chamado aqui", watchedEpisodes);
    localStorage.setItem("watchedEpisodes", JSON.stringify(watchedEpisodes));
  }, [watchedEpisodes]);

  return (
    <WatchHistoryContext.Provider
      value={{ watchedEpisodes, addWatchedEpisode }}
    >
      {children}
    </WatchHistoryContext.Provider>
  );
};

// Custom hook para usar o contexto
export const useWatchHistory = () => {
  return useContext(WatchHistoryContext);
};

// // Componente que utiliza o contexto para atualizar o tempo assistido
// const WatchedEpisodeUpdater: React.FC = () => {
//   const { updateWatchedEpisodeTimestamp } = useWatchHistory();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       // Simulação: Obter o tempo atual do vídeo (substitua pelo valor real)
//       const currentTime = 10; // Exemplo

//       // Simulação: Suponha que você tenha animeId e episodeId do vídeo atual
//       const animeId = 1; // Exemplo
//       const episodeId = 1; // Exemplo

//       // Atualizar o tempo assistido usando o contexto WatchHistory
//       updateWatchedEpisodeTimestamp(animeId, episodeId, currentTime);
//     }, 10000); // A cada 10 segundos

//     return () => clearInterval(interval);
//   }, [updateWatchedEpisodeTimestamp]);

//   return null;
// };

// export default WatchedEpisodeUpdater;
