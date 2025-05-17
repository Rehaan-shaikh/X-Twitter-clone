'use server';

import { prisma } from '@/lib/prisma/prisma';
import { cookies } from 'next/headers';
import { uploadImage } from '../../../middleware';

export async function SignUp(prevState, formData) {
  const email = formData.get('email');
  const username = formData.get('username');
  const password = formData.get('password');
  const image = formData.get('avatar')
  console.log(image)
  const url = await uploadImage(image)
  console.log(url)

  if (!email || !username || !password) {
    return { error: 'All fields are required' };
  }
  if(email.trim()=='' || username.trim()=='' || password.trim()==''){
    return { error: "field are empty"}
  }
  if(!email.includes('@')){
    return { error: 'email should have @'}
  }
  try {
    const url = await uploadImage(image)
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password, 
        avatar: url
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

    const cookieStore = await cookies();  // <-- await here
    cookieStore.set('user_id', user.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: 'Something went wrong' };
  }
}

export const SignOut = async () => {
  try {
    const cookieStore = await cookies(); // <-- await here
    cookieStore.set('user_id', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 0 // delete immediately
    });

    return { success: true, message: 'Logged out successfully' };
  } catch (err) {
    console.error(err);
    return { error: 'Logout failed' };
  }
}
