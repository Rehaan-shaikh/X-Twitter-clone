'use client';

import { toggleFollowUser } from '@/lib/actions/user';
import { useTransition } from 'react';

export default function FollowButton({ profileUser ,userId}) {
  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    startTransition(() => {
      toggleFollowUser(profileUser.id);
    });
  };

  const isSelf = userId === profileUser.id;
  const isFollowing = profileUser.followers.some(
    (f) => f.id === userId
  );

  return (
    <button
      onClick={handleFollow}
      disabled={isPending || isSelf}
      className='bg-blue-500 text-white px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed'
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}
