'use client';

import Button from '@/components/shared/Button';
import Select from '@/components/shared/Select';
import { ImBlocked } from 'react-icons/im';

import Image from '@/components/shared/Image';
import { useEffect } from 'react';
import Description from '@/components/shared/Description';

import coverImage from '@/assets/cover-background.png';
import profileDefault from '@/assets/profile-default.jpg';
import BanedConfirmation from '../panel/BanedConfirmation';
import { AiFillAlert, AiFillBoxPlot } from 'react-icons/ai';
import { useApi } from '@/hooks/useApi';

export const CardUser: React.FC = ({ user }: any) => {
  const api = useApi();

  const handleBannedUser = async (uuid: any, status: boolean) => {
    const response = await api.putUserBanned(uuid, status);

    console.log(response);
  };

  // const { data: usersRolesHigh, isLoading: usersRolesHighLoading } =
  //   useQuery<any>({
  //     queryKey: ['TrendingAnime'],
  //     queryFn: async () => {
  //       const response = await api.getUserRoleHigh('Admin');
  //       return response?.data;
  //     },
  //   });

  return (
    <div className="w-full bg-background-600 rounded-md">
      <div className="bg-blue-500 w-full h-24 relative  rounded-t-md">
        <Image
          src={user?.bannerPicture || coverImage}
          alt="Background Image"
          fill
          className="object-cover rounded-t-md"
        />

        <div className="bg-green-900 w-28 h-28 rounded-full absolute top-12 left-8">
          <Image
            src={user?.profilePicture || profileDefault}
            className="object-cover rounded-full"
            alt="Background Image"
            fill
          />
        </div>
      </div>

      <div className="w-full pt-16 px-12 pb-12">
        <p className="pt-4">{user?.name}</p>
        <p className="text-gray-400">{user?.email}</p>
        <hr className="mt-4 border border-gray-600" />
        <Description
          description={
            user?.bio ||
            "This user is busy watching anime so hasn't written anything here yet."
          }
          className="mt-4"
        />

        <div className="flex justify-end mt-12 gap-2">
          <Select
            options={[]}
            placeholder="Admin"
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: '#1a1a1a',
              }),
            }}
          />

          <div>
            {user.isBanned ? (
              <BanedConfirmation
                confirmString={user?.name}
                banned
                reference={
                  <Button
                    primary
                    className="hover:bg-red-800 items-center justify-center bg-green-400"
                    secondary
                  >
                    Unbanned
                  </Button>
                }
                onConfirm={() => handleBannedUser(user?.id, !user?.isBanned)}
              />
            ) : (
              <BanedConfirmation
                confirmString={user?.name}
                reference={
                  <Button
                    primary
                    className="hover:bg-red-800 items-center justify-center bg-[#EF4444]"
                    secondary
                  >
                    Ban
                  </Button>
                }
                onConfirm={() => handleBannedUser(user?.id, !user?.isBanned)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
