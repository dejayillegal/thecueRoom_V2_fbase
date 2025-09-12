'use client';

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/logo";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/dashboard";

  async function handleGoogle() {
    try {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      const idToken = await cred.user.getIdToken(true);

      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) {
        console.error("session POST failed", await res.text());
        return;
      }
      router.replace(next);
    } catch (error) {
        console.error("Sign in failed", error)
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
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Join thecueRoom</CardTitle>
            <CardDescription>
              Sign in to access the community and your tools.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGoogle} className="w-full">
                Continue with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
