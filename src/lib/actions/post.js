'use server';

import { prisma } from '@/lib/prisma/prisma';
import { uploadImage } from '../../../middleware';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

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
        // You're telling Prisma:
        // 👉 "Don't create a new user, just link this post to an existing user whose id is user.id." So it fills the foreign key userId in your Post model.
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

export async function getPostsById(postId) {
  const Post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!Post) {
    return { error: 'Post not found' };
  }

  return Post;
}



export async function toggleLikePost(postId) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;

  if (!userId) return { error: 'Unauthorized' };

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { likes: true },
  });
  
  // post.likes is an array of User objects — all the users who have liked the post 
  const alreadyLiked = post.likes.some((user) => user.id === userId);
  //This checks if at least one item in the array passes a condition and returns true or false.

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      likes: {
        [alreadyLiked ? 'disconnect' : 'connect']: { id: userId },
        // Toggle like: if user already liked, disconnect; else, connect the user to the post's likes
        // e.g., if userId = 'u1' liked postId = 'p1', then disconnect removes the like; connect adds it
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
    revalidatePath('/');
    // Use revalidatePath() only in a form action, mutation function, or API route, not in fetch/query functions.
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { error: 'Something went wrong' };
  }
}

export async function getPostsByUserId(userId) {
  try {
    return await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        likes: true,
        comments: true,
      },
    });
  } catch (error) {
    console.error('Error getting posts by userId:', error);
    return [];
  }
}


export const searchPostsByTerm = async (searchTerm) => {
  try {
    const decodedTerm = decodeURIComponent(searchTerm);

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { username: { contains: decodedTerm, mode: 'insensitive' } },
          { text: { contains: decodedTerm, mode: 'insensitive' } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts;
  } catch (err) {
    console.error('Failed to search posts:', err);
    return [];
  }
};
