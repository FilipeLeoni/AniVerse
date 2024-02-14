// import { getPageMedia } from "@/services/anilist";
// import { Translation } from "@/@types";
import {
  MediaFormat,
  MediaSort,
  MediaStatus,
  MediaType,
} from "@/@types/anilist";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
// import { removeDup } from "@/utils";d

export interface UseBrowseOptions {
  keyword?: string;
  genres?: string[];
  format?: MediaFormat;
  limit?: number;
  tags?: string[];
  sort?: MediaSort;
  country?: string;
  status?: MediaStatus;
  isAdult?: boolean;
}

const useBrowse: any = (options: UseBrowseOptions) => {
  const {
    format,
    genres,
    keyword,
    sort,
    limit = 30,
    tags,
    country,
    status,
    isAdult,
  } = options;

  async function FetchPage(options: UseBrowseOptions) {
    const api = useApi();

    const res = await api.getMangaSearch({
      format,
      genres,
      keyword,
      sort,
      tags,
      country,
      status,
      isAdult,
    });
    return res;
  }

  return useInfiniteQuery({
    queryKey: ["browse", options],
    queryFn: ({ pageParam = 1 }) => FetchPage(options),
    getNextPageParam: (lastPage: any, allPages: any) => {
      return lastPage?.length ? allPages?.length + 1 : undefined;
    },
  } as any);
};

export default useBrowse;
