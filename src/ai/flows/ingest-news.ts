'use server';

import { FEEDS, MAX_PER_SOURCE, STALE_MS } from "@/feeds/config";
import { fetchAllSources } from "@/feeds/fetchers";
import { readAggregateFresh, saveAggregate } from "@/feeds/store";
import type { IngestNewsInput, IngestNewsOutput } from "@/feeds/types";

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }
function withGlobalTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve) => {
    let done = false;
    const timer = setTimeout(async () => {
      if (done) return;
      // timeout hit — resolve with empty to trigger cache/fallback path
      // @ts-expect-error
      resolve({ __timedOut: true });
    }, ms);
    p.then((v) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve(v);
    }).catch(() => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      // resolve empty to fallback
      // @ts-expect-error
      resolve({ __failed: true });
    });
  });
}

export const GLOBAL_INGEST_TIMEOUT_MS = Number(process.env.NEWS_GLOBAL_TIMEOUT_MS ?? 9000);
export const STALE_FALLBACK_MS = Number(process.env.NEWS_STALE_FALLBACK_MS ?? 6 * 60 * 60 * 1000); // 6h

export async function ingestNews(input: IngestNewsInput = {}): Promise<IngestNewsOutput> {
  // 1) Fast path: fresh cache
  try {
    if (!input?.force) {
      const fresh = await readAggregateFresh(STALE_MS);
      if (fresh?.length) return { articles: fresh };
    }
  } catch { /* ignore */ }

  // 2) Live fetch with a global time budget
  //    If this exceeds budget (slow CloudFront), we serve stale cache (up to 6h) or minimal fallback.
  const liveOrTimeout: any = await withGlobalTimeout(fetchAllSources(FEEDS, MAX_PER_SOURCE), GLOBAL_INGEST_TIMEOUT_MS);

  // Timed out or failed? Serve stale cache if available (up to 6h old)
  if (liveOrTimeout?.__timedOut || liveOrTimeout?.__failed) {
    try {
      const stale = await readAggregateFresh(STALE_FALLBACK_MS);
      if (stale?.length) return { articles: stale };
    } catch { /* ignore */ }

    // last resort (never blank)
    return {
      articles: [
        {
          title: "News temporarily slow — showing a safety card",
          source: "thecueRoom",
          url: "https://thecueRoom.app/news",
          category: "Music",
          region: "Global",
          publishedAt: new Date(),
        },
      ],
    };
  }

  const live = liveOrTimeout as IngestNewsOutput["articles"];
  if (live.length) {
    try { await saveAggregate(live); } catch { /* cache is best-effort */ }
    return { articles: live };
  }

  // No live + no cache
  return {
    articles: [
      {
        title: "No sources responded — fallback",
        source: "thecueRoom",
        url: "https://thecueRoom.app/news",
        category: "Music",
        region: "Global",
        publishedAt: new Date(),
      },
    ],
  };
}
