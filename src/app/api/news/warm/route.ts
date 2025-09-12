
export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getNewsSettings, getEnabledFeeds } from "@/feeds/config";
import { readAggregateFresh } from "@/feeds/store";
import { ingestNews } from "@/ai/flows/ingest-news";

async function isDbAvailable() {
    try {
        await adminDb().listCollections();
        return true;
    } catch {
        return false;
    }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const force = url.searchParams.get('force') === 'true';

  if (force) {
    const { articles } = await ingestNews({ force: true });
    return NextResponse.json({ ok: true, ingested: articles.length });
  }

  const settings = await getNewsSettings();
  const feeds = await getEnabledFeeds();
  const dbAvailable = await isDbAvailable();
  const agg = await readAggregateFresh(Number.MAX_SAFE_INTEGER);

  return NextResponse.json({
    ok: true,
    firestore: { available: dbAvailable },
    settings,
    feeds: { count: feeds.length },
    aggregate: { items: agg?.length ?? 0, lastUpdated: agg ? new Date(agg[0]?.publishedAt) : null },
    ts: new Date().toISOString(),
  });
}
