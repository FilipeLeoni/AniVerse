import { Comment } from "@/@types";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { useUser } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface UseAddCommentPayload {
  comment: string;
  animeId: string;
  parentId: string | null;
}

const useCreateComment: any = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  console.log(session);
  return useMutation<any>({
    mutationKey: ["addComment"],
    mutationFn: async (payload: any) => {
      console.log(payload);
      const { comment, parentId, animeId } = payload;
      const newComment: any = {
        comment,
        animeId,
        parentId,
        userId: session?.user?.id,
      };

      const comments =
        queryClient.getQueryData<Comment[]>(["comments", animeId]) || [];
      queryClient.setQueryData<Comment[]>(
        ["comments", animeId],
        [...comments, newComment]
      );

      return newComment;
    },
    onMutate: async (data: any) => {
      const { comment, parentId, animeId } = data;
      const newComment: any = {
        comment,
        animeId,
        parentId,
        userId: session?.user?.id,
      };

      const comments =
        queryClient.getQueryData<Comment[]>(["comments", animeId]) || [];
      queryClient.setQueryData<Comment[]>(
        ["comments", animeId],
        [...comments, newComment]
      );

      return newComment;
    },
    onSuccess: async (_: any, params: any) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", params.animeId, params.parentId],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useCreateComment;
