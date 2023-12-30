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

// const useRead = () => {
//   const storedHistory: any = localStorage.getItem("aniverse_history");
//   const api = useApi();
//   const { readChapters } = JSON.parse(storedHistory);

//   const uniqueAnimeIdsSet = new Set();
//   for (const item of readChapters) {
//     uniqueAnimeIdsSet.add(item.mangaId);
//   }
//   const mangaIds: any[] = Array.from(uniqueAnimeIdsSet);

//   console.log(mangaIds);
//   return useQuery({
//     queryKey: ["readChapters"],
//     queryFn: async () => {
//       const res = await api.getMangaMediaByIds(mangaIds);
//       return res;
//     },
//   });

const useRead = () => {
  const storedHistory: any = localStorage.getItem("aniverse_history");
  const api = useApi();
  // const { readChapters } = JSON.parse(storedHistory);

  // console.log(readChapters);

  const readChapters = [
    { mangaId: 1, chapterId: 1, readTime: 1703441936081 },
    // { mangaId: 2, chapterId: 1, readTime: 1703441863594 },
    { mangaId: 3, chapterId: 3, readTime: 1703441936081 },
    { mangaId: 4, chapterId: 4, readTime: 1703441863594 },
    // { mangaId: 5, chapterId: 1, readTime: 1703441936081 },
    // { mangaId: 6, chapterId: 1, readTime: 1703441863594 },
    // { mangaId: 7, chapterId: 1, readTime: 1703441936081 },
    // { mangaId: 8, chapterId: 1, readTime: 1703441863594 },
    // { mangaId: 9, chapterId: 1, readTime: 1703441936081 },
    // { mangaId: 10, chapterId: 1, readTime: 1703441863594 },
    // { mangaId: 11, chapterId: 1, readTime: 1703441936081 },
  ];

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

// const [readChapters, setReadChapters] = useState<ChapterData[]>([]);

// useEffect(() => {
//   const storedHistory = localStorage.getItem("aniverse_history");
//   if (storedHistory) {
//     const { readChapters: storedReadChapters } = JSON.parse(storedHistory);
//     if (storedReadChapters) {
//       setReadChapters(storedReadChapters);
//     }
//   }
// }, []);

// const updateReadChapters = (newChapter: ChapterData) => {
//   const storedHistory = localStorage.getItem("aniverse_history");
//   if (storedHistory) {
//     const { readChapters: storedReadChapters } = JSON.parse(storedHistory);
//     const updatedChapters = storedReadChapters
//       ? [newChapter, ...storedReadChapters]
//       : [newChapter];
//     localStorage.setItem(
//       "aniverse_history",
//       JSON.stringify({ readChapters: updatedChapters })
//     );
//     setReadChapters(updatedChapters);
//   } else {
//     localStorage.setItem(
//       "aniverse_history",
//       JSON.stringify({ readChapters: [newChapter] })
//     );
//     setReadChapters([newChapter]);
//   }
// };

// return { readChapters, updateReadChapters };
// };

export default useRead;
