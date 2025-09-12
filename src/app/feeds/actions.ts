
'use server';

import { getDb } from '@/lib/firebase-admin';
import type { RssFeed } from '@/lib/rss-feeds';
import { revalidateTag } from 'next/cache';
import { safe } from '@/lib/actions';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';

export async function getFeeds() {
  return safe(async () => {
    const db = getDb();
    if (!db) {
      console.warn("Firestore is not available, returning empty feeds list.");
      return [];
    }
    const snapshot = await db.collection("news_feeds").orderBy("name").get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RssFeed));
  });
}


const AddFeedSchema = z.object({
  name: z.string().min(2),
  url: z.string().url(),
  category: z.string().min(2),
  region: z.string().min(2),
});

export async function addFeed(raw: unknown) {
  return safe(async () => {
    await requireAdmin();
    const db = getDb();
    if (!db) throw new Error("Database not available.");
    const input = AddFeedSchema.parse(raw);
    const docRef = await db.collection("news_feeds").add({ ...input, enabled: true, createdAt: new Date() });
    return { id: docRef.id, ...input };
  }, { tags: ["news:feeds"] });
}


const UpdateFeedSchema = AddFeedSchema.partial().extend({
    enabled: z.boolean().optional(),
});

export async function updateFeed(id: string, raw: unknown) {
  return safe(async () => {
    await requireAdmin();
    const db = getDb();
    if (!db) throw new Error("Database not available.");
    if (!id) throw new Error("Feed ID is required.");
    const input = UpdateFeedSchema.parse(raw);
    await db.collection("news_feeds").doc(id).set(input, { merge: true });
    return { id, ...input };
  }, { tags: ["news:feeds"] });
}


export async function deleteFeed(id: string) {
  return safe(async () => {
    await requireAdmin();
    const db = getDb();
    if (!db) throw new Error("Database not available.");
    if (!id) throw new Error("Feed ID is required.");
    await db.collection("news_feeds").doc(id).delete();
    return { id };
  }, { tags: ["news:feeds"] });
}


export async function validateFeedUrl(raw: unknown) {
  return safe(async () => {
    const { url } = z.object({ url: z.string().url() }).parse(raw);
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3500);
    try {
      const res = await fetch(url, { signal: ctrl.signal, redirect: "follow" });
      const type = res.headers.get("content-type") || "";
      const isFeed = type.includes("xml") || type.includes("rss") || type.includes("atom");
      const isHtml = type.includes("html");
      return { ok: res.ok, status: res.status, type, isFeed, isHtml };
    } finally {
      clearTimeout(t);
    }
  });
}
