'use server';

import { prisma } from '@/lib/prisma/prisma';
import { getCurrentUser } from './user';
import { revalidatePath } from 'next/cache';

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
  revalidatePath('/');

  return newComment;
}


export async function getCommentsByPostId(postId) {
  return await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          username: true,
          avatar: true, // ✅ this exists in your User model
        },
      },
    },
  });
}
