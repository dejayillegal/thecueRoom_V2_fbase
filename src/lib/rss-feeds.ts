
// This file is kept for type compatibility with the admin page forms, 
// but is no longer the source of truth for feed data.
// The source of truth is now the `news_feeds` collection in Firestore.

export type RssFeed = {
  id?: string; // id is from firestore
  category: string;
  region: string;
  name: string;
  url: string;
  notes?: string;
  enabled?: boolean;
};
