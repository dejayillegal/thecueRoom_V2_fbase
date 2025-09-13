
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase-client';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { handleSignup } from '@/app/actions';
import SignupForm from '@/components/signup-form';

export default function SignUpPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = React.useMemo(() => sp.get('next') || '/dashboard', [sp]);
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  async function createSession(idToken: string) {
    const res = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    if (!res.ok) {
      const body = await res.text(); // not .json() to preserve exact text
      throw new Error(`Session request failed: ${body}`);
    }
  }

  async function afterAuth(isVerified: boolean) {
    try {
      if (!auth.currentUser) {
        throw new Error("No user found after authentication.");
      }
      
      if(isVerified) {
        const idToken = await auth.currentUser.getIdToken(true);
        await createSession(idToken);
        router.replace(next);
      }
      // If not verified, the user sees the "under review" message and stays on the page.
      
    } catch (e: any) {
      console.error("afterAuth (signup) error:", e);
      toast({ variant: 'destructive', title: 'Session Error', description: e.message ?? 'Could not create a server session.' });
      setLoading(false);
    }
  }
  
  async function onGoogle() {
    if (loading) return;
    setLoading(true);
    try {
      // For Google sign-up, we assume auto-verification for simplicity.
      // A real app might have a different flow.
      await signInWithPopup(auth, new GoogleAuthProvider());
      await afterAuth(true);
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Google Sign-up Failed', description: e.message ?? 'An unknown error occurred.' });
    } finally {
      setLoading(false);
    }
  }

  return (
     <div className="relative min-h-screen w-full bg-background">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--accent)/0.2),transparent)]"></div>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="absolute top-4 left-4">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-8 w-auto text-foreground" />
            <span className="font-headline text-xl font-bold tracking-tight">
              thecueRoom
            </span>
          </Link>
        </div>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create an Account</CardTitle>
            <CardDescription>
              Join the community. Your profile will be reviewed for verification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm onGoogle={onGoogle} loading={loading} setLoading={setLoading} afterAuth={afterAuth} />
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
             <Link className="underline" href="/login">
                Already have an account? Sign In
             </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
