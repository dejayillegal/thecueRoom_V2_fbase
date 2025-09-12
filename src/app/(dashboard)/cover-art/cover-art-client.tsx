
'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles, ImageDown, Wand2, Download } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { handleCoverArtGeneration } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const styleSuggestions = [
    "Abstract Techno",
    "Glitchy Waveforms",
    "Minimalist Microhouse",
    "Cosmic Journey",
    "Industrial Grunge",
    "Analog Warmth",
];

const coverArtSchema = z.object({
  prompt: z.string().min(10, { message: "Please enter a more descriptive prompt (at least 10 characters)." }),
  aspectRatio: z.enum(['1:1', '16:9', '9:16']).default('1:1'),
});

type CoverArtFormValues = z.infer<typeof coverArtSchema>;

export default function CoverArtClient() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CoverArtFormValues>({
    resolver: zodResolver(coverArtSchema),
    defaultValues: {
      prompt: "",
      aspectRatio: "1:1",
    },
  });

  const onSubmit = async (data: CoverArtFormValues) => {
    setIsLoading(true);
    setGeneratedImage(null);
    try {
      const result = await handleCoverArtGeneration(data);
      if (result.status === 'success' && result.imageUrl) {
        setGeneratedImage(result.imageUrl);
        toast({
          title: "Generation Complete",
          description: "Your new cover art is ready.",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const currentPrompt = form.getValues("prompt");
    form.setValue("prompt", currentPrompt ? `${currentPrompt}, ${suggestion}` : suggestion);
  };
  
  const getAspectRatio = () => {
    const ratio = form.watch('aspectRatio');
    if (ratio === '16:9') return 16 / 9;
    if (ratio === '9:16') return 9 / 16;
    return 1;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 />
                AI Cover Art Generator
              </CardTitle>
              <CardDescription>
                Design striking visuals for your tracks and mixes. Describe your vision and let the AI bring it to life.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Creative Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A lone figure walking through a neon-lit, rainy alley in a futuristic city, abstract techno vibes"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-3">
                  <FormLabel>Style Suggestions</FormLabel>
                  <div className="flex flex-wrap gap-2">
                      {styleSuggestions.map(suggestion => (
                          <Button key={suggestion} type="button" variant="outline" size="sm" onClick={() => handleSuggestionClick(suggestion)}>
                              {suggestion}
                          </Button>
                      ))}
                  </div>
              </div>
              <FormField
                control={form.control}
                name="aspectRatio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aspect Ratio</FormLabel>
                    <FormControl>
                      <ToggleGroup 
                        type="single" 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                        className="justify-start"
                      >
                        <ToggleGroupItem value="1:1" aria-label="Square">
                          1:1
                        </ToggleGroupItem>
                        <ToggleGroupItem value="16:9" aria-label="Landscape">
                          16:9
                        </ToggleGroupItem>
                        <ToggleGroupItem value="9:16" aria-label="Portrait">
                          9:16
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles />
                    Generate Cover Art
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Generated Art</CardTitle>
          <CardDescription>Your generated cover art will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
            <div 
              className="relative w-full bg-muted/50 rounded-lg border border-dashed flex items-center justify-center overflow-hidden"
              style={{ aspectRatio: getAspectRatio() }}
            >
                {isLoading && (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground z-10 p-4 text-center">
                        <Loader2 className="h-10 w-10 animate-spin" />
                        <p>Evoking the underground...</p>
                        <p className="text-xs">This can take up to 30 seconds.</p>
                    </div>
                )}
                {!isLoading && !generatedImage && (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground z-10 p-4 text-center">
                        <ImageDown className="h-10 w-10" />
                        <p>Your visuals await creation.</p>
                    </div>
                )}
                {generatedImage && (
                     <Image
                        src={generatedImage}
                        alt="Generated cover art"
                        fill
                        className="object-cover transition-all duration-500 ease-in-out"
                        data-ai-hint="album cover"
                     />
                )}
            </div>
        </CardContent>
         {generatedImage && (
          <CardFooter className="flex-col gap-4 items-stretch">
            <Button asChild className="w-full">
              <a href={generatedImage} download="thecueroom-cover-art.png">
                <Download /> Download Image
              </a>
            </Button>
            <p className="text-xs text-muted-foreground text-center">Note: This is a placeholder image. In a real application, a high-resolution image would be generated.</p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
