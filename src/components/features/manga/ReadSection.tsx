import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import useRead from "@/hooks/useRead";
import React from "react";
import CardSwiper from "@/components/shared/CardSwiper";
import Section from "@/components/shared/Section";
import CardCarousel from "@/components/shared/CardCarousel";
import SwiperCard from "@/components/shared/SwiperCard";
import Link from "next/link";

const ReadSection = () => {
  const { data, isLoading } = useRead();

  if (isLoading) {
    return <ListSwiperSkeleton />;
  }

  if (!data) {
    return null;
  }

  return (
    <Section title="Recently Read">
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
