
'use server';

import type { NewsItem } from "@/feeds/types";
import { getEnabledFeeds, getNewsSettings } from "@/feeds/config";
import { fetchAllSources } from "@/feeds/fetchers";
import { readAggregateFresh, saveAggregate } from "@/feeds/store";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export type IngestNewsInput = { force?: boolean };
export type IngestNewsOutput = { articles: NewsItem[] };

export async function ingestNews(input: IngestNewsInput = {}): Promise<IngestNewsOutput> {
  const settings = await getNewsSettings();

  // 1) Try warm cache
  if (!input.force) {
    const cached = await readAggregateFresh(settings.STALE_FALLBACK_MS / 12 /* ~30min */);
    if (cached?.length) return { articles: cached };
  }

  // 2) Live fetch
  const feeds = await getEnabledFeeds();
  const live = await fetchAllSources(feeds, settings);

  // 3) Persist + return; if live empty, try stale cache as fallback
  if (live.length) {
    await saveAggregate(live);
    return { articles: live };
  }

  const stale = await readAggregateFresh(Number.MAX_SAFE_INTEGER);
  if (stale?.length) return { articles: stale }; // stale-if-error

  // 4) Absolute fallback, always valid
  return {
    articles: [
      {
        title: "News temporarily slow — showing a safety card",
        source: "thecueRoom",
        url: "https://github.com/dejayillegal/thecueRoom",
        category: "Music",
        region: "Global",
        publishedAt: new Date(),
        image: null,
      },
    ],
  };
}
