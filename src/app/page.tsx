import Logo from '@/components/logo';
import SignupForm from '@/components/signup-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-background">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--accent)/0.2),transparent)]"></div>
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="container mx-auto flex items-center justify-between p-4">
          <Logo className="h-8 w-auto text-foreground" />
          <div className="flex items-center gap-4">
            <Button variant="ghost">Login</Button>
            <Button>Sign Up</Button>
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center p-4">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
                thecueRoom
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                An exclusive community for India&apos;s underground artists & DJs.
              </p>
            </div>
            <Card className="w-full max-w-lg text-left">
              <CardHeader>
                <CardTitle className="text-2xl">Create your account</CardTitle>
                <CardDescription>
                  Join the community. Your profile will be reviewed for verification.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SignupForm />
              </CardContent>
            </Card>
          </div>
        </main>
        <footer className="container mx-auto p-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} thecueRoom. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
