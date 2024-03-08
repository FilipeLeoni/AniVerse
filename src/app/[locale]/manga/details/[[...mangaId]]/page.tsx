"use client";

import AddToListDropdown from "@/components/shared/AddToListDropdown";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import CharacterConnectionCard from "@/components/shared/CharacterConnectionCard";
import DetailsBanner from "@/components/shared/DetailsBanner";
import DetailsSection from "@/components/shared/DetailsSection";
import DotList from "@/components/shared/DotList";
import InfoItem from "@/components/shared/InfoItem";
import List from "@/components/shared/List";
import MediaDescription from "@/components/shared/MediaDescription";
import PlainCard from "@/components/shared/PlainCard";
import Section from "@/components/shared/Section";
import { useApi } from "@/hooks/useApi";
import { getAnimeById } from "@/mocks/queries";
import { createStudioDetailsUrl, numberWithCommas } from "@/utils";
import { convert, getDescription, getTitle } from "@/utils/data";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { BsFillPlayFill, BsPlusCircleFill } from "react-icons/bs";

export default function DetailsPage({
  params,
}: {
  params: { mangaId: string };
}) {
  const mangaId = params.mangaId[0];
  const api = useApi();
  // const { data } = await api.getMangaMediaByIds(params.mangaId[0], "MANGA");
  const locale = useLocale();
  // const title = getTitle(data?.Media, locale);
  // const description = getDescription(data?.Media, locale);

  const { data: media, isLoading } = useQuery({
    queryKey: ["getMangaById", mangaId],
    queryFn: async () => {
      const media = await api.getMangaById(mangaId);
      return media;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const data = {
    Media: media,
  };

  const nextAiringSchedule = data.Media?.airingSchedule?.nodes
    ?.sort((a: any, b: any) => a.episode - b.episode)
    .find((schedule: any) => dayjs.unix(schedule.airingAt).isAfter(dayjs()));

  const nextAiringScheduleTime = () => {
    if (!nextAiringSchedule?.airingAt) return null;

    return dayjs.unix(nextAiringSchedule.airingAt).locale(locale).fromNow();
  };

  return (
    <div className="pb-8">
      <DetailsBanner image={data.Media?.bannerImage} />

      <Section className="relative pb-4 bg-background-900 px-4 md:px-12 lg:px-20 xl:px-28 w-full h-auto">
        <div className="flex flex-row md:space-x-8">
          <div className="shrink-0 relative md:static md:left-0 md:-translate-x-0 w-[120px] md:w-[186px] mt-4 md:-mt-12 space-y-6">
            <PlainCard src={data?.Media?.coverImage?.extraLarge} alt={"Test"} />
            {/* <Button
              primary
              className="gap-4 w-full justify-center md:flex hidden"
            >
              <BsPlusCircleFill size={22} />
              Add to list
            </Button> */}

            <AddToListDropdown mediaId={2} type="MANGA" />
          </div>

          <div className="flex flex-col justify-between md:py-4 ml-4 text-left items-start md:-mt-16 space-y-4">
            <Button primary className="gap-4 md:flex hidden">
              <BsFillPlayFill size={24} />
              Read now
            </Button>
            <div className="flex flex-col items-start space-y-4 md:no-scrollbar md:py-4">
              <p className="text-2xl md:text-3xl font-semibold max-w-full">
                {data?.Media?.title?.english}
              </p>

              <DotList>
                {data.Media?.genres.map((genre: any) => (
                  <span key={genre}>{convert(genre, "genre", { locale })}</span>
                ))}
              </DotList>

              <MediaDescription
                description={data?.Media?.description}
                containerClassName="hidden md:block"
                className="text-gray-300 hover:text-gray-100 transition duration-300"
              />

              <div id="mal-sync" className="hidden md:block"></div>
            </div>
            <div className="hidden md:flex gap-x-8 md:gap-x-16 [&>*]:shrink-0 ">
              <InfoItem
                title={"Country"}
                value={convert(data.Media.countryOfOrigin, "country", {
                  locale,
                })}
              />
              <InfoItem title={"Total Episodes"} value={data.Media.episodes} />

              {data.Media?.duration && (
                <InfoItem
                  title={"Duration"}
                  value={`${data.Media.duration} ${"Minutes"}`}
                />
              )}

              <InfoItem
                title={"Status"}
                value={convert(data.Media.status, "status", { locale })}
              />

              {nextAiringSchedule && (
                <InfoItem
                  className="!text-primary-300"
                  title={"Next Airing Schedule"}
                  value={`Episodes ${nextAiringSchedule.episode}: ${nextAiringScheduleTime}`}
                />
              )}
            </div>
          </div>
        </div>
        <MediaDescription
          description={data?.Media?.description}
          containerClassName="mt-4 mb-8 md:hidden block"
          className="text-gray-300 hover:text-gray-100 transition duration-300"
        />

        <div className="flex gap-2 mt-2">
          <Button
            primary
            className="gap-4 w-full justify-center flex md:hidden"
          >
            <BsPlusCircleFill size={22} />
            Add to list
          </Button>
          <Button primary className="flex md:hidden bg-transparent text-white">
            <BsFillPlayFill size={24} />
          </Button>
        </div>
      </Section>

      <Section className="w-full min-h-screen gap-8 mt-2 md:mt-8 space-y-8 md:space-y-0 md:grid md:grid-cols-10 sm:px-12">
        <div className="md:col-span-2 xl:h-[max-content] space-y-4">
          <div className="flex md:hidden px-4 flex-row md:flex-col overflow-x-auto bg-background-900 rounded-md md:p-4 gap-4 [&>*]:shrink-0 md:no-scrollbar py-4">
            <InfoItem
              title={"Country"}
              value={convert(data.Media.countryOfOrigin, "country", {
                locale,
              })}
            />
            <InfoItem title={"Total Episodes"} value={data.Media.episodes} />

            {data.Media.duration && (
              <InfoItem
                title={"Duration"}
                value={`${data.Media.duration} ${"Minutes"}`}
              />
            )}

            <InfoItem
              title={"Status"}
              value={convert(data.Media.status, "status", { locale })}
            />
          </div>
          <div className="flex flex-row md:flex-col overflow-x-auto bg-background-900 py-5 px-4 rounded-md md:p-4 gap-4 [&>*]:shrink-0 md:no-scrollbar">
            <InfoItem
              title={"Format"}
              value={convert(data.Media.format, "format", { locale })}
            />
            <InfoItem title="English" value={data.Media.title?.english} />
            <InfoItem title="Native" value={data.Media.title?.native} />
            <InfoItem title="Romanji" value={data.Media.title?.romanji} />
            <InfoItem
              title={"Popular"}
              value={numberWithCommas(data.Media.popularity)}
            />
            <InfoItem
              title={"Favourite"}
              value={numberWithCommas(data.Media.favourites)}
            />
            <InfoItem
              title={"Trending"}
              value={numberWithCommas(data.Media.trending)}
            />

            {/* <InfoItem
              title="Studio"
              value={data?.Media?.studios.map((studio: any) => (
                <Link
                  key={studio.id}
                  href={createStudioDetailsUrl(studio)}
                  className="hover:text-primary-300 transition duration-300"
                >
                  <p>{studio.name}</p>
                </Link>
              ))}
            /> */}

            <InfoItem
              title={"Season"}
              value={`${convert(data.Media.season, "season", { locale })} ${
                data.Media.seasonYear
              }`}
            />
            <InfoItem
              title={"Synonimus"}
              value={data.Media.synonyms.map((synomym: any) => (
                <div key={synomym} className="-mb-2">
                  <p>{synomym}</p>
                </div>
              ))}
            />
          </div>
          <div className="space-y-2 text-gray-400">
            <h1 className="font-semibold">Tags</h1>

            <ul className="overflow-x-auto flex flex-row md:flex-col gap-2 [&>*]:shrink-0 md:no-scrollbar">
              {data.Media.tags.map((tag: any) => (
                <Link
                  href={{
                    pathname: "/browse",
                    query: { type: "anime", tags: tag.name },
                  }}
                  key={tag.id}
                  className="md:block"
                >
                  <li className="p-2 rounded-md bg-background-900 hover:text-primary-300 transition duration-300">
                    {tag.name}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>
        <div className="space-y-12 md:col-span-8">
          {!!data.Media?.characters?.length && (
            <DetailsSection
              title={"Characters"}
              className="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
            >
              {data.Media.characters.map(
                (characterEdge: any, index: number) => (
                  <CharacterConnectionCard
                    characterEdge={characterEdge}
                    key={index}
                  />
                )
              )}
            </DetailsSection>
          )}

          {/* {!!data.Media?.relations?.length && (
            <DetailsSection title={"Relations"}>
              <List data={data.Media.relations.nodes}>
                {(node: any) => <Card data={node} className="relations" />}
              </List>
            </DetailsSection>
          )}

          {!!data.Media?.recommendations?.nodes?.length && (
            <DetailsSection title={"Recomendations"}>
              <List data={data.Media.recommendations.nodes}>
                {(node: any) => <Card data={node.mediaRecommendation} />}
              </List>
            </DetailsSection>
          )} */}
        </div>
      </Section>
    </div>
  );
}
