'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import News from './News';

export default function RightSidebar() {
  const [input, setInput] = useState('');
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    router.push(`/search/${input}`);
  };
  return (
    <>
      <div className='sticky top-0 py-2 pb-6'>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Search'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className=' border rounded-3xl text-sm w-full px-4 py-2'
          />
        </form>
      </div>
      <News />
    </>
  );
}
