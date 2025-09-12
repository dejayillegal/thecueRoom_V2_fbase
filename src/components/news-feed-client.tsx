
"use client";

import React, { useState, useMemo } from "react";
import type { Article } from "@/ai/flows/ingest-news";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Globe, BookOpen, Music, IndianRupee, Podcast, Library } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { formatDistanceToNow } from 'date-fns';

const categoryIcons: { [key: string]: React.ElementType } = {
  "Global Underground": Globe,
  "India / Asia Underground": IndianRupee,
  "Gear / Production": Music,
  "Mixes / Podcasts": Podcast,
  "Labels / Platforms": Library,
  "default": BookOpen,
};

function getDeterministicId(str: string) {
    let hash = 0;
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

            return (
              <div key={article.url} className="group transition-all duration-300 ease-in-out">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50">
                  <Image
                    src={`https://picsum.photos/seed/${imageSeed}/100/100`}
                    alt={article.title}
                    width={80}
                    height={80}
                    className="rounded-lg aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="electronic music"
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{article.title}</p>
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
