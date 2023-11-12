"use client";
import Player from "netplayer";
import React from "react";

export default function page() {
  const url =
    "https://corsproxy.io/?" +
    encodeURIComponent("http://localhost:3000/example");
  return (
    <div>
      <Player
        sources={[
          {
            file: "https://s22.anime-sama.fr/videos/Blue%20Lock/VF/Blue_Lock_1_VF.mp4",
            type: "video/mp4",
          },
        ]}
        subtitles={[
          {
            lang: "jp",
            language: "Japanese",
            file: "https://artplayer.org/assets/sample/subtitle.jp.srt",
          },
          {
            lang: "cn",
            language: "Chinese",
            file: "https://artplayer.org/assets/sample/subtitle.cn.srt",
          },
        ]}
        className="object-contain w-full h-full"
        thumbnail="https://preview.zorores.com/8b/8bc17ab9537166f2abb7e0bef2b57e23/thumbnails/sprite.vtt"
        autoPlay
      />
    </div>
  );
}
