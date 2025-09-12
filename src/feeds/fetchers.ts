import { XMLParser } from "fast-xml-parser";
import removeMd from "remove-markdown";
import { ArticlesSchema, type Article, type FeedSource } from "./types";

const parser = new XMLParser({ ignoreAttributes:false, attributeNamePrefix:"", processEntities:true, removeNSPrefix:true });

const rssCache = new Map<string, { meta: { etag?: string; lastModified?: string; fetchedAt: number }, items: Article[] }>();

const PER_SOURCE_TIMEOUT_MS = Number(process.env.NEWS_SOURCE_TIMEOUT_MS ?? 5000);
const MAX_CONCURRENCY = Number(process.env.NEWS_FETCH_CONCURRENCY ?? 5);

function safeDate(v: any): Date {
  const d = v instanceof Date ? v : new Date(String(v));
  return isNaN(+d) ? new Date() : d;
}

async function fetchWithTimeout(url: string, headers: Record<string,string>) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), PER_SOURCE_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "thecueRoomBot/1.0 (+https://thecueroom.app)",
        Accept: "application/rss+xml, application/atom+xml, text/xml, text/html;q=0.8,*/*;q=0.5",
        ...headers,
      },
      redirect: "follow",
      cache: "no-store",
      signal: ctrl.signal,
    });
    const text = await res.text();
    return { res, text };
  } finally {
    clearTimeout(t);
  }
}

function extractImage(it: any): string | undefined {
  const enc = it["media:content"]?.url || it.enclosure?.url;
  if (enc && /^https?:\/\//.test(enc)) return enc;
  const desc = String(it["content:encoded"] ?? it.description ?? "");
  const m = desc.match(/<img[^>]+src="([^"]+)"/i);
  return m?.[1];
}

function normalizeToArticles(xml: any, source: FeedSource): Article[] {
  if (xml?.rss?.channel?.item) {
    const items = Array.isArray(xml.rss.channel.item) ? xml.rss.channel.item : [xml.rss.channel.item];
    return items.map((it: any) => {
      const image = extractImage(it);
      return {
        title: String(it.title ?? "").trim(),
        url: String(it.link ?? it.guid ?? "").trim(),
        source: source.name,
        category: source.category,
        region: source.region,
        publishedAt: safeDate(it.pubDate ?? it.updated ?? Date.now()),
        summary: removeMd(String(it.description ?? it["content:encoded"] ?? "")).slice(0, 300),
        ...(image ? { image } : {}),
      };
    });
  }
  if (xml?.feed?.entry) {
    const entries = Array.isArray(xml.feed.entry) ? xml.feed.entry : [xml.feed.entry];
    return entries.map((e: any) => ({
      title: String(e.title ?? "").trim(),
      url: String(e.link?.href ?? e.id ?? "").trim(),
      source: source.name,
      category: source.category,
      region: source.region,
      publishedAt: safeDate(e.updated ?? e.published ?? Date.now()),
      summary: removeMd(String(e.summary ?? e.content ?? "")).slice(0, 300),
    }));
  }
  return [];
}

async function scrapeIndexHTML(url: string, source: FeedSource): Promise<Article[]> {
  // HTML fallback has same timeout
  const { text } = await fetchWithTimeout(url, {});
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
    publishedAt: now,
  })) as Article[];
}

async function fetchOneSource(source: FeedSource): Promise<Article[]> {
  const cached = rssCache.get(source.url);
  const fresh = cached && Date.now() - cached.meta.fetchedAt < 5 * 60 * 1000;
  if (fresh) return cached!.items;

  const cond: Record<string, string> = {};
  if (cached?.meta.etag) cond["If-None-Match"] = cached.meta.etag;
  if (cached?.meta.lastModified) cond["If-Modified-Since"] = cached.meta.lastModified;

  try {
    const { res, text } = await fetchWithTimeout(source.url, cond);
    if (res.status === 304 && cached) {
      cached.meta.fetchedAt = Date.now();
      return cached.items;
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("text/html") || source.url.includes("ra.co/news")) {
      const items = await scrapeIndexHTML(source.url, source);
      rssCache.set(source.url, { meta: { fetchedAt: Date.now() }, items });
      return items;
    }

    const xml = parser.parse(text);
    const items = normalizeToArticles(xml, source);
    const validated = ArticlesSchema.parse(items).slice(0, 30);

    rssCache.set(source.url, {
      meta: {
        etag: res.headers.get("etag") || undefined,
        lastModified: res.headers.get("last-modified") || undefined,
        fetchedAt: Date.now(),
      },
      items: validated,
    });
    return validated;
  } catch {
    // Timeout/DNS/CF errors → return last good or empty; never throw
    return cached?.items ?? [];
  }
}

export async function fetchAllSources(
  sources: FeedSource[],
  maxPerSource = 10,
  concurrency = MAX_CONCURRENCY
): Promise<Article[]> {
  const q = [...sources];
  const buckets: Article[][] = [];
  async function worker() {
    while (q.length) {
      const s = q.shift()!;
      // Try up to 2 retries per source, all within per-source timeout
      let tries = 0, got: Article[] = [];
      while (tries < 3 && got.length === 0) {
        got = await fetchOneSource(s);
        if (!got.length) {
          tries++;
          await new Promise(r => setTimeout(r, 200 * 2 ** tries + Math.random() * 200));
        }
      }
      buckets.push(got.slice(0, maxPerSource));
    }
  }
  await Promise.allSettled(Array.from({ length: Math.min(concurrency, sources.length) }, worker));
  return dedupeAndSort(buckets.flat());
}

function dedupeAndSort(items: Article[]): Article[] {
  const map = new Map<string, Article>();
  for (const a of items) {
    const k = (a.url || "") + "::" + a.title.trim().toLowerCase();
    const cur = map.get(k);
    if (!cur || +new Date(a.publishedAt) > +new Date(cur.publishedAt)) map.set(k, a);
  }
  return Array.from(map.values()).sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}
