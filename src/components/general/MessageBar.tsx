"use client"
import { sendMessage } from '@/app/messenger-api-service';
import { useRef } from 'react';

export default function MessageBar(props: { conversationId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFormAction(formData: FormData) {
    if (!inputRef.current) return;
    const inputvalue = formData.get('message-input')?.valueOf();
    if (typeof inputvalue !== 'string') throw new Error('Invalid input');
    if (inputvalue.length === 0) return;
    inputRef.current.value = '';
    await sendMessage(inputvalue, props.conversationId);
    // await getReplyFromOpenAi(inputvalue, props.conversationId);
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