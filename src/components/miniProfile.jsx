'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserCog } from "lucide-react";
import ManageAccountDialog from "./ManageAccountDialog";
import { SignOut } from "@/lib/actions/user";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

const MiniProfile = ({ user }) => {
  //we are propdrilling cause the user can beget by getcurrentuser fun and it requires cookies which we cant use in server component
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  // If no user, show nothing or a loader
  if (!user) {
    return null; // or a spinner/loading placeholder
  }

  async function handleSignOut() {
    const res = await SignOut();
    if (res?.success) {
      router.push('/sign-in');
    } else {
      alert('Sign out failed');
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-9 w-9 cursor-pointer">
            <AvatarImage src={user?.avatar || ''} alt="User avatar" />
            <AvatarFallback className="bg-black text-white font-bold">
              {user?.username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          className="w-56 p-4 rounded-2xl border border-gray-200 shadow-lg"
        >
          <div className="flex flex-col justify-between h-48">
            <div>
              <DropdownMenuLabel className="flex flex-col items-start gap-2">
                <img
                  src={user?.avatar || ''}
                  alt={user?.username || 'user'}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Logged in as {user?.username}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </div>

            <div className="flex flex-col gap-2 mt-auto">
              <DropdownMenuItem
                onClick={() => setDialogOpen(true)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <UserCog className="h-4 w-4" />
                <span>Manage Account</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleSignOut}
                className="flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <ManageAccountDialog open={dialogOpen} onOpenChange={setDialogOpen} user={user} />
    </>
  );
};

export default MiniProfile;
