// import { Chat as ChatType } from "@/types";
import React from "react";
import ChatMessage from "./ChatMessage";
import EventMessage from "./EventMessage";

// interface ChatProps {
//   chat: ChatType;
// }

const Chat = ({ chat }: any) => {
  console.log(chat);
  // console.log(chat.body);
  console.log(chat.user);

  return chat.type === "message" ? (
    <ChatMessage message={{ body: chat.body, user: chat.user }} />
  ) : (
    <EventMessage event={{ eventType: chat.eventType, user: chat.user }} />
  );
};

export default React.memo(Chat);
