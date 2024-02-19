// "use client";

// import UploadContainer from "@/components/features/upload/UploadContainer";
// import React, { useMemo, useState } from "react";
// import { CalendarContainer } from "react-datepicker";
// import "react-modern-calendar-datepicker/lib/DatePicker.css";
// import DatePicker, { DayValue } from "react-modern-calendar-datepicker";
// // import { Calendar, DayValue } from "react-modern-calendar-datepicker";

// export default function Schedule() {
//   const [selectedDay, setSelectedDay] = useState<DayValue>(null);

//   console.log(selectedDay);
//   return (
//     <div className="ml-2">
//       <UploadContainer isVerified={true} className="relative">
//         <h1 className="font-semibold text-2xl">SCHEDULE</h1>

//         <DatePicker
//           value={selectedDay}
//           onChange={setSelectedDay}
//           // shouldHighlightWeekends
//           locale="en" // add this
//           // wrapperClassName="bg-red-500"
//           // inputClassName="bg-blue-500"
//           // calendarClassName="bg-green-500"
//           // calendarTodayClassName="bg-yellow-500"
//           // calendarSelectedDayClassName="bg-pink-500"
//           // calendarRangeStartClassName="bg-purple-500"s
//           // calendarRangeEndClassName="bg-gray-500"
//         />
//       </UploadContainer>
//     </div>
//   );
// }

'use client';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';
import Input from '@/components/shared/Input';
import List from '@/components/shared/List';
import ListSkeleton from '@/components/skeletons/ListSkeleton';
import { getTrendingMedia, searchData } from '@/mocks/queries';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

export default function Schedule() {
  const [query, setQuery] = useState<any>('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const { data, isLoading } = useQuery<any>({
    queryKey: ['AddAnime', debouncedQuery],
    queryFn: async () => {
      if (debouncedQuery.trim() !== '') {
        const response = await searchData(debouncedQuery);
        return response.data;
      }
      const trendingResponse = await getTrendingMedia();
      return trendingResponse.data;
    },
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 600);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

  const handleSelectAnime = (data: any) => {
    console.log(data);
  };

  return (
    <div>
      <div>
        <div>Hi, Username</div>
        <h1 className="font-semibold text-4xl">Select Anime</h1>
      </div>
      <div>
        <div></div>
      </div>
      <div className="flex gap-4 items-center mt-8 justify-between">
        <Input
          containerInputClassName="border border-white/80"
          LeftIcon={AiOutlineSearch}
          label={'Search'}
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
          containerClassName="w-full md:w-1/3 mb-8"
        />
        {/* <Link href={'/panel/upload/anime/create'}>
          <Button primary>Add Data Manually</Button>
        </Link> */}
      </div>
      {isLoading ? (
        <div className="mt-4">
          <ListSkeleton />
        </div>
      ) : (
        <div className="cursor-pointer">
          <List data={data?.Page.media} onClick={() => handleSelectAnime(data)}>
            {(data: any) => (
              <Card data={data} redirectUrl={`/panel/schedule/${data.id}`} />
            )}
          </List>
        </div>
      )}
    </div>
  );
}
