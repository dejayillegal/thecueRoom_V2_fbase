import Link from 'next/link';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

export default function Header() {
  return (
    <header className="container mx-auto flex items-center justify-between p-4">
      <Link href="/" className="flex items-center gap-2">
        <Logo className="h-8 w-auto text-foreground" />
        <span className="text-lg font-normal tracking-tight">
          thecueRoom
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/login">
            <LogIn />
            Login
          </Link>
        </Button>
        <Button asChild>
          <Link href="/signup">
            <UserPlus />
            Sign Up
          </Link>
        </Button>
      </div>
    </header>
  );
}
