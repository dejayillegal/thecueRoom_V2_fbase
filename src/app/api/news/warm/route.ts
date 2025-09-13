export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { ingestNews } from "@/ai/flows/ingest-news";

export async function GET() {
  try {
    const { articles } = await ingestNews({ force: true });
    return NextResponse.json({ ok: true, count: articles.length });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("/api/news/warm error:", errorMessage);
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }
}
