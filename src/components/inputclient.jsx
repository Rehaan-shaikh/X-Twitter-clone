'use client';

import { HiOutlinePhotograph } from 'react-icons/hi';
import { useActionState, useEffect, useRef, useState } from 'react';
import { Post } from '@/lib/actions/post';

export default function InputClient({ user }) {
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const imagePickRef = useRef(null);
  const [formState, formAction] = useActionState(Post, {});

  const addImageToPost = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      //URL.createObjectURL(file) gives you a temporary local preview URL, it cannot replace a real upload to a server or cloud storage like Cloudinary.
    }
  };

  useEffect(() => {
  if (formState.success) {
    location.reload(); // 🔄 Reload the page
  }
  }, [formState.success]);

  return (
    <form action={formAction}>
      <div className="flex border-b border-gray-200 p-3 space-x-3 w-full">
        <img
          src={user.avatar}
          alt="user-img"
          className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95 object-cover"
        />
        <div className="w-full divide-y divide-gray-200">
          <textarea
            name="content"
            className="w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700"
            placeholder="Whats happening"
            rows="2"
          ></textarea>
          {selectedFile && (
            <img
              onClick={() => {
                setSelectedFile(null);
                setImageFileUrl(null);
              }}
              src={imageFileUrl}
              alt="selected-img"
              className="w-full max-h-[250px] object-cover cursor-pointer"
            />
          )}
          <div className="flex items-center justify-between pt-2.5">
            <HiOutlinePhotograph
              className="h-10 w-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer"
              onClick={() => imagePickRef.current.click()}
            />
            <input
              type="file"
              name="image"
              ref={imagePickRef}
              accept="image/*"
              hidden
              onChange={addImageToPost}
            />
            <input name='user' defaultValue={JSON.stringify(user)} hidden />  
            {/* this input adds user filed in formData for backend  */}
            <button
              type="submit"
              disabled={formState.submitting}
              className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
            >
              {formState.submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
      {formState.success && <h1>hi</h1>}
    </form>
  );
}
