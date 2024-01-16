import MessageBar from '@/components/general/MessageBar';
import MessageList from '@/components/general/MessageList';
import { prisma, openAi } from '@/db';
import { Avatar } from '@mui/material';
import { Message, Character } from '@prisma/client';
import Link from 'next/link';
import { CreateChatCompletionRequestMessage } from 'openai/resources/chat/index.mjs';
import { useEffect } from 'react';


async function getReplyFromOpenAi(conversationMessages: Message[], conversationId: string) {
  "use server"
  const messages: CreateChatCompletionRequestMessage[] = conversationMessages.map(message => ({
    content: message.content,
    role: 'system'
  }))
  const sendToAi = await openAi.chat.completions.create({
    messages: messages,
    model: 'gpt-3.5-turbo',
  });
  const reply = sendToAi.choices[0].message;
  if (!reply.content) return;
  await prisma.message.create({
    data: {
      conversationId,
      content: reply.content,
      isFromUser: false,
    }
  })
}

const UserListEntry = (props: Character) => {
  return (
    <Link href={props.id} className="hover:bg-primary-main rounded-lg transition-colors flex flex-row h-[68px] w-full items-center">
      <Avatar sx={{ height: 48, width: 48, marginRight: 1 }} src={props.imageUrl} />
      <p className="text-lg">{props.name}</p>
    </Link>
  )
}

async function UserList() {
  const users = await prisma.character.findMany();
  return (
    <div className="flex flex-col bg-secondary-300 gap-2 rounded-lg w-[300px] pl-2 pt-2">
      {users.map((u) => <UserListEntry key={u.id} {...u} />)}
    </div>
  )
}

// await prisma.character.create({
//   data: {
//     name: 'Rick Sanchez',
//     imageUrl: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
//     id: 'rick-sanches',
//   }
// })
// await prisma.character.create({
//   data: {
//     name: 'Morty Smith',
//     imageUrl: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
//     id: 'morty-smith',
//   }
// })
// await prisma.character.create({
//   data: {
//     name: 'Summer Smith',
//     imageUrl: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
//     id: 'summer-smith',
//   }
// })
// await prisma.character.create({
//   data: {
//     name: 'Beth Smith',
//     imageUrl: 'https://rickandmortyapi.com/api/character/avatar/4.jpeg',
//     id: 'beth-smith',
//   }
// })
// await prisma.character.create({
//   data: {
//     name: 'Jerry Smith',
//     imageUrl: 'https://rickandmortyapi.com/api/character/avatar/5.jpeg',
//     id: 'jerry-smith',
//   }
// })

async function createCharacters() {
  const characters = await prisma.character.findMany();
  if (characters.length === 0) {
    await Promise.all([
      prisma.character.create({
        data: {
          name: 'Rick Sanchez',
          imageUrl: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
          id: 'rick-sanches',
        }
      }),
      prisma.character.create({
        data: {
          name: 'Morty Smith',
          imageUrl: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
          id: 'morty-smith',
        }
      }),
      prisma.character.create({
        data: {
          name: 'Summer Smith',
          imageUrl: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
          id: 'summer-smith',
        }
      }),
      prisma.character.create({
        data: {
          name: 'Beth Smith',
          imageUrl: 'https://rickandmortyapi.com/api/character/avatar/4.jpeg',
          id: 'beth-smith',
        }
      }),
      prisma.character.create({
        data: {
          name: 'Jerry Smith',
          imageUrl: 'https://rickandmortyapi.com/api/character/avatar/5.jpeg',
          id: 'jerry-smith',
        }
      }),
    ])
  }
}


async function findOrCreateConversationWithUser(characterId: string) {
  // Search for an existing conversation that includes both the current user and the other user
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      participants: {
        some: {
          characterId: characterId,
        },
      },
    },
    include: {
      participants: true,
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
      }
    },
  });

  // If a conversation exists, return it
  if (existingConversation) {
    return existingConversation;
  }

  // If not, create a new conversation with both users
  const newConversation = await prisma.conversation.create({
    data: {
      participants: {
        create: [
          { characterId: characterId },
        ],
      },
    },
    include: {
      participants: true,
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
      }
    },
  });

  return newConversation;
}

export default async function MessengerPage({ params }: { params: { characterName: string } }) {
  // const characters = await prisma.character.findMany();
  // await createCharacters();
  const conversation = await findOrCreateConversationWithUser(params.characterName);
  return (
    <div className="flex flex-col relative h-full justify-between pt-5">
      <div className="flex flex-row h-full px-5 gap-5">
        <MessageList messages={conversation.messages} conversationId={conversation.id} />
        <UserList />
      </div>
      <MessageBar conversationId={conversation.id} />
    </div>
  )
}