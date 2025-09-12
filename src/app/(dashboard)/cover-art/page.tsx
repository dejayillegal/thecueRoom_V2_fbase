
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CoverArtPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Cover Art</CardTitle>
          <CardDescription>
            Generate striking visuals for your tracks and mixes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Cover art generator functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
