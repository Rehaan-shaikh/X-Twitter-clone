'use server';

import { prisma } from '@/lib/prisma/prisma';
import { uploadImage } from '../../../middleware';

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
