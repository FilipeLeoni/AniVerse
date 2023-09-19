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
import { getAnimeById } from "@/mocks/queries";
import { createStudioDetailsUrl, numberWithCommas } from "@/utils";
import { convert, getDescription, getTitle } from "@/utils/data";
import dayjs from "dayjs";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default async function DetailsPage({
  params,
}: {
  params: { mangaId: string };
}) {
  const { data } = await getAnimeById(params.mangaId[0], "MANGA");
  const locale = useLocale();
  const title = getTitle(data?.Media, locale);
  const description = getDescription(data?.Media, locale);

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

      <Section className="relative pb-4 bg-background-900">
        <div className="flex flex-row md:space-x-8">
          <div className="shrink-0 relative md:static md:left-0 md:-translate-x-0 w-[120px] md:w-[186px] -mt-20 space-y-6">
            <PlainCard src={data?.Media?.coverImage?.extraLarge} alt={"Test"} />
          </div>

          <div className="flex flex-col justify-between md:py-4 ml-4 text-left items-start md:-mt-16 space-y-4">
            <div className="flex flex-col items-start space-y-4 md:no-scrollbar">
              <p className="mb-2 text-2xl md:text-3xl font-semibold">{title}</p>

              <DotList>
                {data.Media?.genres.map((genre: any) => (
                  <span key={genre}>{convert(genre, "genre", { locale })}</span>
                ))}
              </DotList>

              <MediaDescription
                description={description}
                containerClassName="mt-4 mb-8 hidden md:block"
                className="text-gray-300 hover:text-gray-100 transition duration-300"
              />

              <div id="mal-sync" className="hidden md:block"></div>
            </div>
            <div className="hidden md:flex gap-x-8 md:gap-x-16 [&>*]:shrink-0">
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
      </Section>

      <Section className="w-full min-h-screen gap-8 mt-2 md:mt-8 space-y-8 md:space-y-0 md:grid md:grid-cols-10 sm:px-12">
        <div className="md:col-span-2 xl:h-[max-content] space-y-4">
          <div className="flex flex-row md:flex-col overflow-x-auto bg-background-900 rounded-md md:p-4 gap-4 [&>*]:shrink-0 md:no-scrollbar">
            <InfoItem
              title={"Format"}
              value={convert(data.Media.format, "format", { locale })}
            />
            <InfoItem title="English" value={data.Media.title.english} />
            <InfoItem title="Native" value={data.Media.title.native} />
            <InfoItem title="Romanji" value={data.Media.title.romaji} />
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

            <InfoItem
              title="Studio"
              value={data.Media.studios.nodes.map((studio: any) => (
                <Link
                  key={studio.id}
                  href={createStudioDetailsUrl(studio)}
                  className="hover:text-primary-300 transition duration-300"
                >
                  <p>{studio.name}</p>
                </Link>
              ))}
            />

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
        </div>
        <div className="space-y-12 md:col-span-8">
          {!!data.Media?.characters?.edges?.length && (
            <DetailsSection
              title={"Characters"}
              className="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
            >
              {data.Media.characters.edges.map(
                (characterEdge: any, index: number) => (
                  <CharacterConnectionCard
                    characterEdge={characterEdge}
                    key={index}
                  />
                )
              )}
            </DetailsSection>
          )}

          {!!data.Media?.relations?.nodes?.length && (
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
          )}
        </div>
      </Section>
    </div>
  );
}
