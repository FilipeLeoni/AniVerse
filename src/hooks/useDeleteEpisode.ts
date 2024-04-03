import { Comment } from "@/@types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";
import toast from "react-hot-toast";

const useDeleteEpisode: any = () => {
  const queryClient = useQueryClient();
  return useMutation<any>({
    mutationKey: ["delete-episodes"],
    mutationFn: async ({ episodeId }: any) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/episodes/${episodeId}`,
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

      //   if(data) {
      //     const deleteEpisode = await
      //   }
      console.log(data);
      return data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["getEpisodesByAnime"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useDeleteEpisode;
