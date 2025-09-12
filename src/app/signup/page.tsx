'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase-client';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Logo from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { handleSignup } from '@/app/actions';

export default function SignUpPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || '/dashboard';
  const { toast } = useToast();

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{ status: string; message: string; isVerified?: boolean; } | null>(null);

  async function afterAuth(isGoogleSignup = false) {
    try {
      if (!auth.currentUser) throw new Error("No user found after authentication.");
      const idToken = await auth.currentUser.getIdToken(true);
      
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) throw new Error('Failed to create session');

      if (!isGoogleSignup) {
        // For email sign-up, we already have the review process from handleSignup
        if (result?.isVerified) {
            router.replace(next);
        }
        // If not verified, the success message is already shown.
      } else {
        // For Google sign-up, we assume auto-verification for now
        // or you can add a similar review step.
        toast({ title: 'Account Created!', description: 'Welcome to thecueRoom.'});
        router.replace(next);
      }

    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Session Error', description: 'Could not create a server session.' });
      setLoading(false);
    }
  }

  async function onEmailSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // Create user first to get a UID
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (name) { await updateProfile(userCredential.user, { displayName: name }); }

      // Then, call our verification server action
      const verificationPayload = {
        email: userCredential.user.email,
        password,
        profileUrls: 'google.com', // Placeholder until form has this
        contentPatterns: '', // Placeholder
        newsletter: false, // Placeholder
      };
      const signupResult = await handleSignup(verificationPayload);
      setResult(signupResult);
      
      if (signupResult.status === 'success') {
         toast({ title: signupResult.isVerified ? 'Account Verified!' : 'Application Under Review', description: signupResult.message });
         await afterAuth();
      } else {
         toast({ variant: 'destructive', title: 'Sign-up Failed', description: signupResult.message });
      }

    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Sign-up Error', description: e.message ?? 'An unknown error occurred.' });
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    if (loading) return;
    setLoading(true);
    try {
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
          <CardContent className="space-y-4">
            <form onSubmit={onEmailSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="Password (min 8 chars)" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} disabled={loading} />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
              </Button>
            </form>
             <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button variant="outline" onClick={onGoogle} disabled={loading} className="w-full">
              {loading ? <Loader2 className="animate-spin" /> : 'Sign up with Google'}
            </Button>
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
