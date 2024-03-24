"use client";

import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import dayjs from 'dayjs';
// import 'dayjs/locale/fr'; // Importe o idioma francês (se ainda não estiver importado)

import { useApi } from "@/hooks/useApi";

import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import MediaDetails from "@/components/features/upload/MediaDetails";
import toast, { Toaster } from "react-hot-toast";
import dayjs, { Dayjs } from "dayjs";
import useCreateSchedule from "@/hooks/useCreateSchedule";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import useDeleteSchedule from "@/hooks/useDeleteSchedule";

export default function ScheduleMutate({
  params,
}: {
  params: { animeId: string };
}) {
  const [value, setValue] = useState<Dayjs | null>(dayjs(""));

  const [episode, setEpisode] = useState<string>("");

  const api = useApi();
  const animeId = params.animeId;
  const { mutate: addSchedule, isPending, isSuccess } = useCreateSchedule();
  const { mutate: deleteSchedule, status } = useDeleteSchedule();
  const queryClient = useQueryClient();

  const { data: schedule, isLoading: isLoadingSchedule } = useQuery({
    queryKey: ["getAnimeSchedule", animeId],
    queryFn: async () => {
      const response = await api.getAnimeSchedule(animeId);
      return response;
    },
  });

  const { data: anime, isLoading } = useQuery({
    queryKey: ["getAnimeById", animeId],
    queryFn: async () => {
      const response = await api.getAnimeById(animeId);
      return response;
    },
  });

  const handleDelete = async () => {
    deleteSchedule({ type: "ANIME", ...schedule });
    queryClient.invalidateQueries({
      queryKey: ["getAnimeSchedule", animeId],
    });
  };

  const handleCreateSchedule = async () => {
    const airingAt = value?.unix();

    if (!airingAt) {
      return toast.error("Please select a date");
    }

    if (!episode) {
      return toast.error("Please enter an episode number");
    }
    await addSchedule({
      animeId,
      airingAt,
      episodeNumber: episode,
    });
    setValue(null);
    setEpisode("");
  };

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
        {!isLoading && anime && !schedule?.airingAt && (
          <div className="flex gap-2 justify-end">
            <input
              className="h-14 border-[#262626] border rounded-sm bg-background-900 placeholder:text-[#737373] px-4"
              placeholder="Episode"
              value={episode}
              onChange={(e) => setEpisode(e.target.value)}
            />

            <DateTimePicker
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
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />

            <Button
              onClick={() => handleCreateSchedule()}
              primary
              className="gap-2 justify-center md:flex hidden"
              isLoading={isPending}
            >
              Add schedule <BiPlus />
            </Button>
          </div>
        )}

        {anime && !isLoadingSchedule && schedule?.airingAt && (
          <div className="w-full bg-background-800 mt-4 p-4 rounded-md relative flex justify-between">
            <div>
              <div className="flex gap-2">
                <p>Episode: </p>
                <p className="text-primary-200">{schedule?.episodeNumber}</p>
              </div>

              <div className="flex gap-2">
                <p>Date entered: </p>
                <p className="text-primary-200">
                  {dayjs.unix(schedule?.airingAt).format("DD-MM-YYYY HH:mm")}
                </p>
              </div>
              <p className="flex gap-2">
                Schedule created at:{" "}
                <span className="text-primary-200">
                  {dayjs(schedule.createdAt).format("DD-MM-YYYY HH:mm")}
                </span>
              </p>
            </div>

            <div
              className={classNames(
                "bg-background-800 items-center gap-6 -top-2 right-0 flex"
              )}
            >
              {/* <Button
                iconClassName="w-5 h-5"
                secondary
                LeftIcon={AiFillEdit}
                // onClick={handleEdit}
              /> */}

              <DeleteConfirmation
                reference={
                  <Button
                    iconClassName="w-5 h-5"
                    className="hover:bg-red-500"
                    secondary
                    LeftIcon={AiFillDelete}
                  />
                }
                onConfirm={handleDelete}
              />
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}
