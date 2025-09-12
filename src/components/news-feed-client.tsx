
"use client";

import React from "react";
import type { Article } from "@/ai/flows/ingest-news";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Globe, BookOpen, Music, IndianRupee } from "lucide-react";
import { Badge } from "./ui/badge";
import { formatDistanceToNow } from 'date-fns';

const categoryIcons: { [key: string]: React.ElementType } = {
  "Global Underground": Globe,
  "India / Asia Underground": IndianRupee,
  "Gear / Production": Music,
  "default": BookOpen,
};

export default function NewsFeedClient({ articles }: { articles: Article[] }) {
  return (
    <div className="grid gap-6">
      {articles.map((article, index) => {
        const CategoryIcon = categoryIcons[article.category] || categoryIcons.default;
        const publishedAt = article.publishedAt ? new Date(article.publishedAt) : new Date();

        return (
          <Card key={index} className="p-4 hover:bg-muted/50 transition-colors">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-start space-x-4">
              <Image
                src={`https://picsum.photos/seed/${index + 10}/100/100`}
                alt={article.title}
                width={80}
                height={80}
                className="rounded-lg aspect-square object-cover"
                data-ai-hint="news article"
              />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{article.title}</p>
                <p className="text-sm text-muted-foreground">{article.source}</p>
                <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
                    <Badge variant="outline" className="flex items-center gap-1.5">
                        <CategoryIcon className="h-3 w-3" />
                        {article.category}
                    </Badge>
                    <span>
                        {formatDistanceToNow(publishedAt, { addSuffix: true })}
                    </span>
                </div>
              </div>
            </a>
          </Card>
        );
      })}
    </div>
  );
}
