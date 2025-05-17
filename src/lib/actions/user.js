'use server';

import { prisma } from '@/lib/prisma/prisma';
import { cookies } from 'next/headers';
import { uploadImage } from '../../../middleware';

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

  console.log(userId, ' i am id');
  console.log(cookieStore.get('user_id'), ' i am cookie');

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

