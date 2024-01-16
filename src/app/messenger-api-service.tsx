"use server";
import { prisma, openAi } from '@/db';
import { Message } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { CreateChatCompletionRequestMessage } from 'openai/resources/chat/index.mjs';

async function sendMessage(message: string, conversationId: string) {
  await prisma.message.create({
    data: {
      conversationId,
      content: message,
      isFromUser: true,
    }
  });
  console.log('message sent');
  revalidatePath('/messenger', 'page');
}

export { sendMessage };