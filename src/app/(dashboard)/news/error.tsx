
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewsError({ error }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <Card>
        <CardHeader>
            <CardTitle className="text-destructive">News Feed Error</CardTitle>
            <CardDescription>
                We ran into an issue while fetching the latest news.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
                This can happen when a remote news source is temporarily unavailable. The issue has been logged. You can try refreshing the page in a few moments.
            </p>
            <details className="text-xs text-muted-foreground/80">
                <summary>Error Details</summary>
                <pre className="mt-2 p-4 bg-muted/50 rounded-lg overflow-auto text-xs">
                    {error.message}
                </pre>
            </details>
        </CardContent>
    </Card>
  );
}
