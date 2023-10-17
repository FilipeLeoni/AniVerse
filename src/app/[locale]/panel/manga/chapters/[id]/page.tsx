"use client";

import UploadContainer from "@/components/features/panel/UploadContainer";
import MediaDetails from "@/components/features/upload/MediaDetails";
import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import { UploadMediaProvider } from "@/contexts/UploadMediaContext";
import { getAnimeById, searchData } from "@/mocks/queries";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

export default function Chapters({ params }: { params: { id: string } }) {
  console.log(params);
  const mediaId = parseInt(params.id);
  console.log(params);
  const { data: manga, isLoading: mediaLoading } = useQuery<any>({
    queryKey: ["MangaChapters", mediaId],
    queryFn: async () => {
      const response = await getAnimeById(mediaId, "MANGA");
      return response.data;
    },
  });

  console.log(manga);
  return (
    <React.Fragment>
      <UploadContainer className="!p-24" isVerified={true}>
        {mediaLoading ? (
          <Loading />
        ) : (
          <UploadMediaProvider value={{ mediaId }}>
            <div className="space-y-8">
              <MediaDetails media={manga.Media} />

              <div className="mt-8">
                <div className="w-full flex justify-end items-center gap-x-2 [&>*]:w-max mb-8">
                  <Link href={`/panel/manga/chapters/${mediaId}/create`}>
                    <Button LeftIcon={IoIosAddCircleOutline} primary>
                      New Chapter
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
