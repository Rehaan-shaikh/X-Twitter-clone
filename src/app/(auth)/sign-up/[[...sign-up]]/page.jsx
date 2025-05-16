'use client';

import { SignUp } from '@/lib/actions/user';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const [formState, formAction] = useActionState(SignUp, {});
  const router = useRouter();

  useEffect(() => {
    if (formState?.success) {
      router.push('/sign-in'); // client-side redirect
    }
  }, [formState?.success, router]);

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            href="/sign-in"
          >
            Sign-in
          </Link>
        </p>
      </div>

      <form action={formAction}>
        <div className="flex flex-col gap-3">
          <div className="grid w-full gap-1.5">
            <Label className="mb-1">User Name</Label>
            <Input name="username" placeholder="Enter your User Name" />

            <Label className="mb-1">Email</Label>
            <Input name="email" placeholder="Enter your Email" />

            <Label className="mb-1">Password</Label>
            <Input name="password" placeholder="Enter your Password" />
          </div>
        </div>

        {formState?.error && (
          <p className="text-red-500 text-sm mt-2">{formState.error}</p>
        )}
        {formState?.success && (
          <p className="text-green-600 text-sm mt-2">Account created successfully!</p>
        )}

        <Button type="submit" className="mt-2 w-full">
          Submit
        </Button>
      </form>
    </div>
  );
}
