// import VACard from "@/components/features/va/VACard";
import Card from "@/components/shared/Card";
import DetailsSection from "@/components/shared/DetailsSection";
// import Head from "@/components/shared/Head";
import List from "@/components/shared/List";
import PlainCard from "@/components/shared/PlainCard";
import Section from "@/components/shared/Section";
import TextIcon from "@/components/shared/TextIcon";

import useConstantTranslation from "@/hooks/useConstantTranslation";
import dayjs from "@/lib/dayjs";
// import { getCharacterDetails } from "@/services/anilist";
import { Character, MediaType } from "@/@types/anilist";

import {
  isFalsy,
  numberWithCommas,
  removeArrayOfObjectDup,
  vietnameseSlug,
} from "@/utils";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import React, { useMemo } from "react";
import { AiFillHeart } from "react-icons/ai";
import { BiCake } from "react-icons/bi";
import { getCharacterDetails } from "@/mocks/queries";
import { useApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";

const KeyValue: React.FC<{ property: string; value: string }> = ({
  property,
  value,
}) => (
  <div>
    <b>{property}: </b>

    <span>{value || "Unclear"}</span>
  </div>
);

interface DetailsPageProps {
  character: Character;
}

export default function DetailsPage({ params }: { params: any }) {
  const api = useApi();

  const characterId = params.params[0];
  // const Character = await api.getCharacterById(params.params[0]);

  const { data: Character, isLoading } = useQuery({
    queryKey: ["getAnimeById", characterId],
    queryFn: async () => {
      const data = await api.getCharacterById(characterId);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  // const { GENDERS } = useConstantTranslation();

  //   const gender = useMemo(
  //     () => GENDERS[Character?.gender?.toLowerCase()] || Character.gender,
  //     [GENDERS, Character.gender]
  //   );

  // const birthday: any = () => {
  //   if (!Character.dateOfBirth) return null;
  //   const dateOfBirth = Character.dateOfBirth;
  //   let date = dayjs();
  //   let format = [];

  //   if (Object.keys(dateOfBirth).every((key) => !dateOfBirth[key])) {
  //     return null;
  //   }

  //   if (!isFalsy(dateOfBirth.day)) {
  //     date = date.date(dateOfBirth.day);
  //     format.push("DD");
  //   }

  //   if (!isFalsy(dateOfBirth.month)) {
  //     date = date.month(dateOfBirth.month - 1);
  //     format.push("MM");
  //   }

  //   if (!isFalsy(dateOfBirth.year)) {
  //     date = date.year(dateOfBirth.year);
  //     format.push("YYYY");
  //   }

  //   return date.format(format.join("/"));
  // };

  //   const isBirthday = useMemo(() => {
  //     const date = dayjs();
  //     const birthday = Character.dateOfBirth;

  //     return date.date() === birthday.day && date.month() === birthday.month - 1;
  //   }, [Character.dateOfBirth]);

  //   const voiceActors = useMemo(() => {
  //     return removeArrayOfObjectDup(
  //       Character.media.edges.flatMap((edge: any) => edge.voiceActors),
  //       "id"
  //     );
  //   }, [Character.media.edges]);

  //   const media = useMemo(() => {
  //     return Character.media.edges.map((edge: any) => edge.node);
  //   }, [Character.media.edges]);

  //   const anime =
  //     () => media.filter((media: any) => media.type === MediaType.Anime),

  //   const manga = useMemo(
  //     () => media.filter((media: any) => media.type === MediaType.Manga),
  //     [media]
  //   );

  // const media = Character?.media?.edges.map((edge: any) => edge.node);

  // const anime: any = () =>
  //   media.filter((media: any) => media.type === MediaType.Anime);
  // const manga: any = () =>
  //   media.filter((media: any) => media.type === MediaType.Manga);

  return (
    <>
      {/* <Head
        title={`${character.name.userPreferred} - Kaguya`}
        image={character.image.large}
      /> */}

      <div className="pb-8">
        <div className="w-full h-[200px] bg-background"></div>

        <Section className="relative z-10 bg-background-900 pb-4 mb-8">
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="shrink-0 relative left-1/2 -translate-x-1/2 md:static md:left-0 md:-translate-x-0 w-[186px] -mt-20 space-y-6">
              <PlainCard src={Character.image} alt={Character.name} />
            </div>

            <div className="space-y-8 text-center md:text-left flex flex-col items-center md:items-start py-4 mt-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <h1 className="text-3xl font-semibold">{Character.name}</h1>

                <TextIcon
                  iconClassName="text-primary-500"
                  LeftIcon={AiFillHeart}
                >
                  <p>{numberWithCommas(Character.favourites)}</p>
                </TextIcon>

                {/* {isBirthday && (
                  <TextIcon iconClassName="text-primary-300" LeftIcon={BiCake}>
                    <p>Birthday</p>
                  </TextIcon>
                )} */}
              </div>

              <div className="space-y-4">
                <KeyValue property={"Gender"} value={Character.gender} />
                <KeyValue
                  property={"Date of birth"}
                  value={Character.dateOfBirth}
                />
                <KeyValue property={"Age"} value={Character.age} />
              </div>
            </div>
          </div>
        </Section>

        <Section className="space-y-8">
          {/* {!!voiceActors?.length && (
            <DetailsSection title={t("voice_actors_section")}>
              <List data={voiceActors}>
                {(voiceActor) => <VACard voiceActor={voiceActor} />}
              </List>
            </DetailsSection>
          )} */}

          {!!Character.animes?.length && (
            <DetailsSection title="Anime">
              <List data={Character.animes}>
                {(anime: any) => <Card data={anime} />}
              </List>
            </DetailsSection>
          )}

          {!!Character.Manga?.length && (
            <DetailsSection title="Manga">
              <List data={Character.Manga}>
                {(manga: any) => <Card data={manga} />}
              </List>
            </DetailsSection>
          )}
        </Section>
      </div>
    </>
  );
}
