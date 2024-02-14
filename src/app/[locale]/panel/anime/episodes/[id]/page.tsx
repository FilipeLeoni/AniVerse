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
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";

export default function Params({ params }: { params: { id: number } }) {
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };
  const api = useApi();
  const mediaId = params.id;
  const { data: anime, isLoading: mediaLoading } = useQuery<any>({
    queryKey: ["EpisodeAnime", mediaId],
    queryFn: async () => {
      const response = await api.getAnimeById(mediaId);
      return { media: response };
    },
  });

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

                  <div className="space-y-2">
                    {anime.media && anime.media.episode.length > 0 ? (
                      anime.media.episode.map((episode: any) => (
                        <div key={episode}>
                          <EpisodeItem onDelete={() => console.log("Deleted")}>
                            {episode.number}
                          </EpisodeItem>
                        </div>
                      ))
                    ) : (
                      <p>No Data...</p>
                    )}
                  </div>
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
