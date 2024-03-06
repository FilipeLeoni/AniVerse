"use client";

import Image from "@/components/shared/Image";
import { CharacterEdge } from "@/@types/anilist";
import { convert } from "@/utils/data";
import Link from "next/link";
import React from "react";
import { useLocale } from "next-intl";

interface CharacterCardProps {
  characterEdge: CharacterEdge;
}

const CharacterConnectionCard: React.FC<CharacterCardProps> = ({
  characterEdge,
}) => {
  const locale = useLocale();

  console.log(characterEdge);
  const id = characterEdge?.id;
  const name = characterEdge?.name;
  const formattedName = name ? name.replaceAll(" ", "-") : "";
  const url = `/characters/details/${id}/${formattedName}`;

  return (
    <Link href={url}>
      <div className="text-gray-300 space-x-4 col-span-1 flex w-full h-24 bg-background-900 hover:bg-white/20 transtion duration-300">
        <div className="relative h-full w-16">
          <Image
            src={characterEdge?.image || ""}
            fill
            style={{ objectFit: "cover" }}
            alt={`${characterEdge?.name}`}
          />
        </div>

        <div className="py-2 flex flex-col justify-between">
          <p className="font-semibold">{characterEdge?.name}</p>

          <p>{convert(characterEdge.role, "characterRole", { locale })}</p>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(
  CharacterConnectionCard
) as typeof CharacterConnectionCard;
