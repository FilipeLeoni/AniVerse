"use client";

import React, { useEffect, useState } from "react";
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
import { getAnimeById } from "@/mocks/queries";
import {
  createStudioDetailsUrl,
  formatTimeDifference,
  numberWithCommas,
} from "@/utils";
import { convert, getDescription, getTitle } from "@/utils/data";
import { useLocale } from "next-intl";
import { BsFillPlayFill, BsPlusCircleFill } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/router";
import dayjs from "@/lib/dayjs";
import AiringCountDown from "@/components/shared/AiringCountDown";
import Input from "@/components/shared/Input";
import { useQuery } from "@tanstack/react-query";
import CharacterAddCard from "@/components/features/panel/CharacterAddCard";
import CharacterConnectionRemoveCard from "@/components/features/panel/CharacterConnectionRemove";
import Modal from "@/components/features/panel/CharacterModal";
import AddDataModal from "@/components/features/panel/CharacterModal";
import AddRemoveItem from "@/components/features/panel/AddRemoveItem";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";

export default function UploadPage({
  params,
}: {
  params: { params: string[] };
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>();
  const [character, setCharacter] = useState<any>(null);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [studios, setStudios] = useState<any[]>([]);
  const [synonimus, setSynonimus] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  const { data, isLoading } = useQuery<any>({
    queryKey: ["AnimeById"],
    queryFn: async () => {
      const response = await getAnimeById(params.params[0], "ANIME");
      return response.data;
    },
  });
  const locale = useLocale();

  useEffect(() => {
    if (data?.Media?.studios?.nodes) {
      setStudios(data.Media.studios.nodes);
    }
    if (data?.Media?.synonyms) {
      setSynonimus(data.Media.synonyms);
    }
    if (data?.Media?.tags) {
      setTags(data.Media.tags);
    }
  }, [data?.Media]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const title = getTitle(data?.Media, locale);
  const description = getDescription(data?.Media, locale);

  const transformCharactersData = (characters: any) => {
    return characters.map((character: any) => ({
      name: character.node.name.userPreferred,
      image: character.node.image.large,
      description: character.node.description,
      gender: character.node.gender,
      age: Number(character.node.age),
      dateOfBirth: `${character.node.dateOfBirth.year}-${character.node.dateOfBirth.month}-${character.node.dateOfBirth.day}`,
      role: character.role,
    }));
  };

  const onSubmit: SubmitHandler<any> = async (test) => {
    const episodes = parseInt(test.episodes, 10);
    const duration = parseInt(test.duration, 10);
    const popularity = parseInt(test.popularity, 10);
    const favourites = parseInt(test.favourites, 10);
    const trending = parseInt(test.trending, 10);
    const transformedCharacters = transformCharactersData(
      data.Media.characters.edges
    );
    console.log(episodes);
    console.log(test);

    // console.log(episodes);
    // console.log(transformedCharacters);

    // Crie um objeto com todas as propriedades que deseja enviar
    const requestBody = {
      title: {
        romaji: test.romaji,
        english: test.english,
        native: test.native,
      },
      bannerImage: data.Media.bannerImage,
      coverImage: data.Media.coverImage.extraLarge,
      episodes: episodes,
      duration: duration,
      popularity: popularity,
      favourites: favourites,
      trending: trending,
      status: test.status,
      format: test.format,
      season: test.season,
      characters: transformedCharacters,
      // ...test,
    };

    console.log(requestBody);
    // Enviar a solicitação usando o objeto como corpo
    const response = await fetch("http://localhost:8000/anime", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    console.log(response);
  };

  // console.log(data?.Media?.characters.edges);

  const nextAiringSchedule = data.Media?.airingSchedule?.nodes
    ?.sort((a: any, b: any) => a.episode - b.episode)
    .find((schedule: any) => dayjs.unix(schedule.airingAt).isAfter(dayjs()));

  return (
    <div className="pb-8 relative">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative group transition-all">
          <DetailsBanner image={data.Media.bannerImage} />
          <div className="absolute top-0 left-0 opacity-0 group-hover:opacity-100  flex justify-center items-center w-full bg-black/40 h-full cursor-pointer transition-all font-semibold text-xl">
            Edit banner image
          </div>
        </div>
        <Section className="relative pb-4 bg-background-900 px-4 md:px-12 lg:px-20 xl:px-28 w-full h-auto">
          <div className="flex flex-row md:space-x-8">
            <div className="shrink-0 relative md:static md:left-0 md:-translate-x-0 w-[120px] md:w-[186px] mt-4 md:-mt-12 space-y-6 ">
              <div className="relative group">
                <PlainCard
                  src={data.Media.coverImage.extraLarge}
                  alt={"Test"}
                />
                <div className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 flex justify-center items-center w-full bg-black/40 h-full cursor-pointer transition-all font-semibold text-lg">
                  Edit Cover Image
                </div>
              </div>
              <Button
                primary
                className="gap-4 w-full justify-center md:flex hidden"
              >
                <BsPlusCircleFill size={22} />
                Add to Home
              </Button>
            </div>

            <div className="flex flex-col md:justify-between md:py-4 ml-4 text-left items-start md:-mt-16 space-y-0 md:space-y-4 w-full">
              <div className="flex flex-col items-start space-y-4 pt-20 md:pb-4 w-full">
                <Input
                  label={"Title"}
                  defaultValue={title}
                  // {...register("te", { required: true })}
                  containerClassName="w-full md:w-1/3 mb-8 text-gray-400"
                  className="px-4 py-1 text-white text-3xl focus:ring-2 focus:ring-primary-500 rounded-sm"
                />
                {/* <div className="flex flex-col h-auto">
                <div className="flex gap-2 items-end">
                  <Input
                    type="text"
                    label={"Genres"}
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    containerClassName="w-full text-gray-400 "
                    className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                  />
                  <Button primary onClick={handleAddStudio}>
                    Adicionar
                  </Button>
                </div>
                <div className="overflow-ellipsis line-clamp-1 pb-10 flex mt-3">
                  <ul className="flex gap-2">
                    {genres?.map((genre, index) => (
                      <li
                        key={index}
                        className="bg-neutral-800 rounded flex gap-2 pl-2"
                      >
                        {genre}
                        <button
                          onClick={() => handleRemoveGenre(index)}
                          className="hover:bg-primary-900 px-2 rounded hover:text-primary-300"
                        >
                          x
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div> */}
                <div className="w-full">
                  <h2 className="font-bold text-gray-400">Description</h2>
                  <textarea
                    className="bg-neutral-800 w-full h-full p-4 rounded-md mt-3 focus:ring-2 focus:ring-primary-500 outline-none"
                    rows={7}
                    {...register("description")}
                  >
                    {description}
                  </textarea>
                </div>
                <div id="mal-sync" className="hidden md:block"></div>
              </div>

              <div className="hidden md:flex gap-x-8 md:gap-x-16 [&>*]:shrink-0 flex-wrap">
                <Input
                  containerInputClassName="focus:border border-white/80"
                  label={"Country"}
                  defaultValue={convert(data.Media.countryOfOrigin, "country", {
                    locale,
                  })}
                  // onChange={(e) => setQuery(e.target)}
                  containerClassName="w-full md:w-1/3 mb-8 text-gray-400 "
                  className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                  {...register("countryOfOrigin")}
                />
                {/* <InfoItem title={"Total Episodes"} value={data.Media.episodes} /> */}

                <Input
                  containerInputClassName="focus:border border-white/80"
                  label={"Total Episodes"}
                  defaultValue={parseInt(data.Media.episodes)}
                  // onChange={(e) => setQuery(e.target)}
                  containerClassName="w-full md:w-1/3 mb-8 text-gray-400 "
                  className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                  {...register("episodes")}
                />

                {data.Media.duration && (
                  // <InfoItem
                  //   title={"Duration"}
                  //   value={`${data.Media.duration} ${"Minutes"}`}
                  // />

                  <Input
                    containerInputClassName="focus:border border-white/80"
                    label={"Duration"}
                    defaultValue={parseInt(data.Media.duration)}
                    // onChange={(e) => setQuery(e.target)}
                    containerClassName="w-full md:w-1/3 mb-8 text-gray-400 "
                    className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                    {...register("duration")}
                  />
                )}

                {/* <InfoItem
                title={"Status"}
                value={convert(data.Media.status, "status", { locale })}
              /> */}

                <Input
                  containerInputClassName="focus:border border-white/80"
                  label={"Status"}
                  defaultValue={convert(data.Media.status, "status", {
                    locale,
                  })}
                  // onChange={(e) => setQuery(e.target)}
                  containerClassName="w-full md:w-1/3 mb-8 text-gray-400 "
                  className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                  {...register("status")}
                />

                {/* {nextAiringSchedule && (
                // <AiringCountDown
                //   airingAt={nextAiringSchedule.airingAt}
                //   episode={nextAiringSchedule.episode}
                // />

                <Input
                  containerInputClassName="focus:border border-white/80"
                  label={"nextAiringSchedule"}
                  value={nextAiringSchedule.airingAt}
                  // onChange={(e) => setQuery(e.target)}
                  containerClassName="w-full md:w-1/3 mb-8 text-gray-400 "
                  className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                />
              )} */}
              </div>
            </div>
          </div>
          <MediaDescription
            description={description}
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
            <Button
              primary
              className="flex md:hidden bg-transparent text-white"
            >
              <BsFillPlayFill size={24} />
            </Button>
          </div>
        </Section>

        <Section className="w-full min-h-screen gap-8 mt-2 md:mt-8 space-y-8 md:space-y-0 md:grid md:grid-cols-10 sm:px-12">
          <div className="md:col-span-2 xl:h-[max-content] space-y-4">
            <div className="flex md:hidden flex-row md:flex-col overflow-x-auto bg-background-900 rounded-md md:p-4 gap-4 [&>*]:shrink-0 md:no-scrollbar py-4">
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

              {nextAiringSchedule && (
                <AiringCountDown
                  airingAt={nextAiringSchedule.airingAt}
                  episode={nextAiringSchedule.episode}
                />
              )}
            </div>

            <div className="flex flex-row md:flex-col overflow-x-auto bg-background-900 rounded-md py-5 md:p-4 gap-4 [&>*]:shrink-0 md:no-scrollbar w-full">
              <Input
                containerInputClassName="focus:border border-white/80 w-full"
                label={"Format"}
                defaultValue={convert(data.Media.format, "format", { locale })}
                containerClassName="w-full text-gray-400"
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("format")}
              />
              <Input
                containerInputClassName="focus:border border-white/80"
                label={"English"}
                defaultValue={data.Media.title.english}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("english")}
              />
              <Input
                containerInputClassName="focus:border border-white/80"
                label={"Native"}
                defaultValue={data.Media.title.native}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("native")}
              />

              <Input
                containerInputClassName="focus:border border-white/80"
                label={"Romanji"}
                defaultValue={data.Media.title.romaji}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("romaji")}
              />

              <Input
                containerInputClassName="focus:border border-white/80"
                label={"Popularity"}
                defaultValue={parseInt(data.Media.popularity)}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("popularity")}
              />

              <Input
                containerInputClassName="focus:border border-white/80"
                label={"Favourite"}
                defaultValue={parseInt(data.Media.favourites)}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("favourites")}
              />

              <Input
                containerInputClassName="focus:border border-white/80"
                label={"Trending"}
                defaultValue={parseInt(data.Media.trending)}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("trending")}
              />

              <AddRemoveItem
                label="Studios"
                state={studios}
                setState={setStudios}
              />

              <Input
                containerInputClassName="focus:border border-white/80"
                label={"Season"}
                defaultValue={`${convert(data.Media.season, "season", {
                  locale,
                })} ${data.Media.seasonYear}`}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("season")}
              />

              <AddRemoveItem
                label="Synonimus"
                state={synonimus}
                setState={setSynonimus}
              />
            </div>
            <div className="space-y-2 w-full">
              <AddRemoveItem label="Tags" state={tags} setState={setTags} />
            </div>
          </div>

          <div className="space-y-12 md:col-span-8">
            {!!data.Media?.characters?.edges?.length && (
              <DetailsSection
                title={"Characters"}
                className="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
              >
                <CharacterAddCard onClick={() => setShowCharacterModal(true)} />
                {data.Media.characters.edges.map(
                  (characterEdge: any, index: number) => (
                    <CharacterConnectionRemoveCard
                      characterEdge={characterEdge}
                      key={index}
                    />
                  )
                )}
              </DetailsSection>
            )}

            {showCharacterModal && (
              <AddDataModal
                isOpen={showCharacterModal}
                onClose={() => setShowCharacterModal(false)}
              />
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

        <div className="fixed w-full h-16 bg-neutral-900 bottom-0 left-0 flex justify-end items-center px-36 z-50">
          <Button primary className="flex gap-2" type="submit">
            <AiOutlinePlusCircle size={24} />
            Add Anime
          </Button>
        </div>
      </form>
    </div>
  );
}
