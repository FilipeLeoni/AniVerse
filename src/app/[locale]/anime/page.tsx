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
import {
  getFavoriteAnime,
  getPopularAnime,
  getTrendingAnime,
  getUpdatedAnime,
} from "@/mocks/queries";

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

export default function AnimePage() {
  const { data: TrendingAnime, isLoading: TrendingAnimeLoading } =
    useQuery<any>({
      queryKey: ["TrendingAnime"],
      queryFn: async () => {
        const response = await getTrendingAnime();
        return response.data;
      },
    });

  const { data: PopularAnime, isLoading: PopularAnimeLoading } = useQuery<any>({
    queryKey: ["PopularAnime"],
    queryFn: async () => {
      const response = await getPopularAnime();
      return response.data;
    },
  });
  const { data: UpdatedAnime, isLoading: UpdatedAnimeLodaing } = useQuery<any>({
    queryKey: ["UpdatedAnime"],
    queryFn: async () => {
      const response = await getUpdatedAnime();
      return response.data;
    },
  });
  const { data: FavouriteAnime, isLoading: FavouriteAnimeLoading } =
    useQuery<any>({
      queryKey: ["FavouriteAnime"],
      queryFn: async () => {
        const response = await getFavoriteAnime();
        return response.data;
      },
    });

  const PopularAnimeData = PopularAnime?.Page?.media || [];
  const TrendingAnimeData = TrendingAnime?.Page?.media || [];
  const UpdatedAnimeData = UpdatedAnime?.Page?.media || [];
  const FavoriteAnimeData = FavouriteAnime?.Page?.media || [];

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
        {UpdatedAnimeLodaing ? (
          <ListSwiperSkeleton />
        ) : (
          <CardCarousel data={UpdatedAnimeData} title="NEWLY UPDATED" />
        )}
      </Section>
      <Section className="md:space-between flex flex-col items-center space-y-4 space-x-0 md:flex-row md:space-y-0 md:space-x-4 pb-36">
        {FavouriteAnimeLoading ? (
          <ListSwiperSkeleton />
        ) : (
          <CardCarousel data={FavoriteAnimeData} title="FAVORITE ANIMES" />
        )}
      </Section>
    </div>
  );
}
