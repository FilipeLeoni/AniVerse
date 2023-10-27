import { Comment } from "@/@types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface UseUpdateCommentPayload {
  id: string;
  comment: string;
  mentionedUserIds: string[];
}

const useUpdateWatchlist: any = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<any>({
    mutationKey: ["updateWatchList"],
    mutationFn: async (payload: any) => {
      const userId = session?.user?.id;

      try {
        if (!userId) {
          toast.error("You must be logged!", {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/watchlist/${payload.animeId}}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: payload.status }),
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar comentários");
        }

        return toast.success("Watchlist updated!", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } catch (error) {
        throw new Error("Erro ao buscar comentários");
      }
    },
    onMutate: async (payload: any) => {
      queryClient.setQueryData(["watchlistButton"], () => {
        return {
          status: payload.status,
        };
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["watchlistButton"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useUpdateWatchlist;
