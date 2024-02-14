import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useApi } from "./useApi";

interface ChapterData {
  manga: {
    id: number;
    title: string;
    coverImage: string;
    bannerImage: string;
  };
  chapter: {
    id: number;
    title: string;
    number: number;
  };
  readTime: number;
}

const useRead = () => {
  // const storedHistory: any = localStorage.getItem("aniverse_history");
  let storedHistory = localStorage.getItem("aniverse_history") ?? "";

  const api = useApi();
  const { readChapters } = JSON.parse(storedHistory);

  const mangaChapterMap: Record<number, number> = {}; // Mapeia mangaId para um único chapterId

  for (const item of readChapters) {
    if (!mangaChapterMap[item.mangaId]) {
      mangaChapterMap[item.mangaId] = item.chapterId; // Associa um único chapterId ao mangaId
    }
  }

  const mangaIds: any = Object.keys(mangaChapterMap).map(Number);

  return useQuery({
    queryKey: ["readChaptersz"],
    queryFn: async () => {
      const mangaData = await api.getMangaMediaByIds(mangaIds);

      // Mapeia os chapterIds correspondentes a cada mangaId nos dados da API
      const mangaDataWithChapterIds = mangaData.map((manga: any) => ({
        ...manga,
        chapterId: mangaChapterMap[manga.id] || null, // Obtém os chapterIds correspondentes ao mangaId
      }));

      return mangaDataWithChapterIds;
    },
  });
};

export default useRead;
