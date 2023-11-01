import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface UseAddCommentPayload {
  text: string;
  animeId: string;
  parentId: string | null;
}

const useAddToWatchList: any = () => {
  const queryClient = useQueryClient();

  return useMutation<any>({
    mutationKey: ["AddToWatchList"],
    mutationFn: async (payload: any) => {
      const { status, userId, animeId } = payload;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${payload.userId}/watchlist/${payload.animeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(status),
        }
      );

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }

      const data = await response.json();

      return data;
    },
    onSuccess: async (_: any, params: any) => {
      await queryClient.invalidateQueries({
        queryKey: ["watchList"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useAddToWatchList;
