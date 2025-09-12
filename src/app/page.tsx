import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import SignupForm from '@/components/signup-form';
import { ScrollArea } from '@/components/ui/scroll-area';


export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-background">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--accent)/0.2),transparent)]"></div>
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
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
            <div className="flex gap-4">
               <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg">Join the Community</Button>
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
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </main>
        <footer className="container mx-auto p-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} thecueRoom. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
