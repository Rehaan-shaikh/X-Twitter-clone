'use client';

import { toggleFollowUser } from '@/lib/actions/user';
import { useTransition } from 'react';

export default function FollowButton({ profileUser ,userId}) {
  const [isPending, startTransition] = useTransition();
  //UseTransition is a react hook that allows you handle state transitions in a way that allows you to show a loading state while the transition is happening.

  const handleFollow = () => {
    startTransition(() => {
      toggleFollowUser(profileUser.id);
    });
  };

  const isSelf = userId === profileUser.id;
  const isFollowing = profileUser.followers.some( //the profileUser object should have a followers array
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
