'use client';

import { useActionState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignIn } from '@/lib/actions/user';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const [formState, formAction] = useActionState(SignIn, {});
  const router = useRouter();

  useEffect(() => {
    if (formState?.success) {
      router.push('/'); 
    }
  }, [formState?.success, router]);

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            href="/sign-up"
          >
            Register
          </Link>
        </p>
      </div>

      <form action={formAction}>
        <div className="flex flex-col gap-3">
          <div className="grid w-full gap-1.5">
            <Label className="mb-1">Email</Label>
            <Input name="email" type="email" placeholder="Enter your Email" />

            <Label className="mb-1">Password</Label>
            <Input name="password" type="password" placeholder="Enter your Password" />
          </div>
        </div>

        {formState?.error && (
          <p className="text-red-500 text-sm mt-2">{formState.error}</p>
        )}
        {formState?.success && (
          <p className="text-green-600 text-sm mt-2">Login successful!</p>
        )}

        <Button type="submit" className="mt-2 w-full">
          Sign In
        </Button>
      </form>
    </div>
  );
}
