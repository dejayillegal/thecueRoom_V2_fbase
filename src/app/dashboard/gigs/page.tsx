
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GigsPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Gig Radar</CardTitle>
          <CardDescription>
            Find and list gigs happening in Bangalore.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Gig radar functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
