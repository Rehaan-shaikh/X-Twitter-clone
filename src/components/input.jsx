'use server'

import { getCurrentUser } from '@/lib/actions/user';
import InputClient from './inputclient';

export default async function Input() {
  const user = await getCurrentUser(); 

  return <InputClient user={user} />;
}
