"use server";

import { z } from "zod";
import { autoVerifyUsers } from "@/ai/flows/auto-verify-users";
import { generateCoverArt, GenerateCoverArtInput } from "@/ai/flows/generate-cover-art";
import { getCoverArtConfig as getCoverArtConfigFlow, setCoverArtConfig as setCoverArtConfigFlow } from "@/ai/flows/get-set-cover-art-config";

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
    artistName: z.string().optional(),
    albumName: z.string().optional(),
    releaseLabel: z.string().optional(),
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
            message: "Invalid form data. " + validationResult.error.errors.map(e => e.message).join(' '),
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
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during image generation.";
        return {
            status: "error",
            message: errorMessage,
        };
    }
}

// Actions for Cover Art Config
const coverArtConfigSchema = z.object({
  model: z.enum(["premium", "free"]),
});

export async function getCoverArtConfig() {
  return getCoverArtConfigFlow();
}

export async function setCoverArtConfig(data: unknown) {
  const validationResult = coverArtConfigSchema.safeParse(data);
  if (!validationResult.success) {
    throw new Error("Invalid config data");
  }
  return setCoverArtConfigFlow(validationResult.data);
}
