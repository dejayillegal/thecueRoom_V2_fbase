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
import LoginForm from './login-form';
import SignupForm from './signup-form';

export default function Header() {
  return (
    <header className="container mx-auto flex items-center justify-between p-4">
      <Link href="/" className="flex items-center gap-3">
        <Logo className="h-8 w-auto text-foreground" />
        <span className="font-headline text-xl font-bold tracking-tight">
          thecueRoom
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost">Login</Button>
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
            <Button>Sign Up</Button>
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
  );
}
