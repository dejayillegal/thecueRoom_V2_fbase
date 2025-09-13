import { adminDb } from "@/lib/firebase-admin";
import type { NewsItem } from "./types";

const AGG_COLLECTION = 'news';
const AGG_DOC_ID = 'aggregate';

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
  if (!items || items.length === 0) return;
  try {
    const db = adminDb();
    await db.collection(AGG_COLLECTION).doc(AGG_DOC_ID).set(
      { items: items.map(sanitize), updatedAt: new Date() },
      { merge: true }
    );
  } catch (e) {
    console.error("[feeds/store] Failed to save aggregate news.", e);
  }
}

export async function readAggregateFresh(freshMs: number): Promise<NewsItem[] | null> {
  try {
    const db = adminDb();
    const snap = await db.collection(AGG_COLLECTION).doc(AGG_DOC_ID).get();
    if (!snap.exists) return null;
    const data = snap.data();
    if (!data?.items?.length) return null;
    const ts = data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(0);
    const age = Date.now() - ts.getTime();
    return age <= freshMs ? (data.items as NewsItem[]) : null;
  } catch (e) {
    console.error("[feeds/store] Failed to read aggregate news.", e);
    return null;
  }
}
