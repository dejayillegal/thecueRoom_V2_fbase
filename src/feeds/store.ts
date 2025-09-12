
import { adminDb } from "@/lib/firebase-admin";
import type { NewsItem } from "./types";

function sanitize(item: Partial<NewsItem>): NewsItem {
  return {
    title: item.title ?? "Untitled",
    url: item.url ?? "https://thecueroom.invalid",
    source: item.source ?? "unknown",
    category: item.category ?? "Music",
    region: item.region ?? "Global",
    publishedAt: item.publishedAt ?? new Date(0),
    image: item.image ?? null,
  };
}

export async function saveAggregate(items: NewsItem[]) {
  try {
    const db = adminDb();
    await db.collection("news").doc("aggregate").set(
      { items: items.map(sanitize), updatedAt: new Date() },
      { merge: true }
    );
  } catch (e) {
    console.error("[feeds/store] Failed to save aggregate news.", e);
  }
}

export async function readAggregateFresh(ttlMs: number): Promise<NewsItem[] | null> {
  try {
    const db = adminDb();
    const snap = await db.collection("news").doc("aggregate").get();
    if (!snap.exists) return null;
    const data = snap.data() as any;
    const ts = data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(0);
    if (Date.now() - ts.getTime() > ttlMs) return null;
    return (data.items as NewsItem[]) ?? null;
  } catch (e) {
    console.error("[feeds/store] Failed to read aggregate news.", e);
    return null;
  }
}
