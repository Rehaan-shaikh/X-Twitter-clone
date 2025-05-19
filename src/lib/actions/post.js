'use server';

import { prisma } from '@/lib/prisma/prisma';
import { uploadImage } from '../../../middleware';
import { cookies } from 'next/headers';

export async function Post(prevState, formData) {
  const content = formData.get('content');
  const file = formData.get('image');
  const user = JSON.parse(formData.get('user'));
  const image = await uploadImage(file);
  console.log(user,' i am user')

  if (!user) {
    return { error: 'User not authenticated' };
  }

  await prisma.post.create({
    data: {
      text: content,
      image,
      profileImg : user.avatar,
      username : user.username,
      user: {
        connect: { id: user.id },
      },
    },
  });

  return { success: true };
}

export async function getallPosts() {
  const feedPosts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  return feedPosts
}

export async function toggleLikePost(postId) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;

  if (!userId) return { error: 'Unauthorized' };

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { likes: true },
  });

  const alreadyLiked = post.likes.some((user) => user.id === userId);

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      likes: {
        [alreadyLiked ? 'disconnect' : 'connect']: { id: userId },
      },
    },
    include: {
      likes: true,
    },
  });

  return { success: true, likes: updatedPost.likes };
}

export async function deletePost(postId) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;

  if (!userId) {
    return { error: 'Unauthorized' };
  }

  try {

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return { error: 'Post not found' };
    }

    if (post.userId !== userId) {
      return { error: 'Forbidden' };
    }

    await prisma.post.delete({ where: { id: postId } });
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { error: 'Something went wrong' };
  }
}
