
'use server';

import { getFeeds as getFeedsFromStore, updateFeedInStore, deleteFeedFromStore, addFeedToStore } from '@/lib/feed-store';
import { RssFeed } from '@/lib/rss-feeds';
import { revalidatePath } from 'next/cache';

export async function getFeeds(): Promise<RssFeed[]> {
  // This now calls the server-side in-memory store.
  return getFeedsFromStore();
}

export async function addFeed(newFeed: RssFeed): Promise<{ success: boolean; error?: string }> {
    try {
        console.log(`Server Action: Persisting new feed ${newFeed.url}`);
        addFeedToStore(newFeed);
        revalidatePath('/admin');
        console.log("Path revalidated. New feed has been persisted.");
        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        console.error("Failed to add feed:", message);
        return { success: false, error: message };
    }
}

export async function updateFeed(updatedFeed: RssFeed): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Server Action: Persisting update for feed ${updatedFeed.url}`);
    
    // Call the server-side store to update the data.
    updateFeedInStore(updatedFeed);

    revalidatePath('/admin');
    console.log("Path revalidated. Change has been persisted.");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Failed to update feed:", message);
    return { success: false, error: message };
  }
}

export async function deleteFeed(feedUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Server Action: Persisting deletion for feed ${feedUrl}`);

    // Call the server-side store to delete the data.
    deleteFeedFromStore(feedUrl);

    revalidatePath('/admin');
    console.log("Path revalidated. Deletion has been persisted.");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Failed to delete feed:", message);
    return { success: false, error: message };
  }
}
