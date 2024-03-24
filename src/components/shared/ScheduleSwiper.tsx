"use client";

import Image from "@/components/shared/Image";
// import Swiper, { SwiperProps, SwiperSlide } from "@/components/shared/Swiper";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import useDevice from "@/hooks/useDevice";
import classNames from "classnames";
import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
// import Swiper, { SwiperProps, SwiperSlide } from "@/components/shared/Swiper";

// import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import ScheduleTimeline from "./ScheduleTimeline";
import Section from "./Section";
import { useQuery } from "@tanstack/react-query";
import { getDatesOfCurrentWeek } from "@/utils";
import { useApi } from "@/hooks/useApi";

SwiperCore.use([FreeMode, Navigation, Thumbs]);

const ScheduleSwiper: React.FC<any> = ({ type = "anime", ...props }) => {
  const { isMobile } = useDevice();
  const { GENRES } = useConstantTranslation();
  const { DAYSOFWEEK } = useConstantTranslation();
  const [index, setIndex] = useState<number>(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<any>(null);

  const api = useApi();
  const currentWeekDates = getDatesOfCurrentWeek();
  const activeSlide: any = useMemo(() => currentWeekDates[index], [index]);
  const { data, isLoading } = useQuery({
    queryKey: ["scheduleTimeLine", activeSlide],
    queryFn: async () => {
      const response = await api.getScheduleTimeLineByDay(activeSlide.dateUnix);
      return response;
    },
  });

  const handleSlideChange = useCallback((swiper: any) => {
    swiper.loopCreate;
    setIndex(swiper.activeIndex);
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <>
      <Swiper
        // onSwiper={setThumbsSwiper}
        // slidesPerGroup={1}
        centeredSlides
        // loop
        // slidesPerView={2}
        grabCursor={true}
        spaceBetween={24}
        // className="py-20"
        onSlideChange={handleSlideChange}
        breakpoints={{
          1536: {
            slidesPerView: 8,
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
      >
        <div className="swiper">
          {currentWeekDates.map((day: any) => (
            <SwiperSlide
              key={day.dateUnix}
              onClick={() => {
                setSelectedDay(day.dateUnix);
              }}
            >
              {({ isActive }) => {
                return (
                  <motion.div
                    className={classNames(
                      "group relative overflow-hidden bg-neutral-800 aspect-w-12 aspect-h-6 rounded-md",
                      isActive && "!bg-primary-500"
                    )}
                  >
                    <div>
                      <div className="h-full w-full flex items-center justify-center absolute inset-0 flex-col ">
                        <p className="text-center uppercase text-gray-300 group-hover:text-white transition duration-300 text-sm">
                          {day.date}
                        </p>
                        <p className="text-center uppercase text-base font-bold text-gray-300 group-hover:text-white transition duration-300">
                          {day.dayOfWeekAbbrev}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              }}
            </SwiperSlide>
          ))}
        </div>
      </Swiper>

      <Swiper
        spaceBetween={10}
        navigation={true}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        className="mySwiper2"
      >
        <SwiperSlide className="mt-12">
          {({ isActive }) => {
            return (
              <Section>
                {isLoading ? (
                  <div className="min-h-screen w-full flex justify-center mt-16">
                    <div className="w-16 h-16 border-4 border-primary-500 rounded-full animate-spin"></div>
                  </div>
                ) : data?.length > 0 ? (
                  <>
                    <p className="italic text-neutral-300 text-lg">
                      The airing schedule is synced with your local time.
                    </p>
                    <ScheduleTimeline data={data} />
                  </>
                ) : (
                  <p>No new releases scheduled for today.</p>
                )}
              </Section>
            );
          }}
        </SwiperSlide>
      </Swiper>
    </>
  );
};
export default React.memo(ScheduleSwiper);
