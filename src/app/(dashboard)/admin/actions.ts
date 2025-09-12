
'use server';

import { z } from "zod";
import { getDb } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/auth";
import { safe } from "@/lib/actions";

const SettingsSchema = z.object({
  GLOBAL_TIMEOUT_MS: z.coerce.number().int().positive(),
  SOURCE_TIMEOUT_MS: z.coerce.number().int().positive(),
  FETCH_CONCURRENCY: z.coerce.number().int().min(1).max(16),
  STALE_FALLBACK_MS: z.coerce.number().int().positive(),
  MAX_PER_SOURCE: z.coerce.number().int().min(1).max(50),
});

export async function setNewsSettings(raw: unknown) {
  return safe(async () => {
    await requireAdmin();
    const db = getDb();
    if (!db) throw new Error("Database not available.");
    const input = SettingsSchema.parse(raw);
    await db.collection("config").doc("news").set(input, { merge: true });
    return input;
  }, { tags: ["news:settings"] });
}
