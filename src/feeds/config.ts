
import { getDb, isDbAvailable, markDbBroken } from "@/lib/firebase-admin";
import { z } from "zod";

export const NewsSettingsSchema = z.object({
  GLOBAL_TIMEOUT_MS: z.number().int().positive().default(9000),
  SOURCE_TIMEOUT_MS: z.number().int().positive().default(3500),
  FETCH_CONCURRENCY: z.number().int().min(1).max(16).default(4),
  STALE_FALLBACK_MS: z.number().int().positive().default(21_600_000),
  MAX_PER_SOURCE: z.number().int().min(1).max(50).default(12),
});
export type NewsSettings = z.infer<typeof NewsSettingsSchema>;

function settingsFromEnv(): NewsSettings {
  return NewsSettingsSchema.parse({
    GLOBAL_TIMEOUT_MS: Number(process.env.NEWS_GLOBAL_TIMEOUT_MS) || undefined,
    SOURCE_TIMEOUT_MS: Number(process.env.NEWS_SOURCE_TIMEOUT_MS) || undefined,
    FETCH_CONCURRENCY: Number(process.env.NEWS_FETCH_CONCURRENCY) || undefined,
    STALE_FALLBACK_MS: Number(process.env.NEWS_STALE_FALLBACK_MS) || undefined,
    MAX_PER_SOURCE: Number(process.env.NEWS_MAX_PER_SOURCE) || undefined,
  });
}

export async function getNewsSettings(): Promise<NewsSettings> {
  if (!await isDbAvailable()) return settingsFromEnv();
  const db = await getDb();
  if (!db) return settingsFromEnv();
  try {
    const snap = await db.collection("config").doc("news").get();
    const raw = snap.exists ? snap.data() : {};
    return { ...settingsFromEnv(), ...(raw as Partial<NewsSettings>) };
  } catch {
    await markDbBroken();
    return settingsFromEnv();
  }
}

export type Feed = {
  id?: string;
  name: string;
  url: string;
  category: string;
  region: string;
  enabled?: boolean;
};

const DEFAULT_FEEDS: Feed[] = [
  { name: "Mixmag", url: "https://mixmag.net/rss", category: "Music", region: "Global" },
  { name: "DJ Mag", url: "https://djmag.com/rss.xml", category: "Music", region: "Global" },
  { name: "XLR8R", url: "https://xlr8r.com/feed/", category: "Music", region: "Global" },
  { name: "Attack Magazine", url: "https://www.attackmagazine.com/feed/", category: "Industry", region: "Global" },
  { name: "CDM", url: "https://cdm.link/feed/", category: "Industry", region: "Global" },
  { name: "Wild City", url: "https://wildcity.in/feed", category: "Music", region: "India" },
];

export async function getEnabledFeeds(): Promise<Feed[]> {
  if (!await isDbAvailable()) return DEFAULT_FEEDS;
  const db = await getDb();
  if (!db) return DEFAULT_FEEDS;
  try {
    const snap = await db.collection("news_feeds").where("enabled", "==", true).get();
    if (snap.empty) return DEFAULT_FEEDS;
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Feed) }));
  } catch {
    await markDbBroken();
    return DEFAULT_FEEDS;
  }
}
