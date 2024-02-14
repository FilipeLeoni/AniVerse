// import config from "@/config";
import { createProxyUrl } from "@/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
// import { toast } from "react-toastify";

interface ReturnSuccessType {
  success: true;
  sources: any[];
  subtitles?: any[];
  fonts?: any[];
  thumbnail?: string;
}

interface ReturnFailType {
  success: false;
  error: string;
  errorMessage: string;
}

const convertSources = (sources: any[]) =>
  sources.map((source) => {
    if (source.useProxy) {
      source.file = createProxyUrl(source.file, source.proxy);
    }

    return source;
  });

export const useFetchSource = (currentEpisode: any, nextEpisode?: any) => {
  const queryClient = useQueryClient();

  const fetchSource = (episode: any) =>
    axios
      .get<ReturnSuccessType>(`/source`, {
        params: {
          episode_id: episode.sourceEpisodeId,
          source_media_id: episode.sourceMediaId,
          source_id: episode.sourceId,
        },
      })
      .then(({ data }) => {
        data.sources = convertSources(data.sources);

        return data;
      });

  const getQueryKey = (episode: any) =>
    `source-${episode.sourceId}-${episode.sourceEpisodeId}`;

  return useQuery<any>(
    {
      queryKey: [getQueryKey(currentEpisode)],
      queryFn: () => fetchSource(currentEpisode),
      // onSuccess: () => {
      //   if (!nextEpisode?.sourceEpisodeId) return;

      //   queryClient.prefetchQuery(getQueryKey(nextEpisode), () =>
      //     fetchSource(nextEpisode)
      //   );
    }

    // getQueryKey(currentEpisode),
    // () => fetchSource(currentEpisode),
    // {
    //   onSuccess: () => {
    //     if (!nextEpisode?.sourceEpisodeId) return;

    //     queryClient.prefetchQuery(getQueryKey(nextEpisode), () =>
    //       fetchSource(nextEpisode)
    //     );
    //   },
    //   onError: (error: any) => {
    //     toast.error(error.message);
    //   },
    // }
  );
};
