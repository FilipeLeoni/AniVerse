import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

interface CharacterCardProps {
  onClick?: any;
}

const CharacterAddCard: React.FC<CharacterCardProps> = ({ onClick }) => {
  return (
    <div
      className="text-gray-300 space-x-4 col-span-1 flex w-full h-24 bg-background-900 hover:bg-white/20 transtion duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-full w-16">
        <div className="bg-neutral-700 h-full flex justify-center items-center">
          <AiOutlinePlus size={30} />
        </div>
      </div>

      <div className="py-2 flex flex-col justify-between">
        <p className="font-semibold">Add New Character</p>
      </div>
    </div>
  );
};

export default React.memo(CharacterAddCard) as typeof CharacterAddCard;
