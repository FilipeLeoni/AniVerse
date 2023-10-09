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
          `http://localhost:8000/comments/${payload.id}`,
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
    onSettled(data: any) {
      console.log("teste");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // return useMutation<Comment, PostgrestError, UseUpdateCommentPayload, any>(
  //   async (payload: UseUpdateCommentPayload) => {
  //     const { data, error } = await supabaseClient
  //       .from<Comment>("sce_comments")
  //       .update({
  //         mentioned_user_ids: payload.mentionedUserIds,
  //         comment: payload.comment,
  //       })
  //       .match({ id: payload.id })
  //       .single();

  //     if (error) throw error;

  //     return data;
  //   },
  //   {
  //     onMutate: (payload) => {
  //       queryClient.setQueryData<Comment>(
  //         ["comment", payload.id],
  //         (comment) => ({
  //           ...comment,
  //           comment: payload.comment,
  //           mentioned_user_ids: payload.mentionedUserIds,
  //         })
  //       );
  //     },
  //     onSettled: (data) => {
  //       queryClient.invalidateQueries(["comment", data.id]);
  //     },
  //     onError: (error) => {
  //       toast.error(error.message);
  //     },
  //   }
  // );
};

export default useUpdateComment;
