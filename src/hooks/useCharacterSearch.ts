import { CharacterSort, MediaSort } from "@/@types/anilist";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { UseBrowseOptions } from "./useBrowseAnime";

const useCharacterSearch = (keyword: string) => {
  const api = useApi();
  async function FetchPage(pageParam: any) {
    console.log(pageParam);
    const api = useApi();
    // const { keyword = "", sort = MediaSort.Trending_desc } = options;
    const res = await api.getCharacterSearch({
      keyword,
      page: pageParam,
    });
    console.log(res.data);
    return res.data;
  }
  return useInfiniteQuery({
    queryKey: ["searchAnime", keyword],
    queryFn: ({ pageParam = 1 }) => FetchPage(pageParam),
    getNextPageParam: (lastPage: any, allPages: any) => {
      return lastPage?.length ? allPages?.length + 1 : undefined;
    },
    // initialPageParam: 1,
  } as any);
};

export default useCharacterSearch;
