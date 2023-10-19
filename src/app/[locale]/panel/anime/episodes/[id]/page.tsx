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
import { AiFillEdit } from "react-icons/ai";
import { IoIosAddCircleOutline } from "react-icons/io";

export default function Params({ params }: { params: { id: string } }) {
  const api = useApi();
  console.log(params);
  const mediaId = params.id;
  console.log(params);
  const { data: anime, isLoading: mediaLoading } = useQuery<any>({
    queryKey: ["EpisodeAnime", mediaId],
    queryFn: async () => {
      const response = await api.getAnimeById(mediaId);
      console.log(response);
      return { media: response };
    },
  });

  console.log(anime);
  return (
    <React.Fragment>
      <UploadContainer className="!p-24" isVerified={true}>
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

                  {/* <AddTranslationModal
                    mediaId={mediaId}
                    mediaType={MediaType.Anime}
                    defaultDescription={description}
                    defaultTitle={title}
                  /> */}
                </div>

                <div className="space-y-2">
                  {anime.media && anime.media.episode.length > 0 ? (
                    anime.media.episode.map((episode: any) => (
                      <p key={episode}>episode</p>
                    ))
                  ) : (
                    <p>No Data...</p>
                  )}
                  {/* {sortedEpisodes.map((episode) => (
                    <Link
                      key={episode.slug}
                      href={`/upload/anime/${mediaId}/episodes/${episode.slug}`}
                    >
                      <a className="relative block">
                        <BaseButton className="p-3 w-full !bg-background-900 hover:!bg-white/20 rounded-md">
                          {episode.name}
                        </BaseButton>

                        {!episode.published && (
                          <span className="rounded-md top-1/2 -translate-y-1/2 px-2 py-1 bg-primary-700 absolute right-5">
                            Chưa đăng tải
                          </span>
                        )}
                      </a>
                    </Link>
                  ))} */}
                </div>
              </div>
            </div>
          </UploadMediaProvider>
        )}
      </UploadContainer>

      {/* {!mediaLoading && (
        <Section className="fixed bottom-0 py-3 flex justify-end gap-2 items-center bg-background-800 w-full md:w-4/5">
          <DeleteConfirmation
            onConfirm={handleConfirm}
            className="space-y-4"
            confirmString={anime.title.userPreferred}
            isLoading={deleteLoading}
          >
            <h1 className="text-2xl font-semibold">
              Bạn có chắc chắn xóa không?
            </h1>

            <p>
              Một khi đã xóa, bạn sẽ không thể khôi phục lại. Điều này sẽ xóa
              hoàn toàn bất kỳ dữ liệu nào liên quan đến anime này.
            </p>
          </DeleteConfirmation>
        </Section>
      )} */}
    </React.Fragment>
  );
}
