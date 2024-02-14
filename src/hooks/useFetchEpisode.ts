import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";

export const useFetchEpisode = (episodeId: any) => {
  const queryClient = useQueryClient();
  const api = useApi();
  return useQuery({
    queryKey: ["episode"],
    queryFn: async () => {
      const res = await api.getEpisodeById(episodeId);
      return res;
    },
  });
};
