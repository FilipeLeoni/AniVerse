import Description from "@/components/shared/Description";
import DotList from "@/components/shared/DotList";
import InfoItem from "@/components/shared/InfoItem";
import PlainCard from "@/components/shared/PlainCard";
import TextIcon from "@/components/shared/TextIcon";
import { numberWithCommas } from "@/utils";
import { getTitle, getDescription, convert } from "@/utils/data";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { AiFillHeart } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";
import { useLocale } from "use-intl";

interface MediaDetailsProps {
  media: any;
}

const MediaDetails: React.FC<MediaDetailsProps> = ({ media }) => {
  const locale = useLocale();

  const title = useMemo(() => getTitle(media, locale), [media, locale]);
  const description = useMemo(
    () => getDescription(media, locale),
    [media, locale]
  );

  return (
    <div className="p-8 bg-background-900 text-center md:text-left flex flex-col md:flex-row items-start gap-4">
      {media && (
        <>
          <div className="w-[183px] shrink-0 mx-auto md:mx-0">
            <PlainCard src={media?.coverImage?.extraLarge} alt={title} />
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">{media.title.english}</h1>

            <p className="text-gray-300">{media.title.native}</p>

            <div className="flex flex-wrap items-center text-lg gap-x-8">
              {media.averageScore && (
                <TextIcon LeftIcon={MdTagFaces} iconClassName="text-green-300">
                  <p>{media.averageScore}%</p>
                </TextIcon>
              )}

              <TextIcon LeftIcon={AiFillHeart} iconClassName="text-red-400">
                <p>{numberWithCommas(media.favourites)}</p>
              </TextIcon>

              <DotList>
                {media.genres.map((genre: any) => (
                  <span key={genre}>{convert(genre, "genre")}</span>
                ))}
              </DotList>
            </div>

            <Description description={description} className="text-gray-300" />
          </div>
        </>
      )}
    </div>
  );
};

export default MediaDetails;
