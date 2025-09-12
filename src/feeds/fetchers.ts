import { XMLParser } from "fast-xml-parser";
import removeMd from "remove-markdown";
import type { Feed } from "./config";
import type { NewsItem, NewsSettings } from "./types";

const parser = new XMLParser({ ignoreAttributes:false, attributeNamePrefix:"", processEntities:true, removeNSPrefix:true });

const PER_HOST_BREAKER = new Map<string, { fails: number; until: number }>();
const rssCache = new Map<string, { fetchedAt: number; items: NewsItem[] }>();

function host(url: string) { return new URL(url).host; }
function backoffMs(n: number) { return Math.min(30_000, 1500 * n); }
function canCall(h: string) { const row = PER_HOST_BREAKER.get(h); return !row || Date.now() > row.until; }
function openBreaker(h: string) {
  const row = PER_HOST_BREAKER.get(h) || { fails: 0, until: 0 };
  row.fails = Math.min(row.fails + 1, 6);
  row.until = Date.now() + backoffMs(row.fails);
  PER_HOST_BREAKER.set(h, row);
}
function resetBreaker(h: string) { PER_HOST_BREAKER.delete(h); }

function coerceDate(v: unknown): Date {
  if (v instanceof Date) return v;
  const d = new Date(String(v ?? ""));
  return isNaN(+d) ? new Date() : d;
}

function normalizeRss(xml: any, feed: Feed, max: number): NewsItem[] {
  const ch = xml?.rss?.channel ?? xml?.feed;
  let raw = ch?.item ?? ch?.entry ?? [];
  raw = Array.isArray(raw) ? raw : [raw];

  return raw.slice(0, max).map((it: any) => {
    const url = (it.link?.href ?? it.link ?? it.id ?? "").toString().trim();
    const img =
      it["media:content"]?.url || it["media:thumbnail"]?.url ||
      it["enclosure"]?.url || it["itunes:image"]?.href || it.image?.url || it.image || null;

    const summarySrc = it.description ?? it["content:encoded"] ?? it.summary ?? it.content ?? "";
    return {
      title: String(it.title ?? "Untitled").trim(),
      url,
      source: feed.name,
      category: feed.category,
      region: feed.region,
      publishedAt: coerceDate(it.pubDate ?? it.published ?? it.updated ?? it["dc:date"] ?? it.isoDate),
      image: img ?? null,
      summary: removeMd(String(summarySrc)).replace(/\s+/g, " ").trim().slice(0, 300) || undefined,
    };
  }).filter((i:any) => i.url && i.url.startsWith("http"));
}

async function fetchWithTimeout(url: string, ms: number): Promise<Response | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal, redirect: "follow", cache: "no-store" });
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

// Optional per-source adapters (useful for HTML pages w/out RSS)
type Adapter = (html: string, base: string, feed: Feed, max: number) => NewsItem[];
const ADAPTERS: Record<string, Adapter> = {
  // Example: parse simple news indexes if needed
  "ra.co": (html, base, feed, max) => {
    const matches = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([^<]{10,})<\/a>/gi)];
    return matches.slice(0, max).map((m) => ({
      title: m[2].replace(/<[^>]+>/g, "").trim(),
      url: new URL(m[1], base).toString(),
      source: feed.name, category: feed.category, region: feed.region,
      publishedAt: new Date(), image: null,
    }));
  },
};

export async function fetchAllSources(feeds: Feed[], settings: NewsSettings): Promise<NewsItem[]> {
  const buckets: NewsItem[][] = [];
  const queue = [...feeds];
  const conc = Math.min(settings.FETCH_CONCURRENCY, feeds.length || 1);

  async function worker() {
    while (queue.length) {
      const f = queue.shift()!;
      const h = host(f.url);
      if (!canCall(h)) { buckets.push([]); continue; }

      // in-memory 5 min cache per feed
      const cached = rssCache.get(f.url);
      if (cached && Date.now() - cached.fetchedAt < 5 * 60 * 1000) { buckets.push(cached.items); continue; }

      let items: NewsItem[] = [];
      let tries = 0;
      while (tries < 3 && items.length === 0) {
        tries++;
        const res = await fetchWithTimeout(f.url, settings.SOURCE_TIMEOUT_MS);
        if (!res) { continue; } // timeout/abort
        const contentType = res.headers.get("content-type") || "";
        const text = await res.text();

        if (!res.ok) {
          // Do NOT throw; just log (dev) and continue
          if (process.env.NODE_ENV !== "production") {
            console.warn(`[news] ${f.name} HTTP ${res.status} for ${f.url}`);
          }
          // Try adapter on 404 HTML if any
          if (contentType.includes("text/html")) {
            const hostKey = host(f.url);
            const adapter = ADAPTERS[hostKey];
            if (adapter) items = adapter(text, f.url, f, settings.MAX_PER_SOURCE);
          }
        } else {
          try {
            // If XML, parse; else try adapter; else naive HTML anchors
            if (contentType.includes("xml") || text.trim().startsWith("<?xml")) {
              const xml = parser.parse(text);
              items = normalizeRss(xml, f, settings.MAX_PER_SOURCE);
            } else if (contentType.includes("html")) {
              const hostKey = host(f.url);
              const adapter = ADAPTERS[hostKey];
              if (adapter) {
                items = adapter(text, f.url, f, settings.MAX_PER_SOURCE);
              } else {
                const matches = [...text.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([^<]{10,})<\/a>/gi)];
                items = matches.slice(0, settings.MAX_PER_SOURCE).map((m) => ({
                  title: m[2].replace(/<[^>]+>/g, "").trim(),
                  url: new URL(m[1], f.url).toString(),
                  source: f.name, category: f.category, region: f.region,
                  publishedAt: new Date(), image: null,
                }));
              }
            }
          } catch (e) {
            if (process.env.NODE_ENV !== "production") {
              console.warn(`[news] ${f.name} parse error:`, (e as Error).message);
            }
          }
        }
      }

      // breaker accounting
      if (items.length === 0) openBreaker(h); else resetBreaker(h);

      // cap per source; save in-memory cache
      items = items.slice(0, settings.MAX_PER_SOURCE);
      rssCache.set(f.url, { fetchedAt: Date.now(), items });
      buckets.push(items);
    }
  }

  await Promise.all(Array.from({ length: conc }, () => worker()));

  // merge + dedupe + sort
  const seen = new Set<string>(), all: NewsItem[] = [];
  for (const bucket of buckets) {
    for (const it of bucket) {
      const u = new URL(it.url);
      const key = `${it.source}:${it.title.trim().toLowerCase()}:${u.hostname}${u.pathname}`;
      if (seen.has(key)) continue;
      seen.add(key);
      all.push(it);
    }
  }
  all.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  return all;
}
