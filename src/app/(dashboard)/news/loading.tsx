import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>News Feed</CardTitle>
          <CardDescription>
            Fetching the latest updates...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-4 animate-pulse">
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
