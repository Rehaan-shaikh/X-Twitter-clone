'use server';

import { prisma } from '@/lib/prisma/prisma';
import { getCurrentUser } from './user';

export async function storeComment(postId, commentText) {
  const user = await getCurrentUser();

  if (!user || !user.id) throw new Error('User not authenticated');

  const newComment = await prisma.comment.create({
    data: {
      comment: commentText,
      userId: user.id,
      postId,
      username: user.username,
      profileImg: user.avatar,
    },
  });

  return newComment;
}


export async function getCommentsByPostId(postId) {
  return await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: 'desc' }, // latest first
  });
}