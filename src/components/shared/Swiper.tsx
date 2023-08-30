import React, { useRef } from "react";
import {
  Swiper as ReactSwiper,
  SwiperSlide as ReactSwiperSlide,
} from "swiper/react";
import SwiperCore from "swiper";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import CircleButton from "@/components/shared/CircleButton";
import classNames from "classnames";

export type SwiperInstance = any;
export interface SwiperProps extends React.ComponentProps<typeof ReactSwiper> {
  hideNavigation?: boolean;
  isOverflowHidden?: boolean;
  defaultActiveSlide?: number;
}

SwiperCore.use([Navigation]);

const Swiper: React.FC<SwiperProps> = ({
  children,
  hideNavigation,
  onInit,
  isOverflowHidden = false,
  className,
  defaultActiveSlide,
  ...props
}) => {
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  return (
    <ReactSwiper
      className={classNames(
        isOverflowHidden ? "!overflow-hidden" : "!overflow-visible",
        className
      )}
      breakpoints={{
        1536: {
          slidesPerView: 7,
          slidesPerGroup: 7,
          spaceBetween: 20,
        },
        1280: {
          slidesPerView: 6,
          slidesPerGroup: 6,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 5,
          slidesPerGroup: 5,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 4,
          slidesPerGroup: 4,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 3,
          slidesPerGroup: 3,
          spaceBetween: 10,
        },
        0: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 10,
        },
      }}
      grabCursor
      onInit={(swiper) => {
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        swiper.prevEl = prevButtonRef.current;
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        swiper.nextEl = nextButtonRef.current;
        swiper.navigation.update();

        if (defaultActiveSlide) {
          swiper.slideTo(defaultActiveSlide);
        }

        onInit?.(swiper);
      }}
      navigation={{
        nextEl: ".custom-button-next",
        prevEl: ".custom-button-prev",
      }}
      modules={[Navigation]}
      {...props}
    >
      {children}

      {!hideNavigation && (
        <div
          slot="container-end"
          className="swiper-navigation absolute right-0 bottom-full mb-4 flex space-x-4"
        >
          <CircleButton
            ref={prevButtonRef}
            outline
            LeftIcon={FiChevronLeft}
            className="custom-button-prev flex items-center justify-center"
          ></CircleButton>
          <CircleButton
            ref={nextButtonRef}
            outline
            LeftIcon={FiChevronRight}
            className="custom-button-next flex items-center justify-center"
          />
        </div>
      )}
    </ReactSwiper>
  );
};

export const SwiperSlide = ReactSwiperSlide;

export default Swiper;
