import { useUser } from "@/contexts/AuthContext";
import { AdditionalUser } from "@/@types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { useSession } from "next-auth/react";

const useUpdateProfile: any = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const queryClient = useQueryClient();
  return useMutation<any>({
    mutationKey: ["updateUser"],
    mutationFn: async (payload: any) => {
      const { name, bio } = payload;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${user?.id}/updateUser`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              bio,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Error updating user profile");
        }

        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error("Error updating user profile");
      }
    },
    onMutate(payload: any) {
      queryClient.setQueryData(["user-profile", user?.id], (old: any) => {
        return {
          ...old,
          ...payload,
        };
      });
    },
    onSuccess: async (data: any, params: any) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile", user?.id] });
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
