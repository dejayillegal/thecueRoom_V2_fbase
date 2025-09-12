'use server';

import type { NewsItem } from "@/feeds/types";
import { getEnabledFeeds, getNewsSettings } from "@/feeds/config";
import { fetchAllSources } from "@/feeds/fetchers";
import { readAggregateFresh, saveAggregate } from "@/feeds/store";

export type IngestNewsInput = { force?: boolean };
export type IngestNewsOutput = { articles: NewsItem[] };

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | []> {
  return new Promise((resolve) => {
    let settled = false;
    const t = setTimeout(() => { if (!settled) { settled = true; resolve([] as any); } }, ms);
    p.then(v => { if (!settled) { settled = true; clearTimeout(t); resolve(v); } })
     .catch(() => { if (!settled) { settled = true; clearTimeout(t); resolve([] as any); } });
  });
}

export async function ingestNews(input: IngestNewsInput = {}): Promise<IngestNewsOutput> {
  const settings = await getNewsSettings();

  // 1) cache-first (<= 30m fresh)
  if (!input.force) {
    const cached = await readAggregateFresh(Math.min(settings.STALE_FALLBACK_MS, 30 * 60_000));
    if (cached?.length) {
      // Optional: background refresh if cache older than 5m
      (async () => {
        const stillFresh = await readAggregateFresh(5 * 60_000); // 5m
        if (!stillFresh) {
          const feeds = await getEnabledFeeds();
          const live = await withTimeout(fetchAllSources(feeds, settings), settings.GLOBAL_TIMEOUT_MS);
          if (Array.isArray(live) && live.length) await saveAggregate(live);
        }
      })();
      return { articles: cached };
    }
  }

  // 2) live (bounded by global timeout)
  const feeds = await getEnabledFeeds();
  const live = await withTimeout(fetchAllSources(feeds, settings), settings.GLOBAL_TIMEOUT_MS);
  if (Array.isArray(live) && live.length) {
    await saveAggregate(live);
    return { articles: live };
  }

  // 3) stale-if-error
  const stale = await readAggregateFresh(settings.STALE_FALLBACK_MS);
  if (stale?.length) return { articles: stale };

  // 4) safety card
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
