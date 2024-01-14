"use server";
import prisma from '@/db';
import { revalidatePath } from 'next/cache';

async function sendMessage(data: FormData, activeUserId: string) {
  const inputvalue = data.get('message-input')?.valueOf();
  if (typeof inputvalue !== 'string') throw new Error('Invalid input');
  if (inputvalue.length === 0) return;
  // Try to find conversation between the two users
  const conversation = await prisma.conversation.findFirst({
    where: {
      participantIds: {
        hasEvery: ["65a3eabcb60244adf37015fb", activeUserId]
      }
    }
  })
  if (!conversation) {
    console.log('There is no conversation between the two users')
    // Create conversation and then add message
    const newConversation = await prisma.conversation.create({
      data: {
        participantIds: {
          set: ["65a3eabcb60244adf37015fb", activeUserId]
        }
      }
    });
    console.log('Created new conversation');
    await prisma.message.create({
      data: {
        conversationId: newConversation.id,
        userId: "65a3eabcb60244adf37015fb",
        content: inputvalue
      }
    })
  }
  else {
    console.log('Found conversation between the two users')
    // Add message to conversation
    await prisma.message.create({
      data: {
        content: inputvalue,
        conversationId: conversation.id,
        userId: "65a3eabcb60244adf37015fb"
      }
    })
  }

  revalidatePath('/messenger');
}



export { sendMessage };