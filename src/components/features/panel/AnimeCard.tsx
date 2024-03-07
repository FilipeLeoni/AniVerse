import DotList from "@/components/shared/DotList";
import { convert } from "@/utils/data";
import { useLocale } from "next-intl";
import Image from "next/image";
import React from "react";

export default function AnimeCard({
  image,
  title,
  format,
  season,
  status,
}: any) {
  const locale = useLocale();
  const genres = ["Adventure", "Action", "Comedy"];
  return (
    <div className="flex gap-4 w-full p-2">
      <div className="">
        <Image
          src={image}
          alt={title}
          width={72}
          height={50}
          className="object-cover rounded-md"
        />
      </div>
      <div className="w-full ">
        <h1 className="text-lg font-semibold">{title}</h1>
        <div>
          <DotList className="text-sm text-gray-300">
            <p> {format}</p>
            <p> {season}</p>
            <p> {status}</p>
          </DotList>
          {genres && (
            <DotList className="text-sm text-gray-300">
              {genres &&
                genres?.map((genre: any) => (
                  <span key={genre}>{convert(genre, "genre", { locale })}</span>
                ))}
            </DotList>
          )}
        </div>
      </div>
    </div>
  );
}
