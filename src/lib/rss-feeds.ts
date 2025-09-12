
export type RssFeed = {
  category: string;
  name: string;
  url: string;
  notes?: string;
};

export const rssFeeds: RssFeed[] = [
  // Global underground (news/features)
  {
    category: "Global Underground",
    name: "Resident Advisor — News",
    url: "https://ra.co/news",
    notes: "RSS not public; use site crawl or internal parser",
  },
  {
    category: "Global Underground",
    name: "Mixmag",
    url: "https://mixmag.net/rss",
  },
  {
    category: "Global Underground",
    name: "DJ Mag",
    url: "https://djmag.com/rss.xml",
  },
  {
    category: "Global Underground",
    name: "Electronic Beats",
    url: "https://www.electronicbeats.net/feed/",
  },
  {
    category: "Global Underground",
    name: "FACT Magazine",
    url: "https://www.factmag.com/feed/",
  },
  {
    category: "Global Underground",
    name: "XLR8R (News/Features)",
    url: "https://xlr8r.com/feed/",
  },
  {
    category: "Global Underground",
    name: "Attack Magazine",
    url: "https://www.attackmagazine.com/feed/",
  },
  {
    category: "Global Underground",
    name: "Crack Magazine (Music)",
    url: "https://crackmagazine.net/feed/",
  },
  {
    category: "Global Underground",
    name: "Beatportal",
    url: "https://www.beatportal.com/feed/",
  },
  {
    category: "Global Underground",
    name: "Magnetic Magazine",
    url: "https://www.magneticmag.com/feed/",
    notes: "typical WP feed",
  },

  // India / Asia underground
  {
    category: "India / Asia Underground",
    name: "Wild City (India)",
    url: "https://wildcity.in/feed",
  },
  {
    category: "India / Asia Underground",
    name: "Homegrown (Music/ Culture)",
    url: "https://homegrown.co.in/feed",
  },
  {
    category: "India / Asia Underground",
    name: "Rolling Stone India (Music)",
    url: "https://rollingstoneindia.com/music/feed/",
  },
  {
    category: "India / Asia Underground",
    name: "The Indian Music Diaries",
    url: "https://theindianmusicdiaries.com/feed/",
  },
  {
    category: "India / Asia Underground",
    name: "AHUM (Alt/Indie India)",
    url: "https://ahum.in/feed",
    notes: "if active",
  },

  // Gear / production
  {
    category: "Gear / Production",
    name: "CDM: Create Digital Music",
    url: "https://cdm.link/feed/",
  },
  {
    category: "Gear / Production",
    name: "MusicTech",
    url: "https://musictech.com/feed/",
  },
  {
    category: "Gear / Production",
    name: "Sound On Sound (All)",
    url: "https://www.soundonsound.com/rss/all",
  },
  {
    category: "Gear / Production",
    name: "Attack Magazine (Production)",
    url: "https://www.attackmagazine.com/category/technique/feed/",
  },

  // Mixes / podcasts (long-form listening)
  {
    category: "Mixes / Podcasts",
    name: "XLR8R Podcasts",
    url: "https://xlr8r.com/podcasts/feed/",
  },
  {
    category: "Mixes / Podcasts",
    name: "Dekmantel Podcast",
    url: "https://feeds.soundcloud.com/users/soundcloud:users:9261945/sounds.rss",
  },
  {
    category: "Mixes / Podcasts",
    name: "Truants Podcast (archive)",
    url: "https://truantsblog.com/feed/",
    notes: "podcast in posts",
  },
  {
    category: "Mixes / Podcasts",
    name: "Ransom Note Mixes",
    url: "https://www.theransomnote.com/music/mixes/feed/",
  },
  {
    category: "Mixes / Podcasts",
    name: "Groove Podcast",
    url: "https://groove.de/feed/",
    notes: "German; includes mixes",
  },

  // Labels / platforms / long reads
  {
    category: "Labels / Platforms / Long Reads",
    name: "Bandcamp Daily",
    url: "https://daily.bandcamp.com/feed/",
  },
  {
    category: "Labels / Platforms / Long Reads",
    name: "Resident Advisor Features",
    url: "https://ra.co/features",
    notes: "no official RSS; treat as site-scrape",
  },
  {
    category: "Labels / Platforms / Long Reads",
    name: "Boiler Room News/Editorial",
    url: "https://www.boilerroom.tv/",
    notes: "no RSS; site-scrape",
  },
];
