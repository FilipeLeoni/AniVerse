"use client";

import Loading from "@/components/shared/Loading";
import { useVideo } from "@/contexts/GlobalPlayerContext";
import Player, { useInteract } from "netplayer";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { isMobile } from "react-device-detect";
import Overlay from "./Overlay";
import { BsArrowLeft } from "react-icons/bs";
import classNames from "classnames";
import Controls from "./Controls";
import NextEpisodeButton from "./NextEpisodeButton";
import EpisodesButton from "./EpisodesButton";
import EpisodeSelector from "../EpisodeSelector";
import useSaveWatched from "@/hooks/useSaveWatched";
import { parseNumberFromString } from "@/utils";
import Hls from "netplayer/dist/types/hls.js";
import { buildAbsoluteURL } from "url-toolkit";
import EmbedVidet from "./EmbedVidet";

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
  ref,
}: {
  episodeData: IEpisode;
  isEpisodeLoading: boolean;
  anime: any;
  ref?: any;
}) {
  // const { videoRef } = useVideo();
  const videoRef: any = useRef<HTMLVideoElement>(null) || ref;
  const saveWatchedInterval: any = useRef<NodeJS.Timer>(null);

  useEffect(() => {
    const videoEl = videoRef.current;

    if (!videoEl) return;
    const history: any = localStorage.getItem("aniverse_history") ?? "";

    if (history) {
      const watchedEpisodes = JSON?.parse(history)?.watchedEpisodes || [];
      const watchedEpisodeData = watchedEpisodes?.find(
        (episode: any) => episode.episodeId === episodeData?.id
      );

      if (watchedEpisodeData) {
        const watchedTime = watchedEpisodeData?.watchedTime;

        if (typeof watchedTime === "number") {
          videoEl.currentTime = watchedTime || 0;
        }
      }
    }

    const handleSaveTime = () => {
      if (saveWatchedInterval.current) {
        clearInterval(saveWatchedInterval.current);
      }
      saveWatchedInterval.current = setInterval(() => {
        let watchedEpisodes = [];

        if (history) {
          watchedEpisodes = JSON.parse(history).watchedEpisodes || [];
        }

        const existingEpisodeIndex = watchedEpisodes.findIndex(
          (episode: any) => episode.episodeId === episodeData.id
        );

        const isSameAnime = watchedEpisodes.some(
          (episode: any) => episode.anime.id === anime.id
        );

        // const isSameAnime =
        //   existingEpisodeIndex !== -1 &&
        //   watchedEpisodes[existingEpisodeIndex]?.anime.id === anime.id;

        console.log(isSameAnime);
        if (existingEpisodeIndex !== -1) {
          watchedEpisodes[existingEpisodeIndex].watchedTime =
            videoRef.current?.currentTime;
        } else {
          if (isSameAnime) {
            const sameAnimeIndex = watchedEpisodes.findIndex(
              (episode: any) => episode.anime.id === anime.id
            );

            watchedEpisodes[sameAnimeIndex] = {
              anime: {
                id: anime.id,
                title: anime.title.english,
                thumbnail: anime.bannerImage || anime.coverImage.extraLarge,
                totalEpisodes: anime.totalEpisodes,
              },
              episode: {
                title: episodeData.title,
                number: episodeData.number,
                duration: videoRef.current.duration,
              },
              episodeId: episodeData.id,
              watchedTime: videoRef.current?.currentTime,
              episodeNumber: episodeData.number,
            };
          } else {
            watchedEpisodes.unshift({
              anime: {
                id: anime.id,
                title: anime.title.english,
                thumbnail: anime.bannerImage || anime.coverImage.extraLarge,
              },
              episode: {
                title: episodeData.title,
                number: episodeData.number,
                description: episodeData.description,
                duration: videoRef.current.duration,
              },
              episodeId: episodeData.id,
              watchedTime: videoRef.current?.currentTime,
              episodeNumber: episodeData.number,
            });
          }
        }

        localStorage.setItem(
          "aniverse_history",
          JSON.stringify({ watchedEpisodes })
        );
        // saveWatchedMutation.mutate({
        //   media_id: Number(anime.id),
        //   episode_id: episodeData.id,
        //   watched_time: videoRef.current?.currentTime,
        //   episode_number: episodeData?.number,
        // });
      }, 10000);
    };

    videoEl.addEventListener("canplay", handleSaveTime);

    return () => {
      clearInterval(saveWatchedInterval.current);
      videoEl.removeEventListener("canplay", handleSaveTime);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anime, episodeData, videoRef.current]);

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

  console.log("chamado de novo");

  return (
    <div style={{ height: isMobile ? "100%" : "70vh" }}>
      {episodeData && episodeData.video ? (
        <Player
          ref={videoRef}
          components={components}
          sources={[
            {
              // file: `${"http://localhost:8081"}/${episodeData.video}`,
              file: isEpisodeLoading
                ? "https://cdn.plyr.io/static/blank.mp4"
                : `${"http://localhost:8081"}/${episodeData.video}`,
            },
          ]}
          className="object-contain w-full h-full"
          autoPlay
        />
      ) : // <EmbedVidet />
      !isEpisodeLoading && !episodeData ? (
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
