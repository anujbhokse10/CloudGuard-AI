import { SignupForm } from '@/components/auth/auth-forms';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <span className="ml-2 text-2xl font-bold font-headline">CloudGuard AI</span>
          </Link>
          <h1 className="text-3xl font-bold font-headline">Create an Account</h1>
          <p className="text-muted-foreground">Start your journey to a more secure cloud.</p>
        </div>
        <SignupForm />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
