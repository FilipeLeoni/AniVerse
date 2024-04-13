import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { useState } from "react";

const useDeleteSchedule: any = () => {
  const queryClient = useQueryClient();
  const [type, setType] = useState("");
  const api = useApi();
  return useMutation<any>({
    mutationKey: ["deleteSchedule"],
    mutationFn: async (payload: any) => {
      console.log(payload);
      try {
        // const response: any = await api.deleteAnimeSchedule(
        //   payload.schedule.id
        // );
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/schedule/${payload.episodeId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar comentários");
        }

        const data = await response.json();

        queryClient.setQueryData(
          ["getAnimeSchedule", payload.animeId],
          (schedule: any) => {
            if (!schedule) {
              return null;
            }

            return null;
          }
        );
        return data;
      } catch (error) {
        throw new Error("Erro ao buscar comentários");
      }
    },

    onSuccess(_: any, params: any) {
      console.log(params);
      if (params.type === "ANIME") {
        setType("ANIME");

        queryClient.invalidateQueries({
          queryKey: ["getAnimeSchedule"],
        });
      } else {
        const mangaId = params.mangaId;
        setType("MANGA");

        queryClient.invalidateQueries({
          queryKey: ["getMangaSchedule"],
        });
      }
    },
    onSettled: () => {
      if (type === "ANIME") {
        queryClient.invalidateQueries({
          queryKey: ["getAnimeSchedule"],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["getMangaSchedule"],
        });
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useDeleteSchedule;
