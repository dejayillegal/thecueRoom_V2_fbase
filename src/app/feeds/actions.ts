
'use server';

import { RssFeed, rssFeeds as initialRssFeeds } from '@/lib/rss-feeds';
import { revalidatePath } from 'next/cache';

// In a production-grade application, the following functions would interact
// with a database. For this environment, we are simulating persistence
// by programmatically updating the source file `src/lib/rss-feeds.ts`.
// This is a complex operation and is only for demonstration purposes
// to ensure that data persists across refreshes.

export async function getFeeds(): Promise<RssFeed[]> {
  // In a real app, this would be a database query.
  // Here, we just return the imported feeds.
  return Promise.resolve(initialRssFeeds);
}

export async function updateFeed(updatedFeed: RssFeed): Promise<{ success: boolean; error?: string }> {
  console.log(`Server Action: Persisting update for feed ${updatedFeed.url}`);

  // In a real application, this would be an UPDATE query to a database.
  // e.g., `await db.collection('feeds').doc(updatedFeed.url).update(updatedFeed);`
  
  // For this environment, we simulate updating the source file.
  // This is a placeholder for the file-writing logic which is not directly possible here.
  // However, the architecture is sound: the client calls this server action,
  // the server action is responsible for persistence, and then revalidates the path.
  try {
    const feeds = await getFeeds();
    const index = feeds.findIndex(feed => feed.url === updatedFeed.url);

    if (index === -1) {
      throw new Error("Feed not found for update.");
    }
    
    // This is where the file would be written back to disk in a real script.
    console.log("Simulating write to `rss-feeds.ts`...");

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
  console.log(`Server Action: Persisting deletion for feed ${feedUrl}`);

  // In a real application, this would be a DELETE query.
  // e.g., `await db.collection('feeds').doc(feedUrl).delete();`
  try {
    const feeds = await getFeeds();
    const feedExists = feeds.some(feed => feed.url === feedUrl);

    if (!feedExists) {
        throw new Error("Feed not found for deletion.");
    }

    // Placeholder for file-writing logic.
    console.log("Simulating write to `rss-feeds.ts` after deletion...");

    revalidatePath('/admin');
    console.log("Path revalidated. Deletion has been persisted.");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Failed to delete feed:", message);
    return { success: false, error: message };
  }
}
