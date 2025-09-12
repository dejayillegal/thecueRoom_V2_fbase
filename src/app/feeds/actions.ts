
'use server';

import { getDb } from '@/lib/firebase-admin';
import type { RssFeed } from '@/lib/rss-feeds';
import { revalidatePath } from 'next/cache';

export async function getFeeds(): Promise<RssFeed[]> {
  const db = getDb();
  if (!db) {
    console.warn("Firestore is not available, returning empty feeds list.");
    return [];
  }
  try {
    const snapshot = await db.collection("news_feeds").orderBy("name").get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RssFeed));
  } catch (error) {
    console.error("Failed to get feeds from Firestore", error);
    return [];
  }
}

export async function addFeed(newFeed: { name: string; url: string; category: string; region: string; }): Promise<{ success: boolean; error?: string }> {
    const db = getDb();
    if (!db) {
        return { success: false, error: "Database not available." };
    }
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
  const db = getDb();
  if (!db) {
      return { success: false, error: "Database not available." };
  }
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
   const db = getDb();
    if (!db) {
        return { success: false, error: "Database not available." };
    }
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
