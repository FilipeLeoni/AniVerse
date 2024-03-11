"use client";

import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import dayjs from 'dayjs';
// import 'dayjs/locale/fr'; // Importe o idioma francês (se ainda não estiver importado)

import { useApi } from "@/hooks/useApi";

import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import MediaDetails from "@/components/features/upload/MediaDetails";
import toast, { Toaster } from "react-hot-toast";
import dayjs from "dayjs";

export default function ScheduleMutate({
  params,
}: {
  params: { animeId: string };
}) {
  const [anime, setAnime] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDate, handleDateChange] = useState<any>();
  const [episode, setEpisode] = useState<string>("");

  const api = useApi();

  const getAnimeById = async () => {
    setIsLoading(true);
    const response = await api.getAnimeById(params.animeId);
    setAnime(response);

    setIsLoading(false);
    return response;
  };

  const handlePutSchedule = async () => {
    const response = await api.PutScheduleAnime(params.animeId, {
      schedule: selectedDate,
      episode,
    });

    console.log(response);
    console.log(selectedDate);
    console.log(episode);

    if (response?.status === 201) {
      getAnimeById();
      setEpisode("");
      handleDateChange("");
    } else {
      toast.error("Error create schedules, verify episode and schedule date");
    }
  };

  useEffect(() => {
    getAnimeById();
  }, [params]);

  return (
    <div className="relative min-h-[82vh]">
      <div>
        <div>Hi, Username</div>
        <h1 className="font-semibold text-4xl">Schedule</h1>
      </div>
      <div className="mt-8 ">
        {isLoading ? (
          <div className="w-full h-full items-center justify-center">
            <Loading />
          </div>
        ) : anime ? (
          <MediaDetails media={anime} />
        ) : (
          <p className="pt-8 ">No results found</p>
        )}
      </div>

      <div className="mt-4">
        {!isLoading && anime && (
          <div className="flex gap-2 justify-end">
            <input
              className="h-14 border-[#262626] border rounded-sm bg-background-900 placeholder:text-[#737373] px-4"
              placeholder="Episode"
              value={episode}
              onChange={(e) => setEpisode(e.target.value)}
            />

            {/* <DateTimePicker
              className="border border-red-900"
              sx={{
                color: "white",
                width: 300,
                background: "#0D0D0D",
                border: "1px solid #262626",
                borderRadius: "4px",
                "& input": { color: "white" },
                svg: { color: "#fff" },
              }}
              value={selectedDate}
              onChange={(newValue: any) => handleDateChange(newValue)}
            /> */}

            <Button
              onClick={() => handlePutSchedule()}
              primary
              className="gap-2 justify-center md:flex hidden"
            >
              Add schedule <BiPlus />
            </Button>
          </div>
        )}

        {anime && !isLoading && (
          <div className="w-full bg-background-700 mt-4 p-4 rounded-md">
            <div className="flex gap-2">
              <p>Episode: </p>
              <p className="text-primary-500">
                {anime?.airingSchedule?.episode}
              </p>
            </div>

            <div className="flex gap-2">
              <p>Date entered: </p>
              <p className="text-primary-500">
                {dayjs(anime?.airingSchedule?.schedule).format(
                  "DD/MM/YYYY HH:mm:ss"
                )}
              </p>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}
