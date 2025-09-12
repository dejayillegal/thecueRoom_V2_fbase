
'use server';

import type { NewsItem } from "@/feeds/types";
import { getEnabledFeeds, getNewsSettings } from "@/feeds/config";
import { fetchAllSources } from "@/feeds/fetchers";
import { readAggregateFresh, saveAggregate } from "@/feeds/store";

export type IngestNewsInput = { force?: boolean };
export type IngestNewsOutput = { articles: NewsItem[] };

export async function ingestNews(input: IngestNewsInput = {}): Promise<IngestNewsOutput> {
  const settings = await getNewsSettings();

  // 1) Cache-first (if we can read; function already returns null on failure)
  if (!input.force) {
    const cached = await readAggregateFresh(Math.min(settings.STALE_FALLBACK_MS, 30 * 60_000));
    if (cached?.length) return { articles: cached };
  }

  // 2) Live fetch (no Firestore dependency)
  const feeds = await getEnabledFeeds();
  const live = await fetchAllSources(feeds, settings);

  if (live.length) {
    await saveAggregate(live);   // best-effort; no-ops if Firestore unavailable
    return { articles: live };
  }

  // 3) stale-if-error
  const stale = await readAggregateFresh(settings.STALE_FALLBACK_MS);
  if (stale?.length) return { articles: stale };

  // 4) last resort
  return {
    articles: [{
      title: "News temporarily slow — showing a safety card",
      source: "thecueRoom",
      url: "https://github.com/dejayillegal/thecueroom",
      category: "Music",
      region: "Global",
      publishedAt: new Date(),
      image: null,
    }],
  };
}
