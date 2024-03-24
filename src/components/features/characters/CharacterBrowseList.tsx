import { MediaSort } from "@/@types/anilist";
import CharacterCard from "@/components/shared/CharacterCard";
import Input from "@/components/shared/Input";
import InView from "@/components/shared/InView";
import List from "@/components/shared/List";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
// import useBirthdayCharacters from "@/hooks/useBirthdayCharacters";
import { UseBrowseOptions } from "@/hooks/useBrowseAnime";
import useCharacterSearch from "@/hooks/useCharacterSearch";
// import useFavouriteCharacters from "@/hooks/useFavouriteCharacters";
import { debounce } from "@/utils";
import React, { useMemo, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface BrowseListProps {
  defaultQuery?: UseBrowseOptions;
}

const initialValues: UseBrowseOptions = {
  format: undefined,
  keyword: "",
  genres: [],
  season: undefined,
  seasonYear: undefined,
  tags: [],
  sort: MediaSort.Trending_desc,
  country: undefined,
  isAdult: false,
};

const BrowseList: React.FC<BrowseListProps> = ({
  defaultQuery = initialValues,
}) => {
  const [keyword, setKeyword] = useState(defaultQuery.keyword || "");

  const {
    data: searchResult,
    isLoading: searchIsLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError: searchIsError,
  } = useCharacterSearch(keyword);

  // const { data: birthdayCharacters, isLoading: birthdayIsLoading } =
  //   useBirthdayCharacters();
  // const { data: favouritesCharacters, isLoading: favouritesIsLoading } =
  //   useFavouriteCharacters();

  const handleFetch = () => {
    if (isFetchingNextPage || !hasNextPage) return;

    fetchNextPage();
  };

  const handleInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value),
    500
  );

  const totalData: any = useMemo(
    () => searchResult?.pages?.flatMap((el: any) => el),
    [searchResult?.pages]
  );

  // const totalData: any = searchResult?.pages;

  return (
    <div className="min-h-screen">
      <form className="space-y-4">
        <Input
          containerInputClassName="border border-white/80"
          LeftIcon={AiOutlineSearch}
          onChange={handleInputChange}
          defaultValue={keyword}
          label="Search"
          containerClassName="w-full md:w-96"
          placeholder="Character Name"
        />
      </form>

      <div className="mt-8">
        {!searchIsLoading ? (
          <React.Fragment>
            <List data={totalData}>
              {(character: any) => <CharacterCard character={character} />}
            </List>

            {isFetchingNextPage && !searchIsError && (
              <div className="mt-4">
                <ListSkeleton />
              </div>
            )}

            {((totalData.length && !isFetchingNextPage) || hasNextPage) && (
              <InView onInView={handleFetch} />
            )}

            {/* {((totalData.length && !isFetchingNextPage) || hasNextPage) && (
                <InView onInView={handleFetch} />
              )} */}

            {!hasNextPage && !!totalData.length && (
              <p className="mt-8 text-2xl text-center">
                There is nothing left...
              </p>
            )}
          </React.Fragment>
        ) : (
          <ListSkeleton />
        )}
      </div>
    </div>
  );
};

export default BrowseList;
