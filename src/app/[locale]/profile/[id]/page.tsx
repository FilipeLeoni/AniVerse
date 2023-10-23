"use client";

import React, { useEffect, useMemo, useState } from "react";
import { redirect } from "next-intl/server";
import { useSession } from "next-auth/react";

import DetailsBanner from "@/components/shared/DetailsBanner";
import Image from "next/image";
import test from "../test.jpg";
import Button from "@/components/shared/Button";
import { AiFillCamera } from "react-icons/ai";
import Section from "@/components/shared/Section";
import Avatar from "@/components/shared/Avatar";
import Description from "@/components/shared/Description";
import classNames from "classnames";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import Loading from "@/components/shared/Loading";
import EditProfileModal from "@/components/features/users/EditProfileModal";
import UpdateBanner from "@/components/features/users/UpdateBanner";
import UpdateAvatar from "@/components/features/users/UpdateAvatar";

const LISTS = {
  Watch: "Watch",
  Read: "Read",
} as const;

type ListKey = keyof typeof LISTS;
type List = (typeof LISTS)[ListKey];

export default function Profile({ params }: { params: { id: string } }) {
  const userId = params.id;
  const [listTab, setListTab] = useState<List>(LISTS.Watch);

  const { data: session } = useSession();
  const api = useApi();

  const { data: user, isLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      const res = api.getUserById(userId);
      return res;
    },
    refetchOnWindowFocus: false,
  });

  const handleListTabChange = (list: List) => () => {
    setListTab(list);
  };

  const isOwnProfile = useMemo(
    () => session?.user?.id === user?.id && session?.user?.id !== undefined,
    [session?.user?.id, user?.id]
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full min-h-screen">
      <div className="pt-16 md:pt-0 bg-background-800 w-full flex items-center">
        <Section className="px-0 overflow-hidden relative mx-auto w-full h-[200px] md:h-[400px]">
          <div className="relative w-full h-full">
            {user ? (
              // eslint-disable-next-line @next/next/no-img-element
              <Image
                src={user?.bannerPicture || test}
                fill
                className="w-full h-full object-cover"
                alt="profile banner"
              />
            ) : (
              <div className="w-full h-full bg-background-700"></div>
            )}

            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
          </div>

          {session && <UpdateBanner user={user} />}
        </Section>
      </div>
      <Section className="bg-background-800 pb-8 -mt-16 flex flex-col md:flex-row gap-4 md:items-center justify-between pt-6 w-full">
        <div className="relative flex flex-col md:flex-row gap-8">
          <div className="border-4 border-background-800 relative rounded-full w-32 h-32 md:w-44 md:h-44">
            <Avatar
              src={user?.profilePicture}
              className="mx-auto !w-full !h-full"
            />
            {isOwnProfile && <UpdateAvatar user={user} />}
          </div>

          <div className="md:pt-16 space-y-2">
            <div className="flex flex-col md:flex-row center gap-4">
              <h1 className="text-4xl font-bold">{user?.name}</h1>

              <h3 className="flex items-center text-2xl text-gray-300">
                @{user?.role}
              </h3>
            </div>

            <Description
              description={
                user?.bio ||
                "This user is busy watching anime so hasn't written anything here yet."
              }
            />
          </div>
        </div>
        {isOwnProfile && (
          <div>
            <EditProfileModal user={user} />
          </div>
        )}
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
