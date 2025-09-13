
import { adminDb } from "@/lib/firebase-admin";
import { z } from "zod";
import process from "node:process";

export const NewsSettingsSchema = z.object({
  GLOBAL_TIMEOUT_MS: z.coerce.number().int().positive().default(12000),
  SOURCE_TIMEOUT_MS: z.coerce.number().int().positive().default(3500),
  FETCH_CONCURRENCY: z.coerce.number().int().min(1).max(16).default(4),
  STALE_FALLBACK_MS: z.coerce.number().int().positive().default(21_600_000), // 6 hours
  MAX_PER_SOURCE: z.coerce.number().int().min(1).max(50).default(12),
});
export type NewsSettings = z.infer<typeof NewsSettingsSchema>;

function settingsFromEnv(): NewsSettings {
  return NewsSettingsSchema.parse({
    GLOBAL_TIMEOUT_MS: process.env.NEWS_GLOBAL_TIMEOUT_MS,
    SOURCE_TIMEOUT_MS: process.env.NEWS_SOURCE_TIMEOUT_MS,
    FETCH_CONCURRENCY: process.env.NEWS_FETCH_CONCURRENCY,
    STALE_FALLBACK_MS: process.env.NEWS_STALE_FALLBACK_MS,
    MAX_PER_SOURCE: process.env.NEWS_MAX_PER_SOURCE,
  });
}

export async function getNewsSettings(): Promise<NewsSettings> {
  try {
    const db = adminDb();
    const snap = await db.collection("config").doc("news").get();
    const raw = snap.exists ? snap.data() : {};
    return { ...settingsFromEnv(), ...(raw as Partial<NewsSettings>) };
  } catch(e) {
    console.warn("[feeds/config] Failed to get news settings from Firestore, falling back to env.", e);
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
  { name: "Mixmag", url: "https://mixmag.net/rss", category: "Music", region: "Global", enabled: true },
  { name: "DJ Mag", url: "https://djmag.com/rss.xml", category: "Music", region: "Global", enabled: true },
  { name: "XLR8R", url: "https://xlr8r.com/feed/", category: "Music", region: "Global", enabled: true },
  { name: "Attack Magazine", url: "https://www.attackmagazine.com/feed/", category: "Industry", region: "Global", enabled: true },
  { name: "CDM", url: "https://cdm.link/feed/", category: "Industry", region: "Global", enabled: true },
  { name: "Wild City", url: "https://wildcity.in/feed", category: "Music", region: "India", enabled: true },
];

export async function getEnabledFeeds(): Promise<Feed[]> {
  try {
    const db = adminDb();
    const snap = await db.collection("news_feeds").where("enabled", "==", true).get();
    if (snap.empty) {
        console.warn("[feeds/config] No enabled feeds found in Firestore, returning defaults.");
        return DEFAULT_FEEDS;
    };
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Feed) }));
  } catch(e) {
    console.warn("[feeds/config] Failed to get enabled feeds from Firestore, falling back to defaults.", e);
    return DEFAULT_FEEDS;
  }
}
