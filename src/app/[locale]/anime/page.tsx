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
import { AiFillPlayCircle } from "react-icons/ai";
import WatchedSection from "@/components/features/anime/WatchedSection";
import WatchedSwiperSkeleton from "@/components/skeletons/WatchedSwiperSkeleton";
import { useApi } from "@/hooks/useApi";
import BaseLayout from "@/components/layout/BaseLayout";

interface Anime {
  id: number;
  title: {
    original: string;
    english: string;
  };
}

export default function AnimePage() {
  const api = useApi();

  const { data: getAddedAnimes, isLoading: isLoadingGetAdded } = useQuery<any>({
    queryKey: ["getAddedAnimes"],
    queryFn: async () => {
      const response = await api.getUploadedAnimes();
      return response.data;
    },
    staleTime: 3600 * 1000,
  });

  const { data: getPopularAnime, isLoading: isLoadingPopularAnime } =
    useQuery<any>({
      queryKey: ["getPopularAnime"],
      queryFn: async () => {
        const response = await api.getPopularAnime();
        return response;
      },
      staleTime: 3600 * 1000,
    });

  const { data: getRecommend, isLoading: isLoadingRecommend } = useQuery<any>({
    queryKey: ["getRecommed"],
    queryFn: async () => {
      const response = await api.getRecommed();
      return response;
    },
    staleTime: 3600 * 1000,
  });

  return (
    <div>
      <div>
        <HomeBanner
          data={getPopularAnime || []}
          isLoading={isLoadingPopularAnime}
          icon={AiFillPlayCircle}
        />
      </div>

      {!isLoadingRecommend ? (
        <div className="space-y-8 mb-12">
          <WatchedSection />
        </div>
      ) : (
        <WatchedSwiperSkeleton />
      )}

      {isMobile && (
        <Section className="w-full md:w-[20%] md:!pl-0 h-full mb-8">
          <GenreSwiper className="md:h-[520px]" />
        </Section>
      )}
      <Section className="md:space-between flex flex-col items-center space-y-4 space-x-0 md:flex-row md:space-y-0 md:space-x-4 pb-14">
        {isLoadingGetAdded ? (
          "Loading"
        ) : (
          <CardCarousel data={getAddedAnimes} title="NEWLY UPDATED" />
        )}
      </Section>

      <Section className="md:space-between flex flex-col items-center space-y-4 space-x-0 md:flex-row md:space-y-0 md:space-x-4 pb-14">
        {isLoadingGetAdded ? (
          <ListSwiperSkeleton />
        ) : (
          <CardCarousel data={getPopularAnime} title="Popular Animes" />
        )}
      </Section>

      {!isMobile && (
        <div
          className={classNames(
            "flex gap-8 pt-20",
            isDesktop ? "flex-row" : "flex-col"
          )}
        >
          <Section
            className="w-full md:w-[80%] md:!pr-0"
            title="SHOULD WATCH ON ANIVERSE"
          >
            <ShouldWatch data={getRecommend} isLoading={isLoadingRecommend} />
          </Section>
          <Section className="w-full md:w-[20%] md:!pl-0 h-full" title="GENRES">
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
