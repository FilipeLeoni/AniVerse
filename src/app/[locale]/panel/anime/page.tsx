"use client";

import UploadContainer from "@/components/features/panel/UploadContainer";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import List from "@/components/shared/List";
import Loading from "@/components/shared/Loading";
import { getTrendingMedia, searchData } from "@/mocks/queries";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import Link from "next/link";
import React, { useState } from "react";
import {
  AiOutlineRead,
  AiOutlineSearch,
  AiOutlineVideoCamera,
} from "react-icons/ai";

export default function AnimePanel() {
  const [keyword, setKeyword] = useState("");

  const handleInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value),
    500
  );

  const { data, isLoading } = useQuery<any>({
    queryKey: ["test"],
    queryFn: async () => {
      if (keyword !== "") {
        const response = await searchData(keyword);
        return response.data;
      } else {
        const response = await getTrendingMedia();
        return response.data;
      }
    },
  });

  return (
    <UploadContainer isVerified={true}>
      {/* <Head title="Anime" /> */}
      <h1 className="text-4xl font-semibold mb-8">Anime</h1>
      <React.Fragment>
        <List data={data?.Page.media}>
          {(data: any) => (
            <Card
              data={data}
              redirectUrl={`/panel/anime/edit/${data.id}`}
              isEditCard={true}
              editName="Edit data"
            />
          )}
        </List>

        {/* {((totalData.length && !isFetchingNextPage) || hasNextPage) && (
          <InView onInView={handleFetch} />
        )} */}

        {/* {!hasNextPage && !!totalData.length && (
          <p className="mt-8 text-2xl text-center">
            There is nothing left...
          </p>
        )} */}
      </React.Fragment>
    </UploadContainer>
  );
}
