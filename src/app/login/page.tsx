
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase-client';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Logo from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { FirebaseError } from 'firebase/app';


export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || '/dashboard';
  const { toast } = useToast();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function createSession(idToken: string) {
      const t0 = performance.now();
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ idToken }),
        credentials: 'include',
      });

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Session request failed: ${errorBody}`);
      }
      console.debug('Login: createSession took', performance.now() - t0, 'ms');
  }

  async function afterAuth() {
    try {
      if (!auth.currentUser) {
        throw new Error("No user found after authentication.");
      }
      const t0 = performance.now();
      const idToken = await auth.currentUser.getIdToken(true);
      console.debug('Login: Get ID token took', performance.now() - t0, 'ms');

      if (!idToken) throw new Error('No ID token');
      await createSession(idToken);
      router.replace(next);
    } catch (e: any) {
      console.error("afterAuth error:", e);
      toast({
        variant: 'destructive',
        title: 'Session Error',
        description: e.message ?? 'Could not create a server session. Please try again.'
      });
      setLoading(false);
    }
  }

  async function onEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      await afterAuth();
    } catch (e: any) {
      const fe = e as FirebaseError;
      console.error("Email sign-in error:", fe?.code, fe?.message);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description:
          fe?.code === "auth/invalid-credential"
            ? "Invalid email or password, or Email/Password sign-in is disabled."
            : fe?.message || "Could not sign in. Please try again.",
      });
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
      console.error("Google sign-in error:", e);
      toast({ variant: 'destructive', title: 'Google Sign-In Failed', description: 'Could not sign in with Google. Please try again.' });
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
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access the community and your tools.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={onEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
              </Button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" onClick={onGoogle} disabled={loading} className="w-full">
              {loading ? <Loader2 className="animate-spin" /> : 'Google'}
            </Button>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
             <Link className="underline" href="/signup">
                Don't have an account? Sign up
             </Link>
             <Link className="underline text-muted-foreground" href="/reset-password">
                Forgot password?
             </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
