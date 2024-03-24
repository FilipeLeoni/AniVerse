import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface UseAddCommentPayload {
  text: string;
  animeId: string;
  parentId: string | null;
}

const useCreateSchedule: any = () => {
  const queryClient = useQueryClient();

  return useMutation<any>({
    mutationKey: ["addSchedule"],
    mutationFn: async (payload: any) => {
      const { animeId, airingAt, episodeNumber } = payload;

      console.log(animeId, episodeNumber, airingAt);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/schedule/anime/${animeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            airingAt: Number(airingAt),
            episodeNumber: Number(episodeNumber),
          }),
        }
      );

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to add a schedule");
      }

      const data = await response.json();

      queryClient.setQueryData(
        ["getAnimeSchedule", { animeId }],
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
      const animeId = params.animeId;
      queryClient.invalidateQueries({
        queryKey: ["getAnimeSchedule", animeId],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useCreateSchedule;
