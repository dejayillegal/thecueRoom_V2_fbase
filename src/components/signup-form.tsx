"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Clock, UserCheck, UserPlus, RefreshCcw } from "lucide-react";

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

const signupSchema = z.object({
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

export default function SignupForm() {
  const [result, setResult] = useState<ActionResult | null>(null);
  const { toast } = useToast();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      profileUrls: "",
      contentPatterns: "",
      newsletter: false,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const res = await handleSignup(data);
      setResult(res);
      if (res.status === 'error') {
        toast({
          variant: 'destructive',
          title: 'Signup Failed',
          description: res.message,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      setResult({ status: 'error', message: errorMessage });
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: errorMessage,
      });
    }
  };
  
  if (result?.status === "success") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed border-primary/50 bg-primary/10 p-8 text-center">
        {result.isVerified ? (
          <>
            <div className="rounded-full bg-primary p-3 text-primary-foreground">
              <UserCheck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Verification Successful!</h3>
            <p className="text-muted-foreground">{result.message}</p>
          </>
        ) : (
          <>
            <div className="rounded-full bg-accent p-3 text-accent-foreground">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Application Received</h3>
            <p className="text-muted-foreground">{result.message}</p>
          </>
        )}
         <Button onClick={() => {
           setResult(null);
           form.reset();
         }}>
          <RefreshCcw />
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="artist@domain.com" {...field} />
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
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <UserPlus />
              Create Account
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
