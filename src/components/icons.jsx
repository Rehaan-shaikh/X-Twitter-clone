'use client';

import {
  HiOutlineChat,
  HiOutlineHeart,
  HiOutlineTrash,
  HiHeart,
} from 'react-icons/hi';
import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deletePost, toggleLikePost } from '@/lib/actions/post';
import CommentDialog from './CommentDialog'; // 👈 import your dialog here

export default function Icons({ post, currentUserId }) {
  const [likes, setLikes] = useState(post.likes || []);
  const [isLiked, setIsLiked] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [commentOpen, setCommentOpen] = useState(false); // 👈 control dialog
  const router = useRouter();

  useEffect(() => {
    setIsLiked(likes.some((user) => user.id === currentUserId));
  }, [likes, currentUserId]);

  const likePost = () => {
    startTransition(async () => {
      const res = await toggleLikePost(post.id);
      if (res?.success) {
        setLikes(res.likes);
      }
    });
  };

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    const res = await deletePost(post.id);
    if (res.success) {
      alert('post deleted successfully');
    } else {
      alert(res.error || 'Failed to delete');
    }
  };

  return (
    <>
      <div className='flex justify-start gap-5 p-2 text-gray-500'>
        <HiOutlineChat
          onClick={() => setCommentOpen(true)} // 👈 open dialog
          className='h-8 w-8 cursor-pointer rounded-full p-2 hover:text-sky-500 hover:bg-sky-100'
        />

        <div className='flex items-center'>
          {isLiked ? (
            <HiHeart
              onClick={likePost}
              className='h-8 w-8 cursor-pointer rounded-full p-2 text-red-600 hover:text-red-500 hover:bg-red-100'
            />
          ) : (
            <HiOutlineHeart
              onClick={likePost}
              className='h-8 w-8 cursor-pointer rounded-full p-2 hover:text-red-500 hover:bg-red-100'
            />
          )}
          {likes.length > 0 && (
            <span className={`text-xs ml-1 ${isLiked && 'text-red-600'}`}>
              {likes.length}
            </span>
          )}
        </div>

        {currentUserId === post.userId && (
          <HiOutlineTrash
            onClick={handleDelete}
            className='h-8 w-8 cursor-pointer hover:text-red-500 hover:bg-red-100 p-2 rounded-full'
          />
        )}
      </div>

      {/* Comment Dialog */}
      <CommentDialog
        open={commentOpen}
        onOpenChange={setCommentOpen}
        postId={post.id}
      />
    </>
  );
}
