'use client';

import UploadContainer from '@/components/features/upload/UploadContainer';
import { CardUser } from '@/components/features/users/CardUser';
import AdminCard from '@/components/shared/AdminCard';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import Loading from '@/components/shared/Loading';
import { useApi } from '@/hooks/useApi';
import useSearchUser from '@/hooks/useSearchUser';
import { useQuery } from '@tanstack/react-query';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

export default function RolesPage() {
  const api = useApi();

  const [searchUser, setSearchUser] = useState<any>();
  const [query, setQuery] = useState<any>();

  const {
    data,
    isLoading: searchUserLoading,
    status,
  } = useSearchUser(searchUser);

  const handleSearchUser = async () => {
    setSearchUser(query);
  };

  const { data: usersRolesHigh, isLoading: usersRolesHighLoading } =
    useQuery<any>({
      queryKey: ['usersRolesHigh'],
      queryFn: async () => {
        const response = await api.getUserRoleHigh('Admin');
        return response?.data;
      },
    });

  const handleDigit = (e: any) => {
    setQuery(e.target.value);
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
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleDigit(e)}
            containerClassName="w-full md:w-1/3 mb-8"
            disabled={searchUserLoading}
          />
          <div>
            <Button
              primary
              onClick={() => handleSearchUser()}
              disabled={searchUserLoading}
            >
              Search
            </Button>
          </div>
        </div>

        <div className="grid w-full md:grid-cols-2 grid-cols-1 gap-2">
          {usersRolesHighLoading || searchUserLoading ? (
            <div className="w-96  h-96 justify-center items-center">
              <Loading />
            </div>
          ) : (
            <>
              {data && searchUser?.length > 0 ? (
                <div className="w-full">
                  <CardUser user={data} searchUser />
                </div>
              ) : !data && searchUser?.length ? (
                <p>Usuário não encontrado</p>
              ) : (
                <>
                  {usersRolesHigh?.map((admin: any) => (
                    <AdminCard key={admin.id} adminUser={admin} />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </UploadContainer>
    </div>
  );
}
