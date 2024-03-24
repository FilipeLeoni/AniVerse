import AdvancedSettings from "@/components/shared/AdvancedSettings";
import Card from "@/components/shared/Card";
import FormSelect from "@/components/shared/FormSelect";
import GenresFormSelect from "@/components/shared/GenresFormSelect";
import Input from "@/components/shared/Input";
import InView from "@/components/shared/InView";
import List from "@/components/shared/List";
import SortSelector from "@/components/shared/SortSelector";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import { SEASON_YEARS } from "@/constants";
import useBrowse, { UseBrowseOptions } from "@/hooks/useBrowseAnime";
import { MediaSort, MediaType } from "@/@types/anilist";
import { debounce } from "@/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MobileView } from "react-device-detect";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineSearch } from "react-icons/ai";
import { COUNTRIES, FORMATS, SEASONS, STATUS } from "@/constants/en";

const seasonYears = SEASON_YEARS.map((year) => ({ label: year, value: year }));

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

interface BrowseListProps {
  defaultQuery?: UseBrowseOptions;
}

const BrowseList: React.FC<BrowseListProps> = ({
  defaultQuery = initialValues,
}) => {
  const defaultValues = { ...initialValues, ...defaultQuery };

  const {
    control,
    register,
    watch,
    setValue,
    getValues,
    reset,
    formState: { isDirty },
  } = useForm<UseBrowseOptions>({
    defaultValues,
  });

  const query: any = watch();

  const pathname = usePathname();
  const searchParams: any = useSearchParams();
  const searchQuery = searchParams ? searchParams.get("keyword") : null;
  const searchGenres = searchParams ? searchParams.get("genres") : null;
  const searchType = searchParams ? searchParams.get("format") : null;
  const searchSeason = searchParams ? searchParams.get("season") : null;
  const searchSeasonYear = searchParams ? searchParams.get("seasonYear") : null;

  const {
    data,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
  } = useBrowse(query);

  const handleFetch = () => {
    if (isFetchingNextPage || !hasNextPage) return;

    fetchNextPage();
  };

  const handleInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue("keyword", e.target.value),
    500
  );

  const handleGenresChange = useCallback(
    (values: any) => {
      values.forEach(({ type, value }: any) => {
        setValue(type === "TAGS" ? "tags" : "genres", value, {
          shouldDirty: true,
        });
      });
    },
    [setValue]
  );

  const totalData: any = useMemo(
    () => data?.pages?.flatMap((el: any) => el?.data),
    [data?.pages]
  );

  useEffect(() => {
    const values: any = getValues();
    const queryParams: string[] = [];

    Object.entries(values).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        key !== "sort" &&
        key !== "isAdult"
      ) {
        if (Array.isArray(value) && value.length > 0) {
          queryParams.push(`${key}=${value.join(",")}`);
        } else if (!Array.isArray(value)) {
          queryParams.push(`${key}=${value}`);
        }
      }
    });

    const newUrl =
      queryParams.length > 0
        ? `${pathname}?${queryParams.join("&")}`
        : pathname;

    window.history.pushState({}, "", newUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (searchQuery) {
      setValue("keyword", searchQuery);
    }
    if (searchGenres) {
      const genresArray = searchGenres.split(",");
      setValue("genres", genresArray);
    }
    if (searchType) {
      setValue("format", searchType);
    }
    if (searchSeason) {
      setValue("season", searchSeason);
    }
    if (searchSeasonYear) {
      setValue("seasonYear", Number(searchSeasonYear));
    }
  }, [
    searchQuery,
    searchGenres,
    searchType,
    setValue,
    searchSeason,
    searchSeasonYear,
  ]);

  return (
    <div className="min-h-screen">
      <form className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end gap-6 lg:flex-wrap lg:justify-between lg:space-x-0">
          <Input
            {...register("keyword")}
            containerInputClassName="border border-white/80"
            LeftIcon={AiOutlineSearch}
            onChange={handleInputChange}
            defaultValue={defaultValues.keyword}
            label="Search"
            containerClassName="md:hidden shrink-0"
          />

          <div className="snap-x overflow-x-auto flex items-center gap-6">
            <Input
              {...register("keyword")}
              containerInputClassName="border border-white/80"
              LeftIcon={AiOutlineSearch}
              onChange={handleInputChange}
              defaultValue={defaultValues.keyword}
              label="Search"
              containerClassName="hidden md:block shrink-0"
            />

            <GenresFormSelect
              value={[...query.genres, ...query.tags]}
              onChange={handleGenresChange}
            />

            <FormSelect
              control={control}
              name="season"
              defaultValue={defaultValues.season}
              selectProps={{
                placeholder: "Season",
                options: SEASONS,
              }}
              label="Season"
            />

            <FormSelect
              control={control}
              name="seasonYear"
              defaultValue={defaultValues.seasonYear}
              selectProps={{
                placeholder: "Year",
                options: seasonYears,
              }}
              label="Year"
            />

            <FormSelect
              control={control}
              name="format"
              defaultValue={defaultValues.format}
              selectProps={{
                placeholder: "format",
                options: FORMATS,
              }}
              label="Format"
            />

            <MobileView renderWithFragment>
              <FormSelect
                control={control}
                name="country"
                defaultValue={defaultValues.country}
                selectProps={{
                  placeholder: "Country",
                  options: COUNTRIES,
                }}
                label="Country"
              />

              <FormSelect
                control={control}
                name="status"
                defaultValue={defaultValues.status}
                selectProps={{
                  placeholder: "Status",
                  options: STATUS,
                }}
                label="Status"
              />
            </MobileView>
          </div>

          <AdvancedSettings
            referenceClassName="hidden md:flex"
            className="space-y-4"
          >
            <div className="flex space-x-4">
              <FormSelect
                control={control}
                name="country"
                defaultValue={defaultValues.country}
                selectProps={{
                  placeholder: "country",
                  options: COUNTRIES,
                }}
                label="Country"
              />

              <FormSelect
                control={control}
                name="status"
                defaultValue={defaultValues.status}
                selectProps={{
                  placeholder: "Status",
                  options: STATUS,
                }}
                label="Status"
              />
            </div>

            <div className="flex items-center">
              <input
                className="appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-gray-600 checked:bg-primary-500 checked:border-primary-500 focus:outline-none transition duration-200 mr-2 cursor-pointer"
                type="checkbox"
                id="adultCheckbox"
                {...register("isAdult")}
              />
              <label
                className="inline-block text-white"
                htmlFor="adultCheckbox"
              >
                18+
              </label>
            </div>
          </AdvancedSettings>
        </div>

        <div className="flex items-end justify-end">
          <Controller
            name="sort"
            control={control}
            defaultValue={defaultQuery.sort}
            render={({ field: { value, onChange } }) => (
              <SortSelector
                type={MediaType.Anime}
                defaultValue={value}
                onChange={onChange}
              />
            )}
          />
        </div>
      </form>

      <div className="mt-8">
        {!isLoading && query ? (
          <React.Fragment>
            <List data={totalData}>{(data: any) => <Card data={data} />}</List>

            {isFetchingNextPage && !isError && (
              <div className="mt-4">
                <ListSkeleton />
              </div>
            )}

            {((totalData.length && !isFetchingNextPage) || hasNextPage) && (
              <InView onInView={handleFetch} />
            )}

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
