import { Comment } from "@/@types";
import { useQuery } from "@tanstack/react-query";

const useComment: any = (commentId: string) => {
  return useQuery({
    queryKey: ["comment", commentId],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
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
