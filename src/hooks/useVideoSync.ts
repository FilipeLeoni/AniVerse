/* eslint-disable react-hooks/exhaustive-deps */
// https://github.com/hoangvu12/video-sync/blob/main/public/index.js

import { useUser } from "@/contexts/AuthContext";
import { useRoomInfo } from "@/contexts/RoomContext";
import { sleep } from "@/utils";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
// import { toast } from "react-toastify";

type VideoState = {
  type: "play" | "pause" | "timeupdate";
  currentTime: number;
  hostTime: number;
};

const TIME_SYNC_CYCLES = 10;
const PLAYING_THRESH = 1;

const getGlobalTime = (delta: number) => {
  const date = new Date();
  const time = date.getTime() / 1000;
  // delta is the correction parameter
  return time + delta;
};

const median = (values: number[]) => {
  const cloned = [...values];

  if (cloned.length === 0) {
    return 0;
  }

  cloned.sort((x, y) => x - y);

  const half = Math.floor(cloned.length / 2);

  if (cloned.length % 2) {
    return cloned[half];
  }

  return (cloned[half - 1] + cloned[half]) / 2.0;
};

const useVideoSync = () => {
  const { room, socket } = useRoomInfo();
  const { data: session } = useSession();
  const playerRef = useRef<HTMLVideoElement>();
  // const user = useUser();
  const overEstimates = useRef<number[]>([]);
  const underEstimates = useRef<number[]>([]);
  const overEstimate = useRef<number>(0);
  const underEstimate = useRef<number>(0);
  const correction = useRef<number>(0);
  const isPlaying = useRef(false);

  const user = session?.user;
  const isHost = useMemo(() => user?.id === room?.host.id, [user, room]);
  // () => basicRoomUser?.userId === room?.host.id,

  console.log(room);
  useEffect(() => {
    const player = playerRef.current;

    if (!player) return;

    const handleCanPlay = () => {
      console.log("chamado");
      socket.on("currentTime", (currentTime: number) => {
        player.currentTime = currentTime;
      });

      socket.emit("getCurrentTime", { roomId: room?.id });
    };

    player.addEventListener("canplay", handleCanPlay, { once: true });

    // if (!isHost) {
    //   console.log("test");
    //   socket.on("timeState", (currentTime: number) => {
    //     console.log(currentTime);
    //     player.currentTime = currentTime;
    //   });

    //   // setUserChangeTime(false);
    // }

    // if (!isHost) {
    //   socket.on("videoState", ({ type, currentTime, hostTime }: any) => {
    //     console.log(currentTime);
    //     if (type === "timeupdate" && currentTime !== player.currentTime) {
    //       // Atualizar o tempo do vídeo local
    //       player.currentTime = currentTime;

    //       // Outras ações necessárias, se houver
    //     }
    //   });
    // }

    return () => {
      socket.off("currentTime");
      player.removeEventListener("canplay", handleCanPlay);
      // setUserChangeTime(false);
    };
  }, [socket]);

  useEffect(() => {
    const player = playerRef.current;

    if (!player) return;
    if (isHost) return;

    socket.on("updateSeekedEvent", (data: any) => {
      player.currentTime = data.currentTime;
    });

    return () => {
      socket.off("updateSeekedEvent");
    };
  }, [socket, playerRef]);

  useEffect(() => {
    async function timeSync() {
      for (let i = 0; i < TIME_SYNC_CYCLES; i++) {
        await sleep(1000);
        socket.emit("getTimeSync-backward");
        await sleep(1000);
        socket.emit("getTimeSync-forward", getGlobalTime(0));
      }
    }

    timeSync();

    socket.on("timeSync-backward", (timeAtServer: number) => {
      const latestUnderEstimate = timeAtServer - getGlobalTime(0);

      underEstimates.current.push(latestUnderEstimate);
      underEstimate.current = median(underEstimates.current);
      correction.current = (underEstimate.current + overEstimate.current) / 2;
    });

    socket.on("timeSync-forward", (latestOverEstimate: number) => {
      overEstimates.current.push(latestOverEstimate);
      overEstimate.current = median(overEstimates.current);
      correction.current = (underEstimate.current + overEstimate.current) / 2;
    });

    return () => {
      socket.off("timeSync-backward");
      socket.off("timeSync-forward");
    };
  }, [socket, isHost]);

  useEffect(() => {
    if (!playerRef.current) return;

    const player = playerRef.current;

    const videoStateHandlers = {
      play: () => {
        player.play().catch(() => {
          isPlaying.current = false;
        });

        isPlaying.current = true;
      },
      pause: () => {
        player.pause();

        isPlaying.current = false;
      },
      timeupdate: (state: VideoState) => {
        if (!isPlaying.current) return;

        const proposedTime =
          state.currentTime -
          state.hostTime +
          getGlobalTime(correction.current);

        const gap = Math.abs(proposedTime - player.currentTime);

        if (isPlaying.current) {
          if (gap > PLAYING_THRESH) {
            player.currentTime = proposedTime;
          }

          player.play();
        }
      },
    };

    const handleViewerPlay = () => {
      isPlaying.current = true;
    };

    const handleViewerPause = () => {
      isPlaying.current = false;
    };

    const handleHostPlay = () => {
      socket.emit("changeVideoState", { type: "play" });
      socket.emit("sendEvent", "play");
    };

    const handleHostPause = () => {
      socket.emit("changeVideoState", { type: "pause" });
      socket.emit("sendEvent", "pause");
    };

    const handleHostTimeUpdate = () => {
      socket.emit("changeVideoState", {
        type: "timeupdate",
        currentTime: player.currentTime,
        hostTime: getGlobalTime(correction.current),
        roomId: room.id,
      });
    };

    const handleSeeked = () => {
      const newCurrentTime = player.currentTime;

      socket.emit("seekedEvent", {
        roomId: room?.id,
        currentTime: newCurrentTime,
      });
    };

    if (isHost) {
      player.addEventListener("play", handleHostPlay);
      player.addEventListener("pause", handleHostPause);
      player.addEventListener("timeupdate", handleHostTimeUpdate);
      player.addEventListener("seeked", handleSeeked);
    } else {
      socket.on("videoState", (state: VideoState) => {
        videoStateHandlers[state.type](state);
      });

      player.addEventListener("play", handleViewerPlay);

      player.addEventListener("pause", handleViewerPause);
    }

    player
      .play()
      .then(() => {
        isPlaying.current = true;
      })
      .catch(() => {
        isPlaying.current = false;
      });

    return () => {
      socket.off("videoState");
      player.removeEventListener("play", handleViewerPlay);
      player.removeEventListener("pause", handleViewerPause);

      player.removeEventListener("play", handleHostPlay);
      player.removeEventListener("pause", handleHostPause);
      player.removeEventListener("timeupdate", handleHostTimeUpdate);
    };
  }, [socket, isHost]);

  return playerRef;
};

export default useVideoSync;
