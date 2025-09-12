
'use server';

import type { Article } from "./types";

let db: FirebaseFirestore.Firestore | null = null;

try {
  const { getApps, initializeApp, applicationDefault } = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");
  if (!getApps().length) {
    // Prefer explicit credentials via env; fall back to ADC
    initializeApp({ credential: applicationDefault() });
  }
  db = getFirestore();
  // 🚑 Critical: ignore undefined fields so Firestore never throws on sparse objects
  db.settings({ ignoreUndefinedProperties: true });
} catch {
  db = null; // No admin SDK available in this environment; caching becomes a no-op
}

// Deep-remove undefined (Firestore won't accept them)
// Also convert Date-like values into actual Date instances
function sanitizeForFirestore<T>(value: T): T {
  if (Array.isArray(value)) {
    // @ts-ignore
    return value.map((v) => sanitizeForFirestore(v)) as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value as Record<string, any>)) {
      if (v === undefined) continue;
      if (v && typeof v === "object") {
        out[k] = sanitizeForFirestore(v);
      } else if (k === "publishedAt") {
        const d = new Date(v as any);
        out[k] = isNaN(+d) ? new Date() : d;
      } else {
        out[k] = v;
      }
    }
    return out as T;
  }
  return value;
}

export async function saveSourceSnapshot(_sourceUrl: string, _items: Article[]) {
  if (!db) return;
  try {
    const { FieldValue } = await import("firebase-admin/firestore");
    await db
      .collection("news_sources")
      .doc(encodeURIComponent(_sourceUrl))
      .set(
        {
          updatedAt: FieldValue.serverTimestamp(),
          items: sanitizeForFirestore(_items),
        },
        { merge: true }
      );
  } catch {
    // swallow: Firestore is best-effort cache
  }
}

export async function readSourceSnapshot(_sourceUrl: string): Promise<Article[] | null> {
  if (!db) return null;
  try {
    const snap = await db.collection("news_sources").doc(encodeURIComponent(_sourceUrl)).get();
    return snap.exists ? (snap.data()?.items ?? null) : null;
  } catch {
    return null;
  }
}

export async function saveAggregate(items: Article[]) {
  if (!db) return;
  try {
    const { FieldValue } = await import("firebase-admin/firestore");
    await db.collection("news").doc("aggregate").set(
      {
        updatedAt: FieldValue.serverTimestamp(),
        items: sanitizeForFirestore(items),
      },
      { merge: true }
    );
  } catch {
    // swallow: page should never fail because cache write failed
  }
}

export async function readAggregateFresh(staleMs: number): Promise<Article[] | null> {
  if (!db) return null;
  try {
    const doc = await db.collection("news").doc("aggregate").get();
    if (!doc.exists) return null;
    const data = doc.data()!;
    const updatedAt: Date | undefined = data.updatedAt?.toDate?.();
    if (!updatedAt || Date.now() - updatedAt.getTime() > staleMs) return null;
    return (data.items as Article[]) ?? null;
  } catch {
    return null;
  }
}
