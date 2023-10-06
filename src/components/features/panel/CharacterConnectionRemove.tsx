"use client";

import Image from "@/components/shared/Image";
import { CharacterEdge } from "@/@types/anilist";
import { convert } from "@/utils/data";
import Link from "next/link";
import React from "react";
import { useLocale } from "next-intl";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { FiDelete } from "react-icons/fi";

interface CharacterCardProps {
  characterEdge: CharacterEdge;
}

const CharacterConnectionRemoveCard: React.FC<CharacterCardProps> = ({
  characterEdge,
}) => {
  const locale = useLocale();

  const id = characterEdge?.node?.id;
  const name = characterEdge?.node?.name?.userPreferred;
  const formattedName = name ? name.replaceAll(" ", "-") : "";
  const url = `/characters/details/${id}/${formattedName}`;

  return (
    <div className="text-gray-300 space-x-4 col-span-1 flex w-full h-24 bg-background-900 hover:bg-white/20 transtion duration-300 group relative">
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
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:text-primary-500 gap-8 flex z-10">
        <MdDeleteOutline size={24} />
      </div>
      <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer gap-8 flex justify-center items-center">
        Click to edit
      </div>
    </div>
  );
};

export default React.memo(
  CharacterConnectionRemoveCard
) as typeof CharacterConnectionRemoveCard;
