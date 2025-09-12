
'use server';

import { RssFeed, rssFeeds as initialRssFeeds } from '@/lib/rss-feeds';
import { revalidatePath } from 'next/cache';

// THIS IS A WORKAROUND for the demo environment.
// In a real production application, you would use a database (e.g., Firestore)
// to store and manage this data instead of writing to a source file.
// The following functions are illustrative and will not actually write to the filesystem
// in this sandboxed environment, but they demonstrate the correct architectural pattern
// using server actions and data revalidation.

// A mock "database" in memory.
let mockDbFeeds: RssFeed[] = [...initialRssFeeds];


export async function getFeeds(): Promise<RssFeed[]> {
  // In a real app, this would fetch from a database.
  return Promise.resolve(mockDbFeeds);
}

export async function updateFeed(updatedFeed: RssFeed): Promise<{ success: boolean }> {
  console.log(`Server Action: Updating feed ${updatedFeed.url}`);
  
  const index = mockDbFeeds.findIndex(feed => feed.url === updatedFeed.url);
  
  if (index === -1) {
    console.error("Feed not found for update.");
    return { success: false };
  }
  
  mockDbFeeds[index] = updatedFeed;
  
  // In a real app, you would have logic here to write `mockDbFeeds` back to the file
  // or update the database record.
  // For example: await fs.promises.writeFile(filePath, generatedCode);
  
  revalidatePath('/admin');
  console.log("Path revalidated, mock DB updated.");
  return { success: true };
}


export async function deleteFeed(feedUrl: string): Promise<{ success: boolean }> {
  console.log(`Server Action: Deleting feed ${feedUrl}`);

  const initialLength = mockDbFeeds.length;
  mockDbFeeds = mockDbFeeds.filter(feed => feed.url !== feedUrl);

  if (mockDbFeeds.length === initialLength) {
    console.error("Feed not found for deletion.");
    return { success: false };
  }
  
  // In a real app, you would have logic here to write the updated `mockDbFeeds`
  // back to the file or delete from the database.
  
  revalidatePath('/admin');
  console.log("Path revalidated, mock DB updated.");
  return { success: true };
}

// NOTE: Add feed functionality would follow a similar pattern.
// export async function addFeed(newFeed: RssFeed) { ... }
