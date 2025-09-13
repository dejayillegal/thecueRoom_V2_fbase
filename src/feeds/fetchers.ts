import { XMLParser } from "fast-xml-parser";
import removeMd from "remove-markdown";
import type { Feed, NewsSettings } from "./config";
import type { NewsItem } from "./types";
import process from "node:process";

const parser = new XMLParser({ ignoreAttributes:false, attributeNamePrefix:"", processEntities:true, removeNSPrefix:true });

type CacheRow = { items: NewsItem[]; meta: { fetchedAt: number; etag?: string; lastModified?: string } };
const rssCache = new Map<string, CacheRow>();

const breaker = new Map<string, { fails: number; until: number }>();
const hostOf = (u: string) => new URL(u).host;
function openBreaker(h: string) {
  const row = breaker.get(h) || { fails: 0, until: 0 };
  row.fails = Math.min(row.fails + 1, 5);
  row.until = Date.now() + Math.min(30000, 1500 * row.fails); // back off up to 30s
  breaker.set(h, row);
}
function canCall(h: string) {
  const row = breaker.get(h);
  return !row || Date.now() > row.until;
}

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

async function fetchWithTimeout(url: string, ms: number, headers?: Record<string, string>): Promise<{ res: Response; text: string; }> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { headers, signal: ctrl.signal, redirect: "follow", cache: "no-store" });
    const text = await res.text();
    return { res, text };
  } finally {
    clearTimeout(t);
  }
}

function dedupeAndSort(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>();
  const out: NewsItem[] = [];
  for (const a of items) {
    const key = (a.url || '') + '|' + (a.title || '');
    if (!seen.has(key)) { seen.add(key); out.push(a); }
  }
  return out.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}


async function fetchOneSource(source: Feed, settings: NewsSettings): Promise<NewsItem[]> {
  const h = hostOf(source.url);
  if (!canCall(h)) return [];

  const cached = rssCache.get(source.url);
  const fresh = cached && Date.now() - cached.meta.fetchedAt < 5 * 60 * 1000; // 5 min
  if (fresh) return cached!.items;

  const cond: Record<string, string> = {};
  if (cached?.meta.etag) cond['If-None-Match'] = cached.meta.etag;
  if (cached?.meta.lastModified) cond['If-Modified-Since'] = cached.meta.lastModified;

  try {
    const { res, text } = await fetchWithTimeout(source.url, settings.SOURCE_TIMEOUT_MS, cond);

    if (res.status === 304 && cached) return cached.items;
    
    if (!res.ok) {
        if (process.env.NODE_ENV !== "production") {
            console.warn(`[news] ${source.name} HTTP ${res.status} for ${source.url}`);
        }
        throw new Error(`Fetch failed with status ${res.status}`);
    }

    const items = normalizeRss(parser.parse(text), source, settings.MAX_PER_SOURCE);

    breaker.delete(h);
    const etag = res.headers.get('etag') ?? undefined;
    const lastModified = res.headers.get('last-modified') ?? undefined;

    rssCache.set(source.url, { items, meta: { fetchedAt: Date.now(), etag, lastModified } });
    return items;
  } catch {
    openBreaker(h);
    return cached?.items ?? [];
  }
}

export async function fetchAllSources(feeds: Feed[], settings: NewsSettings): Promise<NewsItem[]> {
  const q = [...feeds];
  const buckets: NewsItem[][] = [];

  async function worker() {
    while (q.length) {
      const s = q.shift()!;
      let tries = 0, got: NewsItem[] = [];
      while (tries < 3 && got.length === 0) {
        try {
            got = await fetchOneSource(s, settings);
            if (got.length > 0) break;
        } catch {}
        tries++;
        if (tries < 3) {
            await new Promise(r => setTimeout(r, 200 * 2 ** tries + Math.random() * 200));
        }
      }
      buckets.push(got.slice(0, settings.MAX_PER_SOURCE));
    }
  }

  await Promise.allSettled(Array.from({ length: Math.min(settings.FETCH_CONCURRENCY, feeds.length) }, worker));
  return dedupeAndSort(buckets.flat());
}
