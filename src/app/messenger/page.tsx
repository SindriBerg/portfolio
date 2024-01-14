import prisma from '@/db';

export default async function MessengerPage() {
  const test = await prisma.message.findMany();
  console.log(test)
  return (
    <div>
      <h1>MessengerRelayPage</h1>
      <p>Find me in ./web/src/pages/MessengerRelayPage/MessengerRelayPage.tsx</p>
    </div>
  )
}