import { LoginForm } from '@/components/auth/auth-forms';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <span className="ml-2 text-2xl font-bold font-headline">CloudGuard AI</span>
          </Link>
          <h1 className="text-3xl font-bold font-headline">Welcome Back</h1>
          <p className="text-muted-foreground">Enter your credentials to access your dashboard.</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
