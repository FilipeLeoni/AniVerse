'use client';

import { useEffect, useRef, useState } from 'react';
import { BiPlus } from 'react-icons/bi';
// import MomentUtils from '@date-io/moment';
// import DateFnsUtils from '@date-io/date-fns';
// import LuxonUtils from '@date-io/luxon';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import DateFnsUtils from '@date-io/date-fns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useApi } from '@/hooks/useApi';

import Button from '@/components/shared/Button';
import Loading from '@/components/shared/Loading';
import MediaDetails from '@/components/features/upload/MediaDetails';
import Modal from '@/components/shared/Modal';
import Input from '@/components/shared/Input';
import { AiOutlineSearch } from 'react-icons/ai';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

export default function ScheduleMutate({
  params,
}: {
  params: { animeId: string };
}) {
  const [anime, setAnime] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDate, handleDateChange] = useState(new Date());

  const api = useApi();
  const modalRef = useRef<any>();

  const getAnimeById = async () => {
    setIsLoading(true);
    const response = await api.getAnimeById(params.animeId);
    setAnime(response);

    setIsLoading(false);
    return response;
  };

  useEffect(() => {
    console.log(selectedDate);
  }, [selectedDate]);

  const handlePutSchedule = async (schedule: string) => {
    const response = api.PutScheduleAnime(params.animeId, '');
  };

  const handleModalState = (state: 'open' | 'close') => () => {
    if (state === 'open') {
      modalRef?.current?.open();
    } else if (state === 'close') {
      modalRef?.current?.close();
    }
  };

  useEffect(() => {
    getAnimeById();
  }, [params]);

  const color = '#c44242';

  return (
    <div>
      <div>
        <div>Hi, Username</div>
        <h1 className="font-semibold text-4xl">Schedule</h1>
      </div>
      <div className="mt-8 ">
        {isLoading ? (
          <div className="w-full h-full items-center justify-center">
            <Loading />
          </div>
        ) : anime ? (
          <MediaDetails media={anime} />
        ) : (
          <p className="pt-8 ">No results found</p>
        )}
      </div>

      {!isLoading && anime && (
        <div className="flex gap-2 justify-end">
          <input
            className="h-14 border-[#262626] border rounded-sm bg-background-900 placeholder:text-white px-4"
            placeholder="Episode"
          />

          <DateTimePicker
            className="border border-red-900"
            sx={{
              color: 'white',
              width: 300,
              background: '#0D0D0D',
              border: '1px solid #262626',
              borderRadius: '4px',
              '& input': { color: 'white' },
              svg: { color: '#fff' },
            }}
          />

          <Button
            onClick={handleModalState('open')}
            primary
            className="gap-2 justify-center md:flex hidden"
          >
            Add schedule <BiPlus />
          </Button>
        </div>
      )}

      {anime && (
        <div className="w-full bg-background-700 mt-4 p-4 rounded-md">
          <p className="">Episode: </p>
          <br />
          <p>Date added on:</p>
          <p>Created by: </p>
          <div className="flex gap-2">
            <p>Date entered: </p>
            <p className="text-primary-500">{anime?.airingSchedule}</p>
          </div>
        </div>
      )}
      {/* 
      <Modal ref={modalRef} className="z-10">
       
      </Modal> */}
    </div>
  );
}
