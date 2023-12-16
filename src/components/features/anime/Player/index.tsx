"use client";

import Loading from "@/components/shared/Loading";
import { useVideo } from "@/contexts/GlobalPlayerContext";
import Player, { useInteract } from "netplayer";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { isMobile } from "react-device-detect";
import Overlay from "./Overlay";
import { BsArrowLeft } from "react-icons/bs";
import classNames from "classnames";
import Controls from "./Controls";
import NextEpisodeButton from "./NextEpisodeButton";
import EpisodesButton from "./EpisodesButton";
import EpisodeSelector from "../EpisodeSelector";

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
  anime,
}: {
  episodeData: IEpisode;
  isEpisodeLoading: boolean;
  anime: any;
}) {
  const { videoRef } = useVideo();

  const PlayerControls = React.memo(() => {
    // const {
    //   playerProps: {
    //     setEpisode,
    //     episodes,
    //     currentEpisodeIndex,
    //     sourceId,
    //     anime,
    //     currentEpisode,
    //   },
    //   isBackground,
    // } = useGlobalPlayer();
    const { isInteracting } = useInteract();

    const nextEpisode = useMemo(
      () =>
        anime?.episode?.find(
          (episode: any) => episode?.number === episodeData?.number + 1
        ),
      []
    );

    const currentEpisode = useMemo(
      () =>
        anime?.episode?.find(
          (episode: any) => episode?.number === episodeData?.number
        ),
      []
    );

    const router = useRouter();
    return (
      <Controls
        rightControlsSlot={
          <React.Fragment>
            {nextEpisode && (
              <NextEpisodeButton
                onClick={() => router.push(`/anime/watch/${nextEpisode.id}`)}
              />
            )}

            {anime?.id && (
              <EpisodesButton>
                <div className="w-[70vw] overflow-hidden bg-background-900 p-4">
                  <EpisodeSelector
                    episodes={anime?.episode}
                    currentEpisode={currentEpisode}
                  />
                </div>
              </EpisodesButton>
            )}
          </React.Fragment>
        }
      />
      // ) : (
      //   <div className="space-y-2">
      //     {isInteracting && (
      //       <div className="px-4">
      //         <TimeIndicator />
      //       </div>
      //     )}

      //     <ProgressSlider />
      //   </div>
    );
  });

  PlayerControls.displayName = "PlayerControls";

  const PlayerOverlay = React.memo(() => {
    const router = useRouter();
    const { isInteracting } = useInteract();
    // const {
    //   playerProps: { currentEpisode, anime },
    //   setPlayerState,
    // } = useGlobalPlayer();
    // const { isBackground } = useGlobalPlayer();

    return (
      <Overlay>
        {!isEpisodeLoading && episodeData ? (
          <div
            className={classNames(
              "flex absolute top-10 left-10 gap-6 transition-al",
              isInteracting ? "visible opacity-100" : "invisible opacity-0"
            )}
          >
            <BsArrowLeft
              className={classNames(
                "transition-al  h-10 w-10 cursor-pointer duration-300 hover:text-gray-200"
              )}
              onClick={router.back}
            />

            <div>
              <h1 className="text-xl font-semibold text-gray-200">
                {episodeData.number} - {episodeData.title}
              </h1>
              <p className="text-sm text-gray-200">{anime?.title?.english}</p>
            </div>
          </div>
        ) : (
          <></>
        )}
      </Overlay>
    );
  });

  PlayerOverlay.displayName = "PlayerOverlay";

  const components = useMemo(
    () => ({
      Controls: PlayerControls,
      // MobileControls: PlayerMobileControls,
      Overlay: PlayerOverlay,
      // MobileOverlay: PlayerMobileOverlay,
    }),
    [PlayerControls, PlayerOverlay]
  );

  return (
    <div style={{ height: isMobile ? "100%" : "70vh" }}>
      {!isEpisodeLoading && episodeData && episodeData.video ? (
        <Player
          ref={videoRef}
          components={components}
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
