"use client";

import DotList from "@/components/shared/DotList";
import Image from "@/components/shared/Image";
import TextIcon from "@/components/shared/TextIcon";
import { Media } from "@/@types/anilist";
import {
  createMediaDetailsUrl,
  isColorVisible,
  numberWithCommas,
} from "@/utils";
import { convert, getDescription, getTitle } from "@/utils/data";
import { Options } from "@popperjs/core";
import classNames from "classnames";
import Link from "next/link";
import React, { useMemo } from "react";
import { AiFillHeart } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";

import { useLocale } from "next-intl";
import Popup from "@/components/shared/Popup";
import Description from "@/components/shared/Description";
import Button from "@/components/shared/Button";

interface CardProps {
  data: Media;
  className?: string;
  containerEndSlot?: React.ReactNode;
  imageEndSlot?: React.ReactNode;
  redirectUrl?: string;
  isEditCard?: boolean;
  editName?: string;
}

const popupOptions: Partial<Options> = {
  strategy: "absolute",

  modifiers: [
    {
      name: "sameWidth",
      enabled: true,
      fn: ({ state }) => {
        state.styles.popper.height = `${state.rects.reference.height}px`;
        state.styles.popper.width = `${state.rects.reference.width * 3}px`;
      },
      phase: "beforeWrite",
      requires: ["computeStyles"],
      effect({ state }) {
        const { width, height } =
          state.elements.reference.getBoundingClientRect();

        state.elements.popper.style.width = `${width * 3}px`;

        state.elements.popper.style.height = `${height}px`;
      },
    },
  ],
};

const Card: React.FC<any> = (props) => {
  const {
    handleRemoveAnime,
    data,
    className,
    imageEndSlot,
    redirectUrl = createMediaDetailsUrl(data),
    isEditCard = false,
    editName,
  } = props;

  const locale = useLocale();

  const primaryColor = useMemo(
    () =>
      data.coverImage?.color && isColorVisible(data.coverImage.color, "#3a3939")
        ? data.coverImage.color
        : "white",
    [data]
  );
  // const title = useMemo(
  //   () => getTitle(data.title, locale),
  //   [data.title, locale]
  // );

  const title = data?.title?.english;

  const description = useMemo(
    () => getDescription(data, locale),
    [data, locale]
  );

  return (
    <Popup
      reference={
        <React.Fragment>
          <div
            className={classNames(
              "relative aspect-w-2 aspect-h-3 group",
              className
            )}
          >
            <Image
              src={data?.coverImage.extraLarge as string}
              fill
              className="rounded-sm object-cover"
              alt={title}
            />
            {imageEndSlot}

            <div className=" bg-black/50 w-fit h-fit absolute hidden group-hover:flex justify-center items-center">
              <Button primary onClick={() => handleRemoveAnime(data)}>
                Remove
              </Button>
            </div>
          </div>

          {data.type && className === "relations" && (
            <p className="italic text-gray-200 font-light text-sm mt-2 ">
              {data.type}
            </p>
          )}
          <p
            className="text-base font-semibold line-clamp-2"
            style={{ color: primaryColor }}
          >
            {title}
          </p>
        </React.Fragment>
      }
      options={popupOptions}
      offset={[0, 10]}
      className="z-10 relative p-4 rounded-md shadow-[rgba(0,0,0,0.25)_0px_54px_55px,rgba(0,0,0,0.12)_0px_-12px_30px,rgba(0,0,0,0.12)_0px_4px_6px,rgba(0,0,0,0.17)_0px_12px_13px,rgba(0,0,0,0.09)_0px_-3px_5px]"
    >
      <Image
        src={data.bannerImage || (data.coverImage?.extraLarge as string)}
        fill
        className="rounded-sm shadow-2xl object-cover"
        alt={title}
      />

      <div className="absolute inset-0 bg-black/70"></div>

      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <p
          className="text-2xl mb-3 font-semibold line-clamp-1"
          style={{ color: primaryColor }}
        >
          {title}
        </p>

        <Description
          description={description}
          className="text-gray-300 hover:text-gray-100 transition duration-300 line-clamp-3 mb-2"
        />

        <DotList className="mb-2">
          {data.genres?.map((genre: any) => (
            <span
              className="text-sm font-semibold"
              style={{
                color: primaryColor,
              }}
              key={genre}
            >
              {convert(genre, "genre", { locale: locale })}
            </span>
          ))}
        </DotList>

        <div className="relative z-50 flex items-center space-x-2">
          {data.averageScore && (
            <TextIcon LeftIcon={MdTagFaces} iconClassName="text-green-300">
              <p>{data.averageScore}%</p>
            </TextIcon>
          )}

          <TextIcon LeftIcon={AiFillHeart} iconClassName="text-red-400">
            <p>{numberWithCommas(data.favourites)}</p>
          </TextIcon>
        </div>
      </div>
    </Popup>
  );
};

export default React.memo(Card) as typeof Card;
