"use client";
import AnimeSchedule from "@/components/features/schedule/animeSchedule";
import MangaSchedule from "@/components/features/schedule/mangaSchedule";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import List from "@/components/shared/List";
import Select from "@/components/shared/Select";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import { useApi } from "@/hooks/useApi";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

const components: any = {
  anime: AnimeSchedule,
  manga: MangaSchedule,
};

const typeSelectStyles = {
  control: (provided: any) => {
    return {
      ...provided,
      backgroundColor: "#1a1a1a",
      border: 0,
      boxShadow: "none",
      padding: "0.25rem",
    };
  },
  singleValue: (provided: any) => {
    return {
      ...provided,
      fontSize: "2.25rem",
      lineHeight: "2.5rem",
      color: "white",
      fontWeight: 600,
    };
  },
  placeholder: (provided: any) => {
    return {
      ...provided,
      fontSize: "2.25rem",
      lineHeight: "2.5rem",
      color: "white",
      fontWeight: 600,
    };
  },
};

export default function Schedule() {
  const [query, setQuery] = useState<any>("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { MEDIATYPES } = useConstantTranslation();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const searchType = searchParams ? searchParams.get("type") : null;
  let type: any = searchType || "anime";

  const api = useApi();
  const { data, isLoading } = useQuery<any>({
    queryKey: ["getAddedAnimes", debouncedQuery, type],
    queryFn: async () => {
      if (debouncedQuery.trim() !== "" && type === "anime") {
        const response = await api.getSearchResults({
          keyword: debouncedQuery,
        });
        return response.data;
      }
      if (debouncedQuery.trim() !== "" && type === "manga") {
        const response = await api.getMangaSearch({
          keyword: debouncedQuery,
        });
        return response.data;
      }
      if (type === "anime") {
        const response = await api.getUploadedAnimes();
        return response.data;
      } else {
        const response: any = await api.getUploadedManga();
        return response.data;
      }
    },
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 600);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

  const handleTypeChange = (type: (typeof MEDIATYPES)[number]) => {
    const truthyQuery: any = {};

    Object.keys(query).forEach((key) => {
      if (!query[key]) return;

      truthyQuery[key] = query[key];
    });

    replace(`/panel/schedule?type=${type.value}`);
  };
  const handleSelectAnime = (data: any) => {
    console.log(data);
  };
  const chosenType = useMemo(
    () => MEDIATYPES?.find((t: any) => t.value === type),
    [MEDIATYPES, type]
  );
  const BrowseComponent = useMemo(() => components[type], [type]);

  return (
    <div>
      <div>
        <div>Hi, Username</div>

        <div className="mb-8 flex items-center space-x-2">
          <h1 className="text-4xl font-semibold text-center md:text-left">
            Search
          </h1>

          <Select
            value={{ value: type, label: chosenType?.label }}
            options={MEDIATYPES}
            isClearable={false}
            isSearchable={false}
            components={{ IndicatorSeparator: () => null }}
            onChange={handleTypeChange}
            styles={typeSelectStyles}
          />
        </div>
      </div>
      <div>
        <div></div>
      </div>
      <div className="flex gap-4 items-center mt-8 justify-between">
        <Input
          containerInputClassName="border border-white/80"
          LeftIcon={AiOutlineSearch}
          label={"Search"}
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
          containerClassName="w-full md:w-1/3 mb-8"
        />
      </div>
      {isLoading ? (
        <div className="mt-4">
          <ListSkeleton />
        </div>
      ) : (
        <BrowseComponent defaultQuery={data} />

        // <div className="cursor-pointer">
        //   <List data={data} onClick={() => handleSelectAnime(data)}>
        //     {(data: any) => (
        //       <Card
        //         data={data}
        //         redirectUrl={`/panel/schedule/anime/${data.id}`}
        //       />
        //     )}
        //   </List>
        // </div>
      )}
    </div>
  );
}
