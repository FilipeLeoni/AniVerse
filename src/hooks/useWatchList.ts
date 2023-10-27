// import supabaseClient from "@/lib/supabase";
// import { getMedia } from "@/services/anilist";
// import { AdditionalUser, SourceStatus, Watched } from "@/types";
// import { Media, MediaType } from "@/types/anilist";
import { getPagination, parseNumberFromString } from "@/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";

export const STATUS = {
  All: "ALL",
  Watching: "WATCHING",
  Completed: "COMPLETED",
  Planning: "PLANNING",
} as const;
export type StatusKey = keyof typeof STATUS;
export type Status = (typeof STATUS)[StatusKey];

const LIST_LIMIT = 10;

async function FetchPage(userId: string, pageParam: number, status?: string) {
  const api = useApi();
  const res = await api.getWatchList(userId, pageParam, LIST_LIMIT, status);
  console.log(res);
  return res;
}

const useWatchList: any = (sourceType: Status, user: any) => {
  return useInfiniteQuery({
    queryKey: ["watchList", sourceType],
    queryFn: ({ pageParam = 1 }) =>
      FetchPage(user.id, pageParam, sourceType === "ALL" ? "" : sourceType),
    getNextPageParam: (lastPage: any, allPages: any) => {
      return lastPage?.length ? allPages?.length + 1 : undefined;
    },
  } as any);
};

export default useWatchList;
