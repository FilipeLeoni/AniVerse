import React from "react";
import { AiFillEdit, AiOutlineClose } from "react-icons/ai";
import DeleteConfirmation from "./DeleteConfirmation";

interface IEpisodeitem {
  children: number;
  onDelete: () => void;
  onEdit?: () => void;
}

export default function EpisodeItem({
  children,
  onDelete,
  onEdit,
}: IEpisodeitem) {
  return (
    <div className="relative">
      <div className="flex justify-center py-2 bg-neutral-900 hover:bg-neutral-800 cursor-pointer">
        {onEdit && (
          <button
            className="absolute left-6  flex gap-2 items-center hover:bg-neutral-700 px-4 rounded hover:text-primary-400"
            onClick={onEdit}
          >
            <AiFillEdit /> Edit
          </button>
        )}
        <p>EP {children}</p>
      </div>

      <div className="absolute -right-2 -top-1 bg-neutral-700 rounded-full p-2 cursor-pointer hover:text-primary-500 hover:bg-neutral-800">
        <DeleteConfirmation
          reference={
            <div className="absolute -right-2 -top-1 bg-neutral-700 rounded-full p-2 cursor-pointer hover:text-primary-500 hover:bg-neutral-800">
              <AiOutlineClose />
            </div>
          }
          onConfirm={onDelete}
        />
      </div>
    </div>
  );
}
