"use client";

import HomeBanner from "@/components/shared/HomeBanner";
import React, { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import PlainCard from "@/components/shared/PlainCard";

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
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  //   const { data: trendingAnime, isLoading: trendingLoading } = useMedia({
  //     type: MediaType.Anime,
  //     sort: [MediaSort.Trending_desc, MediaSort.Popularity_desc],
  //     perPage: isMobile ? 5 : 10,
  //   });

  const { data, isLoading, isError } = useQuery(
    ["trendingAnimeList"],
    async () => {
      const response = await fetch(`https://graphql.anilist.co`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              Page(page: 1, perPage: 20) {
                media(sort: TRENDING_DESC, type: ANIME) {
                  id
                  title {
                    romaji
                    english
                    native
                    userPreferred
                  }
                  bannerImage
                  coverImage {extraLarge}
                  description
                  format
                  type
                  genres
                  averageScore
                  popularity
                  trending
                  favourites
                  nextAiringEpisode {
                    airingAt
                    episode
                  }
                }
              }
            }
          `,
        }),
      });

      return response.json();
    }
  );

  const trendingAnimeList = data?.data?.Page?.media || [];

  return (
    <div>
      <HomeBanner data={trendingAnimeList} isLoading={isLoading} />
    </div>
  );
}
