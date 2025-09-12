
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RssFeed, rssFeeds as initialRssFeeds } from "@/lib/rss-feeds";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Save, Trash2, Pencil, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getCoverArtConfig, setCoverArtConfig } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteFeedDialog from "@/components/delete-feed-dialog";
import EditFeedDialog from "@/components/edit-feed-dialog";
import { deleteFeed, updateFeed } from "@/app/feeds/actions";

export default function AdminPage() {
  const [imageModel, setImageModel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rssFeeds, setRssFeeds] = useState<RssFeed[]>(initialRssFeeds);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [feedToDelete, setFeedToDelete] = useState<RssFeed | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [feedToEdit, setFeedToEdit] = useState<RssFeed | null>(null);

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
          icon: <XCircle />,
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
        icon: <CheckCircle />,
      });
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save configuration.",
        icon: <XCircle />,
      });
    }
  };

  const handleDeleteClick = (feed: RssFeed) => {
    setFeedToDelete(feed);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (feedToDelete) {
      try {
        await deleteFeed(feedToDelete.url);
        // Optimistically update UI or re-fetch
        setRssFeeds(rssFeeds.filter(feed => feed.url !== feedToDelete.url));
        toast({
          title: "Feed Deleted",
          description: `"${feedToDelete.name}" has been removed.`,
          icon: <CheckCircle />,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not delete feed.",
          icon: <XCircle />,
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setFeedToDelete(null);
  };

  const handleEditClick = (feed: RssFeed) => {
    setFeedToEdit(feed);
    setIsEditDialogOpen(true);
  };

  const handleEditConfirm = async (updatedFeed: RssFeed) => {
    if (updatedFeed) {
       try {
        await updateFeed(updatedFeed);
        // Optimistically update UI
        setRssFeeds(rssFeeds.map(feed => feed.url === updatedFeed.url ? updatedFeed : feed));
        toast({
          title: "Feed Updated",
          description: `"${updatedFeed.name}" has been updated.`,
          icon: <CheckCircle />,
        });
      } catch (error) {
         toast({
          variant: "destructive",
          title: "Error",
          description: "Could not update feed.",
          icon: <XCircle />,
        });
      }
    }
    setIsEditDialogOpen(false);
    setFeedToEdit(null);
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
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
      </div>

      <div className="space-y-6">
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
                <form className="space-y-4">
                  <Input placeholder="Category (e.g., Music)" />
                  <Input placeholder="Region (e.g., Global)" />
                  <Input placeholder="Name (e.g., Resident Advisor)" />
                  <Input placeholder="Feed URL" />
                  <Button type="submit" className="w-full">
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
                              <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                          </TableHeader>
                          <TableBody>
                          {rssFeeds.map((feed) => (
                              <TableRow key={feed.url} className="group">
                                <TableCell className="font-medium text-xs py-2">{feed.name}</TableCell>
                                <TableCell className="py-2"><Badge variant="outline">{feed.category}</Badge></TableCell>
                                <TableCell className="py-2"><Badge variant="secondary">{feed.region}</Badge></TableCell>
                                <TableCell className="text-right py-2">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditClick(feed)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteClick(feed)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
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
      <DeleteFeedDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        feedName={feedToDelete?.name || ''}
      />
      {feedToEdit && (
        <EditFeedDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onConfirm={handleEditConfirm}
          feed={feedToEdit}
        />
      )}
    </div>
  );
}
