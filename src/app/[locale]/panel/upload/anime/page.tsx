"use client";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import List from "@/components/shared/List";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import { getTrendingMedia, searchData } from "@/mocks/queries";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { ChangeEvent, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

export default function UploadData() {
  const [query, setQuery] = useState<any>("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { data, isLoading } = useQuery<any>({
    queryKey: ["AddAnime", debouncedQuery],
    queryFn: async () => {
      if (debouncedQuery.trim() !== "") {
        const response = await searchData(debouncedQuery);
        return response.data;
      }
      const trendingResponse = await getTrendingMedia();
      return trendingResponse.data;
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

  return (
    <div>
      <div>
        <div>Hi, Username</div>
        <h1 className="font-semibold text-4xl">Add Anime</h1>
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
        <Link href={"/panel/upload/anime/create"}>
          <Button primary>Add Data Manually</Button>
        </Link>
      </div>
      {isLoading ? (
        <div className="mt-4">
          <ListSkeleton />
        </div>
      ) : (
        <List data={data?.Page.media}>
          {(data: any) => (
            <Card data={data} redirectUrl={`/panel/upload/anime/${data.id}`} />
          )}
        </List>
      )}
    </div>
  );
}
