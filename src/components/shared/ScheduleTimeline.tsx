import Image from "next/image";
import React from "react";
import DotList from "./DotList";
import { convert } from "@/utils/data";
import { getTimeFormattedForUserTimeZone } from "@/utils";

interface ScheduleTimeProps {
  date: string;
  title: string;
  description: string;
}

export default function ScheduleTimeline({
  data,
}: {
  data: ScheduleTimeProps[];
}) {
  return (
    <div className="relative">
      <ol className="list-none m-0">
        {data?.map((item: any, index: number) => {
          const getHour = getTimeFormattedForUserTimeZone(item?.airingAt);

          return (
            <li key={index} className=" ">
              <div className="flex-start flex items-center pt-3 ">
                <div className="-ml-0.5 mr-3 h-1.5 w-1.5 rounded-full flex items-center justify-center bg-red-500"></div>
                <p className="text-xl text-neutral-500 dark:text-neutral-300 font-bold">
                  {getHour}
                </p>
              </div>
              <div className="pl-3  py-2 border-l-2 border-primary-500 flex">
                <div className="w-32 h-48 relative">
                  <Image
                    src={
                      (item?.anime?.coverImage?.extraLarge as string) ||
                      (item?.manga?.coverImage?.extraLarge as string)
                    }
                    alt="Image"
                    className="object-cover rounded-md"
                    fill
                  />
                </div>

                <div className="pl-3">
                  {item?.anime ? (
                    <h4 className="mb-1.5 text-xl font-semibold">
                      {item?.anime?.title?.english}
                    </h4>
                  ) : (
                    <h4 className="mb-1.5 text-xl font-semibold">
                      {item?.manga?.title?.english}
                    </h4>
                  )}

                  <div className="overflow-ellipsis line-clamp-1">
                    {item?.anime ? (
                      <DotList>
                        {item?.anime.genres.map((genre: any) => (
                          <span key={genre} className="text-neutral-300">
                            {convert(genre, "genre", { locale: "en" })}
                          </span>
                        ))}
                      </DotList>
                    ) : (
                      <DotList>
                        {item?.manga.genres.map((genre: any) => (
                          <span key={genre} className="text-neutral-300">
                            {convert(genre, "genre", { locale: "en" })}
                          </span>
                        ))}
                      </DotList>
                    )}
                  </div>
                  {item?.anime ? (
                    <p className="text-neutral-300 text-sm">
                      Episode {item.episodeNumber}
                    </p>
                  ) : (
                    <p className="text-neutral-300 text-sm">
                      Chapter {item.chapterNumber}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
