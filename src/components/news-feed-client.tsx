
"use client";

import React, { useState, useMemo } from "react";
import type { Article } from "@/feeds/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Globe, BookOpen, Music, IndianRupee, Podcast, Library, HardHat, Waypoints, Mic2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { formatDistanceToNow } from 'date-fns';

const categoryIcons: { [key: string]: React.ElementType } = {
  "Music": Mic2,
  "Global Underground": Globe,
  "Industry": HardHat,
  "Guides": Waypoints,
  "default": BookOpen,
};

function getDeterministicId(str: string) {
    let hash = 0;
    if (!str || str.length === 0) {
      return Math.floor(Math.random() * 10000);
    }
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

export default function NewsFeedClient({ articles, categories }: { articles: Article[], categories: string[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    if (!selectedCategory) {
      return articles;
    }
    return articles.filter(article => article.category === selectedCategory);
  }, [articles, selectedCategory]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>News Feed</CardTitle>
        <CardDescription>
          Your curated feed of underground music news. Select a category to filter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map(category => {
            const CategoryIcon = categoryIcons[category] || categoryIcons.default;
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="flex items-center gap-2"
              >
                <CategoryIcon className="h-4 w-4" />
                {category}
              </Button>
            );
          })}
        </div>
        <div className="grid gap-6 animate-fade-in">
          {filteredArticles.map((article) => {
            const CategoryIcon = categoryIcons[article.category] || categoryIcons.default;
            const publishedAt = article.publishedAt ? new Date(article.publishedAt) : new Date();
            const imageSeed = getDeterministicId(article.url);
            const imageUrl = article.image ? article.image : `https://picsum.photos/seed/${imageSeed}/100/100`;

            return (
              <div key={article.url} className="group transition-all duration-300 ease-in-out">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50">
                  <Image
                    src={imageUrl}
                    alt={article.title}
                    width={80}
                    height={80}
                    className="rounded-lg aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="electronic music"
                    unoptimized // Use unoptimized for external images that we don't control
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none group-hover:text-primary">{article.title}</p>
                    <p className="text-sm text-muted-foreground">{article.source}</p>
                    <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="flex items-center gap-1.5">
                            <CategoryIcon className="h-3 w-3" />
                            {article.category}
                        </Badge>
                        <span>
                            {formatDistanceToNow(publishedAt, { addSuffix: true })}
                        </span>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
