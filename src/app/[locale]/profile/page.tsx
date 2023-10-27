"use client";

import React, { useEffect, useState } from "react";
import { redirect } from "next-intl/server";
import { useSession } from "next-auth/react";

import { Api } from "@/utils/api";
import Cookies from "js-cookie";
import DetailsBanner from "@/components/shared/DetailsBanner";
import Image from "next/image";
import test from "./test.jpg";
import Button from "@/components/shared/Button";
import { AiFillCamera } from "react-icons/ai";
import Section from "@/components/shared/Section";
import Avatar from "@/components/shared/Avatar";
import Description from "@/components/shared/Description";
import classNames from "classnames";
import { useApi } from "@/hooks/useApi";

const LISTS = {
  Watch: "Watch",
  Read: "Read",
} as const;

type ListKey = keyof typeof LISTS;
type List = (typeof LISTS)[ListKey];

export default function Profile() {
  const [example, setExample] = useState<any>();
  const [listTab, setListTab] = useState<List>(LISTS.Watch);

  const { data } = useSession();

  const handleListTabChange = (list: List) => () => {
    setListTab(list);
  };

  const session: any = data;
  const accessToken = Cookies.get("accessToken");
  console.log(accessToken);

  useEffect(() => {
    async function fetchData() {
      console.log(session?.user?.id);
      try {
        const response = await Api.get(`/user/${session.user.user.id}`, {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });
        const responseData = response.data;
        setExample(responseData);
      } catch (error) {
        console.log("Erro ao fazer a requisição:", error);
      }
    }

    fetchData();
  }, [accessToken, session?.user]);

  console.log(example);

  if (session === null) {
    return redirect("/login");
  }

  console.log(session);

  return (
    <div className="w-full min-h-screen">
      <div className="pt-16 md:pt-0 bg-background-800 w-full flex items-center">
        <Section className="px-0 overflow-hidden relative mx-auto w-full h-[200px] md:h-[400px]">
          <div className="relative w-full h-full">
            {example ? (
              // eslint-disable-next-line @next/next/no-img-element
              <Image
                src={example?.bannerPicture || test}
                fill
                className="w-full h-full object-cover"
                alt="profile banner"
              />
            ) : (
              <div className="w-full h-full bg-background-700"></div>
            )}

            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
          </div>
        </Section>
      </div>
      <Section className="bg-background-800 pb-8 -mt-16 flex flex-col md:flex-row gap-4 md:items-center justify-between pt-6 w-full">
        <div className="relative flex flex-col md:flex-row gap-8">
          <div className="border-4 border-background-800 relative rounded-full w-32 h-32 md:w-44 md:h-44">
            <Avatar
              src={example?.profilePicture}
              className="mx-auto !w-full !h-full"
            />
          </div>

          <div className="md:pt-16 space-y-2">
            <div className="flex flex-col md:flex-row center gap-4">
              <h1 className="text-4xl font-bold">{example?.name}</h1>

              <h3 className="flex items-center text-2xl text-gray-300">
                @{example?.name}
              </h3>
            </div>

            <Description
              description={
                example?.bio ||
                "This user is busy watching anime so hasn't written anything here yet."
              }
            />
          </div>
        </div>
      </Section>

      <Section title="List" className="mt-8 w-full">
        <div className="flex items-center gap-3">
          <Button
            className={classNames(
              listTab === LISTS.Watch ? "bg-primary-600" : "bg-background-600"
            )}
            onClick={handleListTabChange(LISTS.Watch)}
          >
            Watch
          </Button>
          <Button
            className={classNames(
              listTab === LISTS.Read ? "bg-primary-600" : "bg-background-600"
            )}
            onClick={handleListTabChange(LISTS.Read)}
          >
            Read
          </Button>
        </div>

        {/* <div className="mt-8">
            {listTab === LISTS.Watch ? (
              <WatchList user={user} />
            ) : (
              <ReadList user={user} />
            )}
          </div> */}
      </Section>
    </div>
  );
}
