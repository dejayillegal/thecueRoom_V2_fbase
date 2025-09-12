
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { rssFeeds } from "@/lib/rss-feeds";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { getCoverArtConfig, setCoverArtConfig } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";


export default function AdminPage() {
  const [imageModel, setImageModel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchConfig() {
      setIsLoading(true);
      try {
        const config = await getCoverArtConfig();
        setImageModel(config.model);
      } catch (error) {
        console.error("Failed to fetch config", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load cover art configuration.",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchConfig();
  }, [toast]);

  const handleSaveConfig = async () => {
    if (!imageModel) return;
    try {
      await setCoverArtConfig({ model: imageModel as "premium" | "free" });
      toast({
        title: "Configuration Saved",
        description: "Cover art generation model has been updated.",
      });
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save configuration.",
      });
    }
  };


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Console</CardTitle>
          <CardDescription>
            Manage application settings and content sources.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Cover Art Generation</CardTitle>
          <CardDescription>
            Select the AI model for cover art generation. Premium requires a billed Google Cloud account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/4" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-10 w-24 mt-4" />
            </div>
          ) : (
            <div className="space-y-4">
              <RadioGroup
                value={imageModel ?? 'free'}
                onValueChange={setImageModel}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="premium" id="premium" />
                  <Label htmlFor="premium">Premium (Imagen) - Requires Billed Account</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="free" id="free" />
                  <Label htmlFor="free">Free (Seeded Placeholder)</Label>
                </div>
              </RadioGroup>
              <Button onClick={handleSaveConfig}>
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>RSS Feed Management</CardTitle>
          <CardDescription>
            Add and review the RSS feeds used for the news ingestion flow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add New Feed</h3>
              <form className="grid md:grid-cols-3 gap-4">
                <Input placeholder="Category (e.g., Music)" />
                <Input placeholder="Region (e.g., Global)" />
                <Input placeholder="Name (e.g., Resident Advisor)" />
                <Input placeholder="Feed URL" className="md:col-span-2" />
                <Button type="submit">
                  <Plus />
                  Add Feed
                </Button>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Current Feeds</h3>
                <div className="border rounded-lg overflow-x-auto">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Region</TableHead>
                            <TableHead>URL</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {rssFeeds.map((feed, index) => (
                            <TableRow key={index}>
                            <TableCell className="font-medium">{feed.name}</TableCell>
                            <TableCell><Badge variant="outline">{feed.category}</Badge></TableCell>
                            <TableCell><Badge variant="secondary">{feed.region}</Badge></TableCell>
                            <TableCell className="text-muted-foreground">{feed.url}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
