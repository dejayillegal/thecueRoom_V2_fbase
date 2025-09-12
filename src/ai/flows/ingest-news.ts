
'use server';
/**
 * @fileOverview A news ingestion AI agent.
 *
 * - ingestNews - A function that handles the news ingestion process.
 * - IngestNewsInput - The input type for the ingestNews function.
 * - IngestNewsOutput - The return type for the ingestNews function.
 */

import { fetchAllSources } from "@/feeds/fetchers";
import { FEEDS, MAX_PER_SOURCE, STALE_MS } from "@/feeds/config";
import { readAggregateFresh, saveAggregate } from "@/feeds/store";
import type { IngestNewsInput, IngestNewsOutput } from "@/feeds/types";

export async function ingestNews(input: IngestNewsInput): Promise<IngestNewsOutput> {
  // 1) Serve from Firestore if fresh
  if (!input?.force) {
    const fresh = await readAggregateFresh(STALE_MS);
    if (fresh?.length) return { articles: fresh };
  }

  // 2) Otherwise fetch live, save, and return
  const live = await fetchAllSources(FEEDS, MAX_PER_SOURCE);
  if (live.length) {
    await saveAggregate(live);
    return { articles: live };
  }

  // 3) Final fallback: if nothing live and no fresh cache, return a minimal static set
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
