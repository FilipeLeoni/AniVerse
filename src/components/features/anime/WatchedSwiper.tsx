import EpisodeCard from "@/components/features/anime/EpisodeCard";
import Swiper, { SwiperProps, SwiperSlide } from "@/components/shared/Swiper";
import { Watched } from "@/@types";
import { getTitle } from "@/utils/data";
import Link from "next/link";
// import { useRouter } from "next/router";
import React from "react";

interface WatchedSwiperProps extends SwiperProps {
  data: Watched[];
}

const WatchedSwiper: React.FC<WatchedSwiperProps> = ({ data, ...props }) => {
  // const { locale } = useRouter();

  console.log(data);
  return (
    <Swiper speed={500} {...props}>
      {data.map(({ media, episode, watchedTime, anime }, index) => {
        return (
          <SwiperSlide key={index}>
            <Link href={`/anime/watch/1/1`}>
              <EpisodeCard
                episode={{
                  ...episode,
                  thumbnail: anime.thumbnail,
                }}
                duration={(episode?.duration || 0) * 60}
                watchedTime={(watchedTime || 0) * 60}
              />
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default React.memo(WatchedSwiper);
