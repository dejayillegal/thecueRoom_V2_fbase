
import { db } from "@/lib/firebase-admin";
import type { NewsItem } from "./types";

const AGG_PATH = db.collection("news").doc("aggregate");

type AggregateDoc = {
  items: Array<NewsItem>;
  updatedAt: FirebaseFirestore.Timestamp;
};

function sanitize(item: Partial<NewsItem>): NewsItem {
  // Replace undefined with explicit values so Firestore never sees "undefined"
  return {
    title: item.title ?? "Untitled",
    url: item.url ?? "https://thecueroom.example/invalid",
    source: item.source ?? "unknown",
    category: item.category ?? "Music",
    region: item.region ?? "Global",
    publishedAt: item.publishedAt ?? new Date(0),
    image: item.image ?? null,
  };
}

export async function saveAggregate(items: NewsItem[]) {
  try {
    const payload = {
      items: items.map(sanitize),
      updatedAt: new Date(),
    };
    await AGG_PATH.set(payload, { merge: true });
  } catch (error) {
    console.error("[store] Failed to save aggregate:", error);
    // Swallow error - caching is best-effort
  }
}

export async function readAggregateFresh(ttlMs: number): Promise<NewsItem[] | null> {
  try {
    const snap = await AGG_PATH.get();
    if (!snap.exists) return null;
    const data = snap.data() as AggregateDoc;
    const age = Date.now() - (data.updatedAt.toMillis?.() ?? 0);
    return age <= ttlMs ? data.items : null;
  } catch (error) {
    console.error("[store] Failed to read aggregate:", error);
    return null; // Never crash the page for a cache read failure
  }
}
