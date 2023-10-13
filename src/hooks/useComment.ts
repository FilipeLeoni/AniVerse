import { Comment } from "@/@types";
import { useQuery } from "@tanstack/react-query";

const useComment: any = (commentId: string) => {
  return useQuery({
    queryKey: ["comment", commentId],
    queryFn: async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/comments/${commentId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        if (!response.ok) {
          throw new Error("Erro ao buscar comentário");
        }
        const data = await response.json();
        console.log(data);
        return data;
      } catch (error) {
        throw new Error("Erro ao buscar comentário");
      }
    },
    staleTime: Infinity,
  });
};

export default useComment;
