import MessageBar from '@/components/general/MessageBar';
import prisma from '@/db';
import { Avatar } from '@mui/material';
import { Message, User } from '@prisma/client';

const MessageListEntry = (props: { content: string, userId: string, isCurrentUser: boolean }) => {
  return (
    <div className={`flex ${props.isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {props.isCurrentUser && <Avatar sx={{ height: 24, width: 24, marginRight: 1 }} />}
      <p className='bg-zinc-300 px-2 rounded-md mr-2'>{props.content}</p>
    </div>
  )
}

async function MessageList(props: { activeUserId: Message['userId'] }) {
  const { activeUserId } = props;
  const conversation = await prisma.conversation.findFirst({
    where: {
      participantIds: {
        hasEvery: [activeUserId, "65a3eabcb60244adf37015fb"]
      }
    },
    include: {
      participants: true,
      messages: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });
  return (
    <div className='w-full flex flex-col-reverse p-5 gap-2 bg-zinc-100'>
      {conversation?.messages.map((m) => <MessageListEntry content={m.content} userId={m.userId} isCurrentUser={m.userId === "65a3eabcb60244adf37015fb"} />)}
    </div>
  )
}

const UserListEntry = (props: User) => {
  return (
    <div className="flex flex-row h-[68px] w-full items-center">
      <Avatar sx={{ height: 48, width: 48, marginRight: 1 }} />
      <p className="text-lg">{props.username}</p>
    </div>
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


export default async function MessengerPage() {
  return (
    <div className="flex flex-col relative h-full justify-between pt-5">
      <div className="flex flex-row h-full px-5 gap-5">
        <MessageList activeUserId={"65a3eaabb60244adf37015f9"} />
        <UserList />
      </div>
      <MessageBar activeUserId="65a3eaabb60244adf37015f9" />
    </div>
  )
}