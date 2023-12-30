// import useWatched from "@/hooks/useWatched";
import React from "react";
import WatchedSwiperSkeleton from "@/components/skeletons/WatchedSwiperSkeleton";
import Section from "@/components/shared/Section";
import WatchedSwiper from "@/components/features/anime/WatchedSwiper";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";

const WatchedSection = () => {
  // const { data, isLoading, isError } = useWatched();

  const storedHistory = localStorage.getItem("aniverse_history");
  let data: any = [];
  const api = useApi();

  if (storedHistory) {
    data = JSON.parse(storedHistory).watchedEpisodes || [];
  }

  if (!data || !data?.length) {
    return null;
  }

  return (
    <Section title="Rencetly watched">
      <WatchedSwiper
        data={data}
        slidesPerView={5}
        slidesPerGroup={5}
        breakpoints={{
          1536: {
            slidesPerView: 5,
            slidesPerGroup: 5,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 20,
          },
          0: {
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 10,
          },
        }}
      />
    </Section>
  );
};

export default React.memo(WatchedSection);
