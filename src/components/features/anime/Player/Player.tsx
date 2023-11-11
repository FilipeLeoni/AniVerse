"use client";

import NetPlayer, { Player } from "netplayer";
import React from "react";

export default function Playerz() {
  const videoUrl = "https://artplayer.org/assets/sample/video.mp4";
  return (
    <div className="w-full h-96">
      ff
      {/* <Player
        sources={[
          {
            file: "https://artplayer.org/assets/sample/video.mp4",
          },
        ]}
        className="object-contain w-full h-full"
        autoPlay
      /> */}
      {/* <video src="" type="video/mpr">
        dd s
      </video> */}
      <video controls>
        <source src={videoUrl} type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>
      <NetPlayer
        sources={[
          {
            file: "blob:https://static.crunchyroll.com/0cbc18c9-d032-47c1-8ace-de31a0ac285e",
            label: "1080p",
          },
        ]}
        // subtitles={[
        //   {
        //     lang: "en",
        //     language: "English",
        //     file: "https://subtitles.netpop.app/subtitles/20211116/1637057950304_国王排名 2_英语.srt",
        //   },
        //   {
        //     lang: "vi",
        //     language: "Tiếng Việt",
        //     file: "https://subtitles.netpop.app/subtitles/20211116/1637057969656_国王排名 2_越南语.srt",
        //   },
        // ]}
      />
    </div>
  );
}
