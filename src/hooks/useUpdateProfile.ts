import { useUser } from "@/contexts/AuthContext";
import { AdditionalUser } from "@/@types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";

const useUpdateProfile: any = () => {
  const user = useUser();
  const queryClient = useQueryClient();
  const api = useApi();
  return useMutation<any>({
    mutationKey: ["updateUser"],
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
      queryClient.setQueryData(["userProfile", payload.id], (old: any) => {
        return {
          ...old,
          ...payload,
        };
      });
    },
    onSuccess: async (data: any, params: any) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // return useMutation<any>(
  //   async (updateData: any) => {
  //     // Check if username is available
  //     const { data } = await supabaseClient
  //       .from("users")
  //       .select("id")
  //       .eq("username", updateData.username)
  //       .single();

  //     if (data && data.id !== user.id) {
  //       throw new Error("Username is already taken.");
  //     }

  //     const { error } = await supabaseClient
  //       .from("users")
  //       .update(updateData, { returning: "minimal" })
  //       .match({ id: user.id });

  //     if (error) throw error;

  //     return null;
  //   },
  //   {
  //     onMutate: (updateData) => {
  //       queryClient.setQueryData<AdditionalUser>(
  //         ["user-profile", user.id],

  //         (old) => {
  //           return {
  //             ...old,
  //             ...updateData,
  //           };
  //         }
  //       );
  //     },
  //     onError: (error) => {
  //       toast.error(error.message);
  //     },
  //     onSuccess: () => {
  //       toast.success("Profile updated successfully");

  //       queryClient.invalidateQueries(["user-profile", user.id]);
  //     },
  //   }
  // );
};

export default useUpdateProfile;
