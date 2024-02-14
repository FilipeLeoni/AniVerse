import useConstantTranslation from "@/hooks/useConstantTranslation";
// import { ChatEvent } from "@/types";
// import { useTranslation } from "next-i18next";
import React from "react";

interface EventMessageProps {
  event: any;
}

const EventMessage: React.FC<EventMessageProps> = ({ event }) => {
  const { CHAT_EVENT_TYPES } = useConstantTranslation();
  // const { t } = useTranslation("wwf");

  return (
    <p className="text-center italic text-gray-400 text-xs">
      <strong>{event.user?.name || "Guest"} </strong>

      {CHAT_EVENT_TYPES[event.eventType]}
    </p>
  );
};

export default React.memo(EventMessage);
