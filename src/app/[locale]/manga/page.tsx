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

import ShouldWatch from "@/components/shared/ShouldWatch";
import GenreSwiper from "@/components/shared/GenreSwiper";
import classNames from "classnames";
import { isDesktop, isMobile } from "react-device-detect";
import AnimeScheduling from "@/components/features/anime/Player/AnimeScheduling";
import { randomElement } from "@/utils";
import {
  getPopularMedia,
  getTrendingMedia,
  getUpdatedMedia,
} from "@/mocks/queries";
import BookIcon from "@/components/shared/BookIcon";
import ReadSection from "@/components/features/manga/ReadSection";

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
  const { data: TrendingManga, isLoading: TrendingMangaLoading } =
    useQuery<any>({
      queryKey: ["TrendingManga"],
      queryFn: async () => {
        const response = await getTrendingMedia("MANGA");
        return response.data;
      },
    });

  const { data: PopularManga, isLoading: PopularMangaLoading } = useQuery<any>({
    queryKey: ["PopularManga"],
    queryFn: async () => {
      const response = await getPopularMedia("MANGA");
      return response.data;
    },
  });
  const { data: UpdatedManga, isLoading: UpdatedMangaLodaing } = useQuery<any>({
    queryKey: ["UpdatedManga"],
    queryFn: async () => {
      const response = await getUpdatedMedia("MANGA");
      return response.data;
    },
  });

  const { data: RandomManga, isLoading: RandomMangaLoading } = useQuery<any>({
    queryKey: ["RandomManga"],
    queryFn: async () => {
      const response = TrendingManga;

      return response;
    },
    staleTime: 3600 * 1000,
  });

  const randomTrendingManga = useMemo(() => {
    return randomElement(TrendingManga?.Page.media || []);
  }, [TrendingManga]);

  const PopularMangaData = PopularManga?.Page?.media || [];
  const TrendingMangaData = TrendingManga?.Page?.media || [];
  const UpdatedMangaData = UpdatedManga?.Page?.media || [];

  return (
    <div>
      <div>
        <HomeBanner
          data={TrendingMangaData}
          isLoading={TrendingMangaLoading}
          icon={BookIcon}
        />
      </div>

      <div>
        <ReadSection />
      </div>
      <Section className="md:space-between flex flex-col items-center space-y-4 space-x-0 md:flex-row md:space-y-0 md:space-x-4 pb-14">
        {PopularMangaLoading ? (
          <ListSwiperSkeleton />
        ) : (
          <CardCarousel data={PopularMangaData} title="Popular Mangas" />
        )}
      </Section>
      <Section className="md:space-between flex flex-col items-center space-y-4 space-x-0 md:flex-row md:space-y-0 md:space-x-4 pb-14">
        <CardCarousel data={UpdatedMangaData} title="NEWLY UPDATED" />
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
              isLoading={RandomMangaLoading}
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
