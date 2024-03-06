import { Comment } from "@/@types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseUpdateCommentPayload {
  id: string;
  comment: string;
  mentionedUserIds: string[];
}

const useUpdateComment: any = () => {
  const queryClient = useQueryClient();

  return useMutation<any>({
    mutationKey: ["updateComment"],
    mutationFn: async (payload: any) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/comments/${payload.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
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
      queryClient.setQueryData(["comment", payload.id], (comment: any) => ({
        ...comment,
        comment: payload.comment,
        mentioned_user_ids: payload.mentionedUserIds,
      }));
    },
    onSuccess: async (data: any, params: any) => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useUpdateComment;
