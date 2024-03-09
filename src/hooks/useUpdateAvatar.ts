import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UploadFile } from "@/components/services/upload";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const useUpdateAvatar: any = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const user = session?.user;

  return useMutation<any>({
    mutationKey: ["updateAvatar"],
    mutationFn: async (file: any) => {
      try {
        const uploadedData = await UploadFile(file);

        if (!uploadedData?.success) throw new Error("Upload failed");

        const url = uploadedData?.files?.[0];

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${user?.id}/profilePicture`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              picture: url,
            }),
          }
        );

        const data = await response.json();

        if (data?.error) {
          throw new Error(data.error);
        }

        return uploadedData;
      } catch (error) {
        throw new Error("Error during upload, please try again.");
      }
    },
    onMutate(payload: any) {
      queryClient.setQueryData(["user-profile", payload.id], (old: any) => {
        return {
          ...old,
          ...payload,
        };
      });
    },
    onSuccess: () => {
      toast.success("Profile picture updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export default useUpdateAvatar;
