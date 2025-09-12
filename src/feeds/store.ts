
import { getApps, initializeApp, App } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import type { Article } from "./types";

let app: App;
if (!getApps().length) {
  app = initializeApp(); // relies on default service account in Firebase Functions / local emulator env
} else {
  app = getApps()[0];
}
const db = getFirestore(app);

export async function saveSourceSnapshot(sourceUrl: string, items: Article[]) {
  await db.collection("news_sources").doc(encodeURIComponent(sourceUrl)).set({
    updatedAt: FieldValue.serverTimestamp(),
    items,
  }, { merge: true });
}

export async function readSourceSnapshot(sourceUrl: string): Promise<Article[] | null> {
  const snap = await db.collection("news_sources").doc(encodeURIComponent(sourceUrl)).get();
  return snap.exists ? (snap.data()?.items ?? null) : null;
}

export async function saveAggregate(items: Article[]) {
  // Firestore documents have a size limit of ~1MB.
  // To be safe, we'll serialize and check the size. If it's too large, we'll truncate.
  let itemsToSave = [...items];
  let byteSize = Buffer.byteLength(JSON.stringify(itemsToSave), 'utf8');
  
  const MAX_FIRESTORE_DOC_SIZE = 1048576; // 1 MiB
  const TARGET_SIZE = MAX_FIRESTORE_DOC_SIZE * 0.9; // Target 90% of max size for safety

  while (byteSize > TARGET_SIZE && itemsToSave.length > 1) {
    itemsToSave.pop(); // Remove the oldest articles first
    byteSize = Buffer.byteLength(JSON.stringify(itemsToSave), 'utf8');
  }

  await db.collection("news").doc("aggregate").set({
    updatedAt: FieldValue.serverTimestamp(),
    items: itemsToSave,
  }, { merge: true });
}

export async function readAggregateFresh(staleMs: number): Promise<Article[] | null> {
  try {
    const doc = await db.collection("news").doc("aggregate").get();
    if (!doc.exists) return null;
    const data = doc.data();
    if (!data) return null;
    
    const updatedAt: Date | undefined = data.updatedAt?.toDate?.();
    if (!updatedAt || Date.now() - updatedAt.getTime() > staleMs) return null;

    return data.items ?? null;
  } catch (error) {
    console.error("Error reading from Firestore:", error);
    // If Firestore is unavailable (e.g., permissions issue), we fail gracefully.
    return null;
  }
}
