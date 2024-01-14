"use server";
import prisma from '@/db';
import { revalidatePath } from 'next/cache';

async function sendMessage(data: FormData, conversationId: string) {
  const inputvalue = data.get('message-input')?.valueOf();
  if (typeof inputvalue !== 'string') throw new Error('Invalid input');
  if (inputvalue.length === 0) return;
  // Add message to conversation
  console.log(conversationId);
  await prisma.message.create({
    data: {
      userId: '65a3eabcb60244adf37015fb',
      content: inputvalue,
      conversationId: conversationId,
    }
  })
  revalidatePath('/messenger');
}



export { sendMessage };