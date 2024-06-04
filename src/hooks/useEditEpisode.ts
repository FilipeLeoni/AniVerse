import { UploadVideo } from "@/components/services/upload";
import { useMutation } from "@tanstack/react-query";
import { useApi } from "./useApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const useEditEpisode = () => {
  const api = useApi();
  const router = useRouter();
  return useMutation({
    mutationKey: ["edit-episode"],
    mutationFn: async ({
      animeId,
      title,
      number,
      description,
      video,
      type,
      episodeId,
    }: any) => {
      if (!number) {
        throw new Error("Episode number is required");
      }

      if (!video) {
        throw new Error("Video is required");
      }

      let uploadedVideo: any;

      if (type === "file") {
        const data: any = await UploadVideo(video);

        console.log(data);

        if (!data?.data?.success) throw new Error("Upload failed");

        uploadedVideo = data?.data?.files[0];
      } else {
        uploadedVideo = video;
      }

      if (uploadedVideo) {
        const response = await api.editAnimeEpisode(episodeId, {
          animeId,
          title,
          number,
          description,
          video: uploadedVideo,
        });

        if (response) {
          return response;
        }
      }
    },
    onSuccess: (_, data) => {
      toast.success("Episode created successfully");
      router.push(`/panel/anime/episodes/${data.animeId}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export default useEditEpisode;
