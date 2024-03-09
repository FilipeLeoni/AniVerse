import React, { useState } from "react";
import Swiper, { SwiperInstance, SwiperSlide } from "./Swiper";
import SwiperCard from "./SwiperCard";
import { isMobile } from "react-device-detect";

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

const CardCarousel = ({ title, data, onEachCard }: any, props: any) => {
  const [swiper, setSwiper] = useState<SwiperInstance>();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);

  // const {
  //   onEachCard = (data: any, isHover: any) => (
  //     <SwiperCard isExpanded={isHover} data={data} />
  //   ),
  // } = props;

  const HOVER_WIDTH = 3;

  // const defaultCard = (data: any, isHover: any) => (
  //   <SwiperCard isExpanded={isHover} data={data} />
  // );

  const handleSlideHover = (index: number) => () => {
    if (!swiper) return;

    const slide = swiper.slides[index] as HTMLElement;
    const nextSlide = swiper.slides[index + 1] as HTMLElement;

    const isVisible = slide.classList.contains("swiper-slide-visible");
    if (!isVisible) return;

    slide.classList.add("swiper-animating");

    const [originalWidth] = swiper.slidesSizesGrid as number[];

    let spaceBetween = 0;
    let slidesPerGroup = 1;

    const currentBreakpoint =
      swiper.params.breakpoints[swiper.currentBreakpoint];

    spaceBetween = currentBreakpoint.spaceBetween || swiper.params.spaceBetween;
    slidesPerGroup =
      currentBreakpoint.slidesPerGroup || swiper.params.slidesPerGroup;

    const { first: firstVisibleCardIndex, last: lastVisibleCardIndex } =
      getVisibleIndex(swiper);

    setLastVisible(lastVisibleCardIndex);

    const nonPlaceholderSlides = swiper.slides.filter(
      (slide: any) => !slide.classList.contains("swiper-placeholder")
    );

    const shouldPushSlide =
      nonPlaceholderSlides.length - (HOVER_WIDTH - 1) >= slidesPerGroup &&
      (lastVisibleCardIndex - (HOVER_WIDTH - 1) < index ||
        lastVisibleCardIndex === index);

    if (shouldPushSlide) {
      if (!nextSlide) {
        const element = document.createElement("div");
        element.className = "swiper-slide swiper-placeholder";

        swiper.$wrapperEl?.[0].append(element);
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

    slide.style.transition = "width 0.3s";
    slide.style.width = `${originalWidth * HOVER_WIDTH - 1 + spaceBetween}px`;
    // slide.style.width = `${newWidth}px`;
    slide?.classList?.add("swiper-animating");
  };

  const handleSlideLeave = (index: number) => () => {
    if (!swiper) return;

    const slide = swiper.slides[index] as HTMLElement;
    const nextSlide = swiper.slides[index + 1] as HTMLElement;
    const [originalWidth] = swiper.slidesSizesGrid as number[];

    slide.style.width = `${originalWidth}px`;

    let spaceBetween = 0;
    let slidesPerGroup = 1;

    const currentBreakpoint =
      swiper.originalParams.breakpoints[swiper.currentBreakpoint];

    spaceBetween =
      currentBreakpoint.spaceBetween || swiper.originalParams.spaceBetween;
    slidesPerGroup =
      currentBreakpoint.slidesPerGroup || swiper.originalParams.slidesPerGroup;

    const isAnimating = slide.classList.contains("swiper-animating");

    console.log(spaceBetween, slidesPerGroup);

    if (!isAnimating) return;

    const { first: firstVisibleCardIndex } = getVisibleIndex(swiper);

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

    const shouldPushSlide =
      nonPlaceholderSlides.length - (HOVER_WIDTH - 1) >= slidesPerGroup &&
      (lastVisible - (HOVER_WIDTH - 1) < index || lastVisible === index);

    console.log();
    if (nonPlaceholderSlides.length <= slidesPerGroup) {
      if (
        index === nonPlaceholderSlides.length - 1 ||
        index >= nonPlaceholderSlides.length - (HOVER_WIDTH - 1)
      ) {
        console.log(index);

        revertTranslate();
      }
    } else if (
      shouldPushSlide
      // (nonPlaceholderSlides.length - (HOVER_WIDTH - 1) >= slidesPerGroup &&
      //   (lastVisibleCardIndex - (HOVER_WIDTH - 1) < index ||
      //     lastVisibleCardIndex === index)) ||
      // index === slidesPerGroup * (swiper.snapIndex + 1) - 1 ||
      // index >= slidesPerGroup * (swiper.snapIndex + 1) - (HOVER_WIDTH - 1)
    ) {
      console.log("chamado");
      revertTranslate();
    } else if (index > slidesPerGroup) {
      if (
        index === nonPlaceholderSlides.length - 1 ||
        index >= nonPlaceholderSlides.length - (HOVER_WIDTH - 1)
      ) {
        console.log(index);

        revertTranslate();
      }
    }

    slide.classList.remove("swiper-animating");

    if (nextSlide?.classList.contains("swiper-placeholder")) {
      console.log("remove");
      swiper.slides.eq(swiper.slides.length - 1).remove();
      swiper.update();
    }

    setActiveIndex(null);
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
        {data?.map((item: any, index: any) => {
          let debounceTimeout: any = null;

          const debounce = (fn: (...args: any[]) => void, wait: number) => {
            return (...args: any[]) => {
              const later = () => {
                debounceTimeout = null;
                fn(...args);
              };

              clearTimeout(debounceTimeout);
              debounceTimeout = setTimeout(later, wait);
            };
          };

          return (
            <SwiperSlide
              onMouseEnter={debounce(handleSlideHover(index), 200)}
              onMouseLeave={debounce(handleSlideLeave(index), 200)}
              key={index}
            >
              {onEachCard(item, activeIndex === index)}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

CardCarousel.defaultProps = {
  onEachCard: (data: any, isHover: any) => (
    <SwiperCard isExpanded={isHover} data={data} />
  ),
};

export default React.memo(CardCarousel);
