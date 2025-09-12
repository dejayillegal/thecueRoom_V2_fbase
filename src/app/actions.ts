"use server";

import { z } from "zod";
import { autoVerifyUsers } from "@/ai/flows/auto-verify-users";
import { generateCoverArt, GenerateCoverArtInput } from "@/ai/flows/generate-cover-art";

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
  
  const urls = profileUrls.split('\n').map(url => url.trim()).filter(Boolean);

  if (urls.length === 0) {
    return { status: "error", message: "Please provide at least one valid profile URL." };
  }

  try {
    const verificationResult = await autoVerifyUsers({
      profileUrls: urls,
      contentPatterns: contentPatterns || "",
    });

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


// Action for Cover Art Generation
const coverArtSchema = z.object({
    prompt: z.string().min(5, "Prompt must be at least 5 characters long."),
    aspectRatio: z.enum(['1:1', '16:9', '9:16']),
});

type CoverArtResult = {
  status: "success" | "error";
  message: string;
  imageUrl?: string;
  revisedPrompt?: string;
};

export async function handleCoverArtGeneration(data: unknown): Promise<CoverArtResult> {
    const validationResult = coverArtSchema.safeParse(data);

    if (!validationResult.success) {
        return {
            status: "error",
            message: "Invalid form data. Please check your inputs.",
        };
    }

    try {
        const input: GenerateCoverArtInput = validationResult.data;
        const result = await generateCoverArt(input);

        return {
            status: "success",
            message: "Cover art generated successfully.",
            imageUrl: result.imageUrl,
            revisedPrompt: result.revisedPrompt,
        };
    } catch (error) {
        console.error("Cover art generation failed:", error);
        return {
            status: "error",
            message: "An error occurred during image generation. Please try again later.",
        };
    }
}
