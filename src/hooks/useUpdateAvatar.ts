import { useUser } from "@/contexts/AuthContext";
// import supabaseClient from "@/lib/supabase";
// import { Attachment, uploadFile } from "@/services/upload";
import { AdditionalUser } from "@/@types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateAvatar: any = () => {
  const queryClient = useQueryClient();

  return useMutation<any>({
    mutationKey: ["updateAvatar"],
    mutationFn: async (newProfilePicture: any) => {
      console.log(newProfilePicture);
      const formData = new FormData();
      try {
        if (Array.isArray(newProfilePicture)) {
          newProfilePicture.forEach((f) => formData.append("file", f));
        } else {
          formData.append("file", newProfilePicture);
        }

        // formData.append("profilePicture", newProfilePicture);

        console.log(formData);
        // const response = await fetch(
        //   `http://localhost:8000/user/${newProfilePicture.id}`,
        //   {
        //     method: "PUT",
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //     },
        //     body: formData,
        //   }
        // );

        // if (!response.ok) {
        //   throw new Error("Erro ao atualizar");
        // }

        // const data = await response.json();
        // return data;
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
  //   async (file: any) => {
  //     if (!user.id) {
  //       throw new Error("User not found");
  //     }

  //     // const uploadedData = await uploadFile(file);

  //     // if (!uploadedData?.length) throw new Error("Upload failed");

  //     // I don't know why I didn't return the full URL, just use this until I decided to change it.
  //     const url =
  //       `https://cdn.discordapp.com/attachments/` + uploadedData[0].url;

  //     const { error } = await supabaseClient
  //       .from<AdditionalUser>("users")
  //       .update({ avatarUrl: url }, { returning: "minimal" })
  //       .match({ id: user.id });

  //     if (error) throw error;

  //     return uploadedData;
  //   },
  //   {
  //     onMutate: (file) => {
  //       const fileUrl = URL.createObjectURL(file);

  //       queryClient.setQueryData<AdditionalUser>(
  //         ["user-profile", user.id],

  //         (old) => {
  //           return {
  //             ...old,
  //             avatarUrl: fileUrl,
  //           };
  //         }
  //       );
  //     },
  //     onError: (error) => {
  //       toast.error(error.message);
  //     },
  //     onSuccess: () => {
  //       toast.success("Avatar updated successfully");

  //       queryClient.invalidateQueries(["user-profile", user.id]);
  //     },
  //   }
  // );
};

export default useUpdateAvatar;
