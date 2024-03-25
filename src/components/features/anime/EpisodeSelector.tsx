"use client";

import React, { useMemo, useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { MdInsertPhoto } from "react-icons/md";
import classNames from "classnames";
import EpisodeCard from "./EpisodeCard";
import Link from "next/link";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

function EpisodeSelector(
  { episodes, currentEpisode, onEachEpisode, onEachEpisodeThumb }: any,
  props: any
) {
  const [thumbStyle, setThumbStyle] = useState("number");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 24;

  // Função para calcular o intervalo de episódios para a página atual
  const calculateEpisodeRange = (pageIndex: any) => {
    const startIndex = pageIndex * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, episodes?.length);

    return `${startIndex} - ${endIndex}`;
  };

  // Função para mudar a página
  const changePage = (pageIndex: any) => {
    setCurrentPage(pageIndex);
  };

  const startIndex = currentPage * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, episodes?.length);
  const currentAnimes = episodes?.slice(startIndex - 1, endIndex);

  const defaultOnEachEpisode = (episode: any) => (
    <Link
      href={`/anime/watch/${episode.animeId}/${episode.id}`}
      key={episode.sourceEpisodeId}
      shallow
    >
      <div
        className={classNames(
          "rounded-md bg-background-800 col-span-1 aspect-w-2 aspect-h-1 group",
          episode.id === currentEpisode?.id ? "text-primary-300" : ""
        )}
      >
        <div className="flex items-center justify-center w-full h-full group-hover:bg-white/10 rounded-md transition duration-300">
          <p>{episode.number}</p>
        </div>
      </div>
    </Link>
  );

  const totalPages = Math.ceil(episodes?.length / itemsPerPage);

  // Função para mudar a página

  const defaultOnEachEpisodeThumb = (episode: any) => (
    <Link
      key={episode.id}
      className="aspect-w-1 aspect-h-1 group cursor-pointer"
      href={`/anime/watch/${episode.animeId}/${episode.id}`}
    >
      <EpisodeCard
        episode={{
          number: episode.number,
          title: episode.title,
          thumbnail: episode.thumbnail,
          description: episode.description,
        }}
        className="cursor-pointer"
      />
    </Link>
  );

  const renderEpisode = onEachEpisode || defaultOnEachEpisode;
  const renderEpisodeThumb = onEachEpisodeThumb || defaultOnEachEpisodeThumb;

  return (
    <div className="flex flex-col pt-4">
      {episodes && (
        <Tabs selectedTabClassName="bg-red-600" className=" -ml-2">
          <TabList className="flex items-center justify-start gap-x-2 list-none mb-4">
            {episodes &&
              Array.from(
                { length: Math.ceil(episodes?.length / itemsPerPage) },
                (_, index) => (
                  <Tab
                    key={index}
                    className="bg-background-700 px-3 py-2 rounded-[6px] w-fit cursor-pointer"
                  >
                    {calculateEpisodeRange(index)}
                  </Tab>
                )
              )}
          </TabList>
          {episodes &&
            Array.from(
              { length: Math.ceil(episodes?.length / itemsPerPage) },
              (_, index) => (
                <TabPanel key={index}>
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
                      {episodes
                        .slice(index * itemsPerPage, (index + 1) * itemsPerPage)
                        .map(renderEpisode)}
                    </div>
                  ) : (
                    <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-2 max-h-[360px] overflow-y-auto">
                      {episodes
                        .slice(index * itemsPerPage, (index + 1) * itemsPerPage)
                        .map(renderEpisodeThumb)}
                    </div>
                  )}
                </TabPanel>
              )
            )}
        </Tabs>
      )}
    </div>
  );
}

export default React.memo(EpisodeSelector);
