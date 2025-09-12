
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { ingestNews } from "@/ai/flows/ingest-news";

export async function GET() {
  try {
    const { articles } = await ingestNews({ force: true });
    return NextResponse.json({ ok: true, count: articles.length });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}
