import HorizontalCard from "@/components/shared/HorizontalCard";
import React from "react";
import { AiOutlineRead, AiOutlineVideoCamera } from "react-icons/ai";

export default async function PanelHome() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dashboard/recently-added`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    }
  );

  const data = await res.json();

  return (
    <div className="w-full flex flex-col gap-4 pl-32">
      <h1 className="text-3xl font-semibold">Hi</h1>
      <div className="flex w-full gap-4 flex-wrap">
        <div className="bg-neutral-900/60 rounded-md flex-1 h-auto lg:w-1/2 p-5 ">
          <AiOutlineVideoCamera size={32} />
          <p className="mt-6 text-3xl">{data.animeCount}</p>
          <p className="text-gray-300">Uploaded Anime</p>
        </div>
        <div className="bg-neutral-900/60 rounded-md flex-1 h-auto lg:w-1/2 p-5">
          <AiOutlineRead size={32} />
          <p className="mt-6 text-3xl">{data.mangaCount}</p>
          <p className="text-gray-300">Uploaded Manga</p>
        </div>
      </div>
      <div className="flex gap-6 text-lg flex-wrap">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-2">RECENTLY ANIME</h2>
          <div className="bg-neutral-900/60 rounded-md h-auto w-full flex justify-center items-center p-4">
            {data.latestAnime ? (
              <HorizontalCard
                redirectUrl={`/upload/anime/${data.latestAnime.id}`}
                key={data.latestAnime.id}
                data={data.latestAnime}
                className="w-full"
              />
            ) : (
              <p className="text-center text-gray-300">No datas</p>
            )}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-2">RECENTLY MANGA</h2>
          <div className="bg-neutral-900/60 rounded-md w-full flex justify-center items-center p-4">
            {data.latestManga ? (
              <HorizontalCard
                redirectUrl={`/upload/anime/${data.latestManga.id}`}
                key={data.latestManga.id}
                data={data.latestManga}
                className="w-full"
              />
            ) : (
              <p className="text-center text-gray-300">No data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
