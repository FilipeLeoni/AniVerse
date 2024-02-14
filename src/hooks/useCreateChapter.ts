import { randomString } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useApi } from "./useApi";
import { UploadFile } from "@/components/services/upload";

interface UseCreateChapterArgs {
  mangaId: string;
}

interface CreateChapterInput {
  images: File[];
  chapterName: string;
  chapterNumber: string;
}

const useCreateChapter: any = (args: UseCreateChapterArgs) => {
  const { mangaId } = args;

  console.log(mangaId);
  const router = useRouter();

  const id = "create-chapter-id";
  const chapterId = randomString(8);
  const api = useApi();

  return useMutation<any>({
    mutationKey: ["create-chapter"],
    mutationFn: async ({ chapterNumber, chapterName, images }: any) => {
      console.log(chapterNumber, chapterName, images);
      const uploadedImages: any = await UploadFile(images);

      console.log(uploadedImages);

      const res = await api.createChapter({
        mangaId,
        chapterNumber,
        chapterName,
        images: uploadedImages?.files,
      });

      console.log(res);
    },
  });

  // return useMutation<CreateChapterResponse, Error, CreateChapterInput>(
  //   async ({ chapterName, images }: any) => {
  //     if (!chapterName) {
  //       throw new Error("Chapter name is required");
  //     }

  //     if (!images?.length) {
  //       throw new Error("Images is required");
  //     }

  //     toast.loading("Uploading images...", {
  //       toastId: id,
  //     });

  //     const uploadedImages = await uploadFile(images);

  //     if (!uploadedImages?.length) {
  //       throw new Error("Upload images failed");
  //     }

  //     toast.update(id, {
  //       render: "Creating chapter...",
  //       type: "info",
  //       isLoading: true,
  //     });

  //     const upsertedChapter = await upsertChapter({
  //       chapter: { name: chapterName, id: chapterId },
  //       mediaId,
  //       sourceId,
  //     });

  //     if (!upsertedChapter) throw new Error("Upsert chapter failed");

  //     toast.update(id, {
  //       render: "Uploading to database...",
  //       type: "info",
  //       isLoading: true,
  //     });

  //     const { error } = await supabaseClient.from("kaguya_images").insert({
  //       chapterId: upsertedChapter.slug,
  //       images: uploadedImages,
  //       userId: user.id,
  //     });

  //     if (error) {
  //       throw new Error("Upload failed: " + error.message);
  //     }

  //     return {
  //       images: uploadedImages,
  //       chapter: upsertedChapter,
  //     };
  //   },
  //   {
  //     onError: (error) => {
  //       toast.update(id, {
  //         type: "error",
  //         isLoading: false,
  //         autoClose: 3000,
  //       });

  //       toast.error(error.message, { autoClose: 3000 });
  //     },
  //     onSuccess: () => {
  //       toast.update(id, {
  //         type: "success",
  //         isLoading: false,
  //         autoClose: 3000,
  //       });

  //       toast.success("Upload successfully", { autoClose: 3000 });

  //       router.push(
  //         `/upload/manga/${mediaId}/chapters/${sourceId}-${chapterId}`
  //       );
  //     },
  //   }
  // );
};

export default useCreateChapter;
