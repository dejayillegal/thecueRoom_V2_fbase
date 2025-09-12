
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PenSquare, Newspaper, Image as ImageIcon, Plus, Mic, MapPin, CalendarDays } from "lucide-react";
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
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <Link href="/dashboard/cover-art" className="group">
                    <Card className="h-full transition-all duration-300 hover:bg-muted/50 hover:border-primary">
                        <CardHeader>
                            <ImageIcon className="h-8 w-8 text-muted-foreground transition-all duration-300 group-hover:text-primary" />
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold">Cover Art</h3>
                            <p className="text-sm text-muted-foreground">Generate visuals</p>
                        </CardContent>
                    </Card>
                </Link>
                 <Link href="/dashboard/memes" className="group">
                    <Card className="h-full transition-all duration-300 hover:bg-muted/50 hover:border-primary">
                        <CardHeader>
                            <PenSquare className="h-8 w-8 text-muted-foreground transition-all duration-300 group-hover:text-primary" />
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold">Memes</h3>
                            <p className="text-sm text-muted-foreground">Spark community</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/dashboard/news" className="group">
                    <Card className="h-full transition-all duration-300 hover:bg-muted/50 hover:border-primary">
                        <CardHeader>
                            <Newspaper className="h-8 w-8 text-muted-foreground transition-all duration-300 group-hover:text-primary" />
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold">News</h3>
                            <p className="text-sm text-muted-foreground">Curated updates</p>
                        </CardContent>
                    </Card>
                </Link>
                 <Link href="/dashboard/gigs" className="group">
                    <Card className="h-full transition-all duration-300 hover:bg-muted/50 hover:border-primary">
                        <CardHeader>
                             <CalendarDays className="h-8 w-8 text-muted-foreground transition-all duration-300 group-hover:text-primary" />
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold">Gig Radar</h3>
                            <p className="text-sm text-muted-foreground">Find local shows</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
          </CardContent>
        </Card>

        {/* Gigs Section */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Gigs</CardTitle>
            <Button variant="outline" size="sm" asChild><Link href="/gigs"><Plus className="mr-2 h-4 w-4" /> Add gig</Link></Button>
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
            <Button variant="outline" size="sm" asChild><Link href="/dashboard/news">View all</Link></Button>
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
