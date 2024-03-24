import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface UseAddCommentPayload {
  text: string;
  animeId: string;
  parentId: string | null;
}

const useCreateMangaSchedule: any = () => {
  const queryClient = useQueryClient();

  return useMutation<any>({
    mutationKey: ["addMangaSchedule"],
    mutationFn: async (payload: any) => {
      const { mangaId, airingAt, chapterNumber } = payload;

      console.log(mangaId, chapterNumber, airingAt);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/schedule/manga/${mangaId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            airingAt: Number(airingAt),
            chapterNumber: Number(chapterNumber),
          }),
        }
      );

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to add a schedule");
      }

      const data = await response.json();

      queryClient.setQueryData(
        ["getMangaSchedule", { mangaId }],
        (schedule: any) => {
          if (!schedule) {
            return [];
          }

          return schedule;
        }
      );

      return data;
    },
    onSuccess: async (_: any, params: any) => {
      const mangaId = params.mangaId;
      queryClient.invalidateQueries({
        queryKey: ["getMangaSchedule", mangaId],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useCreateMangaSchedule;
