
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GenresPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Genres</CardTitle>
          <CardDescription>
            Explore and follow genres.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Genre exploration functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
