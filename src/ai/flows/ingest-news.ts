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

  // 1) cache-first (<= STALE_FALLBACK_MS old)
  if (!input.force) {
    try {
      const cached = await readAggregateFresh(settings.STALE_FALLBACK_MS);
      if (cached?.length) {
        // Background refresh if cache is older than our "good enough" window (5m)
        (async () => {
          const stillFresh = await readAggregateFresh(5 * 60_000); // 5m
          if (!stillFresh) {
            try {
              const feeds = await getEnabledFeeds();
              const live = await withTimeout(fetchAllSources(feeds, settings), settings.GLOBAL_TIMEOUT_MS);
              if (Array.isArray(live) && live.length) await saveAggregate(live);
            } catch { /* swallow background errors */ }
          }
        })();
        return { articles: cached };
      }
    } catch { /* ignore cache read errors */ }
  }

  // 2) live (bounded by global timeout)
  try {
    const feeds = await getEnabledFeeds();
    const live = await withTimeout(fetchAllSources(feeds, settings), settings.GLOBAL_TIMEOUT_MS);
    if (Array.isArray(live) && live.length) {
      await saveAggregate(live);
      return { articles: live };
    }
  } catch { /* ignore fetch/save errors on main path */ }


  // 3) stale-if-error (try again, any age)
  try {
      const stale = await readAggregateFresh(Number.MAX_SAFE_INTEGER);
      if (stale?.length) return { articles: stale };
  } catch { /* ignore */ }


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