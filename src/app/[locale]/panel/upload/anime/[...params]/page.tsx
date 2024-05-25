"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/shared/Button";
import DetailsBanner from "@/components/shared/DetailsBanner";
import DetailsSection from "@/components/shared/DetailsSection";
import InfoItem from "@/components/shared/InfoItem";
import MediaDescription from "@/components/shared/MediaDescription";
import PlainCard from "@/components/shared/PlainCard";
import Section from "@/components/shared/Section";
import { getAnimeById } from "@/mocks/queries";

import { convert, getDescription, getTitle } from "@/utils/data";
import { useLocale } from "next-intl";
import { BsFillPlayFill, BsPlusCircleFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import dayjs from "@/lib/dayjs";
import AiringCountDown from "@/components/shared/AiringCountDown";
import Input from "@/components/shared/Input";
import { useMutation, useQuery } from "@tanstack/react-query";
import CharacterAddCard from "@/components/features/panel/CharacterAddCard";
import CharacterConnectionRemoveCard from "@/components/features/panel/CharacterConnectionRemove";
import AddDataModal from "@/components/features/panel/CharacterModal";
import AddRemoveItem from "@/components/features/panel/AddRemoveItem";
import { AiOutlineLeftCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { IoIosRemoveCircle } from "react-icons/io";
import { useForm, SubmitHandler } from "react-hook-form";
import AddRemoveCard from "@/components/features/panel/AddRemoveCard";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

export default function UploadPage({
  params,
}: {
  params: { params: string[] };
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm<any>();
  const [character, setCharacter] = useState<any>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [studios, setStudios] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [synonimus, setSynonimus] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [banner, setBanner] = useState<any | null>(null);
  const [coverImage, setCoverImage] = useState<any | null>(null);
  const [relations, setRelations] = useState<any>([]);
  const [recommendations, setRecommendations] = useState<any>([]);

  const animeId = params.params[0];
  const { data, isLoading } = useQuery<any>({
    queryKey: ["AnimeById", animeId],
    queryFn: async () => {
      const response = await getAnimeById(animeId, "ANIME");
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const isChecked = watch("isHomeBanner");
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    const propertiesToSet = {
      synonyms: setSynonimus,
      tags: setTags,
      characters: setCharacter,
      bannerImage: setBanner,
      genres: setGenres,
    };

    if (data?.Media) {
      Object.entries(propertiesToSet).forEach(([property, setState]) => {
        if (data?.Media[property] !== undefined) {
          setState(data?.Media[property]);
        }
      });

      setValue("format", data?.Media.format);
      setValue("english", data?.Media.title.english);
      setValue("native", data?.Media.title.native);
      setValue("romaji", data?.Media.title.romaji);
      setValue("popularity", parseInt(data?.Media.popularity));
      setValue("favourites", parseInt(data?.Media.favourites));
      setValue("trending", data?.Media.trending);
      setValue("Season", data?.Media.season);
      setValue("seasonYear", data?.Media.seasonYear);
      setValue("averageScore", data?.Media.averageScore);
      setValue("color", data?.Media.coverImage.color);

      setValue(
        "countryOfOrigin",
        convert(data?.Media.countryOfOrigin, "country", {
          locale,
        })
      );
      setValue(
        "episodes",
        data?.Media.episodes ? parseInt(data?.Media.episodes) : ""
      );
      setValue("duration", parseInt(data?.Media.duration));
      setValue(
        "status",
        convert(data?.Media.status, "status", {
          locale,
        })
      );
    }

    if (data?.Media?.studios) {
      setStudios(data?.Media.studios.nodes);
    }

    if (data?.Media?.coverImage?.extraLarge) {
      setCoverImage(data?.Media.coverImage.extraLarge);
    }

    if (data?.Media?.characters) {
      setCharacter(data?.Media.characters.edges);
    }
  }, [data?.Media, locale, setValue]);

  console.log(data?.Media?.trailer);
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleFileChange = (event: any, setState: any) => {
    const file = event.target.files[0];
    const allowedTypes = ["image/webp", "image/png", "image/jpeg", "image/jpg"];

    if (file && allowedTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setState(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setState(data?.Media.bannerImage);
    }
  };

  const title = getTitle(data?.Media, locale);
  const description = getDescription(data?.Media, locale);

  const transformCharactersData = (characters: any) => {
    return characters.map((character: any) => ({
      name: character?.node?.name?.userPreferred,
      image: character?.node?.image?.large,
      description: character?.node?.description,
      gender: character?.node?.gender,
      age: Number(character?.node?.age),
      dateOfBirth: `${character?.node?.dateOfBirth?.day || ""}/${
        character?.node?.dateOfBirth?.month || ""
      }`,
      role: character.role,
    }));
  };

  const handleAddCharacter = () => {
    const nameFieldValue = watch("name");

    if (!nameFieldValue) {
      return;
    }

    const characterData = {
      node: {
        id: Math.random(),
        image: {
          large: selectedFile,
        },
        name: { userPreferred: nameFieldValue, full: nameFieldValue },
        gender: watch("gender"),
        age: watch("age"),
        dateOfBirth: watch("dateOfBirth"),
      },
      role: watch("role"),
    };

    setCharacter([characterData, ...character]);

    setShowCharacterModal(false);
    setSelectedFile(null);
    reset({ name: "", gender: "", age: "", role: "", dateOfBirth: "" });
  };

  const handleRemoveCharacter = (characterId: number) => {
    const updatedCharacters = character.filter(
      (character: any) => character.node.id !== characterId
    );
    setCharacter(updatedCharacters);
  };

  const editCharacter = (characterId: any) => {
    const nameFieldValue = watch("name");
    const gender = watch("gender");
    const role = watch("role");
    const age = watch("age");
    const day = watch("day");
    const month = watch("month");

    if (!nameFieldValue) {
      return;
    }

    setCharacter((characters: any) => {
      return characters.map((character: any) => {
        if (character.node.id === characterId) {
          const updatedCharacter = {
            node: {
              id: characterId,
              image: {
                large: selectedFile,
              },
              name: { userPreferred: nameFieldValue, full: nameFieldValue },
              gender: gender,
              age: age,
              dateOfBirth: {
                day: day,
                month: month,
              },
            },
            role: role,
          };

          return updatedCharacter;
        }
        return character;
      });
    });

    setShowCharacterModal(false);
    setSelectedCharacter(null);
    setSelectedFile(null);
    reset({ name: "", gender: "", age: "", role: "", dateOfBirth: "" });
  };

  async function SendData(requestBody: any) {
    const response: any = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/anime`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );
    if (response.ok) {
      router.push("/panel/upload/anime");
      return response;
    }
    return response;
  }

  const handleCheckboxToggle = () => {
    setValue("isHomeBanner", !isChecked);
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    const episodes = parseInt(data?.episodes, 10);
    const duration = parseInt(data?.duration, 10);
    const popularity = parseInt(data?.popularity, 10);
    const favourites = parseInt(data?.favourites, 10);
    const trending = parseInt(data?.trending, 10);
    const transformedCharacters = transformCharactersData(character);
    const referId = parseInt(animeId);

    const requestBody = {
      title: {
        english: data?.english,
        romaji: data?.romaji,
        native: data?.native,
      },
      bannerImage: banner,
      description: data?.description,
      coverImage: {
        extraLarge: coverImage,
        color: data?.color,
      },
      referId: referId,
      genres: genres,
      totalEpisodes: episodes || null,
      duration: duration || null,
      countryOfOrigin: data?.countryOfOrigin,
      popularity: popularity,
      favourites: favourites,
      trending: trending,
      averageScore: data?.averageScore,
      status: data?.status,
      format: data?.format,
      season: data?.season,
      trailer: data?.trailer,
      seasonYear: Number(data?.seasonYear),
      characters: transformedCharacters,
      isAdult: data?.isAdult,
      isHomeBanner: data?.isHomeBanner,
      relations: relations,
    };

    const callFunction = SendData(requestBody);

    toast.promise(
      callFunction,
      {
        loading: "Adding...",
        success: <b>Added successfully!</b>,
        error: <b>Could not add.</b>,
      },
      {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      }
    );
  };

  const nextAiringSchedule = data?.Media?.airingSchedule?.nodes
    ?.sort((a: any, b: any) => a.episode - b.episode)
    .find((schedule: any) => dayjs.unix(schedule.airingAt).isAfter(dayjs()));

  return (
    <div className="pb-8 relative">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative group transition-all">
          <label htmlFor="bannerInput">
            <DetailsBanner image={banner} />
            <div className="absolute top-0 left-0 md:opacity-0 group-hover:opacity-100  flex justify-center items-center w-full bg-black/40 h-full cursor-pointer transition-all font-semibold text-xl">
              Edit banner image
              <input
                type="file"
                id="bannerInput"
                className="hidden"
                checked={isChecked}
                onChange={(e) => {
                  handleFileChange(e, setBanner);
                }}
              />
            </div>
          </label>
        </div>
        <Section className="relative pb-4 bg-background-900 px-4 md:px-12 lg:px-20 xl:px-28 w-full h-auto">
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="shrink-0 relative md:static md:left-0 md:-translate-x-0 w-[120px] md:w-[186px] mt-4 md:-mt-12 space-y-6 ">
              <div className="relative group mb-2">
                <label htmlFor="coverInput">
                  <PlainCard src={coverImage} alt={"Test"} />
                  <div className="absolute top-0 left-0 text-center md:opacity-0 group-hover:opacity-100 flex justify-center items-center w-full bg-black/40 h-full cursor-pointer transition-all font-semibold text-lg">
                    Edit Cover Image
                    <input
                      type="file"
                      id="coverInput"
                      className="hidden"
                      onChange={(e) => {
                        handleFileChange(e, setCoverImage);
                      }}
                    />
                  </div>
                </label>
              </div>

              <label htmlFor="isHomeBanner" onClick={handleCheckboxToggle}>
                <input
                  className="hidden"
                  type="checkbox"
                  id="isHomeBanner"
                  defaultChecked={false}
                  {...register("isHomeBanner")}
                />
                <Button
                  primary
                  className="gap-2 w-full justify-center md:flex hidden"
                >
                  {isChecked ? (
                    <>
                      <IoIosRemoveCircle size={25} />
                      Remove Home
                    </>
                  ) : (
                    <>
                      <BsPlusCircleFill size={22} />
                      Add to Home
                    </>
                  )}
                </Button>
              </label>
            </div>

            <div className="flex flex-col md:justify-between md:py-4 ml-4 text-left items-start md:-mt-16 space-y-0 md:space-y-4 w-full">
              <div className="flex flex-col items-start space-y-4 pt-20 md:pb-4 w-full">
                <Input
                  label={"Title (English)"}
                  containerClassName="md:w-full md:w-1/3 mb-8 text-gray-400"
                  className="px-4 py-1 text-white md:text-3xl focus:ring-2 focus:ring-primary-500 rounded-sm"
                  {...register("english")}
                />
                <div className="flex md:gap-10 md:w-full md:flex-row flex-col pr-5">
                  <AddRemoveItem
                    label="Genres"
                    state={genres}
                    setState={setGenres}
                    className="!flex-row flex-wrap"
                  />

                  <Input
                    containerInputClassName="focus:border border-white/80"
                    label={"Color"}
                    defaultValue={data?.Media.coverImage.color}
                    containerClassName="md:w-full md:w-1/3 mb-8 text-gray-400 "
                    className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                    {...(register("color"), { max: 100, min: 1 })}
                  />

                  <Input
                    containerInputClassName="focus:border border-white/80"
                    label={"Trailer"}
                    defaultValue={data?.Media?.trailer?.id}
                    containerClassName="md:w-full md:w-1/3 mb-8 text-gray-400 "
                    className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                    {...register("trailer")}
                  />

                  <Input
                    containerInputClassName="focus:border border-white/80"
                    label={"Average Score"}
                    type="number"
                    defaultValue={data?.Media.averageScore}
                    containerClassName="md:w-full md:w-1/3 mb-8 text-gray-400 "
                    className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                    {...(register("averageScore"), { max: 100, min: 1 })}
                  />
                </div>

                <div className="w-full pr-6">
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
                  defaultValue={convert(
                    data?.Media.countryOfOrigin,
                    "country",
                    {
                      locale,
                    }
                  )}
                  containerClassName="w-full md:w-1/3 mb-8 text-gray-400 "
                  className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                  {...register("countryOfOrigin")}
                />

                <Input
                  containerInputClassName="focus:border border-white/80"
                  label={"Total Episodes"}
                  defaultValue={parseInt(data?.Media?.episodes)}
                  type="number"
                  containerClassName="w-full md:w-1/3 mb-8 text-gray-400 "
                  className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                  {...register("episodes")}
                />

                {data?.Media?.duration && (
                  <Input
                    containerInputClassName="focus:border border-white/80"
                    label={"Duration"}
                    defaultValue={parseInt(data?.Media.duration)}
                    containerClassName="w-full md:w-1/3 mb-8 text-gray-400 "
                    className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                    {...register("duration")}
                  />
                )}

                <Input
                  containerInputClassName="focus:border border-white/80"
                  label={"Status"}
                  defaultValue={convert(data?.Media.status, "status", {
                    locale,
                  })}
                  containerClassName="w-full md:w-1/3 mb-8 text-gray-400 "
                  className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                  {...register("status")}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-10">
            <Button
              primary
              className="gap-4 w-full justify-center flex md:hidden"
            >
              <BsPlusCircleFill size={22} />
              Add to Home
            </Button>
          </div>
        </Section>

        <Section className="w-full min-h-screen gap-8 mt-2 md:mt-8 space-y-8 md:space-y-0 md:grid md:grid-cols-10 sm:px-12">
          <div className="md:col-span-2 xl:h-[max-content] space-y-4">
            <div className="flex md:hidden flex-col overflow-x-auto bg-background-900 rounded-md md:p-4 gap-4 [&>*]:shrink-0 md:no-scrollbar p-4">
              <Input
                containerInputClassName="focus:border border-white/80"
                label={"Country"}
                defaultValue={convert(data?.Media.countryOfOrigin, "country", {
                  locale,
                })}
                containerClassName="w-full md:w-1/3 mb-8 text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("countryOfOrigin")}
              />

              <Input
                containerInputClassName="focus:border border-white/80"
                label={"Total Episodes"}
                defaultValue={parseInt(data?.Media?.episodes)}
                type="number"
                containerClassName="w-full md:w-1/3 mb-8 text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("episodes")}
              />

              {data?.Media?.duration && (
                <Input
                  containerInputClassName="focus:border border-white/80"
                  label={"Duration"}
                  defaultValue={parseInt(data?.Media.duration)}
                  containerClassName="w-full md:w-1/3 mb-8 text-gray-400 "
                  className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                  {...register("duration")}
                />
              )}

              <Input
                containerInputClassName="focus:border border-white/80"
                label={"Status"}
                defaultValue={convert(data?.Media.status, "status", {
                  locale,
                })}
                containerClassName="w-full md:w-1/3 mb-8 text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("status")}
              />

              {nextAiringSchedule && (
                <AiringCountDown
                  airingAt={nextAiringSchedule.airingAt}
                  episode={nextAiringSchedule.episode}
                />
              )}
            </div>

            <div className="flex flex-col overflow-x-auto bg-background-900 rounded-md py-5 md:p-4 gap-4 [&>*]:shrink-0 md:no-scrollbar w-full p-4">
              <Input
                containerInputClassName="focus:border border-white/80 w-full"
                label={"Format"}
                containerClassName="w-full text-gray-400"
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("format")}
              />
              <Input
                containerInputClassName="focus:border border-white/80"
                label={"English"}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                value={watch("english")}
              />
              <Input
                containerInputClassName="focus:border border-white/80"
                label={"Native"}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("native")}
              />

              <Input
                containerInputClassName="focus:border border-white/80"
                label={"Romanji"}
                defaultValue={data?.Media.title.romaji}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("romaji")}
              />

              <Input
                containerInputClassName="focus:border border-white/80"
                label={"Popularity"}
                defaultValue={parseInt(data?.Media.popularity)}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("popularity")}
              />

              <Input
                containerInputClassName="focus:border border-white/80"
                label={"Favourite"}
                defaultValue={parseInt(data?.Media.favourites)}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("favourites")}
              />

              <Input
                containerInputClassName="focus:border border-white/80"
                label={"Trending"}
                defaultValue={parseInt(data?.Media.trending)}
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
                defaultValue={data?.Media.season}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("season")}
              />

              <Input
                containerInputClassName="focus:border border-white/80"
                label={"Season Year"}
                defaultValue={data?.Media?.seasonYear}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("seasonYear")}
              />

              <AddRemoveItem
                label="Synonimus"
                state={synonimus}
                setState={setSynonimus}
              />
              <div className="space-y-2 w-full">
                <AddRemoveItem label="Tags" state={tags} setState={setTags} />
              </div>
            </div>
          </div>

          <div className="space-y-12 md:col-span-8 ">
            {!!character?.length && (
              <DetailsSection
                title={"Characters"}
                className="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
              >
                <CharacterAddCard
                  onClick={() => (
                    setShowCharacterModal(true), setSelectedCharacter(null)
                  )}
                />
                {character?.map((characterEdge: any, index: number) => (
                  <CharacterConnectionRemoveCard
                    characterEdge={characterEdge}
                    key={index}
                    handleRemoveCharacter={handleRemoveCharacter}
                    setShowCharacterModal={setShowCharacterModal}
                    setSelectedCharacter={setSelectedCharacter}
                  />
                ))}
              </DetailsSection>
            )}

            <AnimatePresence>
              {showCharacterModal && (
                <AddDataModal
                  register={register}
                  isOpen={showCharacterModal}
                  handleAddCharacter={handleAddCharacter}
                  selectedCharacter={selectedCharacter}
                  setSelectedFile={setSelectedFile}
                  selectedFile={selectedFile}
                  editCharacter={editCharacter}
                  setValue={setValue}
                  onClose={() => setShowCharacterModal(false)}
                />
              )}
            </AnimatePresence>

            <div className="w-full">
              <AddRemoveCard
                label={"Relations"}
                state={relations}
                setState={setRelations}
              />
            </div>

            {/* <div className="w-full">
              <AddRemoveCard
                label={"Recommendations"}
                state={recommendations}
                setState={setRecommendations}
              />
            </div> */}
          </div>
        </Section>

        <div className="fixed w-full h-16 bg-neutral-900 bottom-0 left-0 flex justify-between items-center px-4 md:px-36 z-50">
          <Link
            className="flex gap-2 items-center"
            href={"/panel/upload/anime"}
          >
            <AiOutlineLeftCircle size={20} />
            Back
          </Link>
          <Button primary className="flex gap-2" type="submit">
            <AiOutlinePlusCircle size={24} />
            Upload Anime
          </Button>
        </div>
      </form>
    </div>
  );
}
