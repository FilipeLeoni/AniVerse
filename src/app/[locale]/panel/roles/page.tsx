'use client';

import UploadContainer from '@/components/features/upload/UploadContainer';
import { CardUser } from '@/components/features/users/CardUser';
import AdminCard from '@/components/shared/AdminCard';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { useApi } from '@/hooks/useApi';
import { useQuery } from '@tanstack/react-query';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

export default function page() {
  const api = useApi();

  const [searchUser, setSearchUser] = useState<any>();
  const [resultUser, setResultUser] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearchUser = async () => {
    setIsLoading(true);
    const response = await api.getUserByName(searchUser);

    if (response?.status == 200) {
      setResultUser(response.data);
    }
    setIsLoading(false);
  };

  const { data: usersRolesHigh, isLoading: usersRolesHighLoading } =
    useQuery<any>({
      queryKey: ['TrendingAnime'],
      queryFn: async () => {
        const response = await api.getUserRoleHigh('Admin');
        return response?.data;
      },
    });

  const handleDigit = (e: any) => {
    setSearchUser(e.target.value);

    if (e.target.value?.length === 0) {
      setResultUser(null);
    }
  };

  return (
    <div>
      <UploadContainer isVerified={true} className="relative">
        <h1 className="font-semibold text-2xl">ROLES PERMISSION</h1>

        <div className="flex gap-4 items-center mt-8">
          <Input
            containerInputClassName="border border-white/80"
            LeftIcon={AiOutlineSearch}
            label={'E-mail'}
            placeholder="example@example.com"
            value={searchUser}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleDigit(e)}
            containerClassName="w-full md:w-1/3 mb-8"
          />
          <div>
            <Button
              primary
              onClick={() => handleSearchUser()}
              isLoading={isLoading}
            >
              Search
            </Button>
          </div>
        </div>

        {resultUser && searchUser?.length > 0 ? (
          <CardUser user={resultUser} />
        ) : resultUser === '' ? (
          <p>Usuário não encontrado</p>
        ) : (
          <div className="grid w-full md:grid-cols-2 grid-cols-1 gap-2">
            {usersRolesHigh?.map((admin: any) => (
              <AdminCard adminUser={admin} />
            ))}
          </div>
        )}
      </UploadContainer>
    </div>
  );
}
