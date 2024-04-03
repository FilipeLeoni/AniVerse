import PlainCard from "@/components/shared/PlainCard";
import Swiper, { SwiperProps, SwiperSlide } from "@/components/shared/Swiper";
import useDevice from "@/hooks/useDevice";
import { Media } from "@/@types/anilist";
import { getTitle } from "@/utils/data";
import { motion } from "framer-motion";
import React, { useRef } from "react";
import { useLocale } from "next-intl";

interface BannerSwiperProps extends SwiperProps {
  data: Media[];
}

const BannerSwiper: React.FC<BannerSwiperProps> = ({ data, ...props }) => {
  const { isDesktop } = useDevice();
  const locale = useLocale();

  return (
    <Swiper
      slidesPerGroup={1}
      centeredSlides
      loop
      slidesPerView={2}
      spaceBetween={20}
      breakpoints={{
        1536: {
          slidesPerView: 7,
        },
        1280: {
          slidesPerView: 6,
        },
        1024: {
          slidesPerView: 5,
        },
        768: {
          slidesPerView: 4,
        },
        640: {
          slidesPerView: 3,
        },
      }}
      slideToClickedSlide
      defaultActiveSlide={7}
      className=""
      {...props}
    >
      <div className="swiper">
        {data?.map((anime) => (
          <SwiperSlide key={anime.id}>
            {({ isActive }) => {
              const title = getTitle(anime, locale);
              return (
                <motion.div
                  variants={{
                    enter: {
                      opacity: 1,
                      y: isDesktop ? -40 : 0,
                      speed: 300,
                    },
                    exit: {
                      opacity: 0.2,
                      y: 0,
                    },
                  }}
                  animate={isActive ? "enter" : "exit"}
                  title={title as string}
                >
                  <PlainCard src={anime?.coverImage?.extraLarge} alt={title} />
                </motion.div>
              );
            }}
          </SwiperSlide>
        ))}
      </div>
    </Swiper>
  );
};

export default React.memo(BannerSwiper);
