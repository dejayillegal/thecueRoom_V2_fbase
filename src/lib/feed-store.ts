
import type { RssFeed } from './rss-feeds';

// This is our server-side in-memory "database".
// It is initialized with the default set of feeds.
// Mutations will happen directly on this array.
let feeds: RssFeed[] = [
  // India
  {
    category: "Music",
    region: "India",
    name: "Wild City",
    url: "https://wildcity.in/feed",
  },
  {
    category: "Music",
    region: "India",
    name: "Rolling Stone India (Dance/Electronic)",
    url: "https://rollingstoneindia.com/music/feed/",
  },
  {
    category: "Music",
    region: "India",
    name: "Homegrown",
    url: "https://homegrown.co.in/feed",
  },
  
  // Global / Industry
  {
    category: "Music",
    region: "Global",
    name: "Resident Advisor (News)",
    url: "https://ra.co/news",
    notes: "no RSS, parse HTML",
  },
  {
    category: "Music",
    region: "Global",
    name: "Mixmag",
    url: "https://mixmag.net/rss",
  },
  {
    category: "Industry",
    region: "Global",
    name: "DJ Mag Tech",
    url: "https://djmag.com/rss.xml",
  },
  {
    category: "Industry",
    region: "Global",
    name: "Attack Magazine",
    url: "https://www.attackmagazine.com/feed/",
  },
  {
    category: "Industry",
    region: "Global",
    name: "CDM (Create Digital Music)",
    url: "https://cdm.link/feed/",
  },
  {
    category: "Industry",
    region: "Global",
    name: "MusicTech",
    url: "https://musictech.com/feed/",
  },

  // Production / Education
  {
    category: "Guides",
    region: "Global",
    name: "Ableton Blog",
    url: "https://www.ableton.com/en/blog/feed/",
  },
  {
    category: "Guides",
    region: "Global",
    name: "Native Instruments Blog",
    url: "https://blog.native-instruments.com/feed/",
  },
];

// Getter function
export function getFeeds(): RssFeed[] {
  console.log('Fetching feeds from server-side store.');
  return feeds;
}

// Update function
export function updateFeedInStore(updatedFeed: RssFeed): void {
  const index = feeds.findIndex(feed => feed.url === updatedFeed.url);
  if (index !== -1) {
    console.log(`Updating feed in store: ${updatedFeed.name}`);
    feeds[index] = updatedFeed;
  } else {
    throw new Error(`Feed with URL ${updatedFeed.url} not found.`);
  }
}

// Delete function
export function deleteFeedFromStore(feedUrl: string): void {
  const initialLength = feeds.length;
  feeds = feeds.filter(feed => feed.url !== feedUrl);
  if (feeds.length === initialLength) {
    throw new Error(`Feed with URL ${feedUrl} not found for deletion.`);
  }
  console.log(`Deleted feed from store: ${feedUrl}`);
}
