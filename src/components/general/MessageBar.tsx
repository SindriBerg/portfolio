"use client"
import { sendMessage } from '@/app/messenger-api-service';
import { useRef } from 'react';
export default function MessageBar(props: { activeUserId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFormAction(formData: FormData) {
    if (!inputRef.current) return;
    sendMessage(formData, props.activeUserId);
    inputRef.current.value = '';
  }
  return (
    <div className="py-5 w-full px-5">
      <form action={handleFormAction} className='flex'>
        <input ref={inputRef} placeholder='Aa' type="text" name="message-input" className="bg-zinc-100 w-full p-2 rounded-lg" />
        <button className='ml-5 p-2 bg-blue-400 rounded-md' type="submit">
          Send
        </button>
      </form>
    </div>
  )
};