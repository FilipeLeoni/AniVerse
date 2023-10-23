import { Comment } from "@/@types";
import { MediaType } from "@/@types/anilist";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface UseCommentsQuery {
  topic?: string;
  parentId?: string;
  type?: MediaType;
}

const useComments = (query: any) => {
  const { animeId, parentId = null, type } = query;
  const queryClient = useQueryClient();

  const data = useQuery({
    queryKey: ["comments", { animeId, parentId }],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/comments/anime/${animeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar comentários");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error("Erro ao buscar comentários");
      }
    },
  });

  useEffect(() => {
    if (data.isSuccess) {
      queryClient.setQueryData(["comments", { animeId, parentId }], data.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.isSuccess, data.data, animeId, parentId]);

  return data;
};

export default useComments;
