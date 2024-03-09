"use client";
import { useWatchHistory } from "@/contexts/WatchHistoryContext";
import Player from "netplayer";
import React from "react";

export default function Example() {
  // const watchedEpisodes = JSON.parse(localStorage.getItem("watchedEpisodes"));

  // console.log(watchedEpisodes);
  return (
    <div>
      <Player
        // ref={videoRef}
        // components={components}
        sources={[
          {
            // file: `${"http://localhost:8081"}/${episodeData.video}`,
            file: `https://s22.anime-sama.fr/videos/Naruto%20Shippuden/VOSTFR/Naruto_Shippu_01_VOSTFR.mp4`,
          },
        ]}
        className="object-contain w-full h-full"
        autoPlay
      />

      <div>dwdwdw</div>
    </div>
  );
}
