import DetailsBanner from "@/components/shared/DetailsBanner";
import React from "react";

async function getDetails(animeId: string) {
  const res = await fetch(`https://graphql.anilist.co${name}`);
  return res.json();
}

export async function generateStaticParams() {
  const details = await fetch("https://graphql.anilist.co", {
    method: "POST",
  }).then((res) => res.json());
  console.log(details);

  return details.map((post: any) => ({
    animeId: post.id,
  }));
}

export default function page({ params }: { params: { animeId: string } }) {
  console.log(params);
  return (
    <>
      <div className="pb-8">
        {/* <DetailsBanner image={anime.bannerImage} /> */}
      </div>
    </>
  );
}
