import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UploadFile } from "@/components/services/upload";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const useUpdateBanner: any = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const user = session?.user;

  return useMutation<any>({
    mutationKey: ["updateBanner"],
    mutationFn: async (file: any) => {
      if (!user?.id) {
        throw new Error("User not found");
      }

      try {
        const uploadedData = await UploadFile(file);

        if (!uploadedData?.success) throw new Error("Upload failed");

        const url = uploadedData?.files?.[0];

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${user?.id}/banner`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              banner: url,
            }),
          }
        );

        const data = await response.json();

        if (data?.error) {
          throw new Error(data.error);
        }

        return uploadedData;
      } catch {
        throw new Error("Error during upload, please try again.");
      }
    },
    onMutate: (file) => {
      queryClient.setQueryData<any>(
        ["user-profile", user?.id],

        (old: any) => {
          return {
            ...old,
            bannerPicture: file,
          };
        }
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Banner updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["user-profile", user?.id],
      });
    },
  });
};

export default useUpdateBanner;
