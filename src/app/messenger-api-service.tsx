"use server";
import prisma from '@/db';
import { revalidatePath } from 'next/cache';

async function sendMessage(data: FormData) {
  const inputvalue = data.get('message-input')?.valueOf();
  if (typeof inputvalue !== 'string') throw new Error('Invalid input');
  if (inputvalue.length === 0) return;
  // Try to find conversation between the two users
  const conversation = await prisma.conversation.findFirst({
    where: {
      users: {
        every: {
          OR: [
            {
              id: 4
            },
            {
              id: 3
            }
          ]
        }
      }
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  });
  if (!conversation) {
    console.log('There is no conversation between the two users')
    // Create conversation and then add message
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            { id: 3 },
            { id: 4 }
          ]
        }
      }
    });
    console.log('Created new conversation');
    await prisma.message.create({
      data: {
        content: inputvalue,
        conversationId: newConversation.id,
        userId: 1
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
        userId: 3
      }
    })
  }

  revalidatePath('/messenger');
}



export { sendMessage };