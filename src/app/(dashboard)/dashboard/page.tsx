
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Newspaper, Palette, Bot, Tent, Music } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { user } = useAuth();

  const features = [
    { title: "News Feed", description: "Curated underground music news.", href: "/news", icon: Newspaper },
    { title: "AI Cover Art", description: "Generate visuals for your tracks.", href: "/cover-art", icon: Palette },
    { title: "Meme Generator", description: "Create and share memes.", href: "/memes", icon: Bot },
    { title: "Gig Radar", description: "Find gigs in Bangalore.", href: "/gigs", icon: Tent },
    { title: "Explore Genres", description: "Discover new sounds.", href: "/genres", icon: Music },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.displayName || 'Artist'}</h1>
        <p className="text-muted-foreground">This is your creative hub. Access your tools and stay connected.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card key={feature.href} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
                <feature.icon className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button asChild className="w-full">
                <Link href={feature.href}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
