import MessageBar from '@/components/general/MessageBar';
import { prisma } from '@/db';
import { Avatar } from '@mui/material';
import { Message, User } from '@prisma/client';
import Link from 'next/link';

const UserListEntry = (props: User) => {
  return (
    <Link href={props.id}>
      <div className="flex flex-row h-[68px] w-full items-center">
        <Avatar sx={{ height: 48, width: 48, marginRight: 1 }} />
        <p className="text-lg">{props.username}</p>
      </div>
    </Link>
  )
}

async function UserList() {
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        id: '65a3eabcb60244adf37015fb'
      }
    }
  });
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-zinc-300 w-[300px] pl-2 pt-2">
      {users.map((u) => <UserListEntry key={u.id} {...u} />)}
    </div>
  )
}

const MessageListEntry = (props: { content: string, userId: string, isCurrentUser: boolean }) => {
  return (
    <div className={`flex ${props.isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!props.isCurrentUser && <Avatar sx={{ height: 24, width: 24, marginRight: 1 }} />}
      <p className='bg-zinc-300 px-2 rounded-md mr-2'>{props.content}</p>
    </div>
  )
}

function MessageList(props: { messages: Message[] }) {
  const { messages } = props;
  return (
    <div className='w-full flex flex-col-reverse p-5 gap-2 bg-zinc-100'>
      {messages.map((m) => <MessageListEntry key={m.id} content={m.content} userId={m.userId} isCurrentUser={m.userId === "65a3eabcb60244adf37015fb"} />)}
    </div>
  )
}

export default async function MessengerPage({ params }: { params: { userId: string } }) {
  let conversation = await prisma.conversation.findFirst({
    where: {
      participants: {
        every: {
          userId: {
            in: ["65a3eabcb60244adf37015fb", params.userId]
          }
        }
      },
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'desc'
        }
      },
      participants: true
    }
  })
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        participants: {
          connect: [
            {
              userId: "65a3eabcb60244adf37015fb"
            },
            {
              userId: params.userId
            }
          ]
        }
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        participants: true
      }
    })
  }
  return (
    <div className="flex flex-col relative h-full justify-between pt-5">
      <div className="flex flex-row h-full px-5 gap-5">
        <MessageList messages={conversation.messages} />
        <UserList />
      </div>
      <MessageBar conversationId={conversation.id} />
    </div>
  )
}