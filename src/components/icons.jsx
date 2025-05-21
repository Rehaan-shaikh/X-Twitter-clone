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
import { getCommentsByPostId } from '@/lib/actions/comment';
import CommentDialog from './CommentDialog';

export default function Icons({ post, currentUserId }) {
  const [likes, setLikes] = useState(post.likes || []);
  const [isLiked, setIsLiked] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setIsLiked(likes.some((user) => user.id === currentUserId));
  }, [likes, currentUserId]);

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const comments = await getCommentsByPostId(post.id);
        setCommentCount(comments.length);
      } catch (err) {
        console.error('Failed to fetch comment count:', err);
      }
    };

    fetchCommentCount();
  }, [post.id]);

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
      alert('Post deleted successfully');
    } else {
      alert(res.error || 'Failed to delete');
    }
  };

  return (
    <>
      <div className="flex justify-start gap-5 p-2 text-gray-500">
        <div className="flex items-center">
          <HiOutlineChat
            onClick={() => setCommentOpen(true)}
            className="h-8 w-8 cursor-pointer rounded-full p-2 hover:text-sky-500 hover:bg-sky-100"
          />
          {commentCount > 0 && (
            <span className="text-xs ml-1 text-gray-700">{commentCount}</span>
          )}
        </div>

        <div className="flex items-center">
          {isLiked ? (
            <HiHeart
              onClick={likePost}
              className="h-8 w-8 cursor-pointer rounded-full p-2 text-red-600 hover:text-red-500 hover:bg-red-100"
            />
          ) : (
            <HiOutlineHeart
              onClick={likePost}
              className="h-8 w-8 cursor-pointer rounded-full p-2 hover:text-red-500 hover:bg-red-100"
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
            className="h-8 w-8 cursor-pointer hover:text-red-500 hover:bg-red-100 p-2 rounded-full"
          />
        )}
      </div>

      {/* Comment Dialog */}
      <CommentDialog
        open={commentOpen}
        onOpenChange={async (open) => {
          setCommentOpen(open);
          if (!open) {
            try {
              const comments = await getCommentsByPostId(post.id);
              setCommentCount(comments.length);
            } catch (err) {
              console.error('Failed to refresh comment count:', err);
            }
          }
        }}
        postId={post.id}
      />
    </>
  );
}
