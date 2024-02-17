'use client';

import Image from '@/components/shared/Image';
// import { adminUser } from '@/@types/anilist';
import Link from 'next/link';
import React from 'react';
import Description from './Description';
import profileDefault from '@/assets/profile-default.jpg';

interface CharacterCardProps {
  adminUser: any;
}

const CharacterConnectionCard: React.FC<CharacterCardProps> = ({
  adminUser,
}) => {
  const url = `/profile/${adminUser.id}`;

  return (
    <Link href={url} className="w-full">
      <div className="text-gray-300 space-x-4 col-span-1 flex w-full h-24 bg-background-800 hover:bg-white/20 transtion duration-300">
        <div className="relative h-full w-16">
          <Image
            src={adminUser?.profilePicture || profileDefault}
            fill
            style={{ objectFit: 'cover' }}
            alt={`${adminUser?.name}`}
          />
        </div>

        <div className="py-2 flex flex-col ">
          <p className="font-semibold">{adminUser?.name}</p>
          <p className="text-primary-400">{adminUser.role}</p>

          <Description
            className="!line-clamp-1 pt-2"
            description={`${
              adminUser?.bio
                ? adminUser?.bio?.slice(0, 35)
                : "This user is busy watching anime so hasn't written anything here yet.".slice(
                    0,
                    35
                  )
            }...`}
          />
        </div>
      </div>
    </Link>
  );
};

export default React.memo(
  CharacterConnectionCard
) as typeof CharacterConnectionCard;
