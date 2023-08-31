import Swiper, {
  SwiperInstance,
  SwiperSlide,
} from "@/components/shared/Swiper";
import SwiperCard from "@/components/shared/SwiperCard";
import { Media } from "@/@types/anilist";
import React, { useState } from "react";
import SwiperCore from "swiper";
import { motion } from "framer-motion";
import { isMobile } from "react-device-detect";
import { Navigation, Pagination } from "swiper/modules";
import PlainCard from "./PlainCard";

interface CardSwiperProps {
  data: Media[];
  onEachCard?: (data: Media, isHover: boolean) => React.ReactNode;
}

SwiperCore.use([Navigation, Pagination]);

// Will take 3 times norma; card's width on hover
const HOVER_WIDTH = 3;
const DEBOUNCE_DELAY = 300;

const noop = () => {};

const getVisibleIndex = (swiper: SwiperInstance) => {
  const { slides } = swiper;

  const visibleCards = slides
    .map((slide: any, index: any) => ({
      slide,
      index,
    }))
    .filter(({ slide }: any) =>
      slide.className.includes("swiper-slide-visible")
    );

  return {
    first: visibleCards[0].index,
    last: visibleCards[visibleCards.length - 1].index,
  };
};

const CardSwiper: React.FC<CardSwiperProps> = ({ data }: any) => {
  // const [swiper, setSwiper] = useState<SwiperInstance>();
  // const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // let debounceTimeout: any = null;

  // const debounce = (fn: (...args: any[]) => void, wait: number) => {
  //   return (...args: any[]) => {
  //     const later = () => {
  //       debounceTimeout = null;
  //       fn(...args);
  //     };

  //     clearTimeout(debounceTimeout);
  //     debounceTimeout = setTimeout(later, wait);
  //   };
  // };

  // const handleSlideHover = (index: number) => () => {
  //   if (!swiper) return;

  //   const slide = swiper.slides[index];

  //   const newWidth = slide.clientWidth * HOVER_WIDTH;
  //   slide.style.transition = "width 0.3s";
  //   slide.style.width = `${newWidth}px`;

  //   setActiveIndex(index);
  // };

  // const handleSlideLeave = (index: number) => () => {
  //   if (!swiper) return;

  //   const slide = swiper.slides[index];
  //   slide.style.width = ""; // Reset width

  //   setActiveIndex(null);
  // };

  // const debouncedSlideHover = debounce(handleSlideHover, DEBOUNCE_DELAY);
  // const debouncedSlideLeave = debounce(handleSlideLeave, DEBOUNCE_DELAY);

  return (
    <Swiper
      // onSwiper={(swiper) => {
      //   console.log("here swuiper", swiper);
      //   setSwiper(swiper);
      // }}
      speed={500}
      watchSlidesProgress
      slidesPerView={5}
    >
      {data?.map((item: any, index: any) => (
        <SwiperSlide
          // onMouseEnter={isMobile ? noop : () => debouncedSlideHover(index)}
          // onMouseLeave={() => debouncedSlideLeave(index)}
          key={index}
        >
          <motion.div
            initial={{ width: "100%" }}
            // animate={{ width: activeIndex === index ? "300px" : "100%" }}
            transition={{ duration: 0.3 }}
          >
            {/* {onEachCard(item, activeIndex === index)} */}
            <PlainCard isExpanded={false} data={item} />
          </motion.div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default React.memo(CardSwiper);
