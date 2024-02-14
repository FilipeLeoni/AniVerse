import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface IEpisodeitem {
  children: number;
  onDelete: () => void;
}

export default function EpisodeItem({ children, onDelete }: IEpisodeitem) {
  return (
    <div className="relative">
      <div className="flex justify-center py-2 bg-neutral-900 hover:bg-neutral-800 cursor-pointer">
        <p>EP {children}</p>
      </div>

      <div
        className="absolute -right-2 -top-1 bg-neutral-700 rounded-full p-2 cursor-pointer hover:text-primary-500 hover:bg-neutral-800"
        onClick={onDelete}
      >
        <AiOutlineClose />
      </div>
    </div>
  );
}
