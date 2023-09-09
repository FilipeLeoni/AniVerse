import React, { useState } from "react";
import Swiper, { SwiperInstance, SwiperSlide } from "./Swiper";
import SwiperCard from "./SwiperCard";
import { isMobile } from "react-device-detect";

interface CardSwiperProps {
  title?: string;
  data: any;
  onEachCard?: (data: any, isHover: boolean) => React.ReactNode;
}

const getVisibleIndex = (swiper: SwiperInstance) => {
  const { slides } = swiper;

  const visibleCards = slides
    .map((slide: any, index: any) => ({ slide, index }))
    .filter(({ slide }: any) =>
      slide.classList.contains("swiper-slide-visible")
    );

  return {
    first: visibleCards[0].index,
    last: visibleCards[visibleCards.length - 1].index,
  };
};

const CardCarousel: React.FC<CardSwiperProps> = ({ title, data }: any) => {
  const [swiper, setSwiper] = useState<SwiperInstance>();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<any>(null);

  const HOVER_WIDTH = 3;
  const DEBOUNCE_DELAY = 300;

  const handleSlideHover = (index: number) => () => {
    if (!swiper || activeIndex === index) return;

    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    const timeout = setTimeout(() => {
      const slide = swiper.slides[index];
      const nextSlide = swiper.slides[index + 1];
      const [originalWidth] = swiper.slidesSizesGrid as number[];

      const { first: firstVisibleCardIndex, last: lastVisibleCardIndex } =
        getVisibleIndex(swiper);

      const isVisible = slide.classList.contains("swiper-slide-visible");

      if (!isVisible) return;

      const nonPlaceholderSlides = swiper.slides.filter(
        (slide: any) => !slide.classList.contains("swiper-placeholder")
      );
      let slidesPerGroup = 1;
      let spaceBetween = 0;

      const currentBreakpoint =
        swiper.params.breakpoints[swiper.currentBreakpoint];

      spaceBetween =
        currentBreakpoint.spaceBetween || swiper.params.spaceBetween;
      slidesPerGroup =
        currentBreakpoint.slidesPerGroup || swiper.params.slidesPerGroup;

      const shouldPushSlide =
        nonPlaceholderSlides.length - (HOVER_WIDTH - 1) >= slidesPerGroup &&
        (lastVisibleCardIndex - (HOVER_WIDTH - 1) < index ||
          lastVisibleCardIndex === index);

      if (shouldPushSlide) {
        if (!nextSlide) {
          // Add a placeholder slide to push current slide to the left
          const element = document.createElement("div");
          element.className = "swiper-slide swiper-placeholder";
          swiper.updateSlides();
        }

        const newTranslate =
          -1 *
          ((firstVisibleCardIndex + HOVER_WIDTH - 1) *
            (originalWidth + spaceBetween));

        swiper.setTransition(300);
        swiper.setTranslate(newTranslate);
      }
      setActiveIndex(index);

      const newWidth = slide.clientWidth * HOVER_WIDTH;
      slide.style.transition = "width 0.3s";
      slide.style.width = `${originalWidth * HOVER_WIDTH - 1 + spaceBetween}px`;
      slide.style.width = `${newWidth}px`;
      slide?.classList?.add("swiper-animating");
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
      const nextSlide = swiper.slides[index + 1];
      const [originalWidth] = swiper.slidesSizesGrid as number[];

      const { first: firstVisibleCardIndex } = getVisibleIndex(swiper);

      let spaceBetween = 0;
      let slidesPerGroup = 1;

      const revertTranslate = () => {
        const minTranslate = swiper.minTranslate();
        const maxTranslate = swiper.maxTranslate();

        let newTranslate =
          -1 *
          ((firstVisibleCardIndex - (HOVER_WIDTH - 1)) *
            (originalWidth + spaceBetween));

        if (newTranslate > minTranslate) newTranslate = minTranslate;
        else if (newTranslate < maxTranslate) newTranslate = maxTranslate;

        swiper.setTransition(300);
        swiper.setTranslate(newTranslate);
      };

      const nonPlaceholderSlides = swiper.slides.filter(
        (slide: any) => !slide.classList.contains("swiper-placeholder")
      );

      if (nonPlaceholderSlides.length <= slidesPerGroup) {
        if (
          index === nonPlaceholderSlides.length - 1 ||
          index >= nonPlaceholderSlides.length - (HOVER_WIDTH - 1)
        ) {
          revertTranslate();
        }
      } else if (
        index === slidesPerGroup * (swiper.snapIndex + 1) - 1 ||
        index >= slidesPerGroup * (swiper.snapIndex + 1) - (HOVER_WIDTH - 1)
      ) {
        revertTranslate();
      } else if (index > slidesPerGroup) {
        if (
          index === nonPlaceholderSlides.length - 1 ||
          index >= nonPlaceholderSlides.length - (HOVER_WIDTH - 1)
        ) {
          revertTranslate();
        }
      }

      if (nextSlide?.classList.contains("swiper-placeholder")) {
        swiper.slides.eq(swiper.slides.length - 1).remove();
        swiper.update();
      }

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
        hideNavigation={isMobile}
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
