
import { db } from "@/lib/firebase-admin";
import { NewsSettingsSchema, type NewsSettings } from "./types";

const DEFAULTS: NewsSettings = {
  GLOBAL_TIMEOUT_MS: 9000,
  SOURCE_TIMEOUT_MS: 3500,
  FETCH_CONCURRENCY: 4,
  STALE_FALLBACK_MS: 21_600_000, // 6h
  MAX_PER_SOURCE: 12,
};

export async function getNewsSettings(): Promise<NewsSettings> {
  try {
    const snap = await db.collection("config").doc("news").get();
    const raw = snap.exists ? snap.data() : {};
    // Use partial parsing and merge with defaults for resilience
    const parsed = NewsSettingsSchema.partial().parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch (error) {
    console.error("Error fetching news settings, using defaults:", error);
    return DEFAULTS;
  }
}

export type Feed = {
  id: string;
  name: string;
  url: string;
  category: string;
  region: string;
  enabled: boolean;
};

export async function getEnabledFeeds(): Promise<Feed[]> {
  try {
    const col = db.collection("news_feeds");
    const snap = await col.where("enabled", "==", true).get();
    if (snap.empty) {
        // Fallback to a default list if firestore is empty
        return [
             { id: "default-ra", name: "Resident Advisor (News)", url: "https://ra.co/news", category: "Global Underground", region: "Global", enabled: true },
             { id: "default-mixmag", name: "Mixmag", url: "https://mixmag.net/rss", category: "Music", region: "Global", enabled: true }
        ]
    }
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Feed, "id">) }));
  } catch (error) {
    console.error("Error fetching enabled feeds, using defaults:", error);
     return [
        { id: "default-ra", name: "Resident Advisor (News)", url: "https://ra.co/news", category: "Global Underground", region: "Global", enabled: true },
        { id: "default-mixmag", name: "Mixmag", url: "https://mixmag.net/rss", category: "Music", region: "Global", enabled: true }
    ]
  }
}
