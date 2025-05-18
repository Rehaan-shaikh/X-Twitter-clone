'use client';

import { useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UpdateUserProfile } from '@/lib/actions/user';

export default function ManageAccountDialog({ open, onOpenChange, user }) {
  console.log(user);

  const [message, setMessage] = useState(null);
  const formRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const res = await UpdateUserProfile(formData);
    if (res.success) {
      setMessage('✅ Profile updated successfully!');
    } else {
      setMessage(res.error || '❌ Something went wrong.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-4">
          {/* User info section */}
          {user && (
            <div className="flex items-center gap-4">
              <img
                src={user.avatar || '/default-avatar.png'}
                alt={user.username || 'User avatar'}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{user.username}</span>
                <span className="text-sm text-gray-500">{user.email}</span>
              </div>
            </div>
          )}

          {/* Dialog title and description */}
          <DialogTitle>Manage Your Account</DialogTitle>
          <DialogDescription>
            Update your username, avatar, or password.
          </DialogDescription>
        </DialogHeader>

<form ref={formRef} onSubmit={handleSubmit} className="space-y-4 mt-4">
  <div className="space-y-1">
    <Label htmlFor="username">Username</Label>
    <Input
      name="username"
      id="username"
      placeholder="Enter new username"
      defaultValue={user?.username || ''}
    />
  </div>

  <div className="space-y-1">
    <Label htmlFor="currentPassword">Current Password</Label>
    <Input
      name="currentPassword"
      id="currentPassword"
      type="password"
      placeholder="Enter current password"
      autoComplete="current-password"
    />
  </div>

  <div className="space-y-1">
    <Label htmlFor="password">New Password</Label>
    <Input
      name="password"
      id="password"
      type="password"
      placeholder="New password"
      autoComplete="new-password"
    />
  </div>

  <div className="space-y-1">
    <Label htmlFor="avatar">Avatar</Label>
    <Input name="avatar" id="avatar" type="file" accept="image/*" />
  </div>

  <Button type="submit" className="w-full">
    Update
  </Button>

  {message && (
    <p className="text-sm text-center text-gray-600 mt-2">{message}</p>
  )}
</form>

      </DialogContent>
    </Dialog>
  );
}
