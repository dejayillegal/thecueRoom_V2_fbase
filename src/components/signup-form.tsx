
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Clock, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { handleSignup } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "./ui/separator";
import { auth } from "@/lib/firebase-client";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const signupSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
  profileUrls: z
    .string()
    .min(1, { message: "Please provide at least one profile URL." }),
  contentPatterns: z.string().optional(),
  newsletter: z.boolean().default(false),
});

type SignupFormValues = z.infer<typeof signupSchema>;

type ActionResult = {
  status: "success" | "error";
  message: string;
  isVerified?: boolean;
};

interface SignupFormProps {
    onGoogle: () => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    afterAuth: (isVerified: boolean) => Promise<void>;
}

export default function SignupForm({ onGoogle, loading, setLoading, afterAuth }: SignupFormProps) {
  const [result, setResult] = useState<ActionResult | null>(null);
  const { toast } = useToast();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      profileUrls: "",
      contentPatterns: "",
      newsletter: false,
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    try {
      // Create user first to get a UID
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      if (data.name) { await updateProfile(userCredential.user, { displayName: data.name }); }
      
      const res = await handleSignup(data);
      setResult(res);
      
      if (res.status === 'success') {
         toast({ title: res.isVerified ? 'Account Verified!' : 'Application Under Review', description: res.message });
         await afterAuth(res.isVerified ?? false);
      } else {
         toast({
          variant: 'destructive',
          title: 'Signup Failed',
          description: res.message,
        });
        setLoading(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      setResult({ status: 'error', message: errorMessage });
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: errorMessage,
      });
      setLoading(false);
    }
  };
  
  if (result?.status === "success" && !result.isVerified) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed border-accent/50 bg-accent/10 p-8 text-center">
        <div className="rounded-full bg-accent p-3 text-accent-foreground">
            <Clock className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold">Application Received</h3>
        <p className="text-muted-foreground">{result.message}</p>
        <p className="text-xs text-muted-foreground pt-4">You can now close this window. We'll email you upon approval.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input placeholder="Your Name" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input placeholder="artist@domain.com" {...field} disabled={loading}/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={loading}/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <Separator />

        <div className="space-y-4">
            <FormField
            control={form.control}
            name="profileUrls"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Profile URLs</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="e.g., soundcloud.com/artist&#10;beatport.com/artist/name&#10;instagram.com/artist"
                    className="min-h-[100px]"
                    {...field}
                    disabled={loading}
                    />
                </FormControl>
                <FormDescription>
                    One URL per line. Include SoundCloud, Beatport, Instagram, RA, etc.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="contentPatterns"
            render={({ field }) => (
                <FormItem>
                <FormLabel>About You</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="Describe your involvement in the techno/house scene. Mention genres, collectives, labels, or events you're associated with."
                    className="min-h-[100px]"
                    {...field}
                    disabled={loading}
                    />
                </FormControl>
                <FormDescription>
                    This helps us with faster verification.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="newsletter"
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                    <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                    />
                </FormControl>
                <div className="space-y-1 leading-none">
                    <FormLabel>
                    Subscribe to our personalized newsletter
                    </FormLabel>
                    <FormDescription>
                    Receive curated jobs, templates, and news.
                    </FormDescription>
                </div>
                </FormItem>
            )}
            />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <UserPlus />
              Create Account & Verify
            </>
          )}
        </Button>
      </form>
      <div className="relative my-4">
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
    </Form>
  );
}
