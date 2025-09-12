
export type RssFeed = {
  category: string;
  region: string;
  name: string;
  url: string;
  notes?: string;
};

export const rssFeeds: RssFeed[] = [
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
