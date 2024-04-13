import React from "react";
import Section from "@/components/shared/Section";
import WatchedSwiper from "@/components/features/anime/WatchedSwiper";
import { useApi } from "@/hooks/useApi";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

const WatchedSection = () => {
  const storedHistory = localStorage.getItem("aniverse_history");
  let data: any = [];

  if (storedHistory) {
    data = JSON.parse(storedHistory).watchedEpisodes || [];
  }

  if (!data || !data?.length) {
    return null;
  }

  return (
    <Section>
      <Link
        href={"/anime/recently-watched"}
        className="flex items-center mb-4 gap-2 group"
      >
        <h1 className="uppercase text-2xl font-semibold relative">
          Rencetly watched
          <div className="opacity-0 group-hover:opacity-100 absolute -right-0 flex items-center justify-center group-hover:translate-x-8 transition-all duration-300 top-0 mt-1.5">
            <FaArrowRightLong size={20} />
          </div>
        </h1>
      </Link>

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
