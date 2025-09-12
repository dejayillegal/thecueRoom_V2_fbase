import Link from 'next/link';
import Logo from '@/components/logo';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
       <header className="container mx-auto flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-8 w-auto text-foreground" />
            <span className="font-headline text-xl font-bold tracking-tight">
              thecueRoom
            </span>
          </Link>
        </header>
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
          <p className="text-muted-foreground">This is where the magic happens.</p>
        </div>
      </main>
    </div>
  );
}
