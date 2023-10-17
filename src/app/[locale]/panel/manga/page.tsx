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
          <p className="line-clamp-5">{title}</p>
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
    Header: "Uploaded Chapters",
    accessor: "chapters",
    Cell: ({ cell }: any) => {
      const originalCell = cell.row.original;

      return (
        <div className="px-6 py-4">
          <p className="line-clamp-5 overflow-hidden">
            {originalCell.totalUploadedEpisodes || 0}/{cell.value || "??"}
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
          <Link href={`/upload/anime/${cell.value}`}>
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

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["MangaAdded"],
    queryFn: async () => {
      const response = await getTrendingMedia("MANGA");
      return response.data.Page;
    },
  });

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
          <h1 className="font-semibold text-2xl">UPLOADED MANGA LIST</h1>
          <Button primary>
            <Link href="/upload/anime/create">Search Manga</Link>
          </Button>
        </div>

        {isLoading ? (
          <Loading />
        ) : data?.media?.length ? (
          <ServerPaginateTable
            data={data.media}
            columns={columns}
            totalCount={data.total}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            onPageIndexChange={handlePageIndexChange}
          />
        ) : (
          <h1 className="text-3xl text-center">
            Você ainda não postou nenhum manga
          </h1>
        )}
      </UploadContainer>
    </div>
  );
};

export default UploadAnimePage;
