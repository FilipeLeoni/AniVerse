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
  const { animeId, parentId = null, sortBy } = query;
  const queryClient = useQueryClient();

  console.log(sortBy);
  const { data, isLoading } = useQuery({
    queryKey: ["comments", { animeId, parentId, sortBy }],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/comments/anime/${animeId}?sortBy=${sortBy}`,
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

  console.log(data);

  useEffect(() => {
    if (data) {
      queryClient.setQueryData(["comments", { animeId, parentId }], data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, animeId, parentId]);

  return { data, isLoading };
};

export default useComments;
