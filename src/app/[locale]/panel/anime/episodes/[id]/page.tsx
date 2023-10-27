"use client";

import UploadContainer from "@/components/features/panel/UploadContainer";
import MediaDetails from "@/components/features/upload/MediaDetails";
import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import { UploadMediaProvider } from "@/contexts/UploadMediaContext";
import { useApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { AiFillEdit } from "react-icons/ai";
import { IoIosAddCircleOutline } from "react-icons/io";

export default function Params({ params }: { params: { id: number } }) {
  const api = useApi();
  const mediaId = params.id;
  const { data: anime, isLoading: mediaLoading } = useQuery<any>({
    queryKey: ["EpisodeAnime", mediaId],
    queryFn: async () => {
      const response = await api.getAnimeById(mediaId);
      return { media: response };
    },
  });

  return (
    <React.Fragment>
      <UploadContainer isVerified={true}>
        {mediaLoading ? (
          <Loading />
        ) : (
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
                      <p key={episode}>episode</p>
                    ))
                  ) : (
                    <p>No Data...</p>
                  )}
                </div>
              </div>
            </div>
          </UploadMediaProvider>
        )}
      </UploadContainer>
    </React.Fragment>
  );
}
