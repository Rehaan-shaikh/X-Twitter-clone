'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { getPostsById } from '@/lib/actions/post';
import { useFormState } from 'react-dom';
import { getCurrentUser } from '@/lib/actions/user';
import { getCommentsByPostId, storeComment } from '@/lib/actions/comment';
import CommentList from './CommentList';

export default function CommentDialog({ open, onOpenChange, postId }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState(null);

  // const [formState , formAction] = useFormState(postComment , {})

  // 🔁 Fetch post details when dialog opens
useEffect(() => {
  if (!open) return;
  const fetchPostAndComments = async () => {
    const postData = await getPostsById(postId);
    const commentData = await getCommentsByPostId(postId);
    setPost(postData);
    setComments(commentData);
  };
  fetchPostAndComments();
}, [open, postId]);

const handleComment = async (e) => {
  e.preventDefault();
  try {
    await storeComment(postId, comment);
    setComment('');
    const updatedComments = await getCommentsByPostId(postId); // refresh
    setComments(updatedComments);
  } catch (err) {
    console.error('Failed to post comment:', err);
  }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Write a comment</DialogTitle>
          <DialogDescription>
            Share your thoughts about this post.
          </DialogDescription>
        </DialogHeader>

        {/* Render Post Details */}
        {post ? (
          <div className="flex gap-4 items-center mb-4">
            <img
              src={post.profileImg}
              alt={post.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{post.username}</p>
              <p className="text-sm text-gray-600">{post.text}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Loading ...</p>
        )}

        {/* Comment Input */}
        <form onSubmit={handleComment} className="space-y-4">
          <Textarea
            placeholder="Type your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Post Comment
          </Button>
        </form>
        {/* all comment of this post */}
        <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2 border-b pb-1">
          All Comments
        </h3>
        <CommentList comments={comments} />
      </DialogContent>
    </Dialog>
  );
}
