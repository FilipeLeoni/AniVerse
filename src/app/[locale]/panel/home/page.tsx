import HorizontalCard from "@/components/shared/HorizontalCard";
import React from "react";
import { AiOutlineRead, AiOutlineVideoCamera } from "react-icons/ai";

export default async function PanelHome() {
  const res = await fetch("http://localhost:8000/dashboard/recently-added", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  });

  const data = await res.json();

  console.log(data);
  return (
    <div className="w-full flex flex-col gap-6 p-20 px-36">
      <h1 className="text-3xl font-semibold">Hi</h1>
      <div className="flex w-full gap-10">
        <div className="bg-neutral-900 flex-1 h-auto w-1/2 p-4">
          <AiOutlineVideoCamera size={32} />
          <p className="mt-6 text-3xl">{data.animeCount}</p>
          <p className="text-gray-300">Uploaded Anime</p>
        </div>
        <div className="bg-neutral-900 flex-1 h-auto w-1/2 p-4">
          <AiOutlineRead size={32} />
          <p className="mt-6 text-3xl">{data.mangaCount}</p>
          <p className="text-gray-300">Uploaded Manga</p>
        </div>
      </div>
      <div className="flex gap-6 text-lg">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-2">RECENTLY ANIME</h2>
          <div className="bg-neutral-900 h-auto w-full flex justify-center items-center p-3">
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
          <div className="bg-neutral-900 w-full flex justify-center items-center p-3">
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
