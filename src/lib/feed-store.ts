// src/lib/feed-store.ts
// Server-side in-memory cache for the enabled RSS feeds.

import { getEnabledFeeds, type Feed } from "@/feeds/config";

let cache: Feed[] | null = null;
let lastLoad = 0;
const TTL_MS = 60_000; // 1 min cache; tweak if needed

export async function getFeedsCached(force = false): Promise<Feed[]> {
  const fresh = cache && Date.now() - lastLoad < TTL_MS;
  if (!force && fresh) return cache!;

  const feeds = await getEnabledFeeds();        // <-- Firestore-backed list
  cache = feeds;
  lastLoad = Date.now();
  return feeds;
}

export function invalidateFeedCache() {
  cache = null;
  lastLoad = 0;
}
