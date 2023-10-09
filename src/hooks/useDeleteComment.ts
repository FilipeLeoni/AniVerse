import { Comment } from "@/@types";
import { useQueryClient } from "@tanstack/react-query";

interface UseDeleteCommentProps {
  parentId?: string;
  topic: string;
}

const useDeleteComment: any = (props: UseDeleteCommentProps) => {
  const queryClient = useQueryClient();

  // return useMutation<Comment, PostgrestError, string, any>(
  //   async (commentId: string) => {
  //     const { data, error } = await supabaseClient
  //       .from<Comment>("sce_comments")
  //       .delete()
  //       .match({ id: commentId })
  //       .single();

  //     if (error) throw error;

  //     return data;
  //   },
  //   {
  //     onMutate: (commentId) => {
  //       queryClient.setQueryData<Comment[]>(["comments", props], (comments) =>
  //         comments.filter((comment) => comment.id !== commentId)
  //       );
  //     },
  //     onSettled: () => {
  //       queryClient.invalidateQueries(["comments", props]);
  //     },
  //     onError: (error) => {
  //       toast.error(error.message);
  //     },
  //   }
  // );
};

export default useDeleteComment;
