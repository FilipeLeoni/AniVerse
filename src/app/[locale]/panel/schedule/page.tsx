"use client";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import List from "@/components/shared/List";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import { useApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import React, { ChangeEvent, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

export default function Schedule() {
  const [query, setQuery] = useState<any>("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const api = useApi();
  const { data, isLoading } = useQuery<any>({
    queryKey: ["getAddedAnimes", debouncedQuery],
    queryFn: async () => {
      if (debouncedQuery.trim() !== "") {
        const response = await api.getSearchResults({
          keyword: debouncedQuery,
        });
        return response.data;
      }
      const response = await api.getUploadedAnimes();
      return response.data;
    },
  });

  console.log(data);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 600);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

  const handleSelectAnime = (data: any) => {
    console.log(data);
  };

  return (
    <div>
      <div>
        <div>Hi, Username</div>

        <h1 className="font-semibold text-4xl">Select Anime</h1>
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
        <div className="cursor-pointer">
          <List data={data} onClick={() => handleSelectAnime(data)}>
            {(data: any) => (
              <Card data={data} redirectUrl={`/panel/schedule/${data.id}`} />
            )}
          </List>
        </div>
      )}
    </div>
  );
}
