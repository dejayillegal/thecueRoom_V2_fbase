"use server";

import { z } from "zod";
import { autoVerifyUsers } from "@/ai/flows/auto-verify-users";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  profileUrls: z.string().min(1),
  contentPatterns: z.string().optional(),
  newsletter: z.boolean(),
});

type ActionResult = {
  status: "success" | "error";
  message: string;
  isVerified?: boolean;
};

export async function handleSignup(data: unknown): Promise<ActionResult> {
  const validationResult = signupSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      status: "error",
      message: "Invalid form data. Please check your inputs.",
    };
  }

  const { profileUrls, contentPatterns } = validationResult.data;
  
  // Split textarea URLs into an array of strings, trimming whitespace and filtering out empty lines.
  const urls = profileUrls.split('\n').map(url => url.trim()).filter(Boolean);

  if (urls.length === 0) {
    return { status: "error", message: "Please provide at least one valid profile URL." };
  }

  try {
    const verificationResult = await autoVerifyUsers({
      profileUrls: urls,
      contentPatterns: contentPatterns || "",
    });

    // Here you would typically save the user to your database (e.g., Supabase)
    // with the determined verification_status.
    // For this example, we'll just return the result.
    
    // const { data: user, error } = await supabase.auth.signUp({
    //   email: validationResult.data.email,
    //   password: validationResult.data.password,
    //   options: {
    //     data: {
    //       verification_status: verificationResult.isVerified ? 'verified' : 'pending',
    //       newsletter_opt_in: validationResult.data.newsletter,
    //       // ... other profile data
    //     }
    //   }
    // })

    if (verificationResult.isVerified) {
      return {
        status: "success",
        isVerified: true,
        message: "Welcome to thecueRoom! Check your email to confirm your account."
      };
    } else {
      return {
        status: "success",
        isVerified: false,
        message: "Your application is under review. We'll notify you once it's approved."
      };
    }

  } catch (error) {
    console.error("AI verification failed:", error);
    return {
      status: "error",
      message: "An error occurred during verification. Please try again later.",
    };
  }
}
