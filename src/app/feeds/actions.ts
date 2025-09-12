
'use server';

import { db } from '@/lib/firebase-admin';
import type { RssFeed } from '@/lib/rss-feeds';
import { revalidatePath } from 'next/cache';
import { getEnabledFeeds } from '@/feeds/config';

export async function getFeeds(): Promise<RssFeed[]> {
  try {
    const feeds = await getEnabledFeeds();
    // Sort feeds by name for consistent display
    return feeds.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Failed to get feeds from Firestore", error);
    return [];
  }
}

export async function addFeed(newFeed: { name: string; url: string; category: string; region: string; }): Promise<{ success: boolean; error?: string }> {
    try {
        await db.collection("news_feeds").add({ ...newFeed, enabled: true, createdAt: new Date() });
        revalidatePath('/admin');
        revalidatePath('/news');
        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        console.error("Failed to add feed:", message);
        return { success: false, error: message };
    }
}

export async function updateFeed(updatedFeed: RssFeed): Promise<{ success: boolean; error?: string }> {
  if (!updatedFeed.id) {
    return { success: false, error: "Feed ID is missing." };
  }
  try {
    const { id, ...data } = updatedFeed;
    await db.collection("news_feeds").doc(id).update(data);
    revalidatePath('/admin');
    revalidatePath('/news');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Failed to update feed:", message);
    return { success: false, error: message };
  }
}

export async function deleteFeed(feedId: string): Promise<{ success: boolean; error?: string }> {
   if (!feedId) {
    return { success: false, error: "Feed ID is missing." };
  }
  try {
    await db.collection("news_feeds").doc(feedId).delete();
    revalidatePath('/admin');
    revalidatePath('/news');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Failed to delete feed:", message);
    return { success: false, error: message };
  }
}
