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
import {
  AiOutlineLeftCircle,
  AiOutlinePlus,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { IoIosRemoveCircle } from "react-icons/io";
import { useForm, SubmitHandler } from "react-hook-form";
import AddRemoveCard from "@/components/features/panel/AddRemoveCard";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import classNames from "classnames";

export default function UploadPage() {
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

  console.log(coverImage);

  const isChecked = watch("isHomeBanner");
  const locale = useLocale();
  const router = useRouter();

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
      setState("");
    }
  };

  const transformCharactersData = (characters: any) => {
    return characters.map((character: any) => ({
      name: character.node.name.userPreferred,
      image: character.node.image.large,
      description: character.node.description,
      gender: character.node.gender,
      age: Number(character.node.age),
      dateOfBirth: `${character.node.dateOfBirth.day}/${character.node.dateOfBirth.month}`,
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

    if (character) {
      setCharacter([characterData, ...character]);
    } else {
      setCharacter([characterData]);
    }

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

  console.log(character);

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
    console.log(response);
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
    const episodes = parseInt(data.episodes, 10);
    const duration = parseInt(data.duration, 10);
    const popularity = parseInt(data.popularity, 10);
    const favourites = parseInt(data.favourites, 10);
    const trending = parseInt(data.trending, 10);
    const transformedCharacters = transformCharactersData(character);

    console.log(character);
    console.log(transformedCharacters);
    console.log(data.isHomeBanner);

    const requestBody = {
      title: {
        english: data.english,
        romaji: data.romaji,
        native: data.native,
      },
      bannerImage: banner,
      description: data.description,
      coverImage: {
        extraLarge: coverImage,
        color: data.color,
      },
      genres: genres,
      totalEpisodes: episodes,
      duration: duration,
      countryOfOrigin: data.countryOfOrigin,
      popularity: popularity,
      favourites: favourites,
      trending: trending,
      averageScore: data.averageScore,
      status: data.status,
      format: data.format,
      season: data.season,
      characters: transformedCharacters,
      isAdult: data.isAdult,
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

  return (
    <div className="pb-8 relative">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative group transition-all">
          <label htmlFor="bannerInput">
            <>
              <DetailsBanner image={banner} />
              <div
                className={classNames(
                  "absolute top-0 left-0 flex justify-center items-center w-full bg-black/40 h-full cursor-pointer transition-all font-semibold text-xl",
                  banner ? "opacity-0 group-hover:opacity-100" : ""
                )}
              >
                {banner ? <p>Edit banner image</p> : <p>Add Banner Image</p>}
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
            </>
          </label>
        </div>
        <Section className="relative pb-4 bg-background-900 px-4 md:px-12 lg:px-20 xl:px-28 w-full h-auto">
          <div className="flex flex-row md:space-x-8">
            <div className="shrink-0 relative md:static md:left-0 md:-translate-x-0 w-[120px] md:w-[186px] mt-4 md:-mt-12 space-y-6 ">
              <div className="relative group mb-2">
                <label
                  htmlFor="coverInput"
                  className="rounded-lg w-full h-auto overflow-hidden"
                >
                  <div className="w-full h-full aspect-w-2 aspect-h-3">
                    {coverImage ? (
                      <>
                        <PlainCard src={coverImage} alt={"Test"} />
                        <div className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 flex justify-center items-center w-full bg-black/40 h-full cursor-pointer transition-all font-semibold text-lg">
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
                      </>
                    ) : (
                      <div className="w-full h-full cursor-pointer bg-neutral-800 rounded-md flex flex-col justify-center text-center items-center gap-4 hover:text-primary-500 hover:bg-neutral-700/80 transition-all absolute">
                        <AiOutlinePlus size={64} />
                        Add Cover Image
                      </div>
                    )}

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
                  label={"Title"}
                  placeholder="e.g. Naruto"
                  containerClassName="w-full md:w-1/3 mb-8 text-gray-400"
                  className="px-4 py-1 text-white md:text-3xl focus:ring-2 focus:ring-primary-500 rounded-sm placeholder:text-gray-700"
                  {...register("english")}
                />
                <div className="flex gap-10 w-full">
                  <AddRemoveItem
                    label="Genres"
                    state={genres}
                    setState={setGenres}
                    className="!flex-row"
                  />

                  <Input
                    containerInputClassName="focus:border border-white/80"
                    label={"Color"}
                    placeholder="e.g. #51449c"
                    containerClassName="w-full md:w-1/3 mb-8 text-gray-400 "
                    className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm placeholder:text-gray-700"
                    {...(register("color"), { max: 100, min: 1 })}
                  />

                  <Input
                    containerInputClassName="focus:border border-white/80"
                    label={"Average Score"}
                    placeholder="e.g. 89"
                    type="number"
                    containerClassName="w-full md:w-1/3 mb-8 text-gray-400 "
                    className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm placeholder:text-gray-700"
                    {...(register("averageScore"), { max: 100, min: 1 })}
                  />
                </div>

                <div className="w-full">
                  <h2 className="font-bold text-gray-400">Description</h2>
                  <textarea
                    className="bg-neutral-900 w-full h-full p-4 rounded-md mt-3 focus:ring-2 focus:ring-primary-500 outline-none placeholder:text-gray-700"
                    rows={7}
                    {...register("description")}
                    placeholder="e.g. Naruto Uzumaki is a shinobi of Konohagakure's Uzumaki clan. He became the jinchūriki of the Nine-Tails on the day of his birth — a fate that caused him to be shunned by most of Konoha throughout his childhood."
                  ></textarea>
                </div>
                <div id="mal-sync" className="hidden md:block"></div>
              </div>

              <div className="hidden md:flex gap-x-8 md:gap-x-16 [&>*]:shrink-0 flex-wrap">
                <Input
                  containerInputClassName="focus:border border-white/80"
                  label={"Country"}
                  placeholder="e.g. Japan"
                  containerClassName="w-full md:w-1/3 mb-8 text-gray-400 "
                  className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm placeholder:text-gray-700"
                  {...register("countryOfOrigin")}
                />

                <Input
                  containerInputClassName="focus:border border-white/80"
                  label={"Total Episodes"}
                  placeholder="e.g. 23"
                  containerClassName="w-full md:w-1/3 mb-8 text-gray-400 "
                  className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm placeholder:text-gray-700"
                  {...register("episodes")}
                />

                <Input
                  containerInputClassName="focus:border border-white/80"
                  label={"Duration"}
                  placeholder="e.g. Japan"
                  containerClassName="w-full md:w-1/3 mb-8 text-gray-400 "
                  className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm placeholder:text-gray-700"
                  {...register("duration")}
                />

                <Input
                  containerInputClassName="focus:border border-white/80"
                  label={"Status"}
                  containerClassName="w-full md:w-1/3 mb-8 text-gray-400 "
                  className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm placeholder:text-gray-700"
                  {...register("status")}
                />
              </div>
            </div>
          </div>
          {/* <MediaDescription
            description={description}
            containerClassName="mt-4 mb-8 md:hidden block"
            className="text-gray-300 hover:text-gray-100 transition duration-300"
          /> */}

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
              <InfoItem title={"Country"} />
              <InfoItem title={"Total Episodes"} />

              <InfoItem title={"Duration"} />

              <InfoItem title={"Status"} />

              {/* <AiringCountDown
                  airingAt={nextAiringSchedule.airingAt}
                  episode={nextAiringSchedule.episode}
                />
              )} */}
            </div>

            <div className="flex flex-row md:flex-col overflow-x-auto bg-background-900 rounded-md py-5 md:p-4 gap-4 [&>*]:shrink-0 md:no-scrollbar w-full">
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
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("romaji")}
              />

              <Input
                containerInputClassName="focus:border border-white/80"
                label={"Popularity"}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("popularity")}
              />

              <Input
                containerInputClassName="focus:border border-white/80"
                label={"Favourite"}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
                {...register("favourites")}
              />

              <Input
                containerInputClassName="focus:border border-white/80"
                label={"Trending"}
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
            <DetailsSection
              title={"Characters"}
              className="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
            >
              <CharacterAddCard
                onClick={() => (
                  setShowCharacterModal(true), setSelectedCharacter(null)
                )}
              />
              {character &&
                character?.map((characterEdge: any, index: number) => (
                  <CharacterConnectionRemoveCard
                    characterEdge={characterEdge}
                    key={index}
                    handleRemoveCharacter={handleRemoveCharacter}
                    setShowCharacterModal={setShowCharacterModal}
                    setSelectedCharacter={setSelectedCharacter}
                  />
                ))}
            </DetailsSection>

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
              <AddRemoveCard label={"Relations"} />
            </div>

            <div className="w-full">
              <AddRemoveCard label={"Recommendations"} />
            </div>
          </div>
        </Section>

        <div className="fixed w-full h-16 bg-neutral-900 bottom-0 left-0 flex justify-between items-center px-36 z-50">
          <Button className="flex gap-2 items-center ">
            <AiOutlineLeftCircle size={20} />
            Back
          </Button>
          <Button primary className="flex gap-2" type="submit">
            <AiOutlinePlusCircle size={24} />
            Upload Anime
          </Button>
        </div>
      </form>
    </div>
  );
}
