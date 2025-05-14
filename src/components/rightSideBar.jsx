'use client' 
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const RightSideBar = () => {
  const router = useRouter();;
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if(searchTerm.trim()===0) return
    router.push(`/search/${searchTerm}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search here"
          className='bg-gray-700 border border-gray-200 rounded-3xl text-sm w-full px-4 py-2'
        />
      </form>
    </div>
  );
}

export default RightSideBar
