'use server';

import { prisma } from '@/lib/prisma/prisma';
import { cookies } from 'next/headers';
import { uploadImage } from '../../../middleware';
import { revalidatePath } from 'next/cache';

export async function SignUp(prevState, formData) {
  const email = formData.get('email');
  const username = formData.get('username');
  const password = formData.get('password');
  const image = formData.get('avatar');

  if (!email || !username || !password) {
    return { error: 'All fields are required' };
  }

  if (email.trim() === '' || username.trim() === '' || password.trim() === '') {
    return { error: 'Fields are empty' };
  }

  if (!email.includes('@')) {
    return { error: 'Email should contain @' };
  }

  try {
    const url = await uploadImage(image);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password,
        avatar: url,
      },
    });

    return { success: true, user };
  } catch (err) {
    console.error(err);
    return { error: 'Something went wrong!' };
  }
}

export async function SignIn(prevstate, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { error: 'User not found' };
    }

    if (user.password !== password) {
      return { error: 'Incorrect password' };
    }

    const cookieStore = await cookies();
    cookieStore.set('user_id', user.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: 'Something went wrong' };
  }
}

export const SignOut = async () => {
  try {
    const cookieStore = cookies();
    cookieStore.set('user_id', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return { success: true, message: 'Logged out successfully' };
  } catch (err) {
    console.error(err);
    return { error: 'Logout failed' };
  }
};

export async function getCurrentUser() {
  const cookieStore = await cookies(); // ✅ await here
  const userId = cookieStore.get('user_id')?.value;

  // console.log(userId, ' i am id');
  // console.log(cookieStore.get('user_id'), ' i am cookie');

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      avatar: true,
    },
  });

  return user;
}

export async function UpdateUserProfile(prevState, formData) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) return { error: 'Not authenticated' };

    const username = formData.get('username');
    const newPassword = formData.get('password');
    const currentPassword = formData.get('currentPassword');
    const image = formData.get('avatar'); // File object

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { error: 'User not found' };

    const updateData = {};

    // Username update
    if (username && username.trim() !== '' && username !== user.username) {
      updateData.username = username;
    }

    // Password update with current password check
    if (newPassword && newPassword.trim() !== '') {
      if (!currentPassword || currentPassword.trim() === '') {
        return { error: 'Please provide your current password to change it.' };
      }
      if (currentPassword !== user.password) {
        return { error: 'Current password is incorrect.' };
      }
      updateData.password = newPassword;
    }

    // Avatar update
    if (image && typeof image === 'object' && image.size > 0) {
      const avatarUrl = await uploadImage(image);
      updateData.avatar = avatarUrl;
    }

    // If nothing to update
    if (Object.keys(updateData).length === 0) {
      return { error: 'No valid data to update' };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    revalidatePath('/'); // Re-fetch user data if needed

    return { success: true, user: updatedUser };
  } catch (err) {
    console.error('Update failed:', err);
    return { error: 'Profile update failed' };
  }
}

export async function getUserByUsername(username) {
  try {
    return await prisma.user.findUnique({
      where: { username },
      include: {
        followers: true,
        following: true,
      },
    });
  } catch (error) {
    console.error('Error in getUserByUsername:', error);
    return null;
  }
}

export async function toggleFollowUser(profileUserId) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.id) throw new Error('Not authenticated');
  if (currentUser.id === profileUserId) throw new Error('You cannot follow yourself');

  const existingFollow = await prisma.userFollow.findUnique({
    where: {
      followerId_followingId: {  
        //followerId_followingId is a composite unique key in your Prisma schema.
        // It combines two fields:
        // followerId followingId
        followerId: currentUser.id,
        followingId: profileUserId,
      },
    },
  });

  if (existingFollow) {
    // Unfollow
    await prisma.userFollow.delete({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: profileUserId,
        },
      },
    });
  } else {
    // Follow
    await prisma.userFollow.create({
      data: {
        followerId: currentUser.id,
        followingId: profileUserId,
      },
    });
  }

  revalidatePath(`/user/${profileUserId}`);
}

