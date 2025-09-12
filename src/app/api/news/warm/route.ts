export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { getNewsSettings, getEnabledFeeds } from "@/feeds/config";
import { getDb, getDbInitError, isDbAvailable } from "@/lib/firebase-admin";

export async function GET() {
  const settings = await getNewsSettings();
  const feeds = await getEnabledFeeds();
  const db = getDb();
  const dbErr = getDbInitError();

  return NextResponse.json({
    ok: true,
    env: {
      TCR_FIRESTORE_DISABLED: process.env.TCR_FIRESTORE_DISABLED ?? null,
      NODE_ENV: process.env.NODE_ENV,
    },
    feeds: { count: feeds.length },
    settings,
    firestore: {
      available: !!db,
      initError: dbErr ? dbErr.message : null,
    },
    time: new Date().toISOString(),
  });
}
