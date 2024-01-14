"use server";
import { prisma, openAi } from '@/db';
import { revalidatePath } from 'next/cache';

async function sendMessage(data: FormData, conversationId: string) {
  const inputvalue = data.get('message-input')?.valueOf();
  if (typeof inputvalue !== 'string') throw new Error('Invalid input');
  if (inputvalue.length === 0) return;
  // Add message to conversation
  await prisma.message.create({
    data: {
      userId: '65a3eabcb60244adf37015fb',
      content: inputvalue,
      conversationId: conversationId,
    }
  })
  const sendToAi = await openAi.chat.completions.create({
    messages: [
      {
        content: 'Hello, my name is John and I am a bank teller. How can I help you today?',
        role: 'system',
      }
    ],
    model: 'gpt-3.5-turbo',
  });
  console.log(sendToAi.choices[0].message);
  revalidatePath('/messenger');
}



export { sendMessage };