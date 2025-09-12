import Link from 'next/link';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import LoginForm from '@/components/login-form';
import SignupForm from '@/components/signup-form';
import { LogIn, UserPlus } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="relative min-h-screen w-full bg-background">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--accent)/0.2),transparent)]" />
      <header className="container relative z-10 mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-auto text-foreground" />
          <span className="text-lg font-normal tracking-tight">
            thecueRoom
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">
                <LogIn />
                Login
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Welcome back</DialogTitle>
                <DialogDescription>
                  Enter your credentials to access your account.
                </DialogDescription>
              </DialogHeader>
              <LoginForm />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus />
                Sign Up
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create your account</DialogTitle>
                <DialogDescription>
                  Join the community. Your profile will be reviewed for verification.
                </DialogDescription>
              </DialogHeader>
              <SignupForm />
            </DialogContent>
          </Dialog>
        </div>
      </header>
       <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
            <SignupForm />
        </div>
      </main>
    </div>
  );
}
