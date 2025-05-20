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

export default function CommentDialog({ open, onOpenChange, postId }) {
  const [comment, setComment] = useState('');
  const [post, setPost] = useState(null);

  // 🔁 Fetch post details when dialog opens
  useEffect(() => {
    if (!open) return;
    const fetchPost = async () => {
      const postData = await getPostsById(postId);
      console.log(postData)
      console.log(postId)
      setPost(postData);
    };
    fetchPost();
  }, [open, postId]);

  const handleComment = async (e) => {
    e.preventDefault();
    console.log('Post ID:', postId);
    console.log('Comment:', comment);
    setComment('');
    onOpenChange(false);
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
          <p className="text-sm text-gray-400">Loading post...</p>
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
      </DialogContent>
    </Dialog>
  );
}
