"use client";

import UploadContainer from "@/components/features/upload/UploadContainer";
import React, { useMemo, useState } from "react";
import { CalendarContainer } from "react-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker, { DayValue } from "react-modern-calendar-datepicker";
// import { Calendar, DayValue } from "react-modern-calendar-datepicker";

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState<DayValue>(null);

  console.log(selectedDay);
  return (
    <div className="ml-2">
      <UploadContainer isVerified={true} className="relative">
        <h1 className="font-semibold text-2xl">SCHEDULE</h1>

        <DatePicker
          value={selectedDay}
          onChange={setSelectedDay}
          // shouldHighlightWeekends
          locale="en" // add this
          // wrapperClassName="bg-red-500"
          // inputClassName="bg-blue-500"
          // calendarClassName="bg-green-500"
          // calendarTodayClassName="bg-yellow-500"
          // calendarSelectedDayClassName="bg-pink-500"
          // calendarRangeStartClassName="bg-purple-500"s
          // calendarRangeEndClassName="bg-gray-500"
        />
      </UploadContainer>
    </div>
  );
}
