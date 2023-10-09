"use client";

import Image from "@/components/shared/Image";
import Loading from "@/components/shared/Loading";
import useReaction from "@/hooks/useReaction";
import { Reactions } from "@/mocks/reactions";
import clsx from "clsx";
import React from "react";

export interface ReactionProps {
  type?: string;
  className?: string;
}

const Reaction: React.FC<ReactionProps> = ({ type, className = "" }) => {
  // const { data, isLoading } = useReaction(type);

  return (
    <div className={clsx(" flex text-white", className)}>
      <div className="grid grid-cols-6 gap-6">
        {Reactions.map((reaction) => (
          <div
            key={reaction.name}
            className="flex flex-col items-center gap-1 hover:text-primary-400 text-gray-200 text-sm hover:scale-105 transition-all cursor-pointer"
          >
            <Image
              width={44}
              height={44}
              src={reaction.icon}
              alt={reaction.name}
            />
            <p>{reaction.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reaction;
