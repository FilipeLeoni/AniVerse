import Image from "@/components/shared/Image";
import { createCharacterDetailsUrl } from "@/utils";
import Link from "next/link";
import React from "react";

const CharacterCard = ({ character }: any) => {
  return (
    <Link href={createCharacterDetailsUrl(character)}>
      <div className="space-y-2">
        <div className="aspect-w-9 aspect-h-16 space-y-2 relative">
          <Image
            src={character.image}
            alt={character.name}
            fill
            className="object-cover"
          />
        </div>
        <p>{character.name}</p>
      </div>
    </Link>
  );
};

export default React.memo(CharacterCard) as typeof CharacterCard;
