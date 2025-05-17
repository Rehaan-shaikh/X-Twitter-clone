'use server';

import { prisma } from '@/lib/prisma/prisma';
import { uploadImage } from '../../../middleware';

export async function Post(prevState, formData) {
  const content = formData.get('content');
  const file = formData.get('image');
  const userId = formData.get('userid');
  const image = await uploadImage(file);
  console.log(image, ' i am image url')

  if (!userId) {
    return { error: 'User not authenticated' };
  }

  await prisma.post.create({
    data: {
      content,
      image,
      user: {
        connect: { id: userId },
      },
    },
  });

  return { success: true };
}
