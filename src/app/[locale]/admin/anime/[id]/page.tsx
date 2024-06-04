"use client";

import UploadContainer from "@/components/features/panel/UploadContainer";
import MediaDetails from "@/components/features/upload/MediaDetails";
import Button from "@/components/shared/Button";
import Checkbox from "@/components/shared/Checkbox";
import ControlledCheckbox from "@/components/shared/ControlledCheckbox";
import EpisodeItem from "@/components/shared/EpisodeItem";
import Input from "@/components/shared/Input";
import Loading from "@/components/shared/Loading";
import { UploadMediaProvider } from "@/contexts/UploadMediaContext";
import { useApi } from "@/hooks/useApi";
import useDeleteEpisode from "@/hooks/useDeleteEpisode";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiFillEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";

export default function Params({ params }: { params: { id: number } }) {
  const [checked, setChecked] = useState(false);

  const router = useRouter();

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  const queryClient = useQueryClient();
  const { mutate: deleteEpisode, status, isPending } = useDeleteEpisode();
  const api = useApi();
  const mediaId = params.id;
  const { data: anime, isLoading: mediaLoading } = useQuery<any>({
    queryKey: ["getAnimeById", mediaId],
    queryFn: async () => {
      const response = await api.getAnimeById(mediaId);
      return { media: response };
    },
  });

  const { data: episodes, isLoading: isEpisodeLoading } = useQuery<any>({
    queryKey: ["getEpisodesByAnime", mediaId],
    queryFn: async () => {
      const response = await api.getEpisodeByAnime(mediaId);
      return response;
    },
  });

  async function handleDeleteEpisode(episodeId: number) {
    deleteEpisode({
      episodeId,
    });
  }

  useEffect(() => {
    if (status === "pending") {
      toast.loading("Deleting episode...");
    }

    if (status === "success") {
      toast.success("Episode deleted successfully");
    }

    if (status === "error") {
      toast.error("Error deleting episode");
    }

    return () => {
      toast.dismiss();
    };
  }, [status]);

  const { control } = useForm();
  return (
    <React.Fragment>
      <UploadContainer isVerified={true}>
        {mediaLoading ? (
          <Loading />
        ) : (
          <>
            <UploadMediaProvider value={{ mediaId }}>
              <div className="space-y-8">
                <MediaDetails media={anime.media} />

                <div className="mt-8">
                  <div className="w-full flex justify-between items-center gap-x-2 [&>*]:w-max mb-8">
                    <Button LeftIcon={AiFillEdit} primary>
                      Edit Anime Data
                    </Button>
                    <Link href={`/panel/anime/episodes/${mediaId}/create`}>
                      <Button LeftIcon={IoIosAddCircleOutline} primary>
                        New Episode
                      </Button>
                    </Link>
                  </div>

                  {isEpisodeLoading ? (
                    <div>
                      <Loading />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {episodes && episodes.length > 0 ? (
                        episodes.map((episode: any) => (
                          <div key={episode}>
                            <EpisodeItem
                              onEdit={() =>
                                router.replace(
                                  `/admin/anime/${mediaId}/episode/${episode.id}/edit`
                                )
                              }
                              onDelete={() => handleDeleteEpisode(episode.id)}
                            >
                              {episode.number}
                            </EpisodeItem>
                          </div>
                        ))
                      ) : (
                        <p>No Data...</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </UploadMediaProvider>
            <div className="mt-20">
              <form>
                <div>
                  <Button primary LeftIcon={AiFillEdit}>
                    Scrapper
                  </Button>
                  <div className="flex gap-2 w-full mt-4">
                    <div className="w-full relative flex">
                      <Input
                        placeholder="Anime Url"
                        className="h-full py-2 pl-4 pr-12"
                        containerClassName="w-full h-full"
                      />
                      <div className="absolute right-0 h-full flex rounded justify-center items-center text-red-500 px-3 cursor-pointer transition-colors hover:bg-background-500">
                        <FaTrash />
                      </div>
                    </div>
                    <Button primary>Cancel</Button>
                  </div>
                  <div className="flex gap-6">
                    <ControlledCheckbox
                      label="IS COMPLETED"
                      name="isCompleted"
                      control={control}
                    />

                    <ControlledCheckbox
                      label="AUTO SCRAP"
                      name="isAutoScrap"
                      control={control}
                    />

                    <div>
                      <Input
                        placeholder="0"
                        defaultValue={0}
                        type="numeric"
                        className="max-w-[70px] justify-center flex items-center text-center py-1 border border-gray-200 focus:border-primary-500"
                        containerClassName="!w-auto flex flex-row-reverse justify-center items-center"
                        labelClassName="text-sm !font-normal pt-2 pl-2 max-w-[160px]"
                        label="NUMBER OF EPISODE TO SCRAP"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </>
        )}
      </UploadContainer>
    </React.Fragment>
  );
}
