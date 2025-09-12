
import { XMLParser } from "fast-xml-parser";
import { setTimeout as delay } from "timers/promises";
import type { Article, FeedSource } from "./types";
import { ArticlesSchema } from "./types";
import removeMd from "remove-markdown";
import { request } from "undici";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  processEntities: true,
  removeNSPrefix: true,
});

type CachedMeta = {
  etag?: string;
  lastModified?: string;
  fetchedAt: number;
};

// Simple in-memory cache (per server instance); back it with Firestore below.
const rssCache = new Map<string, { meta: CachedMeta; items: Article[] }>();

const withTimeout = async <T>(p: Promise<T>, ms: number) => {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  try {
    // @ts-ignore
    return await p;
  } finally {
    clearTimeout(t);
  }
};

async function fetchText(url: string, headers: Record<string, string> = {}) {
  const res = await request(url, { headers, maxRedirections: 2 });
  const text = await res.body.text();
  return { status: res.statusCode, headers: res.headers as Record<string, string | number | string[]>, text };
}

// Normalize common RSS/Atom shapes into Article[]
function normalizeToArticles(xml: any, source: FeedSource): Article[] {
  // RSS 2.0
  if (xml?.rss?.channel?.item) {
    const items = Array.isArray(xml.rss.channel.item) ? xml.rss.channel.item : [xml.rss.channel.item];
    return items.map((it: any) => ({
      title: String(it.title ?? "").trim(),
      url: String(it.link ?? it.guid ?? "").trim(),
      source: source.name,
      category: source.category,
      region: source.region,
      publishedAt: it.pubDate ?? it.updated ?? new Date(),
      summary: removeMd(String(it.description ?? it["content:encoded"] ?? "")).slice(0, 300),
      image: extractImage(it),
    }));
  }
  // Atom
  if (xml?.feed?.entry) {
    const entries = Array.isArray(xml.feed.entry) ? xml.feed.entry : [xml.feed.entry];
    return entries.map((e: any) => ({
      title: String(e.title ?? "").trim(),
      url: String(e.link?.href ?? e.id ?? "").trim(),
      source: source.name,
      category: source.category,
      region: source.region,
      publishedAt: e.updated ?? e.published ?? new Date(),
      summary: removeMd(String(e.summary ?? e.content ?? "")).slice(0, 300),
      image: undefined,
    }));
  }
  return [];
}

function extractImage(it: any): string | undefined {
  // Try common fields
  const enc = it["media:content"]?.url || it.enclosure?.url;
  if (enc && /^https?:\/\//.test(enc)) return enc;
  const desc = String(it["content:encoded"] ?? it.description ?? "");
  const m = desc.match(/<img[^>]+src="([^"]+)"/i);
  return m?.[1];
}

// HTML fallback for sites with no RSS (e.g., RA News)
async function scrapeIndexHTML(url: string, source: FeedSource): Promise<Article[]> {
  const { text } = await fetchText(url);
  // extremely light heuristic parser (avoid heavy deps)
  const links = Array.from(text.matchAll(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/gi))
    .map((m) => ({ href: m[1], text: m[2].replace(/<[^>]+>/g, "").trim() }))
    .filter((a) => a.href.includes("/news/") || a.href.includes("/feature") || a.href.startsWith("http"))
    .slice(0, 20);

  const now = new Date();
  return links.map((l) => ({
    title: l.text || "Untitled",
    url: l.href.startsWith("http") ? l.href : new URL(l.href, url).toString(),
    source: source.name,
    category: source.category,
    region: source.region,
    publishedAt: now, // unknown; will be re-hydrated on detail fetch if you add it later
  })) as Article[];
}

async function fetchOneSource(source: FeedSource): Promise<Article[]> {
  const cached = rssCache.get(source.url);
  const freshEnough = cached && Date.now() - cached.meta.fetchedAt < 1000 * 60 * 5; // 5m soft TTL
  if (freshEnough) return cached!.items;

  const cond: Record<string,string> = {};
  if (cached?.meta.etag) cond["If-None-Match"] = cached.meta.etag;
  if (cached?.meta.lastModified) cond["If-Modified-Since"] = cached.meta.lastModified;

  try {
    const { status, headers, text } = await withTimeout(fetchText(source.url, cond), 6000);

    if (status === 304 && cached) {
      cached.meta.fetchedAt = Date.now();
      return cached.items;
    }

    if (String(headers["content-type"])?.includes("text/html") || source.url.includes("ra.co/news")) {
      const items = await scrapeIndexHTML(source.url, source);
      rssCache.set(source.url, { meta: { fetchedAt: Date.now() }, items });
      return items;
    }

    const xml = parser.parse(text);
    const items = normalizeToArticles(xml, source);
    const validated = ArticlesSchema.parse(items).slice(0, 30);
    rssCache.set(source.url, {
      meta: {
        etag: headers.etag as string | undefined,
        lastModified: (headers["last-modified"] as string) || undefined,
        fetchedAt: Date.now(),
      },
      items: validated,
    });
    return validated;
  } catch(e) {
    console.error(`Failed to fetch or parse ${source.url}`, e);
    // network or parse error → graceful fallback
    return cached?.items ?? [];
  }
}

// Retry with exponential backoff; also per-domain jitter to avoid thundering herds
export async function fetchAllSources(
  sources: FeedSource[],
  maxPerSource = 10,
  concurrency = 5
): Promise<Article[]> {
  const queue = [...sources];
  const results: Article[][] = [];

  async function worker() {
    while (queue.length) {
      const s = queue.shift()!;
      // try up to 3 times with backoff
      let tries = 0;
      let got: Article[] = [];
      while (tries < 3 && got.length === 0) {
        got = await fetchOneSource(s);
        if (!got.length) {
          tries++;
          await new Promise(r => setTimeout(r, 200 * 2 ** tries + Math.random() * 200));
        }
      }
      results.push(got.slice(0, maxPerSource));
    }
  }

  // start N workers
  await Promise.allSettled(Array.from({ length: Math.min(concurrency, sources.length) }, worker));
  return dedupeAndSort(results.flat());
}


function dedupeAndSort(items: Article[]): Article[] {
  const key = (a: Article) => (a.url || "") + "::" + a.title.trim().toLowerCase();
  const map = new Map<string, Article>();
  for (const a of items) {
    const k = key(a);
    if (!map.has(k)) { // a simple "first one wins" for items with same key
        map.set(k, a);
    }
  }
  return Array.from(map.values()).sort((a,b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}
