import { Media, MediaType } from "@/@types/anilist";
import { createMediaDetailsUrl } from "@/utils";
import { convert, getTitle } from "@/utils/data";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import DotList from "./DotList";
import PlainCard from "./PlainCard";
import { useLocale } from "next-intl";

interface HorizontalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Media;
  redirectUrl?: string;
}

const HorizontalCard = ({
  data,
  className,
  redirectUrl = createMediaDetailsUrl(data),
  ...props
}: HorizontalCardProps) => {
  // const { locale } = useRouter();
  const locale = useLocale();

  const title = useMemo(() => getTitle(data, locale), [data, locale]);

  return (
    <div
      className={classNames(
        "flex h-24 items-center space-x-2 py-2 overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="w-12 shrink-0">
        <Link href={redirectUrl}>
          <PlainCard
            src={data?.coverImage?.extraLarge || data.coverImage}
            alt={title}
          />
        </Link>
      </div>

      <div className="space-y-1 self-start">
        <Link href={redirectUrl}>
          <p className="font-semibold text-white transition duration-300 line-clamp-1 hover:text-primary-300">
            {title || data?.title?.romanji || data?.title?.english}
          </p>
        </Link>

        <DotList className="text-sm text-gray-300">
          {data.format && <span>{convert(data.format, "format")}</span>}

          {"season" in data && "seasonYear" in data && data?.season && (
            <span>
              {data && convert(data.season, "season", { locale })}{" "}
              {data.seasonYear}
              {data.season.toUpperCase()}
            </span>
          )}

          {data.status && (
            <span>{convert(data.status, "status", { locale })}</span>
          )}
        </DotList>

        <DotList className="text-sm text-gray-300 line-clamp-1 flex-nowrap">
          {data.genres?.map((genre) => (
            <span key={genre}>{convert(genre, "genre", { locale })}</span>
          ))}
        </DotList>
      </div>
    </div>
  );
};

export default React.memo(HorizontalCard);
