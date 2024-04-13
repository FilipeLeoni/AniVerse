import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import useRead from "@/hooks/useRead";
import React from "react";
import CardSwiper from "@/components/shared/CardSwiper";
import Section from "@/components/shared/Section";
import CardCarousel from "@/components/shared/CardCarousel";
import SwiperCard from "@/components/shared/SwiperCard";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

const ReadSection = () => {
  const { data, isLoading } = useRead();

  if (isLoading) {
    return <ListSwiperSkeleton />;
  }

  if (!data || !data?.length) {
    return null;
  }

  return (
    <Section>
      <Link
        href={"/anime/recently-read"}
        className="flex items-center mb-4 gap-2 group"
      >
        <h1 className="uppercase text-2xl font-semibold relative">
          Recently Read
          <div className="opacity-0 group-hover:opacity-100 absolute -right-0 flex items-center justify-center group-hover:translate-x-8 transition-all duration-300 top-0 mt-1.5">
            <FaArrowRightLong size={20} />
          </div>
        </h1>
      </Link>
      <CardCarousel
        data={data}
        onEachCard={(data: any, isHover: any) => (
          <SwiperCard
            isExpanded={isHover}
            data={data}
            redirectUrl={`/manga/read/${data.id}/${data.chapterId}`}
          />
        )}
      />
    </Section>
  );
};

export default ReadSection;
