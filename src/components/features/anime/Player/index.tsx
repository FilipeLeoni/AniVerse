"use client";

import Loading from "@/components/shared/Loading";
import { useVideo } from "@/contexts/GlobalPlayerContext";
import Player from "netplayer";
import React, { useMemo } from "react";
import { isMobile } from "react-device-detect";

interface IEpisode {
  id: string;
  title: string;
  thumbnail?: string | null;
  number: number;
  description: string;
  video: string;
  subtitles?: string | null;
  fonts?: string | null;
  animeId: number;
}

export default function VideoPlayer({
  episodeData,
  isEpisodeLoading,
}: {
  episodeData: IEpisode;
  isEpisodeLoading: boolean;
}) {
  const { videoRef } = useVideo();

  const components = useMemo(
    () => ({
      // Controls: PlayerControls,
      // MobileControls: PlayerMobileControls,
      Overlay: PlayerOverlay,
      // MobileOverlay: PlayerMobileOverlay,
    }),
    []
  );

  console.log(episodeData);
  return (
    <div style={{ height: isMobile ? "100%" : "70vh" }}>
      {!isEpisodeLoading && episodeData && episodeData.video ? (
        <Player
          ref={videoRef}
          sources={[
            {
              file: episodeData.video,
            },
          ]}
          className="object-contain w-full h-full"
          autoPlay
        />
      ) : !isEpisodeLoading && !episodeData ? (
        <div className="w-full h-full flex justify-center items-center">
          Vídeo not found
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <Loading />
        </div>
      )}
    </div>
  );
}
