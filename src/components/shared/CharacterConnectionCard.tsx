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

  return (
    <Link href={`/characters/details/${characterEdge?.node?.id}`}>
      <div className="text-gray-300 space-x-4 col-span-1 flex w-full h-24 bg-background-900 hover:bg-white/20 transtion duration-300">
        <div className="relative h-full w-16">
          <Image
            src={characterEdge?.node?.image?.large || ""}
            fill
            style={{ objectFit: "cover" }}
            alt={`${characterEdge?.node?.name?.userPreferred}`}
          />
        </div>

        <div className="py-2 flex flex-col justify-between">
          <p className="font-semibold">
            {characterEdge?.node?.name?.userPreferred}
          </p>

          <p>{convert(characterEdge.role, "characterRole", { locale })}</p>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(
  CharacterConnectionCard
) as typeof CharacterConnectionCard;
