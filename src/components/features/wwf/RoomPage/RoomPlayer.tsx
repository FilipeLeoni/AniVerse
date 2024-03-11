import { useRoomInfo } from "@/contexts/RoomContext";
// import {
//   RoomPlayerContextProvider,
//   useRoomPlayer,
// } from "@/contexts/RoomPlayerContext";
import { useFetchSource } from "@/hooks/useFetchSource";
import useVideoSync from "@/hooks/useVideoSync";
// import { Episode } from "@/@types";
import { parseNumberFromString } from "@/utils";
import { sortMediaUnit } from "@/utils/data";
import classNames from "classnames";
import Player, { useInteract } from "netplayer";
// import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { BsArrowLeft } from "react-icons/bs";
// import Player from "../../anime/Player";
// import MobileOverlay from "../../anime/Player/MobileOverlay";
import Overlay from "../../anime/Player/Overlay";
// import TimestampSkipButton from "../../anime/Player/TimestampSkipButton";
import RoomPlayerControls from "./RoomPlayerControls";
// import RoomPlayerMobileControls from "./RoomPlayerMobileControls";
import {
  useRoomPlayer,
  RoomPlayerContextProvider,
} from "@/contexts/RoomPlayerContext";
import { useFetchEpisode } from "@/hooks/useFetchEpisode";
import { useRouter } from "next/navigation";

const blankVideo = [
  {
    file: "https://cdn.plyr.io/static/blank.mp4",
  },
];

const PlayerOverlay = () => {
  const router = useRouter();
  const { isInteracting } = useInteract();
  const { currentEpisode, anime } = useRoomPlayer();

  return (
    <Overlay>
      <BsArrowLeft
        className={classNames(
          "absolute w-10 h-10 transition-al duration-300 cursor-pointer top-10 left-10 hover:text-gray-200",
          isInteracting ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        // onClick={router.back}
      />

      {/* {anime.idMal && (
        <TimestampSkipButton
          className="absolute right-4 bottom-20"
          episode={parseNumberFromString(currentEpisode.name)}
          malId={anime.idMal}
        />
      )} */}
    </Overlay>
  );
};

// const PlayerMobileOverlay = () => {
//   const router = useRouter();
//   const { isInteracting } = useInteract();
//   const { currentEpisode, anime } = useRoomPlayer();

//   return (
//     <React.Fragment>
//       <MobileOverlay>
//         <BsArrowLeft
//           className={classNames(
//             "absolute w-8 h-8 transition-all duration-300 cursor-pointer top-4 left-4 hover:text-gray-200",
//             isInteracting ? "opacity-100 visible" : "opacity-0 invisible"
//           )}
//           onClick={router.back}
//         />
//       </MobileOverlay>

//       {anime.idMal && (
//         <TimestampSkipButton
//           className="z-50 absolute right-4 bottom-24"
//           episode={parseNumberFromString(currentEpisode.name)}
//           malId={anime.idMal}
//         />
//       )}
//     </React.Fragment>
//   );
// };

const RoomPlayer = () => {
  const playerRef: any = useVideoSync();
  const { room, socket, basicRoomUser } = useRoomInfo();
  // const { data, isLoading } = useFetchEpisode(room?.episode?.id);

  console.log(room);
  console.log(basicRoomUser);
  const isHost = useMemo(
    () => basicRoomUser?.userId === room?.host.id,
    [basicRoomUser?.userId, room?.host.id]
  );

  //   const sourceEpisodes = useMemo(
  //     () =>
  //       room?.episodes?.filter(
  //         (episode: any) => episode.sourceId === room?.episode.sourceId
  //       ),
  //     [room?.episodes, room?.episode.sourceId]
  //   );

  //   const currentEpisodeIndex = useMemo(
  //     () =>
  //       sourceEpisodes?.findIndex(
  //         (episode: any) =>
  //           episode.sourceEpisodeId === room?.episode.sourceEpisodeId
  //       ),
  //     [sourceEpisodes, room?.episode.sourceEpisodeId]
  //   );

  //   const nextEpisode = useMemo(
  //     () => sourceEpisodes?.[currentEpisodeIndex + 1],
  //     [currentEpisodeIndex, sourceEpisodes]
  //   );

  const sortedEpisodes = useMemo(
    () => sortMediaUnit(room?.episodes),
    [room?.episodes]
  );

  console.log(isHost);

  const handleNavigateEpisode = useCallback(
    (episode: any) => {
      socket.emit("changeEpisode", episode);

      socket.emit("sendEvent", "changeEpisode");
    },
    [socket]
  );

  const components: any = useMemo(
    () => ({
      Controls: RoomPlayerControls,
      //   MobileControls: RoomPlayerMobileControls,
      Overlay: PlayerOverlay,
      //   MobileOverlay: PlayerMobileOverlay,
    }),
    []
  );

  //   const hotkeys = useMemo(
  //     () => [
  //       {
  //         fn: () => {
  //           if (currentEpisodeIndex < sourceEpisodes?.length - 1) {
  //             handleNavigateEpisode(nextEpisode);
  //           }
  //         },
  //         hotKey: "shift+n",
  //         name: "next-episode",
  //       },
  //     ],
  //     [
  //       currentEpisodeIndex,
  //       handleNavigateEpisode,
  //       nextEpisode,
  //       sourceEpisodes?.length,
  //     ]
  //   );

  console.log(room?.episode);
  return (
    <RoomPlayerContextProvider
      value={{
        anime: room?.media,
        currentEpisode: room?.episode,
        // currentEpisodeIndex: currentEpisodeIndex,
        episodes: sortedEpisodes,
        sourceId: room?.episode.sourceId,
        sources: "data?.sources",
        setEpisode: handleNavigateEpisode,
        isHost,
      }}
    >
      <div className="relative aspect-w-16 aspect-h-9">
        <div>
          <Player
            ref={playerRef}
            sources={[
              {
                file: "http://localhost:8081/https://s22.anime-sama.fr/videos/Solo%20Leveling/Saison%201/VF/Solo_Leveling_1_VF.mp4",
              },
            ]}
            // subtitles={data?.subtitles || []}
            // fonts={data?.fonts || []}
            className="object-contain w-full h-full"
            components={components}
            // hotkeys={hotkeys}
            // thumbnail={data?.thumbnail}
            autoPlay
          />
        </div>
      </div>
    </RoomPlayerContextProvider>
  );
};

export default RoomPlayer;
