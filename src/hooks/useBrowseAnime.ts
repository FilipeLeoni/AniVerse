import {
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
  MediaType,
} from "@/@types/anilist";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";

export interface UseBrowseOptions {
  keyword?: string;
  genres?: string[];
  seasonYear?: number;
  season?: MediaSeason;
  format?: MediaFormat;
  // select?: string;
  // limit?: number;
  tags?: string[];
  sort?: MediaSort;
  country?: string;
  status?: MediaStatus;
  isAdult?: boolean;
}

const useBrowse = (options: UseBrowseOptions) => {
  const {
    format = undefined,
    genres = [],
    keyword = "",
    season = undefined,
    seasonYear = undefined,
    sort = MediaSort.Trending_desc,
    // limit = 30,
    tags = [],
    country = undefined,
    status = undefined,
    isAdult = false,
  } = options;

  async function FetchPage(options: UseBrowseOptions) {
    const api = useApi();

    const res = await api.getSearchResults({
      format,
      genres,
      keyword,
      season,
      seasonYear,
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
