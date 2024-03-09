'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { useQuery } from '@tanstack/react-query';

import { useApi } from '@/hooks/useApi';

import UploadContainer from '@/components/features/upload/UploadContainer';
import { CardUser } from '@/components/features/users/CardUser';
import AdminCard from '@/components/shared/AdminCard';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import Loading from '@/components/shared/Loading';
import useSearchUser from '@/hooks/useSearchUser';

export default function RolesPage() {
  const api = useApi();

  const [searchUser, setSearchUser] = useState<any>();
  const [query, setQuery] = useState<any>();
  const [tabSelected, setTabSelected] = useState<any>(1);

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

  const { data: userRolesModerator, isLoading: usersRolesModeratorLoading } =
    useQuery<any>({
      queryKey: ['userRolesModerator'],
      queryFn: async () => {
        const response = await api.getUserRoleHigh('Moderator');
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

        <div
        // className="grid w-full md:grid-cols-2 grid-cols-1 gap-2"
        >
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
                <p>No results found</p>
              ) : (
                <Tabs
                  forceRenderTabPanel
                  className="flex flex-col relative w-full h-full bg-background-900 overflow-y-scroll no-scrollbar"
                  selectedTabClassName="bg-background-700 border-b border-primary-500"
                  selectedTabPanelClassName="!block"
                >
                  <div className="p-2 bg-background-800">
                    <TabList className="z-50 sticky top-0 list-none">
                      <div className="flex items-center gap-2 overflow-x-scroll no-scrollbar">
                        <Tab className="px-3 py-2 cursor-pointer">Admin</Tab>
                        <Tab className="px-3 py-2 cursor-pointer">
                          Moderator
                        </Tab>
                        <Tab className="px-3 py-2 cursor-pointer"></Tab>
                      </div>
                    </TabList>
                  </div>

                  <TabPanel className="hidden p-2 gap-2">
                    <div className="grid w-full md:grid-cols-2 grid-cols-1 gap-2 mt-4">
                      {usersRolesHigh?.map((admin: any) => (
                        <AdminCard key={admin.id} adminUser={admin} />
                      ))}
                    </div>
                  </TabPanel>
                  <TabPanel className="hidden h-full p-2 gap-2">
                    <div className="grid w-full md:grid-cols-2 grid-cols-1 gap-2 mt-4">
                      {userRolesModerator?.map((moderator: any) => (
                        <AdminCard key={moderator.id} adminUser={moderator} />
                      ))}
                    </div>
                  </TabPanel>

                  <div className="py-4 grow overflow-x-hidden no-scrollbar"></div>
                </Tabs>
              )}
            </>
          )}
        </div>
      </UploadContainer>
    </div>
  );
}
