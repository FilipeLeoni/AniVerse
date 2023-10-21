import { useUser } from "@/contexts/AuthContext";
// import { Attachment, uploadFile } from "@/services/upload";
import { AdditionalUser } from "@/@types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateBanner: any = () => {
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation<any>({});

  // return useMutation<any>(
  //   async (file: any) => {
  //     if (!user.id) {
  //       throw new Error("User not found");
  //     }

  //     const uploadedData = await uploadFile(file);

  //     if (!uploadedData?.length) throw new Error("Upload failed");

  //     // I don't know why I didn't return the full URL, just use this until I decided to change it.
  //     const url =
  //       `https://cdn.discordapp.com/attachments/` + uploadedData[0].url;

  //     const { error } = await supabaseClient
  //       .from<AdditionalUser>("users")
  //       .update({ bannerUrl: url }, { returning: "minimal" })
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
  //             bannerUrl: fileUrl,
  //           };
  //         }
  //       );
  //     },
  //     onError: (error) => {
  //       toast.error(error.message);
  //     },
  //     onSuccess: () => {
  //       toast.success("Banner updated successfully");

  //       queryClient.invalidateQueries(["user-profile", user.id]);
  //     },
  //   }
  // );
};

export default useUpdateBanner;
