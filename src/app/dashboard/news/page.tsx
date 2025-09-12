
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NewsPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>News Feed</CardTitle>
          <CardDescription>
            Your curated feed of underground music news.
          </CardDescription>
        </CardHeader>
      </Card>
      {/* News items will be rendered here */}
    </div>
  );
}
