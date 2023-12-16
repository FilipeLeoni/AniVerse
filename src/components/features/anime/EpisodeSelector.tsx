"use client";

import React, { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { MdInsertPhoto } from "react-icons/md";
import classNames from "classnames";
import EpisodeCard from "./EpisodeCard";
import Link from "next/link";

function EpisodeSelector({ episodes, currentEpisode }: any) {
  const [thumbStyle, setThumbStyle] = useState("number");

  return (
    <div className="flex flex-col pt-4">
      {episodes ? (
        <>
          <div className="bg-primary-600 px-3 py-2 rounded-[6px] w-fit">
            <p>1 - 24</p>
          </div>
          <div className="flex gap-2 w-full justify-end mb-10">
            <div
              className={classNames(
                "cursor-pointer font-bold",
                thumbStyle === "number" ? "opacity-100" : "opacity-50"
              )}
              onClick={() => setThumbStyle("number")}
            >
              <RxDashboard size={22} />
            </div>
            <div
              className={classNames(
                "cursor-pointer",
                thumbStyle === "thumb" ? "opacity-100" : "opacity-50"
              )}
              onClick={() => setThumbStyle("thumb")}
            >
              <MdInsertPhoto size={25} />
            </div>
          </div>

          {thumbStyle === "number" ? (
            <div className="grid xl:grid-cols-9 lg:grid-cols-8 md:grid-cols-7 sm:grid-cols-6 grid-cols-4 gap-4">
              {episodes?.map((episode: any) => (
                <Link
                  key={episode.id}
                  className="aspect-w-2 aspect-h-1 group cursor-pointer"
                  href={`/anime/watch/${episode.id}`}
                >
                  <div className={classNames("rounded-md bg-background-700")}>
                    <div
                      className={classNames(
                        "flex items-center justify-center w-full h-full group-hover:bg-white/10 rounded-md transition duration-300",
                        currentEpisode?.id === episode.id
                          ? "border-b border-primary-500"
                          : ""
                      )}
                    >
                      <p>{episode.number}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-2 max-h-[360px] overflow-y-auto">
              {episodes?.map((episode: any) => (
                <Link
                  key={episode.id}
                  className="aspect-w-1 aspect-h-1 group cursor-pointer"
                  href={`/anime/watch/${episode.id}`}
                >
                  <EpisodeCard
                    episode={{
                      number: episode.number,
                      name: episode.title,
                      thumbnail: episode.thumbnail,
                      description: episode.description,
                    }}
                    className="cursor-pointer"
                  />
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-gray-300 text-center">No episodes found</p>
        </div>
      )}
    </div>
  );
}

export default React.memo(EpisodeSelector);
