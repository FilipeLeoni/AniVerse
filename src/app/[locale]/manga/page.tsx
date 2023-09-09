"use client";

import HomeBanner from "@/components/shared/HomeBanner";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Section from "@/components/shared/Section";
import CardCarousel from "@/components/shared/CardCarousel";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import {
  getPopularAnime,
  getRandomAnime,
  getTrendingAnime,
  getUpdatedAnime,
} from "@/mocks/queries";
import ShouldWatch from "@/components/shared/ShouldWatch";
import GenreSwiper from "@/components/shared/GenreSwiper";
import classNames from "classnames";
import { isDesktop, isMobile } from "react-device-detect";
import AnimeScheduling from "@/components/features/anime/Player/AnimeScheduling";
import { randomElement } from "@/utils";

interface Anime {
  id: number;
  title: {
    original: string;
    english: string;
  };
}

interface AnimeListResponse {
  data: {
    Page: {
      media: Anime[];
    };
  };
}

export default function MangaPage() {
  const { data: TrendingAnime, isLoading: TrendingAnimeLoading } =
    useQuery<any>({
      queryKey: ["TrendingAnime"],
      queryFn: async () => {
        const response = await getTrendingAnime("MANGA");
        return response.data;
      },
    });

  const { data: PopularAnime, isLoading: PopularAnimeLoading } = useQuery<any>({
    queryKey: ["PopularAnime"],
    queryFn: async () => {
      const response = await getPopularAnime("MANGA");
      return response.data;
    },
  });
  const { data: UpdatedAnime, isLoading: UpdatedAnimeLodaing } = useQuery<any>({
    queryKey: ["UpdatedAnime"],
    queryFn: async () => {
      const response = await getUpdatedAnime("MANGA");
      return response.data;
    },
  });

  const { data: RandomAnime, isLoading: RandomAnimeLoading } = useQuery<any>({
    queryKey: ["RandomAnime"],
    queryFn: async () => {
      const response = TrendingAnime;
      console.log(response);

      return response;
    },
    staleTime: 3600 * 1000,
  });

  const randomTrendingManga = useMemo(() => {
    return randomElement(TrendingAnime?.Page.media || []);
  }, [TrendingAnime]);

  const PopularAnimeData = PopularAnime?.Page?.media || [];
  const TrendingAnimeData = TrendingAnime?.Page?.media || [];
  const UpdatedAnimeData = UpdatedAnime?.Page?.media || [];

  return (
    <div>
      <div>
        <HomeBanner data={TrendingAnimeData} isLoading={TrendingAnimeLoading} />
      </div>
      <Section className="md:space-between flex flex-col items-center space-y-4 space-x-0 md:flex-row md:space-y-0 md:space-x-4 pb-14">
        {PopularAnimeLoading ? (
          <ListSwiperSkeleton />
        ) : (
          <CardCarousel data={PopularAnimeData} title="Popular Animes" />
        )}
      </Section>
      <Section className="md:space-between flex flex-col items-center space-y-4 space-x-0 md:flex-row md:space-y-0 md:space-x-4 pb-14">
        <CardCarousel data={UpdatedAnimeData} title="NEWLY UPDATED" />
      </Section>

      {!isMobile && (
        <div
          className={classNames(
            "flex gap-8 pt-20",
            isDesktop ? "flex-row" : "flex-col"
          )}
        >
          <Section className="md:space-between flex flex-col items-center space-y-4 space-x-0 md:flex-row md:space-y-0 md:space-x-4 md:w-[80%] md:!pr-0">
            <ShouldWatch
              data={randomTrendingManga}
              isLoading={RandomAnimeLoading}
            />
          </Section>
          <Section className="w-full md:w-[20%] md:!pl-0 h-full">
            <GenreSwiper className="md:h-[520px]" />
          </Section>
        </div>
      )}
    </div>
  );
}
