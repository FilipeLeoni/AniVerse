import React from "react";
import { AiOutlineRead, AiOutlineVideoCamera } from "react-icons/ai";

export default function All() {
  return (
    <div className="w-full flex flex-col gap-6 p-20">
      <h1 className="text-3xl font-semibold">Hi</h1>
      <div className="flex w-full gap-10">
        <div className="bg-neutral-900 flex-1 h-auto w-1/2 p-4">
          <AiOutlineVideoCamera size={28} />
          <p className="mt-4">20</p>
          <p>Number of anime added</p>
        </div>
        <div className="bg-neutral-900 flex-1 h-auto w-1/2 p-4">
          <AiOutlineRead size={28} />
          <p className="mt-4">20</p>
          <p>Number of manga added</p>
        </div>
      </div>
      <div className="flex gap-6 text-lg">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-2">RECENTE ANIME</h2>
          <div className="bg-neutral-900  h-auto w-full flex justify-center items-center p-2">
            No data
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-2">RECENTE MANGA</h2>
          <div className="bg-neutral-900  h-auto w-full flex justify-center items-center p-2">
            No data
          </div>
        </div>
      </div>
    </div>
  );
}
