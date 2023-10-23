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
    Header: "Uploaded Chapters",
    accessor: "chapters",
    Cell: ({ cell }: any) => {
      const originalCell = cell.row.original;

      return (
        <div className="px-6 py-4">
          <p className="line-clamp-5 overflow-hidden">
            {originalCell.totalUploadedEpisodes || 0}/
            {originalCell.totalChapters || "??"}
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
          <Link href={`/upload/manga/${cell.value}`}>
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

  const { data, isLoading } = useQuery({
    queryKey: ["MangaAdded"],
    queryFn: async () => {
      const response = await api.getUploadedManga(pageIndex + 1, pageSize);
      console.log(response);
      return response;
    },
  });

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handlePageIndexChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  return (
    <UploadContainer isVerified={true} className="relative">
      <div className="flex justify-between mb-5">
        <h1 className="font-semibold text-2xl">UPLOADED MANGA LIST</h1>
        <Button primary>
          <Link href="/panel/manga/chapters">Search Manga</Link>
        </Button>
      </div>

      {isLoading ? (
        <Loading />
      ) : data?.data?.length ? (
        <ServerPaginateTable
          data={data.data}
          columns={columns}
          totalCount={data.data.total}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          onPageIndexChange={handlePageIndexChange}
        />
      ) : (
        <h1 className="text-3xl text-center">
          You haven&apos;t uploaded any manga yet
        </h1>
      )}
    </UploadContainer>
  );
};

export default UploadAnimePage;
