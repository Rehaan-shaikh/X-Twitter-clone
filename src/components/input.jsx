'use server'

import { getCurrentUser } from '@/lib/actions/user';
import InputClient from './InputClient';

export default async function Input() {
  const user = await getCurrentUser(); 

  return <InputClient user={user} />;
}
