import { getPagination, parseNumberFromString } from "@/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";

export const STATUS = {
  All: "ALL",
  Reading: "READING",
  Completed: "COMPLETED",
  Planning: "PLANNING",
} as const;

export type StatusKey = keyof typeof STATUS;
export type Status = (typeof STATUS)[StatusKey];
const LIST_LIMIT = 30;

async function FetchPage(userId: string, pageParam: number, status?: string) {
  const api = useApi();
  const type = "MANGA";
  const res = await api.getList(userId, pageParam, LIST_LIMIT, status, type);
  return res;
}

const useReadList = (sourceType: Status, user: any) => {
  return useInfiniteQuery({
    queryKey: ["readList", sourceType],
    queryFn: ({ pageParam = 1 }) =>
      FetchPage(user.id, pageParam, sourceType === "ALL" ? "" : sourceType),
    getNextPageParam: (lastPage: any, allPages: any) => {
      return lastPage?.length ? allPages?.length + 1 : undefined;
    },
  } as any);
};

export default useReadList;
