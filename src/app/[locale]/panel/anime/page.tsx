"use client";

import React from "react";
import UploadContainer from "@/components/features/upload/UploadContainer";
// import UploadLayout from "@/components/layouts/UploadLayout";
import CircleButton from "@/components/shared/CircleButton";
import Description from "@/components/shared/Description";
import Loading from "@/components/shared/Loading";
import PlainCard from "@/components/shared/PlainCard";
// import withAdditionalUser from "@/hocs/withAdditionalUser";
// import useUploadedMedia, {
//   getUploadedMedia,
//   MediaWithMediaUnit,
// } from "@/hooks/useUploadedMedia";
import { getTitle } from "@/utils/data";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { Column } from "react-table";
import Button from "@/components/shared/Button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTrendingMedia } from "@/mocks/queries";
import ServerPaginateTable from "@/components/shared/ServerPaginateTable";
import { useApi } from "@/hooks/useApi";

interface UploadAnimePageProps {
  user: any;
  sourceId: string;
}

const columns: Column<any>[] = [
  {
    Header: "Image",
    Cell: ({ cell }: any) => {
      const originalCell = cell.row.original;
      const title = getTitle(originalCell);

      return (
        <div className="p-2">
          <PlainCard src={originalCell.coverImage.extraLarge} alt={title} />
        </div>
      );
    },
    accessor: "coverImage",
  },
  {
    Header: "Title",
    Cell: ({ cell }: any) => {
      const originalCell = cell.row.original;

      const title = getTitle(originalCell);

      return (
        <div className="px-6 py-4">
          <p className="line-clamp-5">{title || originalCell.title.english}</p>
        </div>
      );
    },
    accessor: "title",
  },
  {
    Header: "Description",
    accessor: "description",
    Cell: ({ cell }: any) => {
      return (
        <div className="px-6 py-4">
          <Description
            className="line-clamp-5 overflow-hidden text-white"
            description={cell.value}
          />
        </div>
      );
    },
  },
  {
    Header: "Uploaded Episodes",
    accessor: "episodes",
    Cell: ({ cell }: any) => {
      const originalCell = cell.row.original;

      return (
        <div className="px-6 py-4">
          <p className="line-clamp-5 overflow-hidden">
            {originalCell.totalUploadedEpisodes || 0}/
            {originalCell.totalEpisodes || "??"}
          </p>
        </div>
      );
    },
  },
  {
    Header: "Action",
    Cell: ({ cell }: any) => {
      return (
        <div className="w-full flex items-center justify-center">
          <Link href={`/panel/anime/episodes/${cell.value}`}>
            <CircleButton secondary LeftIcon={AiOutlineEdit} />
          </Link>
        </div>
      );
    },
    accessor: "id",
  },
];

const UploadAnimePage = ({ user, sourceId }: any) => {
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const api = useApi();

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["AnimeAddeds", pageIndex, pageSize],
    queryFn: async () => {
      const response: any = await api.getUploadedAnimes(
        pageIndex + 1,
        pageSize
      );
      console.log(response);
      return response;
    },
  });

  console.log(pageIndex);

  async function searchData() {
    try {
      const response = await fetch("http://localhost:8000/anime", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro na solicitação: " + response.status);
      }

      const data = await response.json();
      console.log(data);

      return data;
    } catch (error) {
      console.error("Erro na solicitação:", error);
      throw error; // Rejeita a promessa para que o erro possa ser tratado mais adiante
    }
  }

  console.log(data);

  // const { data, isLoading } = useQuery<any>({
  //   queryKey: ["test"],
  //   queryFn: async () => {
  //     if (keyword !== "") {
  //       const response = await searchData(keyword);
  //       return response.data;
  //     } else {
  //       const response = await getTrendingMedia();
  //       return response.data;
  //     }
  //   },
  // });

  // useEffect(() => {
  //   const options = {
  //     type: MediaType.Anime,
  //     page: pageIndex + 2,
  //     perPage: pageSize,
  //     sourceId,
  //   };

  //   queryClient.prefetchQuery(["uploaded-media", { options }], () =>
  //     getUploadedMedia(options)
  //   );
  // }, [pageIndex, pageSize, queryClient, sourceId]);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handlePageIndexChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  return (
    <div className="pt-40">
      <UploadContainer isVerified={true} className="relative">
        <div className="flex justify-between mb-5">
          <h1 className="font-semibold text-2xl">UPLOADED ANIME LIST</h1>
          <Button primary onClick={searchData}>
            search Anime
            {/* <Link href="/upload/anime/create">Search Anime</Link> */}
          </Button>
        </div>

        {isLoading ? (
          <Loading />
        ) : data?.data.length ? (
          <ServerPaginateTable
            data={data.data}
            columns={columns}
            totalCount={data.total}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            onPageIndexChange={handlePageIndexChange}
          />
        ) : (
          <h1 className="text-3xl text-center">
            You haven&apos;t posted any anime yet
          </h1>
        )}
      </UploadContainer>
    </div>
  );
};

export default UploadAnimePage;
