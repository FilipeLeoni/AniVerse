import { getAiringSchedules } from "@/components/services/anilist";
import { AiringSchedule, AiringScheduleArgs, PageArgs } from "@/@types/anilist";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useAiringSchedules = (
  args?: AiringScheduleArgs & PageArgs,
  options?: any
) => {
  return useQuery<any>({
    queryKey: ["airingSchedules", { args }],
    queryFn: async () => {
      return getAiringSchedules(args);
    },
    // options
  });
};

export default useAiringSchedules;
