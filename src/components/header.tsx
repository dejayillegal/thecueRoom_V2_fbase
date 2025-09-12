import Link from 'next/link';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';

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
        <Button variant="ghost" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    </header>
  );
}