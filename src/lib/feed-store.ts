
'use server';

import { FEEDS } from '@/feeds/config';
import type { RssFeed } from '@/lib/rss-feeds';

// This is a server-side in-memory store for the RSS feeds.
// In a real production app, this would be a database.

let feeds: RssFeed[] = FEEDS;

export function getFeedsFromStore(): RssFeed[] {
  return feeds;
}

export function updateFeedInStore(updatedFeed: RssFeed): void {
  const feedIndex = feeds.findIndex(f => f.url === updatedFeed.url);
  if (feedIndex !== -1) {
    feeds[feedIndex] = updatedFeed;
  } else {
    // If for some reason it's not found, add it.
    feeds.push(updatedFeed);
  }
}

export function deleteFeedFromStore(feedUrl: string): void {
  feeds = feeds.filter(f => f.url !== feedUrl);
}

export function addFeedToStore(newFeed: RssFeed): void {
  // Prevent duplicates
  if (!feeds.some(f => f.url === newFeed.url)) {
    feeds.push(newFeed);
  }
}
