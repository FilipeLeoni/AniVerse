import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const useUpdateWatchlist: any = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<any>({
    mutationKey: ["updateList"],
    mutationFn: async (payload: any) => {
      const userId = session?.user?.id;
      const listType = payload.type === "ANIME" ? "watchlist" : "readinglist";

      try {
        if (userId) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/list/${userId}/${listType}/${payload.mediaId}}`,
            {
              method: payload.hasToAdd ? "PUT" : "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: payload.status }),
            }
          );

          if (!response.ok) {
            throw new Error("Erro ao buscar comentários");
          }

          return toast.success("List updated.", {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        } else {
          toast.error("You must be logged.", {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
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
