import { Comment } from "@/@types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteComment: any = () => {
  const queryClient = useQueryClient();

  return useMutation<any>({
    mutationKey: ["deleteComment"],
    mutationFn: async (payload: any) => {
      console.log(payload);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/comments/${payload}`,
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
        return data;
      } catch (error) {
        throw new Error("Erro ao buscar comentários");
      }
    },
    onMutate(payload: any) {
      queryClient.setQueryData(["comment", payload], (comment: any) => ({
        ...comment,
        comment: payload.comment,
      }));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useDeleteComment;
