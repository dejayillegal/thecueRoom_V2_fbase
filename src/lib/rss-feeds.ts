
export type RssFeed = {
  category: string;
  region: string;
  name: string;
  url: string;
  notes?: string;
};

// This file now only contains the type definition.
// The data has been moved to `src/lib/feed-store.ts`
// to act as a persistent in-memory database.
