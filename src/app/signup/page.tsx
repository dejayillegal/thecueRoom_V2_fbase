
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
  const next = sp.get('next') || '/dashboard';
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  async function createSession(idToken: string, maxRetries = 3) {
    let attempt = 0;
    let lastError = "";
    while (attempt < maxRetries) {
      attempt++;
      try {
        const res = await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });
        if (!res.ok) {
          lastError = await res.text();
          throw new Error(`Session request failed with status ${res.status}`);
        }
        return;
      } catch (err) {
        console.error(`Session creation attempt ${attempt} failed:`, err, lastError);
        if (attempt < maxRetries) {
          const backoff = Math.pow(2, attempt) * 200;
          await new Promise(res => setTimeout(res, backoff));
          continue;
        }
        throw new Error(lastError || (err as Error).message || 'Failed to establish session');
      }
    }
  }

  async function afterAuth() {
    const t0 = performance.now();
    try {
      if (!auth.currentUser) {
        throw new Error("No user found after authentication.");
      }
      const idToken = await auth.currentUser.getIdToken(true);
      const t1 = performance.now();
      await createSession(idToken);
      const t2 = performance.now();
      router.replace(next);
      const t3 = performance.now();

      console.log("Signup: Get ID token took", t1 - t0, "ms");
      console.log("Signup: createSession took", t2 - t1, "ms");
      console.log("Signup: router.replace took", t3 - t2, "ms");
      
    } catch (e: any) {
      console.error("afterAuth (signup) error:", e);
      toast({ variant: 'destructive', title: 'Session Error', description: 'Could not create a server session.' });
      setLoading(false);
    }
  }
  
  async function onGoogle() {
    if (loading) return;
    setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      await afterAuth();
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
            <SignupForm onGoogle={onGoogle} loading={loading} />
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
