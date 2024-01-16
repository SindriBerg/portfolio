"use client";

import { Avatar } from "@mui/material";
import { Message } from "@prisma/client";
import { prisma, openAi } from "@/db";
import { CreateChatCompletionRequestMessage } from "openai/resources/chat/index.mjs";
import { useEffect } from "react";
import OpenAI from "openai";


const MessageListEntry = async (props: Message) => {
  return (
    <div className={`flex ${props.isFromUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!props.isFromUser && <Avatar sx={{ height: 24, width: 24, marginRight: 1 }} />}
      <p className={`px-2 rounded-md mr-2 ${props.isFromUser ? 'bg-secondary-main' : 'bg-primary-300'}`}>{props.content}</p>
    </div>
  )
}

export default function MessageList(props: { messages: Message[], conversationId: string }) {
  const { messages } = props;
  // If the messages change, I want to call getReplyFromOpenAi
  return (
    <div className='w-full bg-secondary-300 flex flex-col-reverse p-5 gap-2'>
      {messages.map((m) => <MessageListEntry key={m.id} {...m} />)}
    </div>
  )
}