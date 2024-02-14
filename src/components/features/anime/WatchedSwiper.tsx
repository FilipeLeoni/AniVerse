import EpisodeCard from "@/components/features/anime/EpisodeCard";
import Swiper, { SwiperProps, SwiperSlide } from "@/components/shared/Swiper";
import { Watched } from "@/@types";
import Link from "next/link";
import React from "react";

interface WatchedSwiperProps extends SwiperProps {
  data: Watched[];
}

const WatchedSwiper: React.FC<WatchedSwiperProps> = ({ data, ...props }) => {
  return (
    <Swiper speed={500} {...props}>
      {data.map(({ media, episode, watchedTime, anime, episodeId }, index) => {
        return (
          <SwiperSlide key={index}>
            <Link href={`/anime/watch/${anime?.id}/${episodeId}`}>
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
