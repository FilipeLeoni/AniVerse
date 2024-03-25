"use client";

import Image from "@/components/shared/Image";
// import { adminUser } from '@/@types/anilist';
import Link from "next/link";
import React from "react";
import Description from "./Description";
import profileDefault from "@/assets/profile-default.jpg";
import Avatar from "./Avatar";
import Select from "./Select";

interface CharacterCardProps {
  adminUser: any;
}

const CharacterConnectionCard: React.FC<CharacterCardProps> = ({
  adminUser,
}) => {
  const url = `/profile/${adminUser.id}`;

  return (
    <>
      <div className="text-gray-300 space-x-4 col-span-1 w-full h-auto bg-background-800 transtion duration-300">
        <div className="relative w-full h-20">
          <Image
            src={adminUser?.bannerPicture || profileDefault}
            fill
            style={{ objectFit: "cover" }}
            alt={`${adminUser?.name}`}
          />
        </div>

        <div className="flex">
          <div className="-mt-6">
            <Avatar src={adminUser?.profilePicture} className="w-24 h-24" />
          </div>

          <div className="flex flex-col pl-4 py-2">
            <p className="font-semibold">{adminUser?.name}</p>

            <Description
              className="!line-clamp-1 pt-2"
              description={`${
                adminUser?.bio
                  ? adminUser?.bio
                  : "This user is busy watching anime so hasn't written anything here yet."
              }...`}
            />
          </div>
        </div>

        <div className="w-full">
          <Select
            className="!w-full py-8"
            options={[
              { value: "Admin", label: "Admin" },
              { value: "Moderator", label: "Moderator" },
              { value: "User", label: "User" },
            ]}
            defaultValue={{ value: adminUser.role, label: adminUser.role }}
          />
        </div>

        {/* <p className="text-primary-400">{adminUser.role}</p> */}
      </div>
    </>
  );
};

export default React.memo(
  CharacterConnectionCard
) as typeof CharacterConnectionCard;
