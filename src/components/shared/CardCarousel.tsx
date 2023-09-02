import React, { useState } from "react";
import Swiper, { SwiperInstance, SwiperSlide } from "./Swiper";
import SwiperCard from "./SwiperCard";

interface CardSwiperProps {
  title?: string;
  data: any;
  onEachCard?: (data: any, isHover: boolean) => React.ReactNode;
}

const CardCarousel: React.FC<CardSwiperProps> = ({ title, data }: any) => {
  const [swiper, setSwiper] = useState<SwiperInstance>();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<any>(null);

  const HOVER_WIDTH = 3;
  const DEBOUNCE_DELAY = 250;

  const handleSlideHover = (index: number) => () => {
    if (!swiper) return;
    if (activeIndex === index) return;

    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    const timeout = setTimeout(() => {
      const slide = swiper.slides[index];
      const [originalWidth] = swiper.slidesSizesGrid as number[];

      let spaceBetween = 0;
      const newWidth = slide.clientWidth * HOVER_WIDTH;
      slide.style.transition = "width 0.3s";
      slide.style.width = `${originalWidth * HOVER_WIDTH - 1 + spaceBetween}px`;
      slide.style.width = `${newWidth}px`;
      slide?.classList?.add("swiper-animating");
      setActiveIndex(index);
    }, DEBOUNCE_DELAY);
    setHoverTimeout(timeout);
  };

  const handleSlideLeave = (index: number) => () => {
    if (!swiper) return;

    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setTimeout(() => {
      const slide = swiper.slides[index];
      slide.style.transition = "width 0.3s";
      const [originalWidth] = swiper.slidesSizesGrid as number[];
      slide.style.width = `${originalWidth}px`;
      setActiveIndex(null);
    }, DEBOUNCE_DELAY);
  };

  return (
    <div className="w-full">
      {title && (
        <h2 className="mb-4 text-2xl font-semibold line-clamp-1">
          {title.toUpperCase()}
        </h2>
      )}
      <Swiper
        slidesPerView={2}
        spaceBetween={20}
        watchSlidesProgress={true}
        speed={500}
        onSwiper={(swiper) => {
          setSwiper(swiper);
        }}
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
      >
        {data?.map((item: any, index: any) => (
          <SwiperSlide
            key={index}
            className="slidex"
            onMouseEnter={handleSlideHover(index)}
            onMouseLeave={handleSlideLeave(index)}
          >
            <SwiperCard isExpanded={activeIndex === index} data={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default React.memo(CardCarousel);
