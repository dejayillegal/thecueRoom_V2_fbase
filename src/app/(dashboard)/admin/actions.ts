
'use server';

import { db } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

export async function setNewsSettings(values: Record<string, unknown>) {
  // Ensure values are numbers before writing
  const numericValues: Record<string, number> = {};
  for (const key in values) {
    const value = Number(values[key]);
    if (!isNaN(value)) {
      numericValues[key] = value;
    }
  }
  await db.collection("config").doc("news").set(numericValues, { merge: true });
  revalidatePath("/admin");
  revalidatePath("/news");
}

export async function addFeed(input: { name: string; url: string; category: string; region: string }) {
  await db.collection("news_feeds").add({ ...input, enabled: true, createdAt: new Date() });
  revalidatePath("/admin");
}

export async function updateFeed(id: string, values: { name: string; category: string; region: string; }) {
    await db.collection("news_feeds").doc(id).update(values);
    revalidatePath("/admin");
}


export async function deleteFeed(id: string) {
  await db.collection("news_feeds").doc(id).delete();
  revalidatePath("/admin");
}

export async function toggleFeed(id: string, enabled: boolean) {
  await db.collection("news_feeds").doc(id).set({ enabled }, { merge: true });
  revalidatePath("/admin");
  revalidatePath("/news");
}
