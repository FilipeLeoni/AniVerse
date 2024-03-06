import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface UseAddCommentPayload {
  text: string;
  animeId: string;
  parentId: string | null;
}

const useCreateComment: any = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<any>({
    mutationKey: ["addComment"],
    mutationFn: async (payload: any) => {
      const { text, parentId, animeId } = payload;
      const newComment: any = {
        text,
        animeId,
        parentId,
        userId: session?.user?.id,
      };

      console.log(newComment);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newComment),
        }
      );

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }

      const data = await response.json();

      queryClient.setQueryData(
        ["comments", { animeId, parentId }],
        (comments: any) => {
          if (!comments) {
            return [];
          }

          return comments.map((comment: any) => {
            if (comment.id === parentId) {
              if (!comment.replies) {
                comment.replies = [];
              }
              comment.replies.push(data);
            }
            return comment;
          });
        }
      );

      return data;
    },
    onSuccess: async (_: any, params: any) => {
      await queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useCreateComment;
