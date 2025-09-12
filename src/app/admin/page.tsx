
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { rssFeeds } from "@/lib/rss-feeds";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Console</CardTitle>
          <CardDescription>
            Manage application settings and content sources.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>RSS Feed Management</CardTitle>
          <CardDescription>
            Add and review the RSS feeds used for the news ingestion flow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add New Feed</h3>
              <form className="grid sm:grid-cols-3 gap-4">
                <Input placeholder="Category (e.g., Music)" />
                <Input placeholder="Region (e.g., Global)" />
                <Input placeholder="Name (e.g., Resident Advisor)" />
                <Input placeholder="Feed URL" className="sm:col-span-2" />
                 <Button type="submit">Add Feed</Button>
              </form>
            </div>

            <div className="space-y-4">
               <h3 className="text-lg font-medium">Current Feeds</h3>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Region</TableHead>
                            <TableHead>URL</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {rssFeeds.map((feed, index) => (
                            <TableRow key={index}>
                            <TableCell className="font-medium">{feed.name}</TableCell>
                             <TableCell><Badge variant="outline">{feed.category}</Badge></TableCell>
                             <TableCell><Badge variant="secondary">{feed.region}</Badge></TableCell>
                            <TableCell className="text-muted-foreground">{feed.url}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
