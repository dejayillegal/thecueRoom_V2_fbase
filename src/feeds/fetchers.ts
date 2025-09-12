
import { XMLParser } from "fast-xml-parser";
import pLimit from "p-limit";
import type { Feed } from "./config";
import type { NewsItem, NewsSettings } from "./types";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

function parseMaybeDate(v: unknown): Date {
  if (v instanceof Date) return v;
  if (typeof v === "number") return new Date(v);
  if (typeof v === "string") {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d;
  }
  return new Date();
}

function extractImage(item: any): string | null {
  const media = item["media:content"]?.url || item["media:thumbnail"]?.url || item["enclosure"]?.url;
  const itunes = item["itunes:image"]?.href;
  const generic = item.image?.url || item.image;
  return (media || itunes || generic) ?? null;
}

async function fetchWithTimeout(url: string, timeoutMs: number, signal?: AbortSignal) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(new Error("source-timeout")), timeoutMs);
  try {
    return await fetch(url, { signal: signal ? signal : ctrl.signal, redirect: "follow" });
  } finally {
    clearTimeout(id);
  }
}

async function fetchOneSource(feed: Feed, settings: NewsSettings): Promise<NewsItem[]> {
  try {
    const res = await fetchWithTimeout(feed.url, settings.SOURCE_TIMEOUT_MS);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();

    let items: any[] = [];
    try {
      const xml = parser.parse(text);
      const channel = xml.rss?.channel ?? xml.feed;
      const rawItems = channel?.item ?? channel?.entry ?? [];
      items = Array.isArray(rawItems) ? rawItems : [rawItems];
    } catch {
      const matches = [...text.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([^<]{10,})<\/a>/gi)].slice(0, settings.MAX_PER_SOURCE);
      return matches.map(([_, href, title]) => ({
        title: title.trim(),
        url: new URL(href, feed.url).toString(),
        source: feed.name,
        category: feed.category,
        region: feed.region,
        publishedAt: new Date(),
        image: null,
      }));
    }

    const mapped = items.slice(0, settings.MAX_PER_SOURCE).map((it: any) => ({
      title: String(it.title ?? it["media:title"] ?? "Untitled").trim(),
      url: String(it.link?.href ?? it.link ?? "").trim(),
      source: feed.name,
      category: feed.category,
      region: feed.region,
      publishedAt: parseMaybeDate(it.pubDate ?? it.published ?? it.updated ?? it["dc:date"] ?? it.date ?? it.isoDate),
      image: extractImage(it),
    }));

    return mapped.filter(m => m.url && m.url.startsWith("http"));
  } catch (e) {
    console.error(`[news] ${feed.name} failed:`, e);
    return [];
  }
}

export async function fetchAllSources(feeds: Feed[], settings: NewsSettings): Promise<NewsItem[]> {
  const limit = pLimit(settings.FETCH_CONCURRENCY);

  const globalCtrl = new AbortController();
  const globalTimer = setTimeout(() => globalCtrl.abort("global-timeout"), settings.GLOBAL_TIMEOUT_MS);

  try {
    const settled = await Promise.allSettled(
      feeds.map(f => limit(() => fetchOneSource(f, settings)))
    );
    const all = settled.flatMap(s => (s.status === "fulfilled" ? s.value : []));

    const seen = new Set<string>();
    const uniq: NewsItem[] = [];
    for (const item of all) {
      if (!item.url) continue;
      const key = `${item.source}:${item.title.trim().toLowerCase()}:${new URL(item.url).hostname}${new URL(item.url).pathname}`;
      if (seen.has(key)) continue;
      seen.add(key);
      uniq.push(item);
    }
    
    uniq.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    return uniq;
  } finally {
    clearTimeout(globalTimer);
  }
}
