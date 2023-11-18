import Player from "netplayer";
import React from "react";

export default function WatchPage() {
  return (
    <div>
      <Player
        sources={[
          {
            file: "https://s22.anime-sama.fr/videos/Blue%20Lock/VF/Blue_Lock_1_VF.mp4",
          },
        ]}
        className="object-contain w-full h-full"
        autoPlay
      />
    </div>
  );
}
