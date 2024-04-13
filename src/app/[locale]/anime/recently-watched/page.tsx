"use client";

import Card from "@/components/shared/Card";
import InView from "@/components/shared/InView";
import List from "@/components/shared/List";
import Loading from "@/components/shared/Loading";
import Section from "@/components/shared/Section";
import { useApi } from "@/hooks/useApi";
import useWatchList from "@/hooks/useWatchList";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { IoArrowBack } from "react-icons/io5";

export default function RecentlyWatched() {
  const api = useApi();

  const storedHistory: any = localStorage.getItem("aniverse_history");
  let related: any = [];

  if (storedHistory) {
    related = JSON.parse(storedHistory).watchedEpisodes || [];
  }

  const uniqueAnimeIdsSet = new Set();
  for (const item of related) {
    uniqueAnimeIdsSet.add(item.anime.id);
  }
  const animeIds = Array.from(uniqueAnimeIdsSet);

  const { data, isLoading } = useQuery({
    queryKey: ["watched", animeIds],
    queryFn: async () => {
      const res = await api.getAnimeByMediaIds(animeIds);
      return res;
    },
  });

  const { back } = useRouter();

  return (
    <Section className="min-h-screen">
      <div className="mt-8">
        {isLoading ? (
          <div className="h-screen w-full relative flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <React.Fragment>
            <h1 className="pt-14 text-4xl font-semibold mb-10 flex gap-4 items-center">
              <IoArrowBack onClick={() => back()} className="cursor-pointer" />
              Recently watched
            </h1>
            <List data={data}>
              {(node: any) => {
                const durationTime = node?.duration * 60;
                const watchProgressPercent =
                  durationTime === 0
                    ? 0
                    : (node?.watchedTime / durationTime) * 100;

                const now = dayjs();

                const nextEpisodeAiringTime = !node?.nextAiringEpisode
                  ? null
                  : dayjs.unix(node?.nextAiringEpisode.airingAt);

                let nextEpisodeAiringTimeDuration = "";

                if (nextEpisodeAiringTime) {
                  nextEpisodeAiringTimeDuration = dayjs
                    .duration(nextEpisodeAiringTime.diff(now))
                    .format("D[d] H[h] m[m]");
                }

                const airedEpisodes = node?.nextAiringEpisode
                  ? node?.nextAiringEpisode.episode - 1
                  : null;

                return (
                  <Card
                    imageEndSlot={
                      <React.Fragment>
                        <div className="z-[5] flex flex-col justify-end absolute inset-0">
                          {node?.nextAiringEpisode && (
                            <p className="ml-2 mb-1 px-1 py-0.5 rounded-md bg-background-700 w-max">
                              EP {node.nextAiringEpisode.episode}:{" "}
                              {nextEpisodeAiringTimeDuration}
                            </p>
                          )}

                          <div className="flex justify-between">
                            <p className="ml-2 mb-2 px-1 py-0.5 rounded-md bg-background-700">
                              {airedEpisodes
                                ? `${
                                    node?.watchedEpisode
                                  } / ${airedEpisodes} / ${
                                    node?.episodes || "??"
                                  }`
                                : `${node.watchedEpisode} / ${
                                    node?.episodes || "??"
                                  }`}
                            </p>

                            {/* <p className="mr-2 mb-2 px-1 py-0.5 rounded-md bg-background-700">
                            {parseTime(node.watchedTime)}
                          </p> */}
                          </div>

                          <div
                            className="h-1 bg-primary-500"
                            style={{ width: `${watchProgressPercent}%` }}
                          />
                        </div>

                        <div className="z-0 flex flex-col justify-end absolute inset-0">
                          <div className="h-32 bg-gradient-to-t from-black/80 to-transparent z-40"></div>
                        </div>
                      </React.Fragment>
                    }
                    data={node}
                  />
                );
              }}
            </List>

            {/* {((totalData?.length && !isFetchingNextPage) || hasNextPage) && (
              <InView onInView={handleFetch} />
            )} */}

            {/* {!hasNextPage && !!totalData?.length && (
              <p className="mt-8 text-2xl text-center">
                There is nothing left...
              </p>
            )} */}
          </React.Fragment>
        )}
      </div>
    </Section>
  );
}
