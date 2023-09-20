"use client";

import React, { useEffect, useState } from "react";
import dayjs from "@/lib/dayjs";
import { useLocale } from "next-intl";
import InfoItem from "./InfoItem";

export default function AiringCountDown({ airingAt, episode }: any) {
  const [countdown, setCountdown] = useState("");

  const locale = useLocale();

  function calculateCountdown() {
    if (!airingAt) {
      return "Agora";
    }

    const now = dayjs();
    const airingTime = dayjs.unix(airingAt).locale(locale);

    if (now.isAfter(airingTime)) {
      return "Agora";
    }

    const duration = airingTime.diff(now, "second");
    const days = Math.floor(duration / (3600 * 24));
    const hours = Math.floor((duration % (3600 * 24)) / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  useEffect(() => {
    if (airingAt) {
      const timer = setInterval(() => {
        setCountdown(calculateCountdown());
      }, 1000);

      return () => clearInterval(timer);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [airingAt]);

  return (
    <InfoItem
      className="!text-primary-300"
      title={"Next Airing Schedule"}
      value={`Episodes ${episode}: ${countdown}`}
    />
  );
}
