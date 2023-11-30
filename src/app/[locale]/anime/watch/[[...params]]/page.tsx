"use client";

import EpisodeSelector from "@/components/features/anime/EpisodeSelector";
import VideoPlayer from "@/components/features/anime/Player";
import EmbedVidet from "@/components/features/anime/Player/EmbedVidet";
import MediaDetails from "@/components/features/upload/MediaDetails";
import HorizontalCard from "@/components/shared/HorizontalCard";
import Section from "@/components/shared/Section";
import { useApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import Player from "netplayer";
import React, { useMemo } from "react";
import { isMobile } from "react-device-detect";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

export default function WatchPage({ params }: { params: { params: string } }) {
  const api = useApi();
  const animeId = Number(params.params[0]);

  const { data: episode, isLoading: isEpisodeLoading } = useQuery<any>({
    queryKey: ["EpisodeAnime"],
    queryFn: async () => {
      const response = await api.getEpisodeById(animeId);
      return response;
    },
  });

  console.log(episode);

  const { data: anime, isLoading: mediaLoading } = useQuery<any>({
    queryKey: ["AnimeById"],
    queryFn: async () => {
      const response = await api.getAnimeById(2);
      return { media: response };
    },
  });

  const { data: related, isLoading: isLoadingRelated } = useQuery<any>({
    queryKey: ["Related"],
    queryFn: async () => {
      const response = await api.getUploadedAnimes();
      return { media: response };
    },
  });

  return (
    <div className="flex flex-col w-full h-auto pt-16">
      <div style={{ height: isMobile ? "100%" : "70vh" }} className="relative">
        <VideoPlayer
          episodeData={episode}
          isEpisodeLoading={isEpisodeLoading}
        />
        {/* <EmbedVidet /> */}
      </div>
      <div className="flex mt-20 flex-wrap lg:flex-nowrap">
        <Section className="">
          <div>
            <EpisodeSelector />
          </div>

          <div>
            <h2 className="text-2xl font-medium">Info</h2>
            {!mediaLoading && <MediaDetails media={anime?.media} />}
          </div>
        </Section>

        <div className="w-full flex md:-ml-20">
          <Tabs selectedTabClassName="bg-red-600">
            <TabList className="flex items-center justify-start gap-x-2 list-none -ml-1 mb-4">
              <Tab className="px-4 py-1 bg-background-700 rounded-md cursor-pointer outline-none">
                Related
              </Tab>
              <Tab className="px-4 py-1 bg-background-700 rounded-md cursor-pointer outline-none">
                Recommendations
              </Tab>
            </TabList>

            <TabPanel>
              {related?.media?.data?.map((media: any) => (
                <HorizontalCard
                  // redirectUrl={`/upload/anime/${related.latestManga.id}`}
                  key={media.id}
                  data={media}
                  className="w-full"
                />
              ))}
            </TabPanel>

            <TabPanel>
              <h2>Any content 2</h2>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
