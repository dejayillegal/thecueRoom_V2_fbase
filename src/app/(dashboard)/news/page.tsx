
import { ingestNews } from "@/ai/flows/ingest-news";
import NewsFeedClient from "@/components/news-feed-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";
import type { NewsItem } from "@/feeds/types";

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function NewsFeed() {
  let articles: NewsItem[] = [];
  try {
    const response = await ingestNews({});
    articles = response.articles as NewsItem[];
  } catch (error) {
    console.error("Failed to ingest news feed:", error);
    // In case of a catastrophic failure in ingestNews, return empty array.
    // The error boundary will catch this if the component itself throws.
    articles = [];
  }

  const categories = [...new Set(articles.map((article: NewsItem) => article.category))];
  return <NewsFeedClient articles={articles} categories={categories} />;
}

export default function NewsPage() {
  return (
    <div className="space-y-8">
       <Suspense fallback={<NewsFeedSkeleton />}>
        <NewsFeed />
      </Suspense>
    </div>
  );
}

function NewsFeedSkeleton() {
  return (
     <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>News Feed</CardTitle>
          <CardDescription>
            Your curated feed of underground music news, updated in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
                </div>
            ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
