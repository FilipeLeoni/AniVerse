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

  const saveWatchedMutation = useSaveWatched();
  const corsServers = ["https://corsproxy.io"];

  // const handleHlsInit = useCallback((hls: Hls, source: any) => {
  //   // @ts-ignore
  //   // hls.on("hlsManifestParsed", (_, info) => {
  //   //   info.levels.forEach((level: any) => {
  //   //     if (!level?.url?.length) return;

  //   //     level.url = level.url.map((url: any) => {
  //   //       if (!corsServers.some((server: any) => url.includes(server))) return url;

  //   //       if (url.includes("corsproxy")) {
  //   //         const targetUrl = decodeURIComponent(
  //   //           url.replace("https://corsproxy.io/", "")
  //   //         );

  //   //         const finalUrl = buildAbsoluteURL(source.file, targetUrl, {
  //   //           alwaysNormalize: true,
  //   //         });

  //   //         return `https://corsproxy.io/?${encodeURIComponent(finalUrl)}`;
  //   //       } else if (url.includes(config.proxyServerUrl)) {
  //   //         const targetUrl = decodeURIComponent(
  //   //           url.replace(config.proxyServerUrl + "/", "")
  //   //         );

  //   //         const href = new URL(source.file);
  //   //         const baseUrl = href.searchParams.get("url");

  //   //         const finalUrl = buildAbsoluteURL(baseUrl, targetUrl, {
  //   //           alwaysNormalize: true,
  //   //         });

  //   //         return createProxyUrl(finalUrl, source.proxy);
  //   //       }
  //   //     });
  //   //   });
  //   // });

  //   // @ts-ignore
  //   hls.on("hlsFragLoading", (_, { frag }) => {
  //     if (
  //       !corsServers.some((server) => frag.url.includes(server)) ||
  //       frag.relurl.includes("http")
  //     )
  //       return;

  //     if (frag.url.includes(config.proxyServerUrl)) {
  //       const href = new URL(frag.baseurl);
  //       const targetUrl = href.searchParams.get("url");

  //       const url = buildAbsoluteURL(targetUrl, frag.relurl, {
  //         alwaysNormalize: true,
  //       });

  //       href.searchParams.set("url", url);

  //       frag.url = href.toString();

  //       // Free CORS server
  //     } else if (frag.url.includes("corsproxy")) {
  //       const targetUrl = decodeURIComponent(
  //         frag.baseurl.replace("https://corsproxy.io/?", "")
  //       );

  //       const url = buildAbsoluteURL(targetUrl, frag.relurl, {
  //         alwaysNormalize: true,
  //       });

  //       frag.url = `https://corsproxy.io/?${encodeURIComponent(url)}`;
  //     }
  //   });
  // }, []);

  console.log(anime);

  useEffect(() => {
    const videoEl = videoRef.current;

    if (!videoEl) return;

    const handleSaveTime = () => {
      if (saveWatchedInterval.current) {
        clearInterval(saveWatchedInterval.current);
      }
      saveWatchedInterval.current = setInterval(() => {
        const storedHistory = localStorage.getItem("aniverse_history");
        let watchedEpisodes = [];

        if (storedHistory) {
          watchedEpisodes = JSON.parse(storedHistory).watchedEpisodes || [];
        }

        const existingEpisodeIndex = watchedEpisodes.findIndex(
          (episode: any) => episode.episodeId === episodeData.id
        );

        if (existingEpisodeIndex !== -1) {
          watchedEpisodes[existingEpisodeIndex].watchedTime =
            videoRef.current?.currentTime;
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

  // useEffect(() => {
  //   const watchedEpisode: any = localStorage.getItem("aniverse_history");
  //   const watchedEpisodes = JSON.parse(watchedEpisode)?.watchedEpisodes;
  //   const watchedEpisodeData = watchedEpisodes?.findIndex(
  //     (episode: any) => episode.episode_id === episodeData.id
  //   );
  //   const videoEl = videoRef.current;

  //   if (!videoEl) return;

  //   const currentEpisodeNumber = episodeData.number;

  //   // if (currentEpisodeNumber !== watchedEpisodeData.) return;

  //   const handleVideoPlay = () => {
  //     videoEl.currentTime = watchedEpisodeData.watchedTime;

  //     videoEl.removeEventListener("canplay", handleVideoPlay);
  //     videoEl.removeEventListener("timeupdate", handleVideoPlay);
  //   };

  //   // Only set the video time if the video is ready
  //   videoEl.addEventListener("canplay", handleVideoPlay);
  //   // Just in case the video is already played.
  //   videoEl.addEventListener("timeupdate", handleVideoPlay);

  //   return () => {
  //     videoEl.removeEventListener("canplay", handleVideoPlay);
  //     videoEl.removeEventListener("timeupdate", handleVideoPlay);
  //   };
  // }, [episodeData, videoRef.current]);

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
