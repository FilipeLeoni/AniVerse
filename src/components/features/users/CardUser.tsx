'use client';

import Button from '@/components/shared/Button';
import Select from '@/components/shared/Select';
import { ImBlocked } from 'react-icons/im';
import toast from 'react-hot-toast';

import Image from '@/components/shared/Image';
import { useEffect } from 'react';
import Description from '@/components/shared/Description';

import coverImage from '@/assets/cover-background.png';
import profileDefault from '@/assets/profile-default.jpg';
import BanedConfirmation from '../panel/BanedConfirmation';
import { AiFillAlert, AiFillBoxPlot } from 'react-icons/ai';
import { useApi } from '@/hooks/useApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useBanUser from '@/hooks/useBanUser';
import useModifyRole from '@/hooks/useModifyRole';

export const CardUser: React.FC = ({ user, searchUser }: any) => {
  const api = useApi();

  const roles = [
    { label: 'Admin', value: 'Admin' },
    { label: 'Moderator', value: 'Moderator' },
    { label: 'User', value: 'User' },
  ];

  const { mutate: updateBanStatus, isLoading: updateBanStatusLoading } =
    useBanUser();

  const { mutate: updateRole, isLoading: updateRoleLoading } = useModifyRole();

  const handleBanUser = async () => {
    updateBanStatus({ userId: user?.id, status: !user?.isBanned, searchUser });
  };

  useQuery<any>({
    queryKey: ['BannedUser', user.id, !user.isBanned],
    queryFn: async () => {
      const response = await api.putUserBanned(user.id, !user.isBanned);
      console.log(response);
      return response?.data;
    },
    enabled: false,
  });

  const handleModifyRole = async (e: any) => {
    if (e) {
      updateRole({ userId: user.id, role: e.value });
    } else {
      toast.error('ERREI FUI MLK');
    }
  };

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
            options={roles}
            defaultValue={{ label: user?.role, value: user?.role }}
            onChange={(e) => handleModifyRole(e)}
            placeholder="Roles"
            isClearable={false}
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
                    isLoading={updateBanStatusLoading}
                    className="hover:bg-red-800 items-center justify-center !bg-green-500 "
                  >
                    Unbanned
                  </Button>
                }
                onConfirm={handleBanUser}
              />
            ) : (
              <BanedConfirmation
                confirmString={user?.name}
                reference={
                  <Button
                    isLoading={updateBanStatusLoading}
                    primary
                    className="hover:bg-red-800 items-center justify-center"
                  >
                    Ban
                  </Button>
                }
                onConfirm={handleBanUser}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
