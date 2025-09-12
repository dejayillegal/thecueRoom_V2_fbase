
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="container mx-auto">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Manage your account and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>User settings will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
