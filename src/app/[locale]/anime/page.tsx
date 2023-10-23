"use client";

import HomeBanner from "@/components/shared/HomeBanner";
import React from "react";
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
import {
  getPopularMedia,
  getRandomMedia,
  getTrendingMedia,
  getUpdatedMedia,
} from "@/mocks/queries";
import { AiFillPlayCircle, AiOutlineAlipayCircle } from "react-icons/ai";

interface Anime {
  id: number;
  title: {
    original: string;
    english: string;
  };
}

export default function AnimePage() {
  const { data: TrendingAnime, isLoading: TrendingAnimeLoading } =
    useQuery<any>({
      queryKey: ["TrendingAnime"],
      queryFn: async () => {
        const response = await getTrendingMedia();
        return response.data;
      },
    });

  const { data: PopularAnime, isLoading: PopularAnimeLoading } = useQuery<any>({
    queryKey: ["PopularAnime"],
    queryFn: async () => {
      const response = await getPopularMedia();
      return response.data;
    },
  });
  const { data: UpdatedAnime } = useQuery<any>({
    queryKey: ["UpdatedAnime"],
    queryFn: async () => {
      const response = await getUpdatedMedia();
      return response.data;
    },
  });

  const { data: RandomAnime, isLoading: RandomAnimeLoading } = useQuery<any>({
    queryKey: ["RandomAnime"],
    queryFn: async () => {
      const response = await getRandomMedia();
      return response;
    },
    staleTime: 3600 * 1000,
  });

  const PopularAnimeData = PopularAnime?.Page?.media || [];
  const TrendingAnimeData = TrendingAnime?.Page?.media || [];
  const UpdatedAnimeData = UpdatedAnime?.Page?.media || [];

  return (
    <div>
      <div>
        <HomeBanner
          data={TrendingAnimeData}
          isLoading={TrendingAnimeLoading}
          icon={AiFillPlayCircle}
        />
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
            <ShouldWatch data={RandomAnime} isLoading={RandomAnimeLoading} />
          </Section>
          <Section className="w-full md:w-[20%] md:!pl-0 h-full">
            <GenreSwiper className="md:h-[520px]" />
          </Section>
        </div>
      )}

      <Section className="md:pt-20 pb-10">
        <AnimeScheduling />
      </Section>
    </div>
  );
}
