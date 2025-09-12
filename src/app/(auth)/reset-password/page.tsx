
'use client';
import * as React from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Logo from '@/components/logo';

export default function ResetPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if(loading) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: 'Check your inbox', description: 'A password reset link has been sent to your email address.' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message ?? 'Failed to send reset email.' });
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
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>Enter your email to receive a reset link.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading}/>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="animate-spin"/> : 'Send Reset Email'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
