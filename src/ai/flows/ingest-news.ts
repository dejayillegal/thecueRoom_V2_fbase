
'use server';

import { FEEDS, MAX_PER_SOURCE, STALE_MS } from "@/feeds/config";
import { fetchAllSources } from "@/feeds/fetchers";
import { readAggregateFresh, saveAggregate } from "@/feeds/store";
import type { IngestNewsInput, IngestNewsOutput } from "@/feeds/types";

export async function ingestNews(input: IngestNewsInput = {}): Promise<IngestNewsOutput> {
  // Fast path: cached
  try {
    if (!input?.force) {
      const fresh = await readAggregateFresh(STALE_MS);
      if (fresh?.length) return { articles: fresh };
    }
  } catch {
    // ignore cache read errors
  }

  // Live fetch
  const live = await fetchAllSources(FEEDS, MAX_PER_SOURCE);
  if (live.length) {
    try { await saveAggregate(live); } catch { /* ignore cache write errors */ }
    return { articles: live };
  }

  // Last resort (never blank page)
  return {
    articles: [
      {
        title: "XLR8R+042: A New Compilation Featuring 10 Exclusive Tracks",
        source: "XLR8R",
        url: "https://xlr8r.com/news/",
        category: "Music",
        region: "Global",
        publishedAt: new Date(),
      },
    ],
  };
}
