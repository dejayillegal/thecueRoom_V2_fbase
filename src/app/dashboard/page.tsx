
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Create, Newspaper, Image as ImageIcon, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const newsItems = [
  {
    title: "Berghain announces extended Sunday sessions",
    source: "Resident Advisor",
    time: "2h ago",
    image: "1",
  },
  {
    title: "Detroit mainstay drops surprise vinyl-only EP",
    source: "XLR8R",
    time: "4h ago",
    image: "2",
  },
  {
    title: "Paris warehouse collective unveils fall lineup",
    source: "Mixmag",
    time: "6h ago",
    image: "3",
  },
  {
    title: "Modular synth label releases free sample pack",
    source: "CDM",
    time: "1d ago",
    image: "4",
  },
  {
    title: "Underground stream hits 1M concurrent listeners",
    source: "Boiler Room",
    time: "1d ago",
    image: "5",
  },
];

const gigs = [
    {
        name: "Basement 23 • Berlin",
        time: "Fri 02:00 - Industrial Techno",
        status: "Confirmed",
        image: "6"
    },
    {
        name: "Warehouse Unit 7 • London",
        time: "Sat 03:30 - Raw House",
        status: "Pending",
        image: "7"
    }
]

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Welcome Section */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-start">
            <div>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Your feed is tuned to your preferences. Explore sections or upload new content.</CardDescription>
            </div>
             <Badge variant="outline">Private beta</Badge>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="techno">Techno</TabsTrigger>
                <TabsTrigger value="house">House</TabsTrigger>
                <TabsTrigger value="minimal">Minimal</TabsTrigger>
                <TabsTrigger value="deep">Deep</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cover Art</CardTitle>
                  <CardDescription>Generate striking visuals</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Button><ImageIcon className="mr-2 h-4 w-4"/>Open</Button>
                    <Button variant="outline">View</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Memes</CardTitle>
                  <CardDescription>Spark the community</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Button><Create className="mr-2 h-4 w-4"/>Create</Button>
                    <Button variant="outline">Explore</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">News</CardTitle>
                  <CardDescription>Curated underground updates</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Button><Newspaper className="mr-2 h-4 w-4"/>Read</Button>
                    <Button variant="outline">Sources</Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Gigs Section */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Gigs</CardTitle>
            <Button variant="outline" size="sm"><Plus className="mr-2 h-4 w-4" /> Add gig</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {gigs.map((gig, index) => (
                    <Card key={index} className="flex items-center p-4 gap-4">
                        <Image src={`https://picsum.photos/seed/${gig.image}/80/80`} alt={gig.name} width={80} height={80} className="rounded-md" data-ai-hint="techno club" />
                        <div className="flex-grow">
                            <h3 className="font-semibold">{gig.name}</h3>
                            <p className="text-sm text-muted-foreground">{gig.time}</p>
                        </div>
                        <Badge variant={gig.status === 'Confirmed' ? 'default' : 'secondary'}>{gig.status}</Badge>
                    </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* News Spotlights */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">News spotlights</h2>
            <Button variant="outline" size="sm">Auto-scroll</Button>
        </div>
        <div className="space-y-4">
          {newsItems.map((item, index) => (
            <Card key={index} className="p-4 flex items-start gap-4">
               <Image src={`https://picsum.photos/seed/${item.image}/80/80`} alt={item.title} width={80} height={80} className="rounded-md" data-ai-hint="news article" />
              <div>
                <h3 className="font-semibold leading-tight">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.source} • {item.time}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
