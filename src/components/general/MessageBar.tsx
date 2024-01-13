"use client"
import { sendMessage } from '@/app/messenger-api-service';
export default function MessageBar() {

  return (
    <div className="py-5 w-full px-5">
      <form action={sendMessage} className='flex'>
        <input placeholder='Aa' type="text" name="message-input" className="bg-zinc-100 w-full p-2 rounded-lg" />
        <button className='ml-5 p-2 bg-blue-400 rounded-md' type="submit">
          Send
        </button>
      </form>
    </div>
  )
};