"use client";

import UploadContainer from "@/components/features/panel/UploadContainer";
import MediaDetails from "@/components/features/upload/MediaDetails";
import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import { UploadMediaProvider } from "@/contexts/UploadMediaContext";
import { useApi } from "@/hooks/useApi";
import { getAnimeById, searchData } from "@/mocks/queries";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

export default function Chapters({ params }: { params: { id: string } }) {
  const mediaId = parseInt(params.id);
  console.log(mediaId);
  const api = useApi();
  const { data: manga, isLoading: mediaLoading } = useQuery<any>({
    queryKey: ["MangaChapters", mediaId],
    queryFn: async () => {
      const response = await api.getMangaById(mediaId);
      console.log(response);
      return {
        Media: response,
      };
    },
  });

  console.log(manga);
  return (
    <React.Fragment>
      <UploadContainer isVerified={true}>
        {mediaLoading ? (
          <Loading />
        ) : (
          <UploadMediaProvider value={{ mediaId }}>
            <div className="space-y-8">
              <MediaDetails media={manga?.Media} />

              <div className="mt-8">
                <div className="w-full flex justify-end items-center gap-x-2 [&>*]:w-max mb-8">
                  <Link href={`/panel/manga/chapters/${mediaId}/create`}>
                    <Button LeftIcon={IoIosAddCircleOutline} primary>
                      New Chapter
                    </Button>
                  </Link>
                </div>

                <div className="space-y-2"></div>
              </div>
            </div>
          </UploadMediaProvider>
        )}
      </UploadContainer>
    </React.Fragment>
  );
}
