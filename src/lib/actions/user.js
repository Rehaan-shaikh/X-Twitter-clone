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

    const cookieStore = cookies();
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


export async function UpdateUserProfile(formData) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;
    if (!userId) return { error: 'Not authenticated' };

    const username = formData.get('username');
    const newPassword = formData.get('password');
    const currentPassword = formData.get('currentPassword');
    const image = formData.get('avatar'); // Might be File or null

    let updateData = {};

    // Fetch current user from DB to check password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: 'User not found' };
    }

    if (username && username.trim() !== '') {
      updateData.username = username;
    }

    // Password change logic with verification
    if (newPassword && newPassword.trim() !== '') {
      if (!currentPassword || currentPassword.trim() === '') {
        return { error: 'Please provide your current password to change it.' };
      }

    // Simple check (only if passwords are plain text in DB, NOT recommended)
    if (currentPassword !== user.password) {
      return { error: 'Current password is incorrect.' };
    }
    updateData.password = newPassword;

    }

    if (image && image.size > 0) {
      const avatarUrl = await uploadImage(image);
      updateData.avatar = avatarUrl;
    }

    if (Object.keys(updateData).length === 0) {
      return { error: 'No valid data to update' };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    revalidatePath('/');

    return { success: true, user: updatedUser };
  } catch (err) {
    console.error(err);
    return { error: 'Profile update failed' };
  }
}
